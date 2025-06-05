export interface ContentAnalysis {
    isLongForm: boolean;
    contentType: ContentType;
    wordCount: number;
    readingTime: number;
    title?: string;
    author?: string;
    novelTitle?: string;
    confidence: number;
}
export type ContentType = "novel" | "article" | "news" | "technical" | "generic";
export type EnhancementType = "improve" | "grammar" | "style" | "clarity" | "expand" | "condense";
export interface EnhancementOptions {
    contentType?: ContentType;
    enhancementType?: EnhancementType;
    customPrompt?: string;
    preserveFormatting?: boolean;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface AIProvider {
    name: string;
    id: string;
    apiEndpoint?: string;
    requiresAuth: boolean;
    authType: "api_key" | "oauth" | "none";
    features: string[];
    models?: string[];
    defaultModel?: string;
}
export interface AIModel {
    id: string;
    name: string;
    maxTokens: number;
    rateLimitRPM?: number;
    rateLimitTPM?: number;
    costPerToken?: number;
}
export interface AIResponse {
    summary?: string;
    analysis?: string;
    suggestions?: string[];
    keyPoints?: string[];
    enhanced?: string;
    error?: string;
    processingTime?: number;
    stats?: WordCountStats;
    originalLength?: number;
    enhancedLength?: number;
    compressionRatio?: number;
    model?: string;
    timestamp?: string;
    originalContent?: string;
}
export interface WordCountStats {
    originalWords: number;
    enhancedWords: number;
    wordsChanged: number;
    percentageChange: number;
    charactersOriginal: number;
    charactersEnhanced: number;
}
export interface SiteHandler {
    name: string;
    domains: string[];
    selectors: {
        title?: string;
        content?: string;
        author?: string;
        chapter?: string;
        next?: string;
        previous?: string;
    };
    isEnabled: boolean;
    priority: number;
    contentType?: string;
    extractNovelTitle?: (content: string, pageTitle: string) => string | undefined;
}
export interface CustomPrompts {
    enhancement: Record<string, string>;
    summary: Record<string, string>;
    permanent: Record<string, string>;
    website: Record<string, string>;
    novel: Record<string, string>;
}
export interface UserSettings {
    selectedProvider: string;
    selectedModels: {
        enhance: string;
        summarize: string;
        analyze: string;
        suggestions: string;
    };
    apiKeys: Record<string, string>;
    enabledFeatures: string[];
    enabledHandlers: string[];
    theme: "light" | "dark" | "auto";
    customPrompts?: CustomPrompts;
    autoDetectContentType: boolean;
    showWordCount: boolean;
    showProcessingBanner: boolean;
    rateLimiting: {
        enabled: boolean;
        waitTime: number;
        retryAttempts: number;
    };
}
export interface ExtensionMessage {
    type: "ANALYZE_CONTENT" | "GET_AI_RESPONSE" | "ENHANCE_CONTENT" | "SUMMARIZE_CONTENT" | "UPDATE_SETTINGS" | "GET_SETTINGS" | "GET_AVAILABLE_MODELS" | "UPDATE_CUSTOM_PROMPT" | "STORE_NOVEL_CONTEXT";
    payload?: any;
}
export interface EnhancementRequest {
    content: string;
    contentType: string;
    websiteId: string;
    novelTitle?: string;
    customPrompt?: string;
}
export interface ContentSegment {
    id: string;
    content: string;
    startIndex: number;
    endIndex: number;
    preserveImages: boolean;
    imagePositions: ImagePosition[];
}
export interface ImagePosition {
    src: string;
    alt?: string;
    title?: string;
    position: number;
    originalTag: string;
}
export interface RateLimitTracker {
    provider: string;
    model: string;
    requestCount: number;
    tokenCount: number;
    lastRequest: number;
    nextAvailableTime: number;
}
export interface SegmentationOptions {
    maxChunkSize: number;
    preserveImages: boolean;
    preserveFormatting: boolean;
    overlapSize: number;
}
export interface ContentStorage {
    pageUrl: string;
    originalContent: string;
    enhancedContent?: string;
    summary?: string;
    timestamp: number;
    contentHash: string;
    contentType: ContentType;
    websiteId: string;
}
export interface StorageManager {
    saveContent(content: ContentStorage): Promise<void>;
    getContent(pageUrl: string): Promise<ContentStorage | null>;
    clearContent(pageUrl: string): Promise<void>;
    clearAllContent(): Promise<void>;
    getStorageStats(): Promise<StorageStats>;
}
export interface StorageStats {
    totalItems: number;
    totalSize: number;
    oldestItem?: number;
    newestItem?: number;
}
export interface ContentToggleState {
    isShowingEnhanced: boolean;
    hasEnhancedContent: boolean;
    hasSummary: boolean;
    isProcessing: boolean;
}
export interface ProcessingResult {
    success: boolean;
    originalContent?: string;
    enhancedContent?: string;
    error?: string;
    metadata?: {
        title?: string;
        contentType?: ContentType;
        timestamp?: string;
        wordCount?: number;
        enhancementType?: string;
    };
}
export interface ContentState {
    pageKey: string;
    state: "original" | "enhanced";
    timestamp: string;
}
