import OpenAI from "openai";
import { BaseAIService } from "./base";
import type { AIModel, AIRequest, AIResponse } from "@/types";

export class OpenAIService extends BaseAIService {
  id = "openai";
  name = "OpenAI";
  icon = "🤖";

  private client: OpenAI | null = null;

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      // Test with a simple request
      await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5,
      });

      this.setApiKey(apiKey);
      this.client = client;
      return true;
    } catch (error) {
      return false;
    }
  }
  async getModels(): Promise<AIModel[]> {
    if (!this.client) {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      this.client = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
    }

    try {
      console.log("🔍 Fetching available OpenAI models...");

      // Fetch available models from OpenAI API
      const response = await this.client.models.list();
      const availableModelIds = response.data.map((model) => model.id);

      console.log("Available OpenAI model IDs:", availableModelIds);

      // Define known models with their capabilities
      const knownModels: AIModel[] = [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Most advanced multimodal model",
          maxTokens: 128000,
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
          id: "gpt-4o-mini",
          name: "GPT-4o Mini",
          description: "Fast and efficient model",
          maxTokens: 128000,
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
          id: "gpt-4-turbo",
          name: "GPT-4 Turbo",
          description: "Latest GPT-4 model with large context",
          maxTokens: 128000,
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
          id: "gpt-4-turbo-preview",
          name: "GPT-4 Turbo Preview",
          description: "Preview version of GPT-4 Turbo",
          maxTokens: 128000,
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
          id: "gpt-4",
          name: "GPT-4",
          description: "Most capable model for complex tasks",
          maxTokens: 8192,
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
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and efficient model for most tasks",
          maxTokens: 16385,
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

      // Filter to only include models that are actually available
      const validatedModels = knownModels.filter((model) =>
        availableModelIds.some(
          (id) => id.includes(model.id) || model.id.includes(id)
        )
      );

      if (validatedModels.length === 0) {
        // Fallback to basic models if none found
        console.log(
          "⚠️ No models found in API response, using fallback models"
        );
        const fallbackModels = [
          knownModels.find((m) => m.id === "gpt-4o-mini"),
          knownModels.find((m) => m.id === "gpt-3.5-turbo"),
        ].filter(Boolean) as AIModel[];

        this.models = fallbackModels;
        return fallbackModels;
      }

      console.log(`✅ Found ${validatedModels.length} available OpenAI models`);
      this.models = validatedModels;
      return validatedModels;
    } catch (error) {
      console.error("Failed to fetch OpenAI models:", error);

      // Return fallback models
      const fallbackModels: AIModel[] = [
        {
          id: "gpt-4o-mini",
          name: "GPT-4o Mini",
          description: "Fast and efficient model",
          maxTokens: 128000,
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
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and efficient model for most tasks",
          maxTokens: 16385,
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

      this.models = fallbackModels;
      return fallbackModels;
    }
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      if (!this.client) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
          throw new Error("API key not configured");
        }
        this.client = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true,
        });
      }

      // Handle long content by chunking if necessary
      const maxContentLength = 15000; // Conservative limit for OpenAI

      if (request.content.length > maxContentLength) {
        return await this.processLongContent(request, maxContentLength);
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      // Add system message if provided
      if (request.systemPrompt) {
        messages.push({
          role: "system",
          content: request.systemPrompt,
        });
      }

      // Add user message with content
      messages.push({
        role: "user",
        content: request.systemPrompt
          ? request.content
          : `${request.prompt}\n\nContent:\n${request.content}`,
      });

      const completion = await this.client.chat.completions.create({
        model: request.model,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      });

      // Add rate limiting delay
      await this.rateLimitDelay();

      return {
        result: completion.choices[0]?.message?.content || "",
        usage: {
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
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
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (request.systemPrompt) {
        messages.push({
          role: "system",
          content: `${request.systemPrompt}\n\nThis is part ${i + 1} of ${
            chunks.length
          } of the content. Process this part and maintain consistency with previous parts.`,
        });
      }

      messages.push({
        role: "user",
        content: request.systemPrompt
          ? chunk
          : `${request.prompt}\n\nThis is part ${i + 1} of ${
              chunks.length
            }. Content:\n${chunk}`,
      });

      const completion = await this.client!.chat.completions.create({
        model: request.model,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      });

      results.push(completion.choices[0]?.message?.content || "");

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
