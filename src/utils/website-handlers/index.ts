/**
 * Website Handlers Module
 * Main entry point for the website content handler system
 */

// Export types
export * from "./types";

// Export base handler
export { BaseWebsiteHandler } from "./base-handler";

// Export specific handlers
export { RanobesHandler } from "./ranobes-handler";
export { FanfictionHandler } from "./fanfiction-handler";
export { AO3Handler } from "./ao3-handler";
export { GenericHandler } from "./generic-handler";

// Export handler manager
export { HandlerManager, handlerManager } from "./handler-manager";

// Import for internal use
import { handlerManager } from "./handler-manager";

// Convenience function to get handler for current page
export async function getCurrentPageHandler() {
  return handlerManager.getHandlerForCurrentSite();
}

// Convenience function to check if current domain is supported
export function isCurrentDomainSupported(): boolean {
  const hostname = window.location.hostname;
  return handlerManager.isDomainSupported(hostname);
}

// Convenience function to extract content from current page
export async function extractCurrentPageContent() {
  const handler = await handlerManager.getHandlerForCurrentSite();
  if (!handler) {
    return {
      found: false,
      reason: "No suitable handler found for this website",
    };
  }

  return handler.extractContent();
}

// Convenience function to get navigation info for current page
export async function getCurrentPageNavigation() {
  const handler = await handlerManager.getHandlerForCurrentSite();
  if (!handler) {
    return {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 1,
    };
  }

  return handler.getChapterNavigation();
}

// Test current page compatibility
export async function testCurrentPageCompatibility() {
  return handlerManager.testCurrentPage();
}
