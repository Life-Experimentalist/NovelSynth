import type { UserSettings, CustomPrompts, ContentStorage, ContentToggleState, StorageStats, ContentType } from "../types";
export declare class StorageManager {
    private static readonly STORAGE_KEY;
    private static readonly CONTENT_STORAGE_KEY;
    private static readonly DEFAULT_SETTINGS;
    static getSettings(): Promise<UserSettings>;
    static saveSettings(settings: Partial<UserSettings>): Promise<boolean>;
    static updateApiKey(provider: string, apiKey: string): Promise<boolean>;
    static removeApiKey(provider: string): Promise<boolean>;
    static setSelectedProvider(provider: string): Promise<boolean>;
    static setSelectedModel(featureType: keyof UserSettings["selectedModels"], modelId: string): Promise<boolean>;
    static setSelectedModels(models: Partial<UserSettings["selectedModels"]>): Promise<boolean>;
    static setCustomPrompt(promptType: keyof CustomPrompts, promptKey: string, promptValue: string): Promise<boolean>;
    static removeCustomPrompt(promptType: keyof CustomPrompts, promptKey: string): Promise<boolean>;
    static setRateLimitingSettings(rateLimiting: Partial<UserSettings["rateLimiting"]>): Promise<boolean>;
    static setContentDetectionSettings(settings: {
        autoDetectContentType?: boolean;
        showWordCount?: boolean;
        showProcessingBanner?: boolean;
    }): Promise<boolean>;
    static toggleFeature(feature: string): Promise<boolean>;
    static toggleHandler(handler: string): Promise<boolean>;
    static clearAllData(): Promise<boolean>;
    static onSettingsChanged(callback: (settings: UserSettings) => void): void;
    /**
     * Store enhanced content with original for toggle functionality
     */
    static storeContent(pageUrl: string, originalContent: string, enhancedContent: string, metadata: {
        timestamp: string;
        provider: string;
        model: string;
        contentType: ContentType;
        processingTime?: number;
        websiteId: string;
    }): Promise<boolean>;
    /**
     * Retrieve stored content for a URL
     */
    static getStoredContentForUrl(pageUrl: string): Promise<ContentStorage | null>;
    /**
     * Get all stored content
     */
    static getStoredContent(): Promise<Record<string, ContentStorage>>;
    /**
     * Clear stored content for a URL or all content
     */
    static clearStoredContent(pageUrl?: string): Promise<boolean>;
    /**
     * Get storage statistics
     */
    static getStorageStats(): Promise<StorageStats>;
    /**
     * Manage content toggle state for a specific URL
     */
    static setToggleState(pageUrl: string, isShowingEnhanced: boolean): Promise<boolean>;
    /**
     * Get toggle state for a URL
     */
    static getToggleState(pageUrl: string): Promise<ContentToggleState | null>;
    /**
     * Get all toggle states
     */
    static getToggleStates(): Promise<Record<string, ContentToggleState>>;
    /**
     * Generate a simple hash for content to detect changes
     */
    private static generateContentHash;
}
