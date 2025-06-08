// OpenAI service implementation
import OpenAI from "openai";
import {
  BaseAIService,
  AIServiceRequest,
  AIServiceResponse,
} from "./AIService";
import { AIProviderConfig } from "../types/extension";

export class OpenAIService extends BaseAIService {
  private client: OpenAI;

  constructor(config: AIProviderConfig) {
    super(config);
    this.validateApiKey();
    this.client = new OpenAI({
      apiKey: this.config.apiKey!,
      baseURL: this.config.baseUrl,
      dangerouslyAllowBrowser: true, // Required for browser environment
    });
  }

  async generateContent(request: AIServiceRequest): Promise<AIServiceResponse> {
    await this.checkRateLimit();

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system message if provided
      if (request.systemInstruction) {
        messages.push({
          role: "system",
          content: request.systemInstruction,
        });
      }

      // Add user message with prompt and content
      messages.push({
        role: "user",
        content: `${request.prompt}\n\nContent to process:\n${request.content}`,
      });

      const completion = await this.client.chat.completions.create({
        model: request.model || "gpt-3.5-turbo",
        messages,
        max_tokens: request.maxTokens || 2048,
        temperature: request.temperature || 0.7,
      });

      const choice = completion.choices[0];

      return {
        content: choice.message.content || "",
        model: completion.model,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
        finishReason: choice.finish_reason || "stop",
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // OpenAI-specific method to get available models
  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.data
        .filter((model) => model.id.includes("gpt"))
        .map((model) => model.id)
        .sort();
    } catch (error) {
      console.warn("Failed to fetch available OpenAI models:", error);
      return ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o"];
    }
  }

  // Test API key validity
  async testConnection(): Promise<boolean> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Test connection" }],
        max_tokens: 5,
      });
      return !!completion.choices[0]?.message.content;
    } catch (error) {
      return false;
    }
  }
}
