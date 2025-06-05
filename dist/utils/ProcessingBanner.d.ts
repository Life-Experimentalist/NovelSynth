import { WordCountStats } from "../utils/WordCounter";
export interface BannerConfig {
    provider: string;
    model: string;
    showWordCount: boolean;
    showProcessingBanner: boolean;
}
export declare class ProcessingBanner {
    private bannerElement;
    private config;
    private currentUrl;
    constructor(config: BannerConfig);
    /**
     * Create and show initial banner with word count
     */
    showInitialBanner(contentElement: Element, wordCount: number): void;
    /**
     * Show processing banner while AI is working
     */
    showProcessingBanner(contentElement: Element): void;
    /**
     * Show completion banner with enhancement stats
     */
    showCompletionBanner(contentElement: Element, stats: WordCountStats, processingTime: number): void;
    /**
     * Show error banner
     */
    showErrorBanner(contentElement: Element, error: string): void;
    /**
     * Show toggle banner with content switch functionality
     */
    showToggleBanner(contentElement: Element, hasEnhancedContent?: boolean, hasSummary?: boolean): Promise<void>;
    /**
     * Setup toggle banner event handlers
     */
    private setupToggleBannerEvents;
    /**
     * Handle content toggle between original, enhanced, and summary
     */
    private handleContentToggle;
    /**
     * Update status display in banner
     */
    private updateStatusDisplay;
    /**
     * Check if content has been enhanced and update banner accordingly
     */
    checkAndUpdateBanner(contentElement: Element): Promise<void>;
    /**
     * Remove the current banner
     */
    removeBanner(): void;
    /**
     * Create the base banner element
     */
    private createBannerElement;
    /**
     * Insert banner into the page
     */
    private insertBanner;
    /**
     * Setup banner event listeners
     */
    private setupBannerEvents;
    /**
     * Get banner CSS styles
     */
    private getBannerStyles;
}
