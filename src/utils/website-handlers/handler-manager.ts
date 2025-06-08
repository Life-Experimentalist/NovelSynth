/**
 * Website Handler Manager
 * Manages registration and selection of website-specific content handlers
 */

import {
  IWebsiteHandler,
  HandlerRegistration,
  HandlerManagerConfig,
  ContentType,
  ContentQuality,
} from "./types";

import { RanobesHandler } from "./ranobes-handler";
import { FanfictionHandler } from "./fanfiction-handler";
import { AO3Handler } from "./ao3-handler";
import { GenericHandler } from "./generic-handler";

export class HandlerManager {
  private handlers: Map<string, HandlerRegistration> = new Map();
  private handlerInstances: Map<string, IWebsiteHandler> = new Map();
  private config: HandlerManagerConfig;

  constructor(config?: Partial<HandlerManagerConfig>) {
    this.config = {
      defaultContentType: ContentType.ARTICLE,
      defaultQuality: ContentQuality.MEDIUM,
      globalValidation: {
        minLength: 100,
        maxLength: 1000000,
        excludeUrlPatterns: [
          /\/api\//,
          /\.json$/,
          /\.xml$/,
          /\.rss$/,
          /\/admin/,
          /\/login/,
          /\/logout/,
          /\/register/,
          /\/signup/,
        ],
      },
      cacheHandlers: true,
      ...config,
    };

    this.registerDefaultHandlers();
  }
  /**
   * Register default handlers for common websites
   */
  private registerDefaultHandlers(): void {
    // Register specific site handlers
    this.registerHandler("ranobes", RanobesHandler, 100, true);
    this.registerHandler("fanfiction", FanfictionHandler, 100, true);
    this.registerHandler("ao3", AO3Handler, 100, true);

    // Generic handler has lowest priority
    this.registerHandler("generic", GenericHandler, 1, true);
  }

  /**
   * Register a new website handler
   */
  registerHandler(
    id: string,
    handlerClass: new () => IWebsiteHandler,
    priority: number = 50,
    enabled: boolean = true
  ): void {
    this.handlers.set(id, {
      handlerClass,
      priority,
      enabled,
    });

    // Clear cached instance if it exists
    if (this.handlerInstances.has(id)) {
      const instance = this.handlerInstances.get(id);
      if (instance?.cleanup) {
        instance.cleanup();
      }
      this.handlerInstances.delete(id);
    }
  }

  /**
   * Unregister a handler
   */
  unregisterHandler(id: string): void {
    this.handlers.delete(id);

    if (this.handlerInstances.has(id)) {
      const instance = this.handlerInstances.get(id);
      if (instance?.cleanup) {
        instance.cleanup();
      }
      this.handlerInstances.delete(id);
    }
  }

  /**
   * Enable or disable a handler
   */
  setHandlerEnabled(id: string, enabled: boolean): void {
    const registration = this.handlers.get(id);
    if (registration) {
      registration.enabled = enabled;
    }
  }

  /**
   * Get handler for the current website
   */
  async getHandlerForCurrentSite(): Promise<IWebsiteHandler | null> {
    const url = window.location.href;
    return this.getHandlerForUrl(url);
  }

  /**
   * Get handler for a specific URL
   */
  async getHandlerForUrl(url: string): Promise<IWebsiteHandler | null> {
    try {
      // Check global validation first
      if (!this.passesGlobalValidation(url)) {
        console.log("HandlerManager: URL failed global validation");
        return null;
      }

      // Get all enabled handlers sorted by priority
      const enabledHandlers = Array.from(this.handlers.entries())
        .filter(([_, registration]) => registration.enabled)
        .sort(([_, a], [__, b]) => b.priority - a.priority);

      // Try each handler in priority order
      for (const [id, registration] of enabledHandlers) {
        const handler = this.getHandlerInstance(id, registration);

        if (handler.canHandle(url)) {
          console.log(`HandlerManager: Selected handler '${id}' for ${url}`);

          // Validate content if we're on the actual page
          if (url === window.location.href) {
            const isValid = await handler.validateContent();
            if (!isValid) {
              console.log(
                `HandlerManager: Handler '${id}' failed content validation`
              );
              continue;
            }
          }

          return handler;
        }
      }

      console.log(`HandlerManager: No suitable handler found for ${url}`);
      return null;
    } catch (error) {
      console.error("Error selecting handler:", error);
      return null;
    }
  }

  /**
   * Get or create handler instance
   */
  private getHandlerInstance(
    id: string,
    registration: HandlerRegistration
  ): IWebsiteHandler {
    if (this.config.cacheHandlers && this.handlerInstances.has(id)) {
      return this.handlerInstances.get(id)!;
    }

    const instance = new registration.handlerClass();

    if (this.config.cacheHandlers) {
      this.handlerInstances.set(id, instance);
    }

    return instance;
  }

  /**
   * Check if URL passes global validation
   */
  private passesGlobalValidation(url: string): boolean {
    if (this.config.globalValidation.excludeUrlPatterns) {
      return !this.config.globalValidation.excludeUrlPatterns.some((pattern) =>
        pattern.test(url)
      );
    }
    return true;
  }

  /**
   * Get list of all registered handlers
   */
  getRegisteredHandlers(): Array<{
    id: string;
    config: any;
    enabled: boolean;
    priority: number;
  }> {
    return Array.from(this.handlers.entries()).map(([id, registration]) => {
      const instance = this.getHandlerInstance(id, registration);
      return {
        id,
        config: instance.getConfig(),
        enabled: registration.enabled,
        priority: registration.priority,
      };
    });
  }

  /**
   * Get supported domains from all handlers
   */
  getSupportedDomains(): string[] {
    const domains = new Set<string>();

    for (const [_, registration] of this.handlers) {
      if (registration.enabled) {
        const instance = this.getHandlerInstance(_, registration);
        const config = instance.getConfig();
        config.domains.forEach((domain) => domains.add(domain));
      }
    }

    return Array.from(domains).sort();
  }

  /**
   * Check if a domain is supported
   */
  isDomainSupported(domain: string): boolean {
    const supportedDomains = this.getSupportedDomains();
    return supportedDomains.some(
      (supported) => domain.includes(supported) || domain.endsWith(supported)
    );
  }

  /**
   * Get handler statistics
   */
  getStatistics(): {
    totalHandlers: number;
    enabledHandlers: number;
    supportedDomains: number;
    contentTypes: string[];
  } {
    const enabledHandlers = Array.from(this.handlers.values()).filter(
      (reg) => reg.enabled
    );

    const contentTypes = new Set<string>();
    enabledHandlers.forEach((reg) => {
      const instance = this.getHandlerInstance("", reg);
      contentTypes.add(instance.getConfig().primaryContentType);
    });

    return {
      totalHandlers: this.handlers.size,
      enabledHandlers: enabledHandlers.length,
      supportedDomains: this.getSupportedDomains().length,
      contentTypes: Array.from(contentTypes),
    };
  }

  /**
   * Test handler compatibility with current page
   */
  async testCurrentPage(): Promise<{
    url: string;
    selectedHandler: string | null;
    availableHandlers: string[];
    validationResults: Record<string, boolean>;
    extractionResult?: any;
  }> {
    const url = window.location.href;
    const results = {
      url,
      selectedHandler: null as string | null,
      availableHandlers: [] as string[],
      validationResults: {} as Record<string, boolean>,
      extractionResult: undefined as any,
    };

    // Test all handlers
    for (const [id, registration] of this.handlers) {
      if (!registration.enabled) continue;

      const handler = this.getHandlerInstance(id, registration);

      if (handler.canHandle(url)) {
        results.availableHandlers.push(id);

        try {
          const isValid = await handler.validateContent();
          results.validationResults[id] = isValid;

          if (isValid && !results.selectedHandler) {
            results.selectedHandler = id;
            // Try to extract content
            try {
              results.extractionResult = await handler.extractContent();
            } catch (error) {
              console.error(
                `Error extracting content with handler '${id}':`,
                error
              );
            }
          }
        } catch (error) {
          console.error(
            `Error validating content with handler '${id}':`,
            error
          );
          results.validationResults[id] = false;
        }
      }
    }

    return results;
  }

  /**
   * Clean up all cached handlers
   */
  cleanup(): void {
    for (const [id, instance] of this.handlerInstances) {
      if (instance.cleanup) {
        instance.cleanup();
      }
    }
    this.handlerInstances.clear();
  }
}

// Create and export default instance
export const handlerManager = new HandlerManager();

// Export individual handlers for direct use if needed
export { RanobesHandler, FanfictionHandler, AO3Handler, GenericHandler };
