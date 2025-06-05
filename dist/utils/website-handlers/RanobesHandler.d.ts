import { BaseWebsiteHandler } from "./BaseWebsiteHandler";
/**
 * Ranobes.net Website Content Handler
 * Specialized handler for extracting content from ranobes.net
 */
export declare class RanobesHandler extends BaseWebsiteHandler {
    findContentArea(): HTMLElement | null;
    extractTitle(): string;
    extractContent(contentArea: HTMLElement): string;
    /**
     * Check if current page is a chapter page (not a listing/index page)
     */
    isChapterPage(): boolean;
    getChapterNavigation(): any;
    formatAfterEnhancement(contentArea: HTMLElement): void;
    /**
     * Get site-specific prompt for Ranobes
     */
    getSiteSpecificPrompt(): string;
    /**
     * Get a readable site name for the UI
     */
    getSiteIdentifier(): string;
}
