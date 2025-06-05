import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
export declare class OpenRouterService extends BaseAIService {
    provider: AIProvider;
    summarize(content: string, options?: any): Promise<AIResponse>;
    analyze(content: string, options?: any): Promise<AIResponse>;
    generateSuggestions(content: string, options?: any): Promise<AIResponse>;
    enhance(content: string, options?: EnhancementOptions): Promise<AIResponse>;
    /**
     * Build enhancement prompt based on content type and options
     */
    private buildEnhancementPrompt;
}
