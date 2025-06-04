import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";

export abstract class BaseAIService {
  abstract provider: AIProvider;
  protected apiKey: string = "";

  constructor(apiKey?: string) {
    if (apiKey) {
      this.apiKey = apiKey;
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Updated method signatures to support enhanced functionality
  abstract enhance(
    content: string,
    options?: EnhancementOptions
  ): Promise<AIResponse>;
  abstract summarize(content: string, options?: any): Promise<AIResponse>;
  abstract analyze(content: string, options?: any): Promise<AIResponse>;
  abstract generateSuggestions(
    content: string,
    options?: any
  ): Promise<AIResponse>;

  protected validateApiKey(): void {
    if (!this.apiKey && this.provider.requiresAuth) {
      throw new Error(`API key required for ${this.provider.name}`);
    }
  }

  protected async makeRequest(url: string, options: RequestInit): Promise<any> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${this.provider.name}:`, error);
      throw error;
    }
  }

  /**
   * Get available models for this provider
   */
  getAvailableModels(): string[] {
    return this.provider.models || [];
  }

  /**
   * Check if a specific feature is supported
   */
  supportsFeature(feature: string): boolean {
    return this.provider.features.includes(feature);
  }

  /**
   * Get provider information
   */
  getProviderInfo(): AIProvider {
    return this.provider;
  }
}
