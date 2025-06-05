import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
/**
 * Google Gemini AI Service
 * Primary AI service for NovelSynth with support for all content types
 */
export declare class GeminiService extends BaseAIService {
    provider: AIProvider;
    private readonly ENDPOINTS;
    /**
     * Main content enhancement method - primary function
     */
    enhance(content: string, options?: EnhancementOptions): Promise<AIResponse>;
    /**
     * Generate summary of content
     */
    summarize(content: string, options?: any): Promise<AIResponse>;
    /**
     * Make request to Gemini API
     */
    private makeGeminiRequest;
    /**
     * Extract text from Gemini response
     */
    private extractTextFromResponse;
    /**
     * Build enhancement prompt based on content type
     */
    private buildEnhancementPrompt;
    /**
     * Build summary prompt
     */
    private buildSummaryPrompt;
    /**
     * Get error message from various error types
     */
    private getErrorMessage;
    analyze(content: string, options?: any): Promise<AIResponse>;
    generateSuggestions(content: string, options?: any): Promise<AIResponse>;
}
