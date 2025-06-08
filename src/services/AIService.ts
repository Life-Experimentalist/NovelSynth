// Base AI service interface and common functionality
import { AIProviderConfig } from "../types/extension";

export interface AIServiceRequest {
  prompt: string;
  content: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemInstruction?: string;
}

export interface AIServiceResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason?: string;
}

export abstract class BaseAIService {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract generateContent(
    request: AIServiceRequest
  ): Promise<AIServiceResponse>;

  // Rate limiting logic
  protected async checkRateLimit(): Promise<void> {
    // Implementation for rate limiting based on config.rateLimits
    // This would check against stored request counts in chrome.storage
  }

  // Common error handling
  protected handleError(error: any): never {
    if (error.name === "APIError") {
      throw new Error(`AI Service Error: ${error.message}`);
    }
    if (error.name === "RateLimitError") {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.name === "AuthenticationError") {
      throw new Error("Invalid API key. Please check your configuration.");
    }
    throw new Error(`Unexpected error: ${error.message}`);
  }

  // Validate API key format
  protected validateApiKey(): void {
    if (!this.config.apiKey) {
      throw new Error("API key is required");
    }
  }
}

// Factory for creating AI service instances
export class AIServiceFactory {
  static createService(config: AIProviderConfig): BaseAIService {
    switch (config.id) {
      case "gemini":
        return new GeminiService(config);
      case "openai":
        return new OpenAIService(config);
      case "anthropic":
        return new AnthropicService(config);
      default:
        throw new Error(`Unsupported AI provider: ${config.id}`);
    }
  }
}

// Import service implementations
import { GeminiService } from "./GeminiService";
import { OpenAIService } from "./OpenAIService";
import { AnthropicService } from "./AnthropicService";
