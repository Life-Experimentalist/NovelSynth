/**
 * Archive of Our Own (AO3) Website Content Handler
 * Specialized handler for extracting content from archiveofourown.org
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

export class AO3Handler extends BaseWebsiteHandler {
  protected initializeConfig(): WebsiteConfig {
    return {
      siteName: "Archive of Our Own",
      domains: ["archiveofourown.org", "ao3.org"],
      primaryContentType: ContentType.FANFICTION,
      expectedQuality: ContentQuality.HIGH,
      selectors: {
        content: [
          "#workskin",
          ".userstuff",
          '[role="article"]',
          ".work-text",
          ".chapter",
        ],
        title: [
          "h2.title",
          ".work .heading a",
          ".preface .title",
          "h1.heading",
        ],
        author: [
          '.byline a[rel="author"]',
          ".byline .login",
          ".work .heading .authors a",
        ],
        date: [".published", ".status .datetime", "dd.published"],
        navigation: {
          previous: [
            'a[rel="prev"]',
            ".previous a",
            'a:contains("Previous Chapter")',
          ],
          next: ['a[rel="next"]', ".next a", 'a:contains("Next Chapter")'],
          chapterList: ["#selected_id", ".chapter select"],
        },
        exclude: [
          ".header",
          ".navigation",
          ".kudos",
          ".comments",
          ".footer",
          "#footer",
          ".meta",
          ".stats",
          "script",
          "style",
        ],
      },
      defaultPrompt:
        "This is a fanfiction from Archive of Our Own. Please maintain the author's style, preserve formatting like italics and emphasis, and respect any special narrative techniques or experimental writing styles.",
      styles: {
        lineHeight: "1.6",
        marginBottom: "1em",
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
      minLength: 100, // AO3 can have short chapters/drabbles
      contentUrlPatterns: [/\/works\/\d+/, /\/chapters\/\d+/],
      excludeUrlPatterns: [
        /\/users\//,
        /\/collections\//,
        /\/tags\//,
        /\/search/,
        /\/login/,
        /\/signup/,
        /\/series\//,
        /\/bookmarks/,
      ],
    };
  }

  /**
   * Enhanced validation for AO3 works
   */
  async validateContent(): Promise<boolean> {
    const baseValidation = await super.validateContent();
    if (!baseValidation) return false;

    // Check if we're on a work page
    const url = window.location.href;
    if (!/\/works\/\d+/.test(url)) {
      return false;
    }

    // Check for work content
    const workContent = document.querySelector("#workskin, .userstuff");
    return workContent !== null;
  }

  /**
   * Extract content from AO3 page
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
          reason: "No work content found",
        };
      }

      const metadata = await this.extractMetadata();

      // Extract and clean text while preserving AO3 formatting
      const cleanText = this.cleanAO3Content(contentArea);
      const metrics = this.calculateMetrics(cleanText);

      metadata.wordCount = metrics.wordCount;
      metadata.readingTime = metrics.readingTime;

      // Extract AO3-specific metadata
      await this.extractAO3Metadata(metadata);

      return {
        found: true,
        text: cleanText,
        metadata,
        selector: this.getUsedSelector(contentArea),
        contentType: this.config.primaryContentType,
        quality: this.assessAO3Quality(cleanText),
        rawHtml: contentArea.innerHTML,
      };
    } catch (error) {
      console.error("Error extracting AO3 content:", error);
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
   * Clean AO3 content while preserving formatting
   */
  private cleanAO3Content(contentArea: HTMLElement): string {
    // AO3 content is usually well-formatted, preserve more structure
    const clone = contentArea.cloneNode(true) as HTMLElement;

    // Remove unwanted elements but preserve formatting elements
    const unwantedSelectors = [
      "script",
      "style",
      ".landmark",
      ".navigation",
      ".kudos",
      ".comments",
    ];

    unwantedSelectors.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Convert HTML formatting to text equivalents
    clone.querySelectorAll("em, i").forEach((el) => {
      el.textContent = `*${el.textContent}*`;
    });

    clone.querySelectorAll("strong, b").forEach((el) => {
      el.textContent = `**${el.textContent}**`;
    });

    clone.querySelectorAll("u").forEach((el) => {
      el.textContent = `_${el.textContent}_`;
    });

    // Handle horizontal rules and section breaks
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
   * Extract AO3-specific metadata
   */
  private async extractAO3Metadata(metadata: any): Promise<void> {
    try {
      // Extract tags and categories
      const tags = Array.from(document.querySelectorAll(".tags .tag"))
        .map((tag) => tag.textContent?.trim())
        .filter((tag) => tag);

      if (tags.length > 0) {
        metadata.genres = tags;
      }

      // Extract rating
      const ratingElement = document.querySelector(".rating .tag");
      if (ratingElement?.textContent) {
        metadata.rating = ratingElement.textContent.trim();
      }

      // Extract word count from stats
      const wordCountElement = document.querySelector("dd.words");
      if (wordCountElement?.textContent) {
        const wordCount = parseInt(
          wordCountElement.textContent.replace(/,/g, ""),
          10
        );
        if (!isNaN(wordCount)) {
          metadata.wordCount = wordCount;
        }
      }

      // Extract series information
      const seriesElement = document.querySelector(".series");
      if (seriesElement?.textContent) {
        metadata.series = seriesElement.textContent.trim();
      }

      // Extract summary
      const summaryElement = document.querySelector(".summary .userstuff");
      if (summaryElement?.textContent) {
        metadata.description = summaryElement.textContent.trim();
      }
    } catch (error) {
      console.error("Error extracting AO3 metadata:", error);
    }
  }

  /**
   * Get the selector that was used to find content
   */
  private getUsedSelector(contentArea: HTMLElement): string {
    if (contentArea.id === "workskin") return "#workskin";
    if (contentArea.classList.contains("userstuff")) return ".userstuff";

    for (const selector of this.config.selectors.content) {
      if (contentArea.matches && contentArea.matches(selector)) {
        return selector;
      }
    }
    return "ao3-handler-fallback";
  }

  /**
   * Assess content quality for AO3
   */
  private assessAO3Quality(text: string): ContentQuality {
    // AO3 generally has higher quality content
    const indicators = {
      high: [
        /[""]/g, // Smart quotes
        /[—–]/g, // Proper dashes
        /\*[^*]+\*/g, // Italic formatting
        /\*\*[^*]+\*\*/g, // Bold formatting
        /\b(?:said|whispered|murmured|replied|asked)\b/gi, // Dialogue tags
      ],
      medium: [
        /[.!?]\s+[A-Z]/g, // Proper sentences
        /"[^"]*"/g, // Dialogue
        /\b(?:and|but|however|although)\b/gi, // Connectors
      ],
      poor: [
        /\b(u|ur|2|4)\b/gi, // Text speak (rare on AO3)
        /(.)\1{4,}/g, // Excessive repetition
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

    if (poorRatio > 2) return ContentQuality.POOR;
    if (highRatio > 3 || (highRatio > 1 && mediumRatio > 10))
      return ContentQuality.HIGH;
    if (mediumRatio > 8) return ContentQuality.MEDIUM;

    return ContentQuality.HIGH; // Default assumption for AO3
  }

  /**
   * Get chapter navigation for AO3
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
        'a[rel="prev"]'
      ) as HTMLAnchorElement;
      const nextLink = document.querySelector(
        'a[rel="next"]'
      ) as HTMLAnchorElement;

      if (prevLink) {
        navigation.hasPrevious = true;
        navigation.previousUrl = prevLink.href;
      }

      if (nextLink) {
        navigation.hasNext = true;
        navigation.nextUrl = nextLink.href;
      }

      // Get chapter info from URL or page
      const chapterMatch = window.location.href.match(/\/chapters\/(\d+)/);
      if (chapterMatch) {
        navigation.currentChapter = parseInt(chapterMatch[1], 10);
      }

      // Try to get total chapters from work stats
      const chaptersElement = document.querySelector("dd.chapters");
      if (chaptersElement?.textContent) {
        const chaptersText = chaptersElement.textContent.trim();
        const totalMatch = chaptersText.match(/(\d+)$/);
        if (totalMatch) {
          navigation.totalChapters = parseInt(totalMatch[1], 10);
        }
      }

      // Check for chapter selector
      const chapterSelect = document.querySelector(
        "#selected_id"
      ) as HTMLSelectElement;
      if (chapterSelect) {
        navigation.chapterSelector = chapterSelect;
        navigation.totalChapters = chapterSelect.options.length;
        navigation.currentChapter = chapterSelect.selectedIndex + 1;
      }
    } catch (error) {
      console.error("Error getting AO3 chapter navigation:", error);
    }

    return navigation;
  }

  /**
   * Get optimal UI insertion point for AO3
   */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
    // Look for the work content area
    const workskin = document.querySelector("#workskin") as HTMLElement;
    if (workskin) {
      return {
        element: workskin,
        position: "before",
        containerClass: "novelsynth-ao3-ui",
      };
    }

    // Fallback to default behavior
    return super.getUIInsertionPoint(contentArea);
  }

  /**
   * Apply AO3-specific formatting after enhancement
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    super.formatAfterEnhancement(contentArea);

    if (!contentArea) return;

    // Preserve AO3's formatting style
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const pElement = p as HTMLElement;
      pElement.style.marginBottom = "1em";
      pElement.style.lineHeight = "1.6";
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

    // Handle blockquotes
    contentArea.querySelectorAll("blockquote").forEach((el) => {
      const element = el as HTMLElement;
      element.style.margin = "1em 0";
      element.style.paddingLeft = "1em";
      element.style.borderLeft = "3px solid #ccc";
      element.style.fontStyle = "italic";
    });
  }
}
