import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
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
    options: EnhancementOptions = {}
  ): Promise<AIResponse> {
    this.validateApiKey();

    const {
      contentType = "generic",
      enhancementType = "improve",
      customPrompt,
      preserveFormatting = true,
      model = "meta-llama/llama-3.2-3b-instruct:free",
    } = options;

    const startTime = Date.now();

    try {
      const prompt = this.buildEnhancementPrompt(
        content,
        contentType,
        enhancementType,
        customPrompt,
        preserveFormatting
      );

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
        originalLength: content.length,
        enhancedLength: enhancedContent.length,
        model: model,
        timestamp: new Date().toISOString(),
        processingTime,
        stats,
      };
    } catch (error) {
      return {
        error: `Enhancement failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        originalContent: content,
      };
    }
  }

  /**
   * Build enhancement prompt based on content type and options
   */
  private buildEnhancementPrompt(
    content: string,
    contentType: string,
    enhancementType: string,
    customPrompt?: string,
    preserveFormatting = true
  ): string {
    if (customPrompt) {
      return `${customPrompt}\n\nContent to enhance:\n${content}`;
    }

    const basePrompts: { [key: string]: string } = {
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

    const enhancementTypes: { [key: string]: string } = {
      improve: "Focus on overall improvement",
      grammar: "Focus primarily on grammar and syntax corrections",
      style: "Focus on improving writing style and flow",
      clarity: "Focus on making the content clearer and more understandable",
      expand: "Expand on ideas and add more detail where appropriate",
      condense: "Make the content more concise while retaining key information",
    };

    let prompt = `${basePrompts[contentType] || basePrompts.generic}. ${
      enhancementTypes[enhancementType] || enhancementTypes.improve
    }.`;

    if (preserveFormatting) {
      prompt +=
        " Preserve the original formatting, structure, and any special elements like dialogue, emphasis, or line breaks.";
    }

    prompt += `\n\nContent to enhance:\n${content}`;

    return prompt;
  }
}
