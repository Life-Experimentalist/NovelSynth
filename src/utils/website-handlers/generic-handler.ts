/**
 * Generic Website Content Handler
 * Fallback handler for websites without specific implementations
 */

import { BaseWebsiteHandler } from "./base-handler";
import {
  WebsiteConfig,
  ContentExtractionResult,
  ContentType,
  ContentQuality,
  ContentValidation,
} from "./types";

export class GenericHandler extends BaseWebsiteHandler {
  protected initializeConfig(): WebsiteConfig {
    const hostname =
      typeof window !== "undefined" ? window.location.hostname : "unknown";

    return {
      siteName: this.generateSiteName(hostname),
      domains: [hostname],
      primaryContentType: this.detectContentType(),
      expectedQuality: ContentQuality.MEDIUM,
      selectors: {
        content: [
          "article",
          ".article",
          ".content",
          ".main-content",
          ".post-content",
          ".entry-content",
          ".story-content",
          ".chapter-content",
          "main",
          "#content",
          ".text",
          ".body",
        ],
        title: [
          "h1",
          ".title",
          ".heading",
          ".entry-title",
          ".post-title",
          ".article-title",
          "title",
        ],
        author: [
          ".author",
          ".by-author",
          ".byline",
          ".author-name",
          ".post-author",
          'a[rel="author"]',
        ],
        date: [
          "time",
          ".date",
          ".published",
          ".post-date",
          ".entry-date",
          "[datetime]",
        ],
      },
      defaultPrompt:
        "Please enhance this content for better readability while maintaining its original style and meaning.",
      features: {
        chapterNavigation: false,
        seriesTracking: false,
        authorProfiles: false,
      },
    };
  }

  protected initializeValidation(): ContentValidation {
    return {
      ...super.initializeValidation(),
      minLength: 200, // More lenient for generic content
      excludeUrlPatterns: [
        /\/search/,
        /\/login/,
        /\/register/,
        /\/signup/,
        /\/profile/,
        /\/account/,
        /\/settings/,
        /\/admin/,
        /\/api\//,
        /\.json$/,
        /\.xml$/,
        /\.rss$/,
      ],
    };
  }

  /**
   * Generate a readable site name from hostname
   */
  private generateSiteName(hostname: string): string {
    // Remove common prefixes and suffixes
    let siteName = hostname
      .replace(/^(www\.|m\.|mobile\.)/, "")
      .replace(/\.(com|net|org|edu|gov|io|co|uk|de|fr|jp|cn)$/, "");

    // Capitalize first letter and handle special cases
    siteName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

    // Handle special formatting
    siteName = siteName
      .replace(/github/i, "GitHub")
      .replace(/stackoverflow/i, "Stack Overflow")
      .replace(/wikipedia/i, "Wikipedia")
      .replace(/medium/i, "Medium")
      .replace(/reddit/i, "Reddit");

    return siteName;
  }

  /**
   * Attempt to detect content type from page characteristics
   */
  private detectContentType(): ContentType {
    if (typeof window === "undefined") return ContentType.UNKNOWN;

    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();

    // Check URL patterns
    if (
      url.includes("/story/") ||
      url.includes("/fanfic") ||
      url.includes("/fic/")
    ) {
      return ContentType.FANFICTION;
    }

    if (
      url.includes("/novel/") ||
      url.includes("/chapter/") ||
      url.includes("/book/")
    ) {
      return ContentType.NOVEL;
    }

    if (
      url.includes("/news/") ||
      url.includes("/article/") ||
      hostname.includes("news")
    ) {
      return ContentType.NEWS;
    }

    if (
      url.includes("/blog/") ||
      url.includes("/post/") ||
      hostname.includes("blog")
    ) {
      return ContentType.BLOG;
    }

    if (
      url.includes("/docs/") ||
      url.includes("/documentation/") ||
      hostname.includes("docs") ||
      hostname.includes("wiki")
    ) {
      return ContentType.DOCUMENTATION;
    }

    if (
      hostname.includes("reddit") ||
      hostname.includes("forum") ||
      url.includes("/thread/") ||
      url.includes("/discussion/")
    ) {
      return ContentType.FORUM;
    }

    if (
      hostname.includes("twitter") ||
      hostname.includes("facebook") ||
      hostname.includes("instagram") ||
      hostname.includes("social")
    ) {
      return ContentType.SOCIAL;
    }

    // Check page title patterns
    if (title.includes("chapter") || title.includes("volume")) {
      return ContentType.NOVEL;
    }

    if (title.includes("fanfic") || title.includes("fan fiction")) {
      return ContentType.FANFICTION;
    }

    // Check for academic patterns
    if (
      title.includes("journal") ||
      title.includes("research") ||
      title.includes("paper") ||
      hostname.includes("academic")
    ) {
      return ContentType.ACADEMIC;
    }

    // Default to article for most web content
    return ContentType.ARTICLE;
  }

  /**
   * Extract content using generic methods
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
          reason: "No content area found using generic selectors",
        };
      }

      const metadata = await this.extractMetadata();
      const cleanText = this.cleanTextContent(contentArea);
      const metrics = this.calculateMetrics(cleanText);

      metadata.wordCount = metrics.wordCount;
      metadata.readingTime = metrics.readingTime;

      return {
        found: true,
        text: cleanText,
        metadata,
        selector: this.getUsedSelector(contentArea),
        contentType: this.config.primaryContentType,
        quality: this.assessGenericQuality(cleanText),
        rawHtml: contentArea.innerHTML,
      };
    } catch (error) {
      console.error("Error extracting generic content:", error);
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
   * Get the selector that was used to find content
   */
  private getUsedSelector(contentArea: HTMLElement): string {
    for (const selector of this.config.selectors.content) {
      if (contentArea.matches && contentArea.matches(selector)) {
        return selector;
      }
    }
    return "generic-handler-fallback";
  }

  /**
   * Assess content quality using generic indicators
   */
  private assessGenericQuality(text: string): ContentQuality {
    const indicators = {
      high: [
        /[""]/g, // Smart quotes
        /[—–]/g, // Proper dashes
        /\b(?:however|therefore|furthermore|moreover|nonetheless)\b/gi, // Complex connectors
        /\b(?:analyze|synthesize|demonstrate|illustrate)\b/gi, // Academic language
      ],
      medium: [
        /[.!?]\s+[A-Z]/g, // Proper sentence structure
        /\b(?:and|but|or|because|although|while)\b/gi, // Basic connectors
        /[,;:]/g, // Punctuation variety
      ],
      poor: [
        /\b(u|ur|2|4|b4|c|r)\b/gi, // Text speak
        /(.)\1{4,}/g, // Excessive repetition
        /^[a-z]/gm, // Many lines starting lowercase
        /\s{3,}/g, // Excessive spacing
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

    if (poorRatio > 5) return ContentQuality.POOR;
    if (poorRatio > 2) return ContentQuality.LOW;
    if (highRatio > 3 && mediumRatio > 15) return ContentQuality.HIGH;
    if (mediumRatio > 10) return ContentQuality.MEDIUM;

    return ContentQuality.LOW;
  }

  /**
   * Get site-specific prompt with content type awareness
   */
  getSiteSpecificPrompt(): string {
    const basePrompt = super.getSiteSpecificPrompt();

    // If using default prompt, customize based on detected content type
    if (basePrompt === this.config.defaultPrompt) {
      const contentTypePrompts: Partial<Record<ContentType, string>> = {
        [ContentType.NEWS]:
          "This appears to be a news article. Please improve clarity and readability while maintaining journalistic objectivity and factual accuracy.",
        [ContentType.BLOG]:
          "This appears to be a blog post. Please enhance readability while preserving the author's personal voice and style.",
        [ContentType.DOCUMENTATION]:
          "This appears to be technical documentation. Please improve clarity while maintaining technical accuracy and structure.",
        [ContentType.ACADEMIC]:
          "This appears to be academic content. Please enhance readability while preserving scholarly tone and precision.",
        [ContentType.FORUM]:
          "This appears to be forum content. Please improve readability while maintaining the conversational tone.",
        [ContentType.SOCIAL]:
          "This appears to be social media content. Please enhance while maintaining the casual, personal tone.",
      };

      return contentTypePrompts[this.config.primaryContentType] || basePrompt;
    }

    return basePrompt;
  }
}
