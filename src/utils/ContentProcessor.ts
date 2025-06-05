import { BaseWebsiteHandler } from "./website-handlers/BaseWebsiteHandler";
import { FanfictionHandler } from "./website-handlers/fanfiction-handler";
import { RanobesHandler } from "./website-handlers/RanobesHandler";
import { AIServiceManager } from "../services/ai/AIServiceManager";
import type { ProcessingResult, ContentType } from "../types";

export class ContentProcessor {
  private aiServiceManager: AIServiceManager;
  private currentHandler: BaseWebsiteHandler | null = null;

  constructor() {
    this.aiServiceManager = new AIServiceManager();
    this.detectWebsiteHandler();
  }
  /**
   * Detect which website handler to use based on current URL
   */
  private detectWebsiteHandler(): void {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes("fanfiction.net")) {
      this.currentHandler = new FanfictionHandler();
    } else if (
      hostname.includes("ranobes.net") ||
      hostname.includes("ranobes.com") ||
      hostname.includes("ranobes.top")
    ) {
      // Use RanobesHandler for ranobes.net and its variants
      this.currentHandler = new RanobesHandler();
    }
    // Add your new handlers here like this:
    // else if (hostname.includes("yoursite.com")) {
    //   this.currentHandler = new YourSiteHandler();
    // }
    else {
      this.currentHandler = new BaseWebsiteHandler();
    }
  }

  /**
   * Check if current page can be handled
   */
  canHandleCurrentPage(): boolean {
    return (
      this.currentHandler !== null &&
      this.currentHandler.findContentArea() !== null
    );
  }

  /**
   * Process the current page content
   */
  async processCurrentPage(options: any = {}): Promise<ProcessingResult> {
    try {
      if (!this.currentHandler) {
        return {
          success: false,
          error: "No suitable handler found for this website",
        };
      }

      const contentArea = this.currentHandler.findContentArea();
      if (!contentArea) {
        return {
          success: false,
          error: "No content area found on this page",
        };
      }

      const originalContent = this.currentHandler.extractContent(contentArea);
      if (!originalContent || originalContent.trim().length < 100) {
        return {
          success: false,
          error: "Content too short or empty",
        };
      }

      // Determine content type
      const contentType = this.detectContentType();

      // Enhance content using AI
      const enhancementOptions = {
        contentType,
        enhancementType: options.enhancementType || "improve",
        preserveFormatting: options.preserveFormatting !== false,
        ...options,
      };

      const aiResponse = await this.aiServiceManager.enhance(
        originalContent,
        enhancementOptions
      );

      if (aiResponse.error) {
        return {
          success: false,
          error: aiResponse.error,
        };
      }

      return {
        success: true,
        originalContent,
        enhancedContent: aiResponse.enhanced || "",
        metadata: {
          title: this.currentHandler.extractTitle(),
          contentType,
          timestamp: new Date().toISOString(),
          wordCount: originalContent.split(/\s+/).length,
          enhancementType: enhancementOptions.enhancementType,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Replace page content with new content
   */
  replacePageContent(newContent: string): void {
    if (!this.currentHandler) {
      console.error("No handler available to replace content");
      return;
    }

    const contentArea = this.currentHandler.findContentArea();
    if (!contentArea) {
      console.error("No content area found to replace");
      return;
    }

    // Store original content if not already stored
    if (!contentArea.dataset.originalContent) {
      contentArea.dataset.originalContent = contentArea.innerHTML;
    }

    // Replace content
    contentArea.innerHTML = this.formatContentForDisplay(newContent);

    // Apply any website-specific formatting
    this.currentHandler.formatAfterEnhancement(contentArea);
  }

  /**
   * Detect content type based on website and content
   */
  private detectContentType(): ContentType {
    const hostname = window.location.hostname.toLowerCase();

    if (
      hostname.includes("fanfiction") ||
      hostname.includes("archiveofourown") ||
      hostname.includes("wattpad") ||
      hostname.includes("royalroad")
    ) {
      return "novel";
    }

    if (hostname.includes("news") || hostname.includes("article")) {
      return "news";
    }

    return "generic";
  }

  /**
   * Format content for display while preserving important formatting
   */
  private formatContentForDisplay(content: string): string {
    // Convert line breaks to HTML
    return content
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>");
  }

  /**
   * Get current handler
   */
  getCurrentHandler(): BaseWebsiteHandler | null {
    return this.currentHandler;
  }
}
