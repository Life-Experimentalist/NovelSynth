import { BaseWebsiteHandler } from "./BaseWebsiteHandler";

/**
 * Ranobes.net Website Content Handler
 * Specialized handler for extracting content from ranobes.net
 */
export class RanobesHandler extends BaseWebsiteHandler {
  // canHandle(): boolean {
  //   return (
  //     window.location.hostname.includes("ranobes.net") ||
  //     window.location.hostname.includes("ranobes.com")
  //   );
  // }

  override findContentArea(): HTMLElement | null {
    // Look for the main content element specific to Ranobes
    const contentElement = document.querySelector(
      ".text-chapter"
    ) as HTMLElement;
    if (contentElement) {
      return contentElement;
    }

    // Try alternative selectors
    const selectors = [
      "#arrticle", // Ranobes.top specific main content area
      ".story",
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && element.innerText.trim().length > 1000) {
        return element;
      }
    }

    // Fallback to the base implementation
    return super.findContentArea();
  }

  override extractTitle(): string {
    // Try to find the title from the heading
    const heading = document.querySelector("h1.title");
    if (heading) {
      return heading.textContent?.trim() || "";
    }

    // Try alternative selectors
    const titleSelectors = [".story-title", ".chapter-title"];
    for (const selector of titleSelectors) {
      const titleElement = document.querySelector(selector);
      if (titleElement && titleElement.textContent?.trim()) {
        return titleElement.textContent.trim();
      }
    }

    // Fallback to the default title extraction (page title)
    return document.title;
  }

  override extractContent(contentArea: HTMLElement): string {
    if (!contentArea) {
      return "";
    }

    // Create a deep clone to prevent modifying the actual DOM
    const contentClone = contentArea.cloneNode(true) as HTMLElement;

    // Remove title elements from the content if they exist
    const titlesToRemove = contentClone.querySelectorAll(
      "h1, h2, h3.title, .story-title, .chapter-title"
    );
    titlesToRemove.forEach((title) => {
      title.remove();
    });

    // Get clean text content
    let chapterText = contentClone.innerText
      .trim()
      .replace(/\n\s+/g, "\n") // Preserve paragraph breaks but remove excess whitespace
      .replace(/\s{2,}/g, " "); // Replace multiple spaces with a single space

    // Additional cleaning - check the first few lines for titles
    const chapterTitle = this.extractTitle();
    const titleParts = chapterTitle.split(/[:\-–—]/);
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
          cleanTitlePart.length > 3 && // Avoid filtering out lines with short matches
          (trimmedLine === cleanTitlePart ||
            trimmedLine.startsWith(`${cleanTitlePart}:`) ||
            trimmedLine.startsWith(`${cleanTitlePart} -`))
        ) {
          return false;
        }
      }

      // Check for common book name patterns at the start of content
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(trimmedLine)) {
        return false;
      }

      return true;
    });

    // Recombine the filtered head lines with the rest of the content
    return [...filteredHeadLines, ...lines.slice(5)].join("\n");
  }

  /**
   * Check if current page is a chapter page (not a listing/index page)
   */
  isChapterPage(): boolean {
    // Check if URL contains chapter indicators
    if (
      window.location.pathname.includes("/chapter-") ||
      window.location.pathname.includes("/read-")
    ) {
      return true;
    }

    // Check if page has content elements typical for chapter pages
    const contentSelectors = ["#arrticle", ".text-chapter", ".story"];
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      // Content element exists and has substantial text (not just a listing)
      if (
        element &&
        element.textContent &&
        element.textContent.trim().length > 1000
      ) {
        return true;
      }
    }

    // Check if page has title elements typical for chapter pages
    const titleSelectors = ["h1.title", ".story-title", ".chapter-title"];
    for (const selector of titleSelectors) {
      const titleElement = document.querySelector(selector);
      if (titleElement && titleElement.textContent?.trim()) {
        // Check if the title indicates a chapter
        const titleText = titleElement.textContent.toLowerCase();
        if (titleText.includes("chapter") || titleText.includes("volume")) {
          return true;
        }
      }
    }

    // Page doesn't match chapter page criteria
    return false;
  }

  override getChapterNavigation() {
    try {
      // Try to find current chapter number
      const breadcrumbs = document.querySelector(".options-left");
      if (breadcrumbs && breadcrumbs.textContent) {
        const chapterText = breadcrumbs.textContent;
        const chapterMatch = chapterText.match(/Chapter (\d+)/i);

        // Try to find navigation links
        const prevLink = document.querySelector(".prev-chap");
        const nextLink = document.querySelector(".next-chap");

        if (chapterMatch) {
          const currentChapter = parseInt(chapterMatch[1], 10);
          return {
            hasPrevious: prevLink !== null,
            hasNext: nextLink !== null,
            currentChapter: currentChapter,
            totalChapters: 0, // Total unknown
          };
        }
      }
    } catch (error) {
      console.error("Error getting chapter navigation:", error);
    }

    // Fallback to default
    return super.getChapterNavigation();
  }

  override formatAfterEnhancement(contentArea: HTMLElement): void {
    super.formatAfterEnhancement(contentArea);

    // Apply site-specific styling for Ranobes
    contentArea.style.fontFamily = "Arial, sans-serif";
    contentArea.style.lineHeight = "1.7";
    contentArea.style.color = "#bab9a0";

    // Style paragraphs specifically
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      (p as HTMLElement).style.marginBottom = "1em";
      (p as HTMLElement).style.lineHeight = "1.7";
      (p as HTMLElement).style.color = "#bab9a0";
    });
  }

  /**
   * Get ideal insertion point for UI controls
   * Override from base to provide Ranobes-specific placement
   */
  override getUIInsertionPoint(contentArea: HTMLElement): {
    element: HTMLElement;
    position: "before" | "after" | "inside";
  } {
    // Look for a better insertion point - we want to insert before the content
    // but after the title and possibly other elements
    const textChapter = document.querySelector(".text-chapter") as HTMLElement;
    if (textChapter) {
      return {
        element: textChapter,
        position: "before",
      };
    }

    // Fallback to default behavior
    return super.getUIInsertionPoint(contentArea);
  }

  // getWebsiteId(): string {
  //   return "ranobes";
  // }

  /**
   * Get site-specific prompt for Ranobes
   */
  getSiteSpecificPrompt(): string {
    return (
      "This is a machine-translated web novel from a Russian novel site. " +
      "Please improve the translation while maintaining the original meaning and flow. " +
      "Keep any special formatting like section breaks. " +
      "Russian and Chinese names should be properly transliterated."
    );
  }

  /**
   * Get a readable site name for the UI
   */
  getSiteIdentifier(): string {
    return "Ranobes.net";
  }
}
