import type { ContentHandler, ContentMode, ExtractedContent } from "@/types";
import { NovelContentHandler } from "./novel";
import { ArticleContentHandler } from "./article";

class ContentHandlerRegistry {
  private handlers: ContentHandler[] = [];

  constructor() {
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers() {
    this.register(new NovelContentHandler());
    this.register(new ArticleContentHandler());
  }

  register(handler: ContentHandler) {
    this.handlers.push(handler);
  }

  getHandler(url: string): ContentHandler | null {
    return this.handlers.find((handler) => handler.canHandle(url)) || null;
  }

  extractContent(): ExtractedContent | null {
    const handler = this.getHandler(window.location.href);
    if (!handler) {
      return this.getDefaultContent();
    }

    try {
      return handler.extractContent();
    } catch (error) {
      console.error("Content extraction failed:", error);
      return this.getDefaultContent();
    }
  }

  private getDefaultContent(): ExtractedContent {
    // Fallback content extraction using generic selectors
    const title = document.title;
    const content = this.extractGenericContent();

    return {
      title,
      content,
      contentType: "general",
      metadata: {
        url: window.location.href,
        domain: window.location.hostname,
      },
    };
  }

  private extractGenericContent(): string {
    // Try common content selectors
    const selectors = [
      "article",
      "main",
      '[role="main"]',
      ".content",
      ".post-content",
      ".entry-content",
      "#content",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        return element.textContent.trim();
      }
    }

    // Fallback to body text
    return document.body.textContent?.slice(0, 5000) || "";
  }
}

export const contentHandlerRegistry = new ContentHandlerRegistry();
