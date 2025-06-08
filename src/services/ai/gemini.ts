import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseAIService } from "./base";
import type { AIModel, AIRequest, AIResponse } from "@/types";

export class GeminiService extends BaseAIService {
  id = "gemini";
  name = "Google Gemini";
  icon = "🔮";

  private client: GoogleGenerativeAI | null = null;
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Basic API key format validation
      if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
        console.error("Gemini API key validation failed: Invalid key format");
        return false;
      }

      // Gemini API keys typically start with "AIza" and are about 39 characters long
      const trimmedKey = apiKey.trim();
      if (!trimmedKey.startsWith("AIza") || trimmedKey.length < 35) {
        console.error(
          "Gemini API key validation failed: Key does not match expected format"
        );
        return false;
      }

      console.log(
        `Validating Gemini API key: ${trimmedKey.substring(0, 8)}...`
      );

      const genAI = new GoogleGenerativeAI(trimmedKey);

      // Use the latest available model for validation
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Use newer model that's more likely to work
        generationConfig: {
          maxOutputTokens: 5, // Very minimal response for validation
          temperature: 0,
        },
      });

      // Test with a minimal prompt to validate API access
      console.log("Making validation request to Gemini API...");

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: "1" }] }],
      });

      const response = await result.response;
      const text = response.text();

      // If we got any response text, the API key is valid
      if (text && text.length > 0) {
        this.setApiKey(trimmedKey);
        this.client = genAI;
        console.log("✅ Gemini API key validation successful");
        return true;
      } else {
        console.error("❌ Gemini API key validation failed: Empty response");
        return false;
      }
    } catch (error: any) {
      console.error("❌ Gemini API key validation failed:", error);

      // Provide more detailed error messages
      const errorMessage =
        error?.message || error?.toString() || "Unknown error";

      if (
        errorMessage.includes("API_KEY_INVALID") ||
        errorMessage.includes("invalid")
      ) {
        console.error("🔑 The provided API key is invalid or malformed");
        throw new Error(
          "Invalid API key: The key format is incorrect or the key has been revoked"
        );
      } else if (
        errorMessage.includes("PERMISSION_DENIED") ||
        errorMessage.includes("permission")
      ) {
        console.error("🚫 Permission denied - check API key permissions");
        throw new Error(
          "Permission denied: API key doesn't have required permissions for Gemini API"
        );
      } else if (
        errorMessage.includes("QUOTA_EXCEEDED") ||
        errorMessage.includes("quota")
      ) {
        console.error("📊 API quota exceeded");
        throw new Error(
          "Quota exceeded: You have reached your API usage limit"
        );
      } else if (
        errorMessage.includes("RATE_LIMIT_EXCEEDED") ||
        errorMessage.includes("rate")
      ) {
        console.error("⏱️ Rate limit exceeded");
        throw new Error(
          "Rate limit exceeded: Too many requests, please try again later"
        );
      } else if (
        errorMessage.includes("fetch") ||
        errorMessage.includes("network")
      ) {
        console.error("🌐 Network connectivity issue");
        throw new Error("Network error: Unable to connect to Gemini API");
      } else {
        console.error("❓ Unknown validation error:", errorMessage);
        throw new Error(`API validation failed: ${errorMessage}`);
      }
    }
  }
  async getModels(): Promise<AIModel[]> {
    if (!this.client) {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      this.client = new GoogleGenerativeAI(apiKey);
    }

    try {
      console.log("🔍 Fetching available Gemini models...");      // Try to fetch available models from the API
      // Note: Google Generative AI library doesn't expose listModels directly in the browser client
      // So we'll use the known available models with API validation
      const knownModels: AIModel[] = [
        {
          id: "gemini-2.0-flash",
          name: "Gemini 1.5 Flash",
          description: "Fast and efficient model for most tasks",
          maxTokens: 1048576, // 1M tokens
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
          id: "gemini-2.0-flash-8b",
          name: "Gemini 1.5 Flash 8B",
          description: "Smaller, faster version of Flash model",
          maxTokens: 1048576,
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
          id: "gemini-2.0-flash-latest",
          name: "Gemini 1.5 Flash (Latest)",
          description: "Latest stable version of Flash model",
          maxTokens: 1048576,
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
          id: "gemini-1.5-pro",
          name: "Gemini 1.5 Pro",
          description: "Most capable model for complex reasoning tasks",
          maxTokens: 2097152, // 2M tokens
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
          id: "gemini-1.5-pro-latest",
          name: "Gemini 1.5 Pro (Latest)",
          description: "Latest stable version of Pro model",
          maxTokens: 2097152,
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
          id: "gemini-1.5-pro-exp-0801",
          name: "Gemini 1.5 Pro Experimental",
          description: "Experimental version with cutting-edge features",
          maxTokens: 2097152,
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
          id: "gemini-1.5-pro-exp-0827",
          name: "Gemini 1.5 Pro Experimental (0827)",
          description: "Latest experimental build",
          maxTokens: 2097152,
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
          id: "gemini-1.0-pro",
          name: "Gemini 1.0 Pro",
          description: "First generation Gemini model",
          maxTokens: 30720,
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
          id: "gemini-pro",
          name: "Gemini Pro (Legacy)",
          description: "Previous generation model",
          maxTokens: 30720,
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
          id: "gemini-pro-vision",
          name: "Gemini Pro Vision",
          description: "Multimodal model that can process images",
          maxTokens: 30720,
          supportedModes: ["article", "educational", "general"],
        },
      ];

      // Validate each model by testing access
      const validatedModels: AIModel[] = [];

      for (const model of knownModels) {
        try {
          const testModel = this.client.getGenerativeModel({
            model: model.id,
            generationConfig: {
              maxOutputTokens: 1,
              temperature: 0,
            },
          });

          // Test if we can access this model
          console.log(`Testing model: ${model.id}`);
          await Promise.race([
            testModel.generateContent("test"),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000)
            ),
          ]);

          validatedModels.push(model);
          console.log(`✅ Model ${model.id} is accessible`);
        } catch (error) {
          console.log(`❌ Model ${model.id} is not accessible:`, error);
          // Skip this model if not accessible
        }
      }

      if (validatedModels.length === 0) {
        // Fallback to basic models if validation fails
        console.log("⚠️ Using fallback models");
        validatedModels.push(knownModels[0], knownModels[3]); // Flash and Pro Legacy
      }

      console.log(`✅ Found ${validatedModels.length} available Gemini models`);
      this.models = validatedModels;
      return validatedModels;
    } catch (error) {
      console.error("Failed to fetch Gemini models:", error);

      // Return basic fallback models
      const fallbackModels: AIModel[] = [
        {
          id: "gemini-2.0-flash",
          name: "Gemini 1.5 Flash",
          description: "Fast and efficient model for most tasks",
          maxTokens: 1048576,
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
          id: "gemini-pro",
          name: "Gemini Pro",
          description: "Previous generation model",
          maxTokens: 30720,
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
        this.client = new GoogleGenerativeAI(apiKey);
      }

      const model = this.client.getGenerativeModel({
        model: request.model,
        generationConfig: {
          maxOutputTokens: 8192,
          temperature: 0.7,
        },
      });

      // Handle long content by chunking if necessary
      const maxContentLength = 25000; // Leave room for system prompt

      if (request.content.length > maxContentLength) {
        return await this.processLongContent(model, request, maxContentLength);
      }

      // For normal content, use system instructions and content separately
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: request.systemPrompt || request.prompt }],
          },
          {
            role: "model",
            parts: [
              {
                text: "I understand. I'll follow these instructions for processing the content.",
              },
            ],
          },
        ],
      });

      const result = await chat.sendMessage(request.content);
      const response = await result.response;
      const text = response.text();

      // Add rate limiting delay
      await this.rateLimitDelay();

      return {
        result: text,
        usage: {
          inputTokens: 0, // Gemini doesn't provide detailed token usage
          outputTokens: 0,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async processLongContent(
    model: any,
    request: AIRequest,
    maxContentLength: number
  ): Promise<AIResponse> {
    const chunks = this.chunkContent(request.content, maxContentLength);
    const results: string[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkPrompt = `${
        request.systemPrompt || request.prompt
      }\n\nThis is part ${i + 1} of ${
        chunks.length
      } of the content. Process this part and maintain consistency with previous parts.\n\nContent part ${
        i + 1
      }:`;

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: chunkPrompt }],
          },
          {
            role: "model",
            parts: [
              {
                text: "I understand. I'll process this part while maintaining consistency.",
              },
            ],
          },
        ],
      });

      const result = await chat.sendMessage(chunk);
      const response = await result.response;
      results.push(response.text());

      // Rate limiting between chunks
      if (i < chunks.length - 1) {
        await this.rateLimitDelay(2000); // 2 second delay between chunks
      }
    }

    return {
      result: results.join("\n\n"),
      usage: {
        inputTokens: 0,
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

  private buildPrompt(request: AIRequest): string {
    return `${request.systemPrompt || request.prompt}\n\nContent:\n${
      request.content
    }`;
  }
}
