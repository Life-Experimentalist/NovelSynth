import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse } from "../../types";
import { WordCounter } from "../../utils/WordCounter";

export class GeminiService extends BaseAIService {
  provider: AIProvider = {
    name: "Google Gemini",
    id: "gemini",
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta",
    requiresAuth: true,
    authType: "api_key",
    features: ["summarize", "analyze", "suggestions", "keyPoints"],
  };

  async summarize(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    const prompt = `Please provide a concise summary of the following content:\n\n${content}`;

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
        summary:
          response.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No summary available",
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

  async enhance(
    content: string,
    prompt: string,
    options?: any
  ): Promise<AIResponse> {
    this.validateApiKey();

    const startTime = Date.now();
    const originalWordCount = WordCounter.countWords(content);

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`,
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
            generationConfig: {
              maxOutputTokens: 8192,
              temperature: 0.7,
            },
          }),
        }
      );

      const enhancedContent =
        response.candidates?.[0]?.content?.parts?.[0]?.text || content;
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
