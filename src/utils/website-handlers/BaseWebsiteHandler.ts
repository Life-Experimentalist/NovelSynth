export class BaseWebsiteHandler {
  /**
   * Find the main content area on the page
   */
  findContentArea(): HTMLElement | null {
    // Common content selectors
    const selectors = [
      "main",
      '[role="main"]',
      "#content",
      ".content",
      "#main",
      ".main",
      "article",
      ".post-content",
      ".entry-content",
      ".story-text",
      ".chapter-content",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isValidContentArea(element)) {
        return element;
      }
    }

    // Fallback: find the largest text container
    return this.findLargestTextContainer();
  }

  /**
   * Extract content from the content area
   */
  extractContent(contentArea: HTMLElement): string {
    // Clone the element to avoid modifying the original
    const clone = contentArea.cloneNode(true) as HTMLElement;

    // Remove unwanted elements
    this.removeUnwantedElements(clone);

    // Extract text content while preserving some formatting
    return this.extractFormattedText(clone);
  }

  /**
   * Extract the title of the page/chapter
   */
  extractTitle(): string {
    // Try various title selectors
    const titleSelectors = [
      "h1",
      ".title",
      ".chapter-title",
      ".post-title",
      ".entry-title",
    ];

    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }

    // Fallback to page title
    return document.title;
  }

  /**
   * Get chapter navigation info
   */
  getChapterNavigation(): any {
    return {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 1,
    };
  }

  /**
   * Format content after enhancement
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    // Basic formatting - can be overridden by specific handlers
    this.addEnhancementMarkers(contentArea);
  }

  /**
   * Check if element is a valid content area
   */
  private isValidContentArea(element: HTMLElement): boolean {
    const text = element.textContent || "";
    const words = text.trim().split(/\s+/).length;

    // Must have at least 50 words
    if (words < 50) return false;

    // Should not be navigation or sidebar
    const classList = element.classList.toString().toLowerCase();
    const excludeClasses = ["nav", "sidebar", "footer", "header", "menu"];

    return !excludeClasses.some((cls) => classList.includes(cls));
  }

  /**
   * Find the largest text container as fallback
   */
  private findLargestTextContainer(): HTMLElement | null {
    const elements = document.querySelectorAll("div, section, article");
    let largest: HTMLElement | null = null;
    let maxWords = 0;

    elements.forEach((element) => {
      const text = element.textContent || "";
      const words = text.trim().split(/\s+/).length;

      if (words > maxWords && this.isValidContentArea(element as HTMLElement)) {
        largest = element as HTMLElement;
        maxWords = words;
      }
    });

    return largest;
  }

  /**
   * Remove unwanted elements from content
   */
  private removeUnwantedElements(element: HTMLElement): void {
    const unwantedSelectors = [
      "script",
      "style",
      "nav",
      ".navigation",
      ".nav",
      ".sidebar",
      ".footer",
      ".header",
      ".advertisement",
      ".ads",
      ".social-media",
      ".comments",
      ".author-note",
    ];

    unwantedSelectors.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });
  }

  /**
   * Extract formatted text while preserving structure
   */
  private extractFormattedText(element: HTMLElement): string {
    // Replace block elements with line breaks
    const blockElements = element.querySelectorAll(
      "p, div, br, h1, h2, h3, h4, h5, h6"
    );
    blockElements.forEach((el) => {
      if (el.tagName === "BR") {
        el.replaceWith("\n");
      } else {
        el.appendChild(document.createTextNode("\n"));
      }
    });

    return element.textContent || "";
  }

  /**
   * Add markers to indicate enhanced content
   */
  private addEnhancementMarkers(contentArea: HTMLElement): void {
    contentArea.classList.add("novelsynth-enhanced");
    contentArea.setAttribute("data-enhanced", "true");
  }
}
