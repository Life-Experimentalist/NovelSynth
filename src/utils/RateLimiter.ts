import type { RateLimitTracker, AIModel } from "../types";

export class RateLimiter {
  private static trackers: Map<string, RateLimitTracker> = new Map();

  /**
   * Check if a request can be made based on rate limits
   */
  static canMakeRequest(
    provider: string,
    model: AIModel,
    tokenCount: number = 0
  ): boolean {
    const key = `${provider}:${model.id}`;
    const tracker = this.getTracker(key, provider, model.id);
    const now = Date.now();

    // Reset counters if a minute has passed
    if (now - tracker.lastRequest >= 60000) {
      tracker.requestCount = 0;
      tracker.tokenCount = 0;
    }

    // Check RPM limit
    if (model.rateLimitRPM && tracker.requestCount >= model.rateLimitRPM) {
      return false;
    }

    // Check TPM limit
    if (
      model.rateLimitTPM &&
      tracker.tokenCount + tokenCount > model.rateLimitTPM
    ) {
      return false;
    }

    return now >= tracker.nextAvailableTime;
  }

  /**
   * Record a request and update rate limit tracker
   */
  static recordRequest(
    provider: string,
    model: AIModel,
    tokenCount: number = 0
  ): void {
    const key = `${provider}:${model.id}`;
    const tracker = this.getTracker(key, provider, model.id);
    const now = Date.now();

    tracker.requestCount++;
    tracker.tokenCount += tokenCount;
    tracker.lastRequest = now;

    // Calculate next available time based on rate limits
    if (model.rateLimitRPM) {
      const requestInterval = 60000 / model.rateLimitRPM;
      tracker.nextAvailableTime = Math.max(
        tracker.nextAvailableTime,
        now + requestInterval
      );
    }
  }

  /**
   * Get time until next request can be made
   */
  static getWaitTime(provider: string, model: AIModel): number {
    const key = `${provider}:${model.id}`;
    const tracker = this.getTracker(key, provider, model.id);
    const now = Date.now();

    return Math.max(0, tracker.nextAvailableTime - now);
  }

  /**
   * Wait for rate limit to reset
   */
  static async waitForRateLimit(
    provider: string,
    model: AIModel
  ): Promise<void> {
    const waitTime = this.getWaitTime(provider, model);
    if (waitTime > 0) {
      console.log(
        `Rate limit reached for ${provider}:${model.id}. Waiting ${waitTime}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Get or create rate limit tracker
   */
  private static getTracker(
    key: string,
    provider: string,
    modelId: string
  ): RateLimitTracker {
    if (!this.trackers.has(key)) {
      this.trackers.set(key, {
        provider,
        model: modelId,
        requestCount: 0,
        tokenCount: 0,
        lastRequest: 0,
        nextAvailableTime: 0,
      });
    }

    return this.trackers.get(key)!;
  }

  /**
   * Clear all rate limit trackers
   */
  static clearTrackers(): void {
    this.trackers.clear();
  }

  /**
   * Get all current trackers (for debugging)
   */
  static getTrackers(): RateLimitTracker[] {
    return Array.from(this.trackers.values());
  }
}
