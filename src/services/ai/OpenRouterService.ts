import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse } from "../../types";
import { WordCounter } from "../../utils/WordCounter";

export class OpenRouterService extends BaseAIService {
  provider: AIProvider = {
    name: "OpenRouter",
    id: "openrouter",
    apiEndpoint: "https://openrouter.ai/api/v1",
    requiresAuth: true,
    authType: "api_key",
    features: ["summarize", "analyze", "suggestions", "keyPoints"],
  };

  async summarize(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://novelsynth.com",
            "X-Title": "NovelSynth",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that provides concise summaries of content.",
              },
              {
                role: "user",
                content: `Please provide a concise summary of the following content:\n\n${content}`,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      return {
        summary:
          response.choices?.[0]?.message?.content || "No summary available",
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
        `${this.provider.apiEndpoint}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://novelsynth.com",
            "X-Title": "NovelSynth",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that analyzes content and provides insights.",
              },
              {
                role: "user",
                content: `Analyze the following content and provide insights about its structure, themes, and key points:\n\n${content}`,
              },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        }
      );

      return {
        analysis:
          response.choices?.[0]?.message?.content || "No analysis available",
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
        `${this.provider.apiEndpoint}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://novelsynth.com",
            "X-Title": "NovelSynth",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that provides useful suggestions based on content.",
              },
              {
                role: "user",
                content: `Based on the following content, provide 3-5 helpful suggestions for better understanding or related topics to explore:\n\n${content}`,
              },
            ],
            max_tokens: 400,
            temperature: 0.8,
          }),
        }
      );
      const text = response.choices?.[0]?.message?.content || "";
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
    const model = options?.model || "meta-llama/llama-3.2-3b-instruct:free";

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://novelsynth.com",
            "X-Title": "NovelSynth",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 4096,
            temperature: 0.7,
          }),
        }
      );

      const enhancedContent =
        response.choices?.[0]?.message?.content || content;
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
