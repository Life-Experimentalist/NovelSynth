import { BaseAIService } from "./BaseAIService";
import type {
  AIProvider,
  AIResponse,
  EnhancementOptions,
  ContentType,
} from "../../types";

/**
 * Google Gemini AI Service
 * Primary AI service for NovelSynth with support for all content types
 */
export class GeminiService extends BaseAIService {
  provider: AIProvider = {
    name: "Google Gemini",
    id: "gemini",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    requiresAuth: true,
    authType: "api_key",
    features: ["enhance", "summarize", "analyze", "suggestions"],
    models: [
      "gemini-pro",
      "gemini-pro-vision",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
    ],
    defaultModel: "gemini-1.5-pro",
  };

  private readonly ENDPOINTS = {
    generateContent: (model: string) =>
      `${this.provider.apiEndpoint}/models/${model}:generateContent`,
    countTokens: (model: string) =>
      `${this.provider.apiEndpoint}/models/${model}:countTokens`,
  };

  /**
   * Main content enhancement method - primary function
   */
  async enhance(
    content: string,
    options: EnhancementOptions = {}
  ): Promise<AIResponse> {
    this.validateApiKey();

    const {
      contentType = "generic",
      enhancementType = "improve",
      customPrompt,
      preserveFormatting = true,
      model = this.provider.defaultModel || "gemini-1.5-pro",
    } = options;

    try {
      const prompt = this.buildEnhancementPrompt(
        content,
        contentType,
        enhancementType,
        customPrompt,
        preserveFormatting
      );

      const response = await this.makeGeminiRequest(model, prompt);

      return {
        enhanced: this.extractTextFromResponse(response),
        originalLength: content.length,
        enhancedLength: this.extractTextFromResponse(response).length,
        model: model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: `Enhancement failed: ${this.getErrorMessage(error)}`,
        originalContent: content,
      };
    }
  }

  /**
   * Generate summary of content
   */
  async summarize(content: string, options: any = {}): Promise<AIResponse> {
    this.validateApiKey();

    const {
      length = "medium",
      style = "comprehensive",
      model = this.provider.defaultModel || "gemini-1.5-pro",
    } = options;

    const prompt = this.buildSummaryPrompt(content, length, style);

    try {
      const response = await this.makeGeminiRequest(model, prompt);

      return {
        summary: this.extractTextFromResponse(response),
        originalLength: content.length,
        compressionRatio:
          content.length / this.extractTextFromResponse(response).length,
        model: model,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: `Summary failed: ${this.getErrorMessage(error)}`,
      };
    }
  }

  /**
   * Make request to Gemini API
   */
  private async makeGeminiRequest(model: string, prompt: string): Promise<any> {
    const url = `${this.ENDPOINTS.generateContent(model)}?key=${this.apiKey}`;

    const response = await this.makeRequest(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    return response;
  }

  /**
   * Extract text from Gemini response
   */
  private extractTextFromResponse(response: any): string {
    return (
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated"
    );
  }

  /**
   * Build enhancement prompt based on content type
   */
  private buildEnhancementPrompt(
    content: string,
    contentType: ContentType,
    enhancementType: string,
    customPrompt?: string,
    preserveFormatting = true
  ): string {
    if (customPrompt) {
      return `${customPrompt}\n\nContent to enhance:\n${content}`;
    }

    const basePrompts = {
      novel:
        "Enhance this novel/fiction content by improving readability, flow, and narrative quality while maintaining the author's voice and style.",
      article:
        "Improve this article by enhancing clarity, structure, and engagement while maintaining factual accuracy.",
      news: "Enhance this news content by improving clarity and readability while maintaining journalistic integrity.",
      technical:
        "Improve this technical content by enhancing clarity, accuracy, and accessibility while maintaining technical precision.",
      generic:
        "Enhance this content by improving readability, clarity, and overall quality.",
    };

    const enhancementTypes = {
      improve: "Focus on overall improvement",
      grammar: "Focus primarily on grammar and syntax corrections",
      style: "Focus on improving writing style and flow",
      clarity: "Focus on making the content clearer and more understandable",
      expand: "Expand on ideas and add more detail where appropriate",
      condense: "Make the content more concise while retaining key information",
    };
    let prompt = `${basePrompts[contentType] || basePrompts.generic}. ${
      enhancementTypes[enhancementType as keyof typeof enhancementTypes] ||
      enhancementTypes.improve
    }.`;

    if (preserveFormatting) {
      prompt +=
        " Preserve the original formatting, structure, and any special elements like dialogue, emphasis, or line breaks.";
    }

    prompt += `\n\nContent to enhance:\n${content}`;

    return prompt;
  }

  /**
   * Build summary prompt
   */
  private buildSummaryPrompt(
    content: string,
    length: string,
    style: string
  ): string {
    const lengthMap = {
      short: "Provide a brief summary in 2-3 sentences",
      medium: "Provide a comprehensive summary in 1-2 paragraphs",
      long: "Provide a detailed summary covering all key points",
    };

    const styleMap = {
      comprehensive: "covering all main points",
      highlights: "focusing on the most important highlights",
      analytical: "with analytical insights",
      narrative: "maintaining the narrative flow",
    };
    return `${
      lengthMap[length as keyof typeof lengthMap] || lengthMap.medium
    } of the following content, ${
      styleMap[style as keyof typeof styleMap] || styleMap.comprehensive
    }:\n\n${content}`;
  }

  /**
   * Get error message from various error types
   */
  private getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "Unknown error occurred";
  }

  async analyze(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    const prompt = `Analyze the following content and provide insights about its structure, themes, and key points:\n\n${content}`;

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      return {
        analysis:
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No analysis available",
      };
    } catch (error) {
      return {
        error: `Failed to generate analysis: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async generateSuggestions(
    content: string,
    options?: any
  ): Promise<AIResponse> {
    this.validateApiKey();

    const prompt = `Based on the following content, provide helpful suggestions for better understanding or related topics to explore:\n\n${content}`;

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const suggestions = text
        .split("\n")
        .filter((line: string) => line.trim().length > 0);

      return {
        suggestions,
      };
    } catch (error) {
      return {
        error: `Failed to generate suggestions: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
