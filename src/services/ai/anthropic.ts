import Anthropic from "@anthropic-ai/sdk";
import { BaseAIService } from "./base";
import type { AIModel, AIRequest, AIResponse } from "@/types";

export class AnthropicService extends BaseAIService {
  id = "anthropic";
  name = "Anthropic Claude";
  icon = "🧠";

  private client: Anthropic | null = null;

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      // Test with a simple request
      await client.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 5,
        messages: [{ role: "user", content: "Hello" }],
      });

      this.setApiKey(apiKey);
      this.client = client;
      return true;
    } catch (error) {
      return false;
    }
  }

  async getModels(): Promise<AIModel[]> {
    const models: AIModel[] = [
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        description: "Most powerful model for complex tasks",
        maxTokens: 4096,
        supportedModes: [
          "novel",
          "article",
          "news",
          "educational",
          "code",
          "general",
        ],
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        description: "Balanced model for most tasks",
        maxTokens: 4096,
        supportedModes: [
          "novel",
          "article",
          "news",
          "educational",
          "code",
          "general",
        ],
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        description: "Fastest model for simple tasks",
        maxTokens: 4096,
        supportedModes: [
          "novel",
          "article",
          "news",
          "educational",
          "code",
          "general",
        ],
      },
    ];

    this.models = models;
    return models;
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      if (!this.client) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
          throw new Error("API key not configured");
        }
        this.client = new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: true,
        });
      }

      // Handle long content by chunking if necessary
      const maxContentLength = 180000; // Claude has a large context window

      if (request.content.length > maxContentLength) {
        return await this.processLongContent(request, maxContentLength);
      }

      const messages: Anthropic.MessageParam[] = [];

      // Add user message with content
      const content = request.systemPrompt
        ? request.content
        : `${request.prompt}\n\nContent:\n${request.content}`;

      messages.push({
        role: "user",
        content,
      });

      const response = await this.client.messages.create({
        model: request.model,
        max_tokens: 4096,
        system: request.systemPrompt,
        messages,
      });

      // Add rate limiting delay
      await this.rateLimitDelay();

      const textContent = response.content.find(
        (block) => block.type === "text"
      );

      return {
        result: textContent?.text || "",
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async processLongContent(
    request: AIRequest,
    maxContentLength: number
  ): Promise<AIResponse> {
    const chunks = this.chunkContent(request.content, maxContentLength);
    const results: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const messages: Anthropic.MessageParam[] = [];

      const content = request.systemPrompt
        ? chunk
        : `${request.prompt}\n\nThis is part ${i + 1} of ${
            chunks.length
          }. Content:\n${chunk}`;

      messages.push({
        role: "user",
        content,
      });

      const systemPrompt = request.systemPrompt
        ? `${request.systemPrompt}\n\nThis is part ${i + 1} of ${
            chunks.length
          } of the content. Process this part and maintain consistency with previous parts.`
        : undefined;

      const response = await this.client!.messages.create({
        model: request.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages,
      });

      const textContent = response.content.find(
        (block) => block.type === "text"
      );
      results.push(textContent?.text || "");

      // Rate limiting between chunks
      if (i < chunks.length - 1) {
        await this.rateLimitDelay(1000); // 1 second delay between chunks
      }
    }

    return {
      result: results.join("\n\n"),
      usage: {
        inputTokens: 0, // Summed from all chunks
        outputTokens: 0,
      },
    };
  }

  private chunkContent(content: string, maxLength: number): string[] {
    const chunks: string[] = [];
    const sentences = content.split(/(?<=[.!?])\s+/);
    let currentChunk = "";

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          // Single sentence is too long, split by words
          const words = sentence.split(" ");
          let wordChunk = "";
          for (const word of words) {
            if (wordChunk.length + word.length > maxLength) {
              if (wordChunk) {
                chunks.push(wordChunk.trim());
                wordChunk = word;
              } else {
                chunks.push(word); // Single word is very long
              }
            } else {
              wordChunk += (wordChunk ? " " : "") + word;
            }
          }
          if (wordChunk) {
            currentChunk = wordChunk;
          }
        }
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private async rateLimitDelay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
