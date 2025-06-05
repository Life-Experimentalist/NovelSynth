import type { RateLimitTracker, AIModel } from "../types";
export declare class RateLimiter {
    private static trackers;
    /**
     * Check if a request can be made based on rate limits
     */
    static canMakeRequest(provider: string, model: AIModel, tokenCount?: number): boolean;
    /**
     * Record a request and update rate limit tracker
     */
    static recordRequest(provider: string, model: AIModel, tokenCount?: number): void;
    /**
     * Get time until next request can be made
     */
    static getWaitTime(provider: string, model: AIModel): number;
    /**
     * Wait for rate limit to reset
     */
    static waitForRateLimit(provider: string, model: AIModel): Promise<void>;
    /**
     * Get or create rate limit tracker
     */
    private static getTracker;
    /**
     * Clear all rate limit trackers
     */
    static clearTrackers(): void;
    /**
     * Get all current trackers (for debugging)
     */
    static getTrackers(): RateLimitTracker[];
}
