import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse } from "../../types";
import { WordCounter } from "../../utils/WordCounter";

export class AnthropicService extends BaseAIService {
  provider: AIProvider = {
    name: "Anthropic Claude",
    id: "anthropic",
    apiEndpoint: "https://api.anthropic.com/v1",
    requiresAuth: true,
    authType: "api_key",
    features: ["summarize", "analyze", "suggestions", "keyPoints"],
  };

  async summarize(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-sonnet-20240229",
            max_tokens: 500,
            messages: [
              {
                role: "user",
                content: `Please provide a concise summary of the following content:\n\n${content}`,
              },
            ],
          }),
        }
      );

      return {
        summary: response.content?.[0]?.text || "No summary available",
      };
    } catch (error) {
      return {
        error: `Failed to generate summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  async analyze(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-sonnet-20240229",
            max_tokens: 800,
            messages: [
              {
                role: "user",
                content: `Analyze the following content and provide insights about its structure, themes, writing style, and key points:\n\n${content}`,
              },
            ],
          }),
        }
      );

      return {
        analysis: response.content?.[0]?.text || "No analysis available",
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

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-sonnet-20240229",
            max_tokens: 400,
            messages: [
              {
                role: "user",
                content: `Based on the following content, provide 3-5 helpful suggestions for better understanding, related topics to explore, or ways to engage with the material:\n\n${content}`,
              },
            ],
          }),
        }
      );
      const text = response.content?.[0]?.text || "";
      const suggestions = text
        .split("\n")
        .filter(
          (line: string) =>
            line.trim().length > 0 &&
            (line.includes("•") ||
              line.includes("-") ||
              /^\d+\./.test(line.trim()))
        );

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

  async enhance(
    content: string,
    prompt: string,
    options?: any
  ): Promise<AIResponse> {
    this.validateApiKey();

    const startTime = Date.now();
    const model = options?.model || "claude-3-sonnet-20240229";

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model,
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

      const enhancedContent = response.content?.[0]?.text || content;
      const processingTime = Date.now() - startTime;
      const stats = WordCounter.calculateStats(content, enhancedContent);

      return {
        enhanced: enhancedContent,
        processingTime,
        stats,
      };
    } catch (error) {
      return {
        error: `Failed to enhance content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
