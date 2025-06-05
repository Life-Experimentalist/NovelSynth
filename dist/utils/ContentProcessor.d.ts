import { BaseWebsiteHandler } from "./website-handlers/BaseWebsiteHandler";
import type { ProcessingResult } from "../types";
export declare class ContentProcessor {
    private aiServiceManager;
    private currentHandler;
    constructor();
    /**
     * Detect which website handler to use based on current URL
     */
    private detectWebsiteHandler;
    /**
     * Check if current page can be handled
     */
    canHandleCurrentPage(): boolean;
    /**
     * Process the current page content
     */
    processCurrentPage(options?: any): Promise<ProcessingResult>;
    /**
     * Replace page content with new content
     */
    replacePageContent(newContent: string): void;
    /**
     * Detect content type based on website and content
     */
    private detectContentType;
    /**
     * Format content for display while preserving important formatting
     */
    private formatContentForDisplay;
    /**
     * Get current handler
     */
    getCurrentHandler(): BaseWebsiteHandler | null;
}
