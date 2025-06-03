import type { ContentAnalysis, SiteHandler } from "../types";

export class ContentDetector {
  private static readonly MIN_WORD_COUNT = 500;
  private static readonly WORDS_PER_MINUTE = 200;

  static analyzeContent(handlers: SiteHandler[]): ContentAnalysis {
    const url = window.location.href;
    const domain = window.location.hostname;

    // Find matching handler
    const handler = handlers.find(
      (h) => h.isEnabled && h.domains.some((d) => domain.includes(d))
    );

    let content = "";
    let title = "";
    let author = "";

    if (handler) {
      // Use specific handler selectors
      content = this.extractTextFromSelector(
        handler.selectors.content || "body"
      );
      title = this.extractTextFromSelector(handler.selectors.title || "title");
      author = this.extractTextFromSelector(handler.selectors.author || "");
    } else {
      // Fallback to generic content detection
      content = this.extractGenericContent();
      title = document.title;
    }

    const wordCount = this.countWords(content);
    const readingTime = Math.ceil(wordCount / this.WORDS_PER_MINUTE);
    const isLongForm = wordCount >= this.MIN_WORD_COUNT;

    const contentType = this.detectContentType(url, content, title);
    const confidence = this.calculateConfidence(
      handler,
      wordCount,
      contentType
    );

    return {
      isLongForm,
      contentType,
      wordCount,
      readingTime,
      title: title || undefined,
      author: author || undefined,
      confidence,
    };
  }

  private static extractTextFromSelector(selector: string): string {
    if (!selector) return "";

    const elements = document.querySelectorAll(selector);
    return Array.from(elements)
      .map((el) => el.textContent?.trim() || "")
      .join(" ")
      .replace(/\s+/g, " ");
  }

  private static extractGenericContent(): string {
    // Remove script, style, and other non-content elements
    const clone = document.cloneNode(true) as Document;
    const elementsToRemove = clone.querySelectorAll(
      "script, style, nav, header, footer, aside, .advertisement, .ads"
    );
    elementsToRemove.forEach((el) => el.remove());

    // Try to find main content areas
    const contentSelectors = [
      "main",
      "article",
      ".content",
      ".post-content",
      ".article-content",
      ".entry-content",
      "#content",
      ".chapter-content",
      ".story-content",
    ];

    for (const selector of contentSelectors) {
      const element = clone.querySelector(selector);
      if (element && element.textContent && element.textContent.length > 1000) {
        return element.textContent.trim().replace(/\s+/g, " ");
      }
    }

    // Fallback to body content
    return clone.body?.textContent?.trim().replace(/\s+/g, " ") || "";
  }

  private static countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  private static detectContentType(
    url: string,
    content: string,
    title: string
  ): ContentAnalysis["contentType"] {
    const lowerUrl = url.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Web novel detection
    if (
      lowerUrl.includes("novel") ||
      lowerUrl.includes("chapter") ||
      lowerUrl.includes("fanfiction") ||
      lowerUrl.includes("webnovel") ||
      lowerTitle.includes("chapter") ||
      /chapter\s+\d+/i.test(title)
    ) {
      return "novel";
    }

    // News detection
    if (
      lowerUrl.includes("news") ||
      lowerUrl.includes("article") ||
      /\d{4}\/\d{2}\/\d{2}/.test(url) ||
      lowerContent.includes("breaking news") ||
      lowerContent.includes("reuters") ||
      lowerContent.includes("associated press")
    ) {
      return "news";
    }

    // Documentation detection
    if (
      lowerUrl.includes("docs") ||
      lowerUrl.includes("documentation") ||
      lowerUrl.includes("api") ||
      lowerUrl.includes("guide") ||
      lowerTitle.includes("documentation")
    ) {
      return "technical";
    }

    // Blog detection
    if (
      lowerUrl.includes("blog") ||
      lowerUrl.includes("post") ||
      lowerContent.includes("posted by") ||
      lowerContent.includes("written by")
    ) {
      return "article";
    }

    // Article detection (technical articles, tutorials, etc.)
    if (
      lowerUrl.includes("tutorial") ||
      lowerUrl.includes("howto") ||
      lowerUrl.includes("guide") ||
      lowerTitle.includes("how to") ||
      lowerTitle.includes("tutorial")
    ) {
      return "article";
    }

    return "generic";
  }

  private static calculateConfidence(
    handler: SiteHandler | undefined,
    wordCount: number,
    contentType: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Handler match increases confidence
    if (handler) {
      confidence += 0.3;
    }

    // Word count affects confidence
    if (wordCount > 2000) {
      confidence += 0.2;
    } else if (wordCount > 1000) {
      confidence += 0.1;
    } // Content type detection affects confidence
    if (contentType !== "generic") {
      confidence += 0.2;
    }

    return Math.min(confidence, 1.0);
  }
}
