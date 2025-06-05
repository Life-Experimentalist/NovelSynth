export declare class BaseWebsiteHandler {
    /**
     * Find the main content area on the page
     */
    findContentArea(): HTMLElement | null;
    /**
     * Extract content from the content area
     */
    extractContent(contentArea: HTMLElement): string;
    /**
     * Extract the title of the page/chapter
     */
    extractTitle(): string;
    /**
     * Get chapter navigation info
     */
    getChapterNavigation(): any;
    /**
     * Format content after enhancement
     */
    formatAfterEnhancement(contentArea: HTMLElement): void;
    /**
     * Check if element is a valid content area
     */
    private isValidContentArea;
    /**
     * Find the largest text container as fallback
     */
    private findLargestTextContainer;
    /**
     * Remove unwanted elements from content
     */
    private removeUnwantedElements;
    /**
     * Extract formatted text while preserving structure
     */
    private extractFormattedText;
    /**
     * Add markers to indicate enhanced content
     */
    private addEnhancementMarkers;
}
