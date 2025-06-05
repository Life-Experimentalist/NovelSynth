import type { AIProvider, AIResponse, UserSettings, AIModel, EnhancementOptions } from "../../types";
export declare class AIServiceManager {
    private services;
    private currentService;
    private currentSettings;
    constructor();
    private initializeServices;
    getAvailableProviders(): AIProvider[];
    /**
     * Get available models for a specific provider
     */
    getAvailableModels(providerId: string): AIModel[];
    /**
     * Get all available models across all providers
     */
    getAllAvailableModels(): Record<string, AIModel[]>;
    setActiveProvider(providerId: string, apiKey?: string): Promise<boolean>;
    getCurrentProvider(): AIProvider | null;
    /**
     * Enhanced method with rate limiting and segmentation support
     */
    enhance(content: string, options?: EnhancementOptions, featureType?: "enhance" | "summarize" | "analyze" | "suggestions"): Promise<AIResponse>;
    /**
     * Handle large content with segmentation
     */ private enhanceWithSegmentation;
    /**
     * Handle single content enhancement with rate limiting
     */ private enhanceSingleContent;
    /**
     * Get model by ID for a provider
     */
    private getModelById;
    summarize(content: string, options?: any): Promise<AIResponse>;
    analyze(content: string, options?: any): Promise<AIResponse>;
    generateSuggestions(content: string, options?: any): Promise<AIResponse>;
    loadSettingsAndInitialize(settings: UserSettings): Promise<void>;
}
