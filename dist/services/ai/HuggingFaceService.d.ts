import { BaseAIService } from "./BaseAIService";
import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
export declare class HuggingFaceService extends BaseAIService {
    provider: AIProvider;
    summarize(content: string, options?: any): Promise<AIResponse>;
    analyze(content: string, options?: any): Promise<AIResponse>;
    generateSuggestions(content: string, options?: any): Promise<AIResponse>;
    enhance(content: string, options?: EnhancementOptions): Promise<AIResponse>;
}
