import { GeminiService } from "./GeminiService";
import { OpenAIService } from "./OpenAIService";
import { HuggingFaceService } from "./HuggingFaceService";
import { AnthropicService } from "./AnthropicService";
import { OpenRouterService } from "./OpenRouterService";
import type {
  AIProvider,
  AIResponse,
  UserSettings,
  AIModel,
  ContentSegment,
  EnhancementOptions,
} from "../../types";
import { BaseAIService } from "./BaseAIService";
import { RateLimiter } from "../../utils/RateLimiter";
import { ContentSegmenter } from "../../utils/ContentSegmenter";
import { AI_MODELS } from "../../utils/PromptManager";

export class AIServiceManager {
  private services: Map<string, BaseAIService> = new Map();
  private currentService: BaseAIService | null = null;
  private currentSettings: UserSettings | null = null;

  constructor() {
    this.initializeServices();
  }

  private initializeServices(): void {
    const services = [
      new GeminiService(),
      new OpenAIService(),
      new HuggingFaceService(),
      new AnthropicService(),
      new OpenRouterService(),
    ];

    services.forEach((service) => {
      this.services.set(service.provider.id, service);
    });
  }

  getAvailableProviders(): AIProvider[] {
    return Array.from(this.services.values()).map(
      (service) => service.provider
    );
  }

  /**
   * Get available models for a specific provider
   */
  getAvailableModels(providerId: string): AIModel[] {
    return AI_MODELS[providerId as keyof typeof AI_MODELS] || [];
  }

  /**
   * Get all available models across all providers
   */
  getAllAvailableModels(): Record<string, AIModel[]> {
    const result: Record<string, AIModel[]> = {};
    this.getAvailableProviders().forEach((provider) => {
      result[provider.id] = this.getAvailableModels(provider.id);
    });
    return result;
  }

  async setActiveProvider(
    providerId: string,
    apiKey?: string
  ): Promise<boolean> {
    const service = this.services.get(providerId);
    if (!service) {
      console.error(`AI provider '${providerId}' not found`);
      return false;
    }

    if (apiKey) {
      service.setApiKey(apiKey);
    }

    this.currentService = service;
    return true;
  }

  getCurrentProvider(): AIProvider | null {
    return this.currentService?.provider || null;
  }
  /**
   * Enhanced method with rate limiting and segmentation support
   */
  async enhance(
    content: string,
    options: EnhancementOptions = {},
    featureType: "enhance" | "summarize" | "analyze" | "suggestions" = "enhance"
  ): Promise<AIResponse> {
    if (!this.currentService || !this.currentSettings) {
      return { error: "No AI provider selected or settings not loaded" };
    }

    try {
      const modelId = this.currentSettings.selectedModels[featureType];
      const model = this.getModelById(this.currentService.provider.id, modelId);

      if (!model) {
        return {
          error: `Model ${modelId} not found for provider ${this.currentService.provider.id}`,
        };
      }

      // Merge model into options
      const enhancedOptions = { ...options, model: model.id };

      // Check if content needs segmentation
      const shouldSegment = content.length > model.maxTokens * 3; // Rough token estimation

      if (shouldSegment) {
        return await this.enhanceWithSegmentation(
          content,
          enhancedOptions,
          model
        );
      } else {
        return await this.enhanceSingleContent(content, enhancedOptions, model);
      }
    } catch (error) {
      return {
        error: `Service error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Handle large content with segmentation
   */ private async enhanceWithSegmentation(
    content: string,
    options: EnhancementOptions,
    model: AIModel
  ): Promise<AIResponse> {
    const segments = ContentSegmenter.segmentContent(content, {
      maxChunkSize: Math.floor(model.maxTokens * 2.5), // Conservative token estimation
      preserveImages: true,
      preserveFormatting: true,
    });

    const enhancedSegments: ContentSegment[] = [];
    let totalProcessingTime = 0;
    let hasError = false;
    let errorMessage = "";

    for (const segment of segments) {
      // Apply rate limiting
      if (this.currentSettings?.rateLimiting.enabled) {
        await RateLimiter.waitForRateLimit(
          this.currentService!.provider.id,
          model
        );
      }
      const segmentOptions = {
        ...options,
        customPrompt: options.customPrompt
          ? `${options.customPrompt}\n\n**Important:** This is part ${
              segments.indexOf(segment) + 1
            } of ${
              segments.length
            } segments. Maintain consistency with the overall content style and formatting.`
          : `**Important:** This is part ${segments.indexOf(segment) + 1} of ${
              segments.length
            } segments. Maintain consistency with the overall content style and formatting.`,
      };

      try {
        const response = await this.currentService!.enhance(
          segment.content,
          segmentOptions
        );

        if (response.error) {
          hasError = true;
          errorMessage = response.error;
          break;
        }

        enhancedSegments.push({
          ...segment,
          content: response.enhanced || segment.content,
        });

        totalProcessingTime += response.processingTime || 0;

        // Record rate limit usage
        RateLimiter.recordRequest(this.currentService!.provider.id, model);
      } catch (error) {
        hasError = true;
        errorMessage = error instanceof Error ? error.message : "Unknown error";
        break;
      }
    }

    if (hasError) {
      return { error: errorMessage };
    }

    // Reassemble segments
    const enhancedContent =
      ContentSegmenter.reassembleSegments(enhancedSegments);

    return {
      enhanced: enhancedContent,
      processingTime: totalProcessingTime,
      // Note: Stats will be approximate for segmented content
    };
  }

  /**
   * Handle single content enhancement with rate limiting
   */ private async enhanceSingleContent(
    content: string,
    options: EnhancementOptions,
    model: AIModel
  ): Promise<AIResponse> {
    // Apply rate limiting
    if (this.currentSettings?.rateLimiting.enabled) {
      await RateLimiter.waitForRateLimit(
        this.currentService!.provider.id,
        model
      );
    }

    try {
      const response = await this.currentService!.enhance(content, options);

      // Record rate limit usage
      RateLimiter.recordRequest(this.currentService!.provider.id, model);

      return response;
    } catch (error) {
      return {
        error: `Enhancement failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Get model by ID for a provider
   */
  private getModelById(providerId: string, modelId: string): AIModel | null {
    const models = this.getAvailableModels(providerId);
    return models.find((model) => model.id === modelId) || null;
  }

  async summarize(content: string, options?: any): Promise<AIResponse> {
    if (!this.currentService || !this.currentSettings) {
      return { error: "No AI provider selected or settings not loaded" };
    }

    try {
      const modelId = this.currentSettings.selectedModels.summarize;
      const model = this.getModelById(this.currentService.provider.id, modelId);

      if (!model) {
        return { error: `Model ${modelId} not found` };
      }

      // Apply rate limiting
      if (this.currentSettings.rateLimiting.enabled) {
        await RateLimiter.waitForRateLimit(
          this.currentService.provider.id,
          model
        );
      }

      const response = await this.currentService.summarize(content, {
        ...options,
        model: model.id,
      });

      // Record rate limit usage
      RateLimiter.recordRequest(this.currentService.provider.id, model);

      return response;
    } catch (error) {
      return {
        error: `Service error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async analyze(content: string, options?: any): Promise<AIResponse> {
    if (!this.currentService || !this.currentSettings) {
      return { error: "No AI provider selected or settings not loaded" };
    }

    try {
      const modelId = this.currentSettings.selectedModels.analyze;
      const model = this.getModelById(this.currentService.provider.id, modelId);

      if (!model) {
        return { error: `Model ${modelId} not found` };
      }

      // Apply rate limiting
      if (this.currentSettings.rateLimiting.enabled) {
        await RateLimiter.waitForRateLimit(
          this.currentService.provider.id,
          model
        );
      }

      const response = await this.currentService.analyze(content, {
        ...options,
        model: model.id,
      });

      // Record rate limit usage
      RateLimiter.recordRequest(this.currentService.provider.id, model);

      return response;
    } catch (error) {
      return {
        error: `Service error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async generateSuggestions(
    content: string,
    options?: any
  ): Promise<AIResponse> {
    if (!this.currentService || !this.currentSettings) {
      return { error: "No AI provider selected or settings not loaded" };
    }

    try {
      const modelId = this.currentSettings.selectedModels.suggestions;
      const model = this.getModelById(this.currentService.provider.id, modelId);

      if (!model) {
        return { error: `Model ${modelId} not found` };
      }

      // Apply rate limiting
      if (this.currentSettings.rateLimiting.enabled) {
        await RateLimiter.waitForRateLimit(
          this.currentService.provider.id,
          model
        );
      }

      const response = await this.currentService.generateSuggestions(content, {
        ...options,
        model: model.id,
      });

      // Record rate limit usage
      RateLimiter.recordRequest(this.currentService.provider.id, model);

      return response;
    } catch (error) {
      return {
        error: `Service error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async loadSettingsAndInitialize(settings: UserSettings): Promise<void> {
    this.currentSettings = settings;
    const { selectedProvider, apiKeys } = settings;

    if (selectedProvider && apiKeys[selectedProvider]) {
      await this.setActiveProvider(selectedProvider, apiKeys[selectedProvider]);
    } else {
      // Default to first available provider
      const providers = this.getAvailableProviders();
      if (providers.length > 0) {
        await this.setActiveProvider(providers[0].id);
      }
    }
  }
}
