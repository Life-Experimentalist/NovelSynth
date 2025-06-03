import type { AIProvider, AIResponse } from "../../types";

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
  abstract summarize(content: string, options?: any): Promise<AIResponse>;
  abstract analyze(content: string, options?: any): Promise<AIResponse>;
  abstract generateSuggestions(
    content: string,
    options?: any
  ): Promise<AIResponse>;
  abstract enhance(
    content: string,
    prompt: string,
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
}
