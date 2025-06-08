// Google Gemini AI service implementation
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  BaseAIService,
  AIServiceRequest,
  AIServiceResponse,
} from "./AIService";
import { AIProviderConfig } from "../types/extension";

export class GeminiService extends BaseAIService {
  private client: GoogleGenerativeAI;

  constructor(config: AIProviderConfig) {
    super(config);
    this.validateApiKey();
    this.client = new GoogleGenerativeAI(this.config.apiKey!);
  }

  async generateContent(request: AIServiceRequest): Promise<AIServiceResponse> {
    await this.checkRateLimit();

    try {
      const model = this.client.getGenerativeModel({
        model: request.model || "gemini-pro",
        generationConfig: {
          maxOutputTokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        },
      });

      // Create the prompt combining system instruction and user content
      const prompt = request.systemInstruction
        ? `System: ${request.systemInstruction}\n\nUser: ${request.prompt}\n\nContent to process:\n${request.content}`
        : `${request.prompt}\n\nContent to process:\n${request.content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return {
        content: response.text(),
        model: request.model || "gemini-pro",
        usage: {
          promptTokens: 0, // Gemini doesn't provide token counts in response
          completionTokens: 0,
          totalTokens: 0,
        },
        finishReason: response.candidates?.[0]?.finishReason || "stop",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Gemini-specific method to get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      // For now, return known Gemini models
      // In the future, this could query the API for available models
      return [
        "gemini-pro",
        "gemini-pro-vision",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
      ];
    } catch (error) {
      console.warn("Failed to fetch available Gemini models:", error);
      return ["gemini-pro"];
    }
  }

  // Test API key validity
  async testConnection(): Promise<boolean> {
    try {
      const model = this.client.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Test connection");
      return !!result.response.text();
    } catch (error) {
      return false;
    }
  }
}
