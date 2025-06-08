// Main AI service manager for feature execution
import {
  FeatureExecution,
  FeatureResult,
  AIProviderConfig,
  FeatureConfig,
  PromptTemplate,
  ContentType,
  FeatureCategory,
} from "../types/extension";
import { AIServiceFactory, BaseAIService } from "./AIService";

export class AIManager {
  private services: Map<string, BaseAIService> = new Map();

  // Initialize services for enabled AI providers
  initializeServices(providers: AIProviderConfig[]): void {
    this.services.clear();

    for (const provider of providers) {
      if (provider.enabled && provider.apiKey) {
        try {
          const service = AIServiceFactory.createService(provider);
          this.services.set(provider.id, service);
        } catch (error) {
          console.error(
            `Failed to initialize ${provider.name} service:`,
            error
          );
        }
      }
    }
  }

  // Execute a feature with AI processing
  async executeFeature(
    execution: FeatureExecution,
    feature: FeatureConfig,
    aiProvider: AIProviderConfig
  ): Promise<FeatureResult> {
    const startTime = Date.now();

    try {
      // Get the AI service
      const service = this.services.get(aiProvider.id);
      if (!service) {
        throw new Error(`AI service ${aiProvider.name} is not available`);
      }

      // Find the appropriate prompt template
      const promptTemplate = this.findBestPromptTemplate(
        feature,
        execution.contentType,
        execution.promptTemplate
      );

      if (!promptTemplate) {
        throw new Error(
          `No suitable prompt template found for feature ${feature.name}`
        );
      }

      // Build the system instruction and user prompt
      const { systemInstruction, userPrompt } = this.buildPrompt(
        promptTemplate,
        execution.variables
      );

      // Execute the AI request
      const response = await service.generateContent({
        prompt: userPrompt,
        content: execution.selectedContent,
        model: execution.model,
        systemInstruction,
        maxTokens: this.getMaxTokensForFeature(feature),
        temperature: this.getTemperatureForFeature(feature),
      });

      return {
        featureId: execution.featureId,
        success: true,
        result: response.content,
        metadata: {
          model: response.model,
          usage: response.usage,
          processingTime: Date.now() - startTime,
          promptTemplate: promptTemplate.id,
          aiProvider: aiProvider.id,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        featureId: execution.featureId,
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          processingTime: Date.now() - startTime,
          aiProvider: aiProvider.id,
        },
        timestamp: Date.now(),
      };
    }
  }

  // Find the best prompt template for the given context
  private findBestPromptTemplate(
    feature: FeatureConfig,
    contentType: ContentType,
    preferredTemplateId?: string
  ): PromptTemplate | null {
    // If a specific template is requested, try to find it first
    if (preferredTemplateId) {
      const preferred = feature.promptTemplates.find(
        (t) => t.id === preferredTemplateId
      );
      if (preferred) return preferred;
    }

    // Find templates that match the content type
    const matchingTemplates = feature.promptTemplates.filter(
      (t) =>
        t.contentType === contentType || t.contentType === ContentType.GENERAL
    );

    if (matchingTemplates.length === 0) {
      // Fallback to any template for this feature
      return feature.promptTemplates[0] || null;
    }

    // Prefer content-type specific templates over general ones
    const specificTemplate = matchingTemplates.find(
      (t) => t.contentType === contentType
    );
    return specificTemplate || matchingTemplates[0];
  }

  // Build the system instruction and user prompt from template
  private buildPrompt(
    template: PromptTemplate,
    variables: Record<string, any>
  ): { systemInstruction: string; userPrompt: string } {
    let content = template.content;

    // Replace variables in the template
    for (const variable of template.variables) {
      const value = variables[variable.name] ?? variable.defaultValue ?? "";
      const placeholder = `{{${variable.name}}}`;
      content = content.replaceAll(placeholder, String(value));
    }

    // Split system instruction and user prompt
    // Convention: content before "---USER---" is system instruction
    const parts = content.split("---USER---");

    if (parts.length > 1) {
      return {
        systemInstruction: parts[0].trim(),
        userPrompt: parts[1].trim(),
      };
    } else {
      // If no split marker, treat entire content as user prompt
      return {
        systemInstruction: this.getDefaultSystemInstruction(template.category),
        userPrompt: content.trim(),
      };
    }
  }

  // Get default system instruction based on category
  private getDefaultSystemInstruction(category: string): string {
    switch (category) {
      case "enhancement":
        return "You are an expert text enhancement assistant. Improve the given content while maintaining the original meaning and style.";
      case "summarization":
        return "You are a skilled summarization assistant. Create concise, accurate summaries that capture the key points.";
      case "analysis":
        return "You are a literary analysis expert. Provide insightful analysis of characters, themes, and narrative elements.";
      case "translation":
        return "You are a professional translator. Provide accurate, natural translations while preserving the original tone and meaning.";
      default:
        return "You are a helpful AI assistant. Process the given content according to the user's request.";
    }
  }
  // Get max tokens based on feature type
  private getMaxTokensForFeature(feature: FeatureConfig): number {
    switch (feature.category) {
      case FeatureCategory.ENHANCEMENT:
        return 4096; // Longer output for enhanced text
      case FeatureCategory.ANALYSIS:
        return 2048; // Medium length for analysis
      case FeatureCategory.TRANSLATION:
        return 4096; // Potentially long for translations
      case FeatureCategory.UTILITY:
        return 1024; // Shorter for utility functions
      default:
        return 2048;
    }
  }
  // Get temperature based on feature type
  private getTemperatureForFeature(feature: FeatureConfig): number {
    switch (feature.category) {
      case FeatureCategory.ENHANCEMENT:
        return 0.7; // Some creativity for enhancement
      case FeatureCategory.ANALYSIS:
        return 0.6; // Moderate creativity for insights
      case FeatureCategory.TRANSLATION:
        return 0.2; // Very low for accurate translations
      case FeatureCategory.UTILITY:
        return 0.3; // Low creativity for utility functions
      default:
        return 0.7;
    }
  }

  // Test connection to an AI service
  async testService(providerId: string): Promise<boolean> {
    const service = this.services.get(providerId);
    if (!service) return false;

    try {
      return (await (service as any).testConnection?.()) ?? false;
    } catch (error) {
      console.error(`Failed to test ${providerId} service:`, error);
      return false;
    }
  }

  // Get available models for a provider
  async getAvailableModels(providerId: string): Promise<string[]> {
    const service = this.services.get(providerId);
    if (!service) return [];

    try {
      return (await (service as any).getAvailableModels?.()) ?? [];
    } catch (error) {
      console.error(`Failed to get models for ${providerId}:`, error);
      return [];
    }
  }
}
