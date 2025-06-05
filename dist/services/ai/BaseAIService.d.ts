import type { AIProvider, AIResponse, EnhancementOptions } from "../../types";
export declare abstract class BaseAIService {
    abstract provider: AIProvider;
    protected apiKey: string;
    constructor(apiKey?: string);
    setApiKey(apiKey: string): void;
    abstract enhance(content: string, options?: EnhancementOptions): Promise<AIResponse>;
    abstract summarize(content: string, options?: any): Promise<AIResponse>;
    abstract analyze(content: string, options?: any): Promise<AIResponse>;
    abstract generateSuggestions(content: string, options?: any): Promise<AIResponse>;
    protected validateApiKey(): void;
    protected makeRequest(url: string, options: RequestInit): Promise<any>;
    /**
     * Get available models for this provider
     */
    getAvailableModels(): string[];
    /**
     * Check if a specific feature is supported
     */
    supportsFeature(feature: string): boolean;
    /**
     * Get provider information
     */
    getProviderInfo(): AIProvider;
}
