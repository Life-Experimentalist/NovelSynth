/**
 * Ranobes.net Website Content Handler
 * Specialized handler for extracting content from ranobes.net
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

export class RanobesHandler extends BaseWebsiteHandler {
  protected initializeConfig(): WebsiteConfig {
    return {
      siteName: "Ranobes.net",
      domains: ["ranobes.net", "ranobes.com", "ranobes.top"],
      primaryContentType: ContentType.NOVEL,
      expectedQuality: ContentQuality.LOW, // Often machine-translated
      selectors: {
        content: [
          ".text-chapter",
          "#arrticle", // Note: This appears to be a typo in the original site
          ".story",
          ".chapter-content",
          ".content",
        ],
        title: ["h1.title", ".story-title", ".chapter-title", "h1", ".title"],
        author: [".author", ".story-author", 'a[href*="/author/"]'],
        date: [".date", ".published", ".chapter-date"],
        navigation: {
          previous: [".prev-chap", 'a[rel="prev"]', ".previous"],
          next: [".next-chap", 'a[rel="next"]', ".next"],
          chapterList: [".chapter-list", ".chapters", 'select[name="chapter"]'],
        },
        exclude: [
          ".advertisement",
          ".ads",
          ".social-share",
          ".comments",
          "nav",
          "footer",
        ],
      },
      defaultPrompt:
        "This is a machine-translated web novel from a Russian novel site. Please improve the translation while maintaining the original meaning and flow. Keep any special formatting like section breaks. Russian and Chinese names should be properly transliterated.",
      styles: {
        lineHeight: "1.7",
        color: "#bab9a0", // Ranobes site color scheme
        marginBottom: "1em",
      },
      features: {
        chapterNavigation: true,
        seriesTracking: true,
        authorProfiles: false,
      },
    };
  }

  protected initializeValidation(): ContentValidation {
    return {
      ...super.initializeValidation(),
      minLength: 1000, // Chapters should be substantial
      contentUrlPatterns: [/\/chapter-\d+/, /\/read-/, /\/novel\/.+\/chapter/],
      excludeUrlPatterns: [
        /\/novels?$/,
        /\/search/,
        /\/profile/,
        /\/login/,
        /\/register/,
        /\/bookmark/,
      ],
    };
  }

  /**
   * Enhanced validation for chapter pages
   */
  async validateContent(): Promise<boolean> {
    const baseValidation = await super.validateContent();
    if (!baseValidation) return false;

    // Additional Ranobes-specific validation
    return this.isChapterPage();
  }

  /**
   * Check if current page is a chapter page (not a listing/index page)
   */
  private isChapterPage(): boolean {
    const url = window.location.pathname;

    // Check URL patterns
    if (url.includes("/chapter-") || url.includes("/read-")) {
      return true;
    }

    // Check for chapter content indicators
    const contentSelectors = this.config.selectors.content;
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (
        element &&
        element.textContent &&
        element.textContent.trim().length > 1000
      ) {
        return true;
      }
    }

    // Check for chapter title patterns
    const titleSelectors = this.config.selectors.title;
    for (const selector of titleSelectors) {
      const titleElement = document.querySelector(selector);
      if (titleElement?.textContent) {
        const titleText = titleElement.textContent.toLowerCase();
        if (titleText.includes("chapter") || titleText.includes("volume")) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Extract content from Ranobes page
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
          reason: "No content area found",
        };
      }

      const metadata = await this.extractMetadata();

      // Clean and extract text
      const cleanText = this.cleanRanobesContent(contentArea, metadata.title);
      const metrics = this.calculateMetrics(cleanText);

      metadata.wordCount = metrics.wordCount;
      metadata.readingTime = metrics.readingTime;

      return {
        found: true,
        text: cleanText,
        metadata,
        selector: this.getUsedSelector(contentArea),
        contentType: this.config.primaryContentType,
        quality: this.assessContentQuality(cleanText),
        rawHtml: contentArea.innerHTML,
      };
    } catch (error) {
      console.error("Error extracting Ranobes content:", error);
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
   * Clean Ranobes-specific content
   */
  private cleanRanobesContent(contentArea: HTMLElement, title: string): string {
    // Create a deep clone to avoid modifying the actual DOM
    const contentClone = contentArea.cloneNode(true) as HTMLElement;

    // Remove title elements from the content if they exist
    const titlesToRemove = contentClone.querySelectorAll(
      "h1, h2, h3.title, .story-title, .chapter-title"
    );
    titlesToRemove.forEach((titleEl) => titleEl.remove());

    // Get clean text content
    let chapterText = this.cleanTextContent(contentClone);

    // Additional cleaning for Ranobes - check first few lines for repeated titles
    const titleParts = title.split(/[:\-–—]/);
    const lines = chapterText.split("\n");
    const headLines = lines.slice(0, 5); // Only look at first 5 lines

    const filteredHeadLines = headLines.filter((line) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === "") return true;

      // Check if line is just the title or part of the title
      for (const titlePart of titleParts) {
        const cleanTitlePart = titlePart.trim();
        if (
          cleanTitlePart.length > 3 && // Avoid filtering short matches
          (trimmedLine === cleanTitlePart ||
            trimmedLine.startsWith(`${cleanTitlePart}:`) ||
            trimmedLine.startsWith(`${cleanTitlePart} -`))
        ) {
          return false; // Filter out this line
        }
      }

      // Check for common book name patterns at the start of content
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmedLine)) {
        return false; // Likely a book title
      }

      return true; // Keep this line
    });

    // Recombine the filtered head lines with the rest of the content
    chapterText = [...filteredHeadLines, ...lines.slice(5)].join("\n");

    return chapterText;
  }

  /**
   * Get the selector that was used to find content
   */
  private getUsedSelector(contentArea: HTMLElement): string {
    for (const selector of this.config.selectors.content) {
      if (contentArea.matches(selector)) {
        return selector;
      }
    }
    return "ranobes-handler-fallback";
  }

  /**
   * Assess content quality for Ranobes
   */
  private assessContentQuality(text: string): ContentQuality {
    // Ranobes often has machine translations with specific patterns
    const indicators = {
      poor: [
        /\b(he|she|it)\s+(he|she|it)\b/gi, // Repeated pronouns
        /\b(\w+)\s+\1\b/gi, // Repeated words (fixed: added capturing group)
        /[""]/g, // Smart quotes often indicate better quality
      ],
      medium: [
        /[.!?]\s*[A-Z]/g, // Proper sentence structure
        /\b(the|and|or|but|in|on|at|to)\b/gi, // Common function words
      ],
    };

    let poorScore = 0;
    let mediumScore = 0;

    indicators.poor.forEach((regex) => {
      const matches = text.match(regex);
      if (matches) poorScore += matches.length;
    });

    indicators.medium.forEach((regex) => {
      const matches = text.match(regex);
      if (matches) mediumScore += matches.length;
    });

    const totalLength = text.length;
    const poorRatio = (poorScore / totalLength) * 1000;
    const mediumRatio = (mediumScore / totalLength) * 1000;

    if (poorRatio > 5) return ContentQuality.POOR;
    if (poorRatio > 2) return ContentQuality.LOW;
    if (mediumRatio > 20) return ContentQuality.MEDIUM;

    return ContentQuality.LOW; // Default for Ranobes
  }

  /**
   * Get chapter navigation for Ranobes
   */
  async getChapterNavigation(): Promise<ChapterNavigation> {
    const navigation: ChapterNavigation = {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 0,
    };

    try {
      // Try to find current chapter number from breadcrumbs
      const breadcrumbs = document.querySelector(".options-left");
      if (breadcrumbs) {
        const chapterText = breadcrumbs.textContent || "";
        const chapterMatch = chapterText.match(/Chapter (\d+)/i);
        if (chapterMatch) {
          navigation.currentChapter = parseInt(chapterMatch[1], 10);
        }
      }

      // Find navigation links
      const prevSelectors = this.config.selectors.navigation?.previous || [];
      const nextSelectors = this.config.selectors.navigation?.next || [];

      for (const selector of prevSelectors) {
        const prevLink = document.querySelector(selector) as HTMLAnchorElement;
        if (prevLink) {
          navigation.hasPrevious = true;
          navigation.previousUrl = prevLink.href;
          break;
        }
      }

      for (const selector of nextSelectors) {
        const nextLink = document.querySelector(selector) as HTMLAnchorElement;
        if (nextLink) {
          navigation.hasNext = true;
          navigation.nextUrl = nextLink.href;
          break;
        }
      }

      // Try to find chapter selector for total chapters
      const chapterSelector = document.querySelector(
        'select[name="chapter"]'
      ) as HTMLSelectElement;
      if (chapterSelector) {
        navigation.totalChapters = chapterSelector.options.length;
        navigation.chapterSelector = chapterSelector;
      }
    } catch (error) {
      console.error("Error getting Ranobes chapter navigation:", error);
    }

    return navigation;
  }

  /**
   * Get optimal UI insertion point for Ranobes
   */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
    // Look for the text-chapter container for better positioning
    const textChapter = document.querySelector(".text-chapter") as HTMLElement;
    if (textChapter) {
      return {
        element: textChapter,
        position: "before",
        containerClass: "novelsynth-ranobes-ui",
      };
    }

    // Fallback to default behavior
    return super.getUIInsertionPoint(contentArea);
  }

  /**
   * Apply Ranobes-specific formatting after enhancement
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    super.formatAfterEnhancement(contentArea);

    if (!contentArea) return;

    // Apply Ranobes-specific styling to match site theme
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const pElement = p as HTMLElement;
      pElement.style.marginBottom = "1em";
      pElement.style.lineHeight = "1.7";
      pElement.style.color = "#bab9a0"; // Ranobes theme color
    });

    // Handle any special formatting like section breaks
    const sectionBreaks = contentArea.querySelectorAll("hr, .section-break");
    sectionBreaks.forEach((br) => {
      const brElement = br as HTMLElement;
      brElement.style.margin = "2em 0";
      brElement.style.border = "none";
      brElement.style.borderTop = "1px solid #555";
    });
  }
}
