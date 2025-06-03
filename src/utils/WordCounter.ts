export interface WordCountStats {
  originalWords: number;
  enhancedWords: number;
  wordsChanged: number;
  percentageChange: number;
  charactersOriginal: number;
  charactersEnhanced: number;
}

export class WordCounter {
  /**
   * Count words in text content
   */
  static countWords(text: string): number {
    if (!text || typeof text !== "string") {
      return 0;
    }

    // Remove HTML tags and clean text
    const cleanText = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      return 0;
    }

    // Split by whitespace and filter out empty strings
    return cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  }

  /**
   * Count characters in text content
   */
  static countCharacters(text: string): number {
    if (!text || typeof text !== "string") {
      return 0;
    }

    // Remove HTML tags and count characters
    return text.replace(/<[^>]*>/g, "").length;
  }

  /**
   * Calculate enhancement statistics
   */
  static calculateStats(
    originalText: string,
    enhancedText: string
  ): WordCountStats {
    const originalWords = this.countWords(originalText);
    const enhancedWords = this.countWords(enhancedText);
    const wordsChanged = enhancedWords - originalWords;
    const percentageChange =
      originalWords > 0 ? (wordsChanged / originalWords) * 100 : 0;

    const charactersOriginal = this.countCharacters(originalText);
    const charactersEnhanced = this.countCharacters(enhancedText);

    return {
      originalWords,
      enhancedWords,
      wordsChanged,
      percentageChange: Math.round(percentageChange * 100) / 100, // Round to 2 decimal places
      charactersOriginal,
      charactersEnhanced,
    };
  }

  /**
   * Format word count for display
   */
  static formatWordCount(count: number): string {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  }

  /**
   * Format percentage change for display
   */
  static formatPercentageChange(percentage: number): string {
    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
  }

  /**
   * Format word change for display
   */
  static formatWordChange(change: number): string {
    const sign = change > 0 ? "+" : "";
    return `${sign}${this.formatWordCount(Math.abs(change))}`;
  }

  /**
   * Get reading time estimate (assuming 200 words per minute)
   */
  static getReadingTime(wordCount: number): string {
    const minutes = Math.round(wordCount / 200);

    if (minutes < 1) {
      return "< 1 min";
    } else if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    }
  }

  /**
   * Extract word count from page content
   */
  static extractContentWordCount(element: Element): number {
    if (!element) {
      return 0;
    }

    // Clone element to avoid modifying original
    const clone = element.cloneNode(true) as Element;

    // Remove navigation, ads, and other non-content elements
    const elementsToRemove = [
      "nav",
      "header",
      "footer",
      "aside",
      ".ads",
      ".navigation",
      ".breadcrumb",
      ".social",
      ".share",
      ".comments",
      ".author-bio",
    ];

    elementsToRemove.forEach((selector) => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    return this.countWords(clone.textContent || "");
  }
}
