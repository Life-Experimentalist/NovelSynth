/**
 * Royal Road Website Content Handler
 * Specialized handler for extracting content from royalroad.com
 */

import { BaseWebsiteHandler } from "./base-handler";
import {
  WebsiteConfig,
  ContentExtractionResult,
  ChapterNavigation,
  UIInsertionPoint,
  ContentType,
  ContentQuality,
  ContentValidation,
} from "./types";

export class RoyalRoadHandler extends BaseWebsiteHandler {
  protected initializeConfig(): WebsiteConfig {
    return {
      siteName: "Royal Road",
      domains: ["royalroad.com", "www.royalroad.com"],
      primaryContentType: ContentType.NOVEL,
      expectedQuality: ContentQuality.MEDIUM,
      selectors: {
        content: [
          ".chapter-content",
          ".chapter-inner",
          ".fiction-body",
          ".chapter p",
          ".portlet-body",
        ],
        title: ["h1", ".chapter-title", ".fiction-title h1", ".fic-title"],
        author: [
          ".author",
          ".author-link",
          'a[href*="/profile/"]',
          ".username",
        ],
        date: [".chapter-date", "time", ".date"],
        navigation: {
          previous: [
            ".prev-chap",
            'a[title*="Previous"]',
            ".chapter-nav .prev",
          ],
          next: [".next-chap", 'a[title*="Next"]', ".chapter-nav .next"],
          chapterList: [".chapter-list", ".toc-list", 'select[name="chapter"]'],
        },
        exclude: [
          ".advertisement",
          ".ads",
          ".social-share",
          ".comments",
          ".author-note",
          "nav",
          "footer",
          ".sidebar",
        ],
      },
      defaultPrompt:
        "This is a web novel from Royal Road. Please enhance the text while maintaining the author's unique voice and style. Preserve any special formatting, dialogue, and narrative flow. Royal Road novels often feature LitRPG, fantasy, or progression elements.",
      styles: {
        lineHeight: "1.8",
        marginBottom: "1.2em",
      },
      features: {
        chapterNavigation: true,
        seriesTracking: true,
        authorProfiles: true,
      },
    };
  }

  protected initializeValidation(): ContentValidation {
    return {
      ...super.initializeValidation(),
      minLength: 300, // Royal Road chapters can vary in length
      contentUrlPatterns: [
        /\/fiction\/\d+\/[^\/]+\/chapter\/\d+/,
        /royalroad\.com\/fiction/,
      ],
      excludeUrlPatterns: [
        /\/profile\//,
        /\/search/,
        /\/browse/,
        /\/my-fictions/,
        /\/login/,
        /\/register/,
        /\/forums/,
      ],
    };
  }

  /**
   * Enhanced validation for Royal Road chapters
   */
  async validateContent(): Promise<boolean> {
    const baseValidation = await super.validateContent();
    if (!baseValidation) return false;

    // Check if we're on a chapter page
    const url = window.location.href;
    if (!/\/fiction\/\d+\/[^\/]+\/chapter\/\d+/.test(url)) {
      return false;
    }

    // Check for chapter content
    const chapterContent = document.querySelector(
      ".chapter-content, .chapter-inner"
    );
    return chapterContent !== null;
  }

  /**
   * Extract content from Royal Road page
   */
  async extractContent(): Promise<ContentExtractionResult> {
    try {
      const contentArea = await this.findContentArea();
      if (!contentArea) {
        return {
          found: false,
          text: "",
          metadata: { title: document.title },
          selector: "",
          contentType: this.config.primaryContentType,
          quality: this.config.expectedQuality,
          reason: "No chapter content found",
        };
      }

      const metadata = await this.extractMetadata();

      // Extract and clean text while preserving Royal Road formatting
      const cleanText = this.cleanRoyalRoadContent(contentArea);
      const metrics = this.calculateMetrics(cleanText);

      metadata.wordCount = metrics.wordCount;
      metadata.readingTime = metrics.readingTime;

      // Extract Royal Road-specific metadata
      await this.extractRoyalRoadMetadata(metadata);

      return {
        found: true,
        text: cleanText,
        metadata,
        selector: this.getUsedSelector(contentArea),
        contentType: this.config.primaryContentType,
        quality: this.assessRoyalRoadQuality(cleanText),
        rawHtml: contentArea.innerHTML,
      };
    } catch (error) {
      console.error("Error extracting Royal Road content:", error);
      return {
        found: false,
        text: "",
        metadata: { title: document.title },
        selector: "",
        contentType: this.config.primaryContentType,
        quality: this.config.expectedQuality,
        reason: `Extraction error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  /**
   * Clean Royal Road content while preserving formatting
   */
  private cleanRoyalRoadContent(contentArea: HTMLElement): string {
    const clone = contentArea.cloneNode(true) as HTMLElement;

    // Remove unwanted elements
    const unwantedSelectors = [
      "script",
      "style",
      ".advertisement",
      ".ads",
      ".author-note",
      ".comments",
    ];

    unwantedSelectors.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Preserve italics and bold formatting
    clone.querySelectorAll("em, i").forEach((el) => {
      el.textContent = `*${el.textContent}*`;
    });

    clone.querySelectorAll("strong, b").forEach((el) => {
      el.textContent = `**${el.textContent}**`;
    });

    // Handle Royal Road's line breaks and paragraphs
    clone.querySelectorAll("br").forEach((el) => {
      el.textContent = "\n";
    });

    clone.querySelectorAll("hr").forEach((el) => {
      el.textContent = "\n---\n";
    });

    // Get clean text
    return clone.innerText
      .trim()
      .replace(/\n\s+/g, "\n")
      .replace(/\s{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n");
  }

  /**
   * Extract Royal Road-specific metadata
   */
  private async extractRoyalRoadMetadata(metadata: any): Promise<void> {
    try {
      // Extract fiction title and chapter title
      const fictionTitle = document
        .querySelector(".fiction-title h1")
        ?.textContent?.trim();
      const chapterTitle = document.querySelector("h1")?.textContent?.trim();

      if (fictionTitle && chapterTitle) {
        metadata.series = fictionTitle;
        metadata.title = chapterTitle;
      }

      // Extract tags and genres
      const tags = Array.from(document.querySelectorAll(".tags .tag, .genre"))
        .map((tag) => tag.textContent?.trim())
        .filter((tag) => tag);

      if (tags.length > 0) {
        metadata.genres = tags;
      }

      // Extract chapter number
      const chapterMatch = window.location.href.match(/\/chapter\/(\d+)/);
      if (chapterMatch) {
        metadata.chapterNumber = parseInt(chapterMatch[1], 10);
      }

      // Extract fiction status
      const statusElement = document.querySelector(".fiction-status");
      if (statusElement?.textContent) {
        metadata.status = statusElement.textContent.trim();
      }
    } catch (error) {
      console.error("Error extracting Royal Road metadata:", error);
    }
  }

  /**
   * Get the selector that was used to find content
   */
  private getUsedSelector(contentArea: HTMLElement): string {
    if (contentArea.classList.contains("chapter-content"))
      return ".chapter-content";
    if (contentArea.classList.contains("chapter-inner"))
      return ".chapter-inner";

    for (const selector of this.config.selectors.content) {
      if (contentArea.matches && contentArea.matches(selector)) {
        return selector;
      }
    }
    return "royalroad-handler-fallback";
  }

  /**
   * Assess content quality for Royal Road
   */
  private assessRoyalRoadQuality(text: string): ContentQuality {
    // Royal Road generally has decent quality content
    const indicators = {
      high: [
        /[""]/g, // Smart quotes
        /[—–]/g, // Proper dashes
        /\b(?:said|whispered|murmured|replied|asked)\b/gi, // Dialogue tags
        /\b(?:however|therefore|furthermore|moreover)\b/gi, // Complex connectors
      ],
      medium: [
        /[.!?]\s+[A-Z]/g, // Proper sentences
        /"[^"]*"/g, // Dialogue
        /\b(?:and|but|or|because|although)\b/gi, // Basic connectors
        /[,;:]/g, // Punctuation variety
      ],
      poor: [
        /\b(u|ur|2|4|b4|c|r)\b/gi, // Text speak
        /(.)\1{4,}/g, // Excessive repetition
        /\?\?\?|!!!/g, // Excessive punctuation
      ],
    };

    let highScore = 0;
    let mediumScore = 0;
    let poorScore = 0;

    indicators.high.forEach((regex) => {
      const matches = text.match(regex);
      if (matches) highScore += matches.length;
    });

    indicators.medium.forEach((regex) => {
      const matches = text.match(regex);
      if (matches) mediumScore += matches.length;
    });

    indicators.poor.forEach((regex) => {
      const matches = text.match(regex);
      if (matches) poorScore += matches.length;
    });

    const totalLength = text.length;
    const highRatio = (highScore / totalLength) * 1000;
    const mediumRatio = (mediumScore / totalLength) * 1000;
    const poorRatio = (poorScore / totalLength) * 1000;

    if (poorRatio > 3) return ContentQuality.POOR;
    if (highRatio > 2 || (highRatio > 1 && mediumRatio > 8))
      return ContentQuality.HIGH;
    if (mediumRatio > 6) return ContentQuality.MEDIUM;

    return ContentQuality.MEDIUM; // Default assumption for Royal Road
  }

  /**
   * Get chapter navigation for Royal Road
   */
  async getChapterNavigation(): Promise<ChapterNavigation> {
    const navigation: ChapterNavigation = {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 1,
    };

    try {
      // Check for chapter navigation links
      const prevLink = document.querySelector(
        '.prev-chap, a[title*="Previous"]'
      ) as HTMLAnchorElement;
      const nextLink = document.querySelector(
        '.next-chap, a[title*="Next"]'
      ) as HTMLAnchorElement;

      if (prevLink) {
        navigation.hasPrevious = true;
        navigation.previousUrl = prevLink.href;
      }

      if (nextLink) {
        navigation.hasNext = true;
        navigation.nextUrl = nextLink.href;
      }

      // Get chapter info from URL
      const chapterMatch = window.location.href.match(/\/chapter\/(\d+)/);
      if (chapterMatch) {
        navigation.currentChapter = parseInt(chapterMatch[1], 10);
      }

      // Try to get total chapters from chapter list
      const chapterList = document.querySelectorAll(
        ".toc-list li, .chapter-list li"
      );
      if (chapterList.length > 0) {
        navigation.totalChapters = chapterList.length;
      }
    } catch (error) {
      console.error("Error getting Royal Road chapter navigation:", error);
    }

    return navigation;
  }

  /**
   * Get optimal UI insertion point for Royal Road
   */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
    // Look for the chapter content area
    const chapterContent = document.querySelector(
      ".chapter-content"
    ) as HTMLElement;
    if (chapterContent) {
      return {
        element: chapterContent,
        position: "before",
        containerClass: "novelsynth-royalroad-ui",
      };
    }

    // Fallback to default behavior
    return super.getUIInsertionPoint(contentArea);
  }

  /**
   * Apply Royal Road-specific formatting after enhancement
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    super.formatAfterEnhancement(contentArea);

    if (!contentArea) return;

    // Apply Royal Road specific styling
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const pElement = p as HTMLElement;
      pElement.style.marginBottom = "1.2em";
      pElement.style.lineHeight = "1.8";
    });

    // Handle emphasis elements
    contentArea.querySelectorAll("em, i").forEach((el) => {
      const element = el as HTMLElement;
      element.style.fontStyle = "italic";
    });

    contentArea.querySelectorAll("strong, b").forEach((el) => {
      const element = el as HTMLElement;
      element.style.fontWeight = "bold";
    });

    // Style horizontal rules (scene breaks)
    const hrs = contentArea.querySelectorAll("hr");
    hrs.forEach((hr) => {
      const hrElement = hr as HTMLElement;
      hrElement.style.margin = "2em auto";
      hrElement.style.width = "50%";
      hrElement.style.border = "none";
      hrElement.style.borderTop = "1px solid #ddd";
    });
  }
}
