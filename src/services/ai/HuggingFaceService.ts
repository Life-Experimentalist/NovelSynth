import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
import { WordCounter } from "../../utils/WordCounter";

export class HuggingFaceService extends BaseAIService {
  provider: AIProvider = {
    name: "Hugging Face",
    id: "huggingface",
    apiEndpoint: "https://api-inference.huggingface.co",
    requiresAuth: true,
    authType: "api_key",
    features: ["summarize", "analyze"],
  };

  async summarize(content: string, options?: any): Promise<AIResponse> {
    this.validateApiKey();

    try {
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/models/facebook/bart-large-cnn`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: content.substring(0, 1024), // Limit input length for free tier
            parameters: {
              max_length: 200,
              min_length: 50,
            },
          }),
        }
      );

      return {
        summary: response[0]?.summary_text || "No summary available",
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
      // Use text classification for basic analysis
      const response = await this.makeRequest(
        `${this.provider.apiEndpoint}/models/cardiffnlp/twitter-roberta-base-sentiment-latest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: content.substring(0, 512),
          }),
        }
      );

      const sentiment = response[0];
      const analysis = `Content Analysis:\n- Sentiment: ${
        sentiment?.label || "Unknown"
      } (${(sentiment?.score * 100).toFixed(1)}% confidence)\n- Length: ${
        content.length
      } characters\n- Estimated reading time: ${Math.ceil(
        content.split(" ").length / 200
      )} minutes`;

      return {
        analysis,
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
    // HuggingFace free inference doesn't support this well, return basic suggestions
    return {
      suggestions: [
        "Consider reading similar content on this topic",
        "Look up key terms mentioned in the content",
        "Check for related articles by the same author",
        "Explore the main themes discussed",
      ],
    };
  }
  async enhance(
    content: string,
    options: EnhancementOptions = {}
  ): Promise<AIResponse> {
    // HuggingFace free inference has limited enhancement capabilities
    // Return the original content with a simple enhancement note
    const startTime = Date.now();

    const {
      contentType = "generic",
      enhancementType = "improve",
      model = "basic-cleanup",
    } = options;

    try {
      // Basic enhancement - just return cleaned content with minor improvements
      const enhancedContent = content
        .replace(/\s+/g, " ")
        .replace(/\.\s+/g, ". ")
        .replace(/,\s+/g, ", ")
        .trim();

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
}
