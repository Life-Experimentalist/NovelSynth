import { ContentType, PromptType } from "./PromptManager";
import type { UserSettings } from "../types";
export interface PromptComponents {
    basePrompt: string;
    websitePrompt: string;
    novelPrompt: string;
    permanentPrompt: string;
}
export interface NovelContext {
    title: string;
    author?: string;
    genre?: string;
    customPrompt?: string;
}
export declare class PromptBuilder {
    private settings;
    private novelContexts;
    constructor(settings: UserSettings);
    /**
     * Build a complete prompt for content enhancement
     */
    buildEnhancementPrompt(contentType: ContentType, websiteId: string, novelTitle?: string): PromptComponents;
    /**
     * Build a complete prompt for content summarization
     */
    buildSummaryPrompt(contentType: ContentType, websiteId: string, novelTitle?: string): PromptComponents;
    /**
     * Combine prompt components into a single prompt string
     */
    combinePrompts(components: PromptComponents, content: string): string;
    /**
     * Get enhancement prompt for content type
     */
    private getEnhancementPrompt;
    /**
     * Get summary prompt for content type
     */
    private getSummaryPrompt;
    /**
     * Get website-specific prompt
     */
    private getWebsitePrompt;
    /**
     * Get novel-specific prompt
     */
    private getNovelPrompt;
    /**
     * Store novel context for future use
     */
    storeNovelContext(novelTitle: string, context: Partial<NovelContext>): void;
    /**
     * Get novel context
     */
    getNovelContext(novelTitle: string): NovelContext | undefined;
    /**
     * Update custom prompt for a specific type and key
     */
    updateCustomPrompt(type: PromptType, key: string, prompt: string): void;
    /**
     * Get all available prompts for editing
     */
    getAllPrompts(): {
        [key: string]: any;
    };
    /**
     * Reset prompt to default
     */
    resetPromptToDefault(type: PromptType, key: string): void;
    /**
     * Normalize novel title for consistent storage
     */
    private normalizeNovelTitle;
    /**
     * Load novel contexts from storage
     */
    private loadNovelContexts;
    /**
     * Save novel contexts to storage
     */
    private saveNovelContexts;
    /**
     * Extract novel title from content or page
     */
    static extractNovelTitle(content: string, pageTitle: string): string | undefined;
}
