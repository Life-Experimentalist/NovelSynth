import type {
  AIService,
  AIModel,
  AIRequest,
  AIResponse,
  ContentMode,
} from "@/types";

export abstract class BaseAIService implements AIService {
  abstract id: string;
  abstract name: string;
  abstract icon: string;
  models: AIModel[] = [];
  isConfigured: boolean = false;

  abstract validateApiKey(apiKey: string): Promise<boolean>;
  abstract getModels(): Promise<AIModel[]>;
  abstract processRequest(request: AIRequest): Promise<AIResponse>;

  // New method to refresh models after API key is set
  async refreshModels(): Promise<AIModel[]> {
    try {
      const models = await this.getModels();
      this.models = models;
      return models;
    } catch (error) {
      console.error(`Failed to refresh models for ${this.name}:`, error);
      return this.models; // Return cached models if refresh fails
    }
  }

  // Get models that support a specific content mode
  getModelsForMode(mode: ContentMode): AIModel[] {
    return this.models.filter((model) => model.supportedModes.includes(mode));
  }

  protected getApiKey(): string {
    return localStorage.getItem(`${this.id}_api_key`) || "";
  }

  protected setApiKey(apiKey: string): void {
    localStorage.setItem(`${this.id}_api_key`, apiKey);
    this.isConfigured = true;
  }

  protected handleError(error: any): AIResponse {
    console.error(`${this.name} Error:`, error);
    return {
      result: "",
      error: error.message || "Unknown error occurred",
    };
  }
}
