/**
 * Base Website Content Handler
 * Abstract class that all website-specific handlers should extend
 */

import {
  IWebsiteHandler,
  WebsiteConfig,
  ContentExtractionResult,
  ChapterNavigation,
  UIInsertionPoint,
  ContentType,
  ContentQuality,
  ContentMetadata,
  ContentValidation,
} from "./types";

export abstract class BaseWebsiteHandler implements IWebsiteHandler {
  protected config: WebsiteConfig;
  protected validation: ContentValidation;

  constructor() {
    this.config = this.initializeConfig();
    this.validation = this.initializeValidation();
  }

  /**
   * Initialize handler configuration - must be implemented by subclasses
   */
  protected abstract initializeConfig(): WebsiteConfig;

  /**
   * Initialize content validation rules
   */
  protected initializeValidation(): ContentValidation {
    return {
      minLength: 500,
      maxLength: 1000000,
      requiredElements: [],
      forbiddenElements: [
        ".advertisement",
        ".ad-container",
        ".social-share",
        "nav",
        "footer",
      ],
      contentUrlPatterns: [],
      excludeUrlPatterns: [
        /\/search\?/,
        /\/login/,
        /\/register/,
        /\/profile/,
        /\/settings/,
      ],
    };
  }

  /**
   * Get handler configuration
   */
  getConfig(): WebsiteConfig {
    return this.config;
  }

  /**
   * Check if this handler can process the current page
   */
  canHandle(url?: string): boolean {
    const targetUrl = url || window.location.href;
    const hostname = new URL(targetUrl).hostname;

    return this.config.domains.some(
      (domain) => hostname.includes(domain) || hostname.endsWith(domain)
    );
  }

  /**
   * Validate that current page contains processable content
   */
  async validateContent(): Promise<boolean> {
    // Check URL patterns
    const currentUrl = window.location.href;

    // Check if URL matches exclusion patterns
    if (
      this.validation.excludeUrlPatterns?.some((pattern) =>
        pattern.test(currentUrl)
      )
    ) {
      return false;
    } // Check if URL matches content patterns (if specified)
    if (
      this.validation.contentUrlPatterns &&
      this.validation.contentUrlPatterns.length > 0
    ) {
      if (
        !this.validation.contentUrlPatterns.some((pattern) =>
          pattern.test(currentUrl)
        )
      ) {
        return false;
      }
    } // Check for forbidden elements
    if (
      this.validation.forbiddenElements &&
      this.validation.forbiddenElements.length > 0
    ) {
      const hasForbiddenElements = this.validation.forbiddenElements.some(
        (selector) => document.querySelector(selector) !== null
      );
      if (hasForbiddenElements) {
        return false;
      }
    } // Check for required elements
    if (
      this.validation.requiredElements &&
      this.validation.requiredElements.length > 0
    ) {
      const hasRequiredElements = this.validation.requiredElements.every(
        (selector) => document.querySelector(selector) !== null
      );
      if (!hasRequiredElements) {
        return false;
      }
    }

    // Check content length
    const contentArea = await this.findContentArea();
    if (!contentArea) {
      return false;
    }

    const contentLength = contentArea.textContent?.length || 0;
    return (
      contentLength >= (this.validation.minLength || 0) &&
      contentLength <= (this.validation.maxLength || Infinity)
    );
  }

  /**
   * Find the main content element of the page
   */
  protected async findContentArea(): Promise<HTMLElement | null> {
    // Try site-specific selectors first
    for (const selector of this.config.selectors.content) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isValidContentElement(element)) {
        console.log(
          `${this.config.siteName}: Found content with selector ${selector}`
        );
        return element;
      }
    }

    // Fallback to common selectors
    const commonSelectors = [
      "article",
      ".article",
      ".content",
      ".main-content",
      ".chapter-content",
      "#content",
      ".entry-content",
      ".post-content",
      ".story-content",
      ".text-content",
      "main",
    ];

    for (const selector of commonSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isValidContentElement(element)) {
        console.log(
          `${this.config.siteName}: Found content with fallback selector ${selector}`
        );
        return element;
      }
    }

    // Last resort: Find largest text block
    return this.findLargestTextBlock();
  }

  /**
   * Check if an element is valid content
   */
  protected isValidContentElement(element: HTMLElement): boolean {
    if (!element || !element.textContent) return false;

    const textLength = element.textContent.trim().length;
    return textLength > 500; // Minimum content threshold
  }

  /**
   * Find the largest text block on the page as fallback
   */
  protected findLargestTextBlock(): HTMLElement | null {
    const paragraphs = document.querySelectorAll("p");
    let bestCandidate: HTMLElement | null = null;
    let maxLength = 0;

    for (const p of paragraphs) {
      const text = p.textContent?.trim() || "";
      if (text.length > maxLength) {
        maxLength = text.length;
        bestCandidate =
          (p.closest("div, article, section, main") as HTMLElement) ||
          (p.parentElement as HTMLElement);
      }
    }

    if (bestCandidate && maxLength > 200) {
      console.log(
        `${this.config.siteName}: Found content using largest text block method`
      );
      return bestCandidate;
    }

    return null;
  }

  /**
   * Extract content metadata
   */
  protected async extractMetadata(): Promise<ContentMetadata> {
    const metadata: ContentMetadata = {
      title: await this.extractTitle(),
      author: await this.extractAuthor(),
      description: await this.extractDescription(),
      date: await this.extractDate(),
      language: await this.extractLanguage(),
      wordCount: 0,
      readingTime: 0,
    };

    return metadata;
  }

  /**
   * Extract the title of the content
   */
  protected async extractTitle(): Promise<string> {
    // Try site-specific title selectors
    for (const selector of this.config.selectors.title) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    // Fallback to common title selectors
    const commonSelectors = [
      "h1",
      ".title",
      ".heading",
      ".chapter-title",
      ".story-title",
    ];
    for (const selector of commonSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    // Final fallback to page title
    return document.title || "Untitled";
  }

  /**
   * Extract author information
   */
  protected async extractAuthor(): Promise<string | undefined> {
    const authorSelectors = this.config.selectors.author || [
      ".author",
      ".by-author",
      ".story-author",
      'a[href*="/u/"]',
      'a[href*="/user/"]',
      ".byline",
      ".author-name",
    ];

    for (const selector of authorSelectors) {
      const element = document.querySelector(selector);
      if (element?.textContent) {
        return element.textContent.trim();
      }
    }

    return undefined;
  }

  /**
   * Extract content description
   */
  protected async extractDescription(): Promise<string | undefined> {
    const descSelectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
      ".description",
      ".summary",
      ".story-description",
    ];

    for (const selector of descSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const content = element.getAttribute("content") || element.textContent;
        if (content?.trim()) {
          return content.trim();
        }
      }
    }

    return undefined;
  }

  /**
   * Extract publication date
   */
  protected async extractDate(): Promise<Date | undefined> {
    const dateSelectors = this.config.selectors.date || [
      "time",
      ".date",
      ".published",
      ".updated",
      ".story-date",
      "[datetime]",
    ];

    for (const selector of dateSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const dateValue =
          element.getAttribute("datetime") ||
          element.getAttribute("data-date") ||
          element.textContent;

        if (dateValue) {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Extract content language
   */
  protected async extractLanguage(): Promise<string | undefined> {
    return (
      document.documentElement.lang ||
      document.querySelector("html")?.getAttribute("lang") ||
      undefined
    );
  }

  /**
   * Calculate word count and reading time
   */
  protected calculateMetrics(text: string): {
    wordCount: number;
    readingTime: number;
  } {
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 WPM reading speed

    return {
      wordCount: words,
      readingTime,
    };
  }

  /**
   * Clean extracted text content
   */
  protected cleanTextContent(element: HTMLElement): string {
    // Create a clone to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;

    // Remove unwanted elements
    const unwantedSelectors = [
      "script",
      "style",
      "nav",
      ".navigation",
      ".ad",
      ".advertisement",
      ".social-share",
      ".comments",
      "footer",
    ];

    unwantedSelectors.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Get text content and clean it up
    return clone.innerText
      .trim()
      .replace(/\n\s+/g, "\n") // Remove excess whitespace
      .replace(/\s{2,}/g, " ") // Replace multiple spaces
      .replace(/\n{3,}/g, "\n\n"); // Limit consecutive line breaks
  }

  /**
   * Extract content from the current page - must be implemented by subclasses
   */
  abstract extractContent(): Promise<ContentExtractionResult>;

  /**
   * Get chapter navigation information
   */
  async getChapterNavigation(): Promise<ChapterNavigation> {
    return {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 1,
    };
  }

  /**
   * Get optimal UI insertion point
   */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
    const target =
      contentArea ||
      (document.querySelector(this.config.selectors.content[0]) as HTMLElement);

    if (!target) {
      // Fallback to body
      return {
        element: document.body,
        position: "prepend",
        containerClass: "novelsynth-ui-container",
      };
    }

    return {
      element: target,
      position: "before",
      containerClass: "novelsynth-ui-container",
    };
  }

  /**
   * Get site-specific prompt for AI processing
   */
  getSiteSpecificPrompt(): string {
    // Try to get stored custom prompt first
    const hostname = window.location.hostname;
    const storedPrompt = this.getStoredSitePrompt(hostname);

    if (storedPrompt) {
      return storedPrompt;
    }

    // Return default prompt from config
    return this.config.defaultPrompt || this.getDefaultPrompt();
  }

  /**
   * Get default prompt based on content type
   */
  protected getDefaultPrompt(): string {
    const prompts: Record<ContentType, string> = {
      [ContentType.NOVEL]:
        "This is a web novel chapter. Please enhance readability while maintaining the author's style and narrative flow.",
      [ContentType.FANFICTION]:
        "This is fan fiction. Please maintain the author's style and any special formatting for dialogue, thoughts, or scene transitions.",
      [ContentType.NEWS]:
        "This is a news article. Please improve clarity and readability while maintaining journalistic objectivity.",
      [ContentType.BLOG]:
        "This is a blog post. Please enhance readability while preserving the author's voice and personal style.",
      [ContentType.DOCUMENTATION]:
        "This is technical documentation. Please improve clarity while maintaining technical accuracy.",
      [ContentType.ACADEMIC]:
        "This is academic content. Please enhance readability while preserving scholarly tone and accuracy.",
      [ContentType.ARTICLE]:
        "This is an article. Please improve readability and flow while maintaining the original meaning.",
      [ContentType.SOCIAL]:
        "This is social media content. Please enhance while maintaining the casual tone and personality.",
      [ContentType.FORUM]:
        "This is forum content. Please improve readability while maintaining the conversational tone.",
      [ContentType.UNKNOWN]:
        "Please enhance this content for better readability while maintaining its original style and meaning.",
    };

    return (
      prompts[this.config.primaryContentType] || prompts[ContentType.UNKNOWN]
    );
  }

  /**
   * Get stored site-specific prompt from localStorage
   */
  protected getStoredSitePrompt(hostname: string): string | null {
    try {
      const storedPrompts = localStorage.getItem("novelsynth_site_prompts");
      if (storedPrompts) {
        const promptsObj = JSON.parse(storedPrompts);
        return promptsObj[hostname] || null;
      }
    } catch (error) {
      console.error("Error retrieving stored site prompt:", error);
    }
    return null;
  }

  /**
   * Apply post-enhancement formatting
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    if (!contentArea) return;

    // Apply default formatting
    const style = contentArea.style;
    style.lineHeight = "1.6";
    style.fontFamily = "inherit";

    // Apply site-specific styles if configured
    if (this.config.styles) {
      Object.entries(this.config.styles).forEach(([property, value]) => {
        (style as any)[property] = value;
      });
    }

    // Ensure proper paragraph spacing
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const pStyle = (p as HTMLElement).style;
      pStyle.marginBottom = pStyle.marginBottom || "1em";
    });
  }

  /**
   * Clean up handler resources
   */
  cleanup(): void {
    // Default implementation - subclasses can override
  }
}
