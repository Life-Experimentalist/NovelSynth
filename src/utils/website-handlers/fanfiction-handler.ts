/**
 * FanFiction.net Website Content Handler
 * Specialized handler for extracting content from fanfiction.net
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
  WebsiteMetadata,
} from "./types";

export class FanfictionHandler extends BaseWebsiteHandler {
  protected initializeConfig(): WebsiteConfig {
    return {
      siteName: "FanFiction.Net",
      domains: ["fanfiction.net", "www.fanfiction.net", "m.fanfiction.net"],
      primaryContentType: ContentType.FANFICTION,
      expectedQuality: ContentQuality.MEDIUM,
      selectors: {
        content: [
          "#storytext",
          ".storytext",
          "#story_text",
          ".text",
          ".chapter",
        ],
        title: [
          "#profile_top b.xcontrast_txt",
          "#content b",
          "h1.title",
          "b.xcontrast_txt",
          ".story-title",
        ],
        author: [
          '#profile_top a[href*="/u/"]',
          'a[href*="/u/"]',
          ".author",
          ".story-author",
        ],
        date: ["#profile_top span[data-xutime]", ".story-date", ".updated"],
        navigation: {
          previous: [
            "#chap_select option[selected] ~ option",
            'a[title="Previous Chapter"]',
          ],
          next: [
            "#chap_select option[selected] ~ option",
            'a[title="Next Chapter"]',
          ],
          chapterList: ["#chap_select", 'select[name="chapter"]'],
        },
        exclude: [
          "#top",
          "#menubar",
          ".gui_table",
          ".lc-wrapper",
          "#content_wrapper_inner > center",
          "script",
          "style",
        ],
      },
      defaultPrompt:
        "This is a fanfiction from FanFiction.Net. Please maintain the author's style and any formatting features like section breaks, centered text, italics, etc. Respect any special formatting the author uses for dialogue, thoughts, flashbacks, or scene transitions.",
      styles: {
        marginBottom: "1.5em",
        lineHeight: "1.6",
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
      minLength: 100, // FF.net can have shorter chapters
      contentUrlPatterns: [
        /\/s\/\d+\/\d+\//, // Story ID and chapter pattern
        /fanfiction\.net\/s\/\d+/,
      ],
      excludeUrlPatterns: [
        /\/u\/\d+\//, // User profiles
        /\/communities\//,
        /\/search\//,
        /\/browse\//,
        /\/beta\//,
        /\/login/,
        /\/signup/,
      ],
    };
  }

  /**
   * Enhanced validation for fanfiction chapters
   */
  async validateContent(): Promise<boolean> {
    const baseValidation = await super.validateContent();
    if (!baseValidation) return false;

    // Check if we're on a story page (not user profile, etc.)
    const url = window.location.href;
    if (!/\/s\/\d+\/\d+\//.test(url)) {
      return false;
    }

    // Check for storytext element specifically
    const storytextElement = document.getElementById("storytext");
    return (
      storytextElement !== null &&
      (storytextElement.textContent?.length || 0) > 50
    );
  }

  /**
   * Extract content from FanFiction.net page
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
          reason: "No storytext element found",
        };
      }

      const metadata = await this.extractMetadata();

      // Extract and clean text
      const cleanText = this.cleanFanfictionContent(contentArea);
      const metrics = this.calculateMetrics(cleanText);

      metadata.wordCount = metrics.wordCount;
      metadata.readingTime = metrics.readingTime;

      // Extract additional FF.net specific metadata
      await this.extractFFNetMetadata(metadata);

      return {
        found: true,
        text: cleanText,
        metadata,
        selector: this.getUsedSelector(contentArea),
        contentType: this.config.primaryContentType,
        quality: this.assessFanfictionQuality(cleanText),
        rawHtml: contentArea.innerHTML,
      };
    } catch (error) {
      console.error("Error extracting FanFiction.net content:", error);
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
   * Clean FanFiction.net specific content
   */
  private cleanFanfictionContent(contentArea: HTMLElement): string {
    // FF.net content is usually pretty clean, but we'll apply basic cleaning
    const cleanText = this.cleanTextContent(contentArea);

    // Handle common FF.net formatting quirks
    return cleanText
      .replace(/^A\/N:.*$/gm, "") // Remove author's notes that slipped through
      .replace(/^AN:.*$/gm, "") // Another A/N format
      .replace(/^\s*-{3,}\s*$/gm, "---") // Normalize section breaks
      .replace(/\n{4,}/g, "\n\n\n") // Limit excessive line breaks
      .trim();
  }

  /**
   * Extract detailed FanFiction.net specific metadata
   */
  private async extractFFNetMetadata(metadata: any): Promise<void> {
    try {
      // Extract story title and author
      const titleElement = document.querySelector(
        "#profile_top b.xcontrast_txt"
      );
      if (titleElement) {
        metadata.storyTitle = titleElement.textContent?.trim() || "";
      }

      const authorElement = document.querySelector(
        '#profile_top a[href*="/u/"]'
      );
      if (authorElement) {
        metadata.author = authorElement.textContent?.trim() || "";
        metadata.authorId =
          authorElement.getAttribute("href")?.match(/\/u\/(\d+)\//)?.[1] || "";
        metadata.authorUrl = `https://fanfiction.net${authorElement.getAttribute(
          "href"
        )}`;
      }

      // Extract story details from the gray text area
      const storyInfoElement = document.querySelector("#profile_top .xgray");
      if (storyInfoElement) {
        const infoText = storyInfoElement.textContent || "";

        // Extract various metadata from the info text
        const ratedMatch = infoText.match(/Rated:\s*(\w+)/);
        if (ratedMatch) metadata.rating = ratedMatch[1];

        const languageMatch = infoText.match(/Language:\s*(\w+)/);
        if (languageMatch) metadata.language = languageMatch[1];

        const genreMatch = infoText.match(/Genre:\s*([^-]+?)(?:\s*-|$)/);
        if (genreMatch) metadata.genre = genreMatch[1].trim();

        const chaptersMatch = infoText.match(/Chapters:\s*(\d+)/);
        if (chaptersMatch) {
          metadata.totalChapters = parseInt(chaptersMatch[1], 10);
        }

        const wordsMatch = infoText.match(/Words:\s*([\d,]+)/);
        if (wordsMatch) {
          metadata.totalWords = parseInt(wordsMatch[1].replace(/,/g, ""), 10);
        }

        const reviewsMatch = infoText.match(/Reviews:\s*([\d,]+)/);
        if (reviewsMatch) {
          metadata.reviews = parseInt(reviewsMatch[1].replace(/,/g, ""), 10);
        }

        const favsMatch = infoText.match(/Favs:\s*([\d,]+)/);
        if (favsMatch) {
          metadata.favorites = parseInt(favsMatch[1].replace(/,/g, ""), 10);
        }

        const followsMatch = infoText.match(/Follows:\s*([\d,]+)/);
        if (followsMatch) {
          metadata.follows = parseInt(followsMatch[1].replace(/,/g, ""), 10);
        }

        const publishedMatch = infoText.match(
          /Published:\s*([^-]+?)(?:\s*-|$)/
        );
        if (publishedMatch) {
          metadata.publishedDate = publishedMatch[1].trim();
        }

        const updatedMatch = infoText.match(/Updated:\s*([^-]+?)(?:\s*-|$)/);
        if (updatedMatch) {
          metadata.updatedDate = updatedMatch[1].trim();
        }

        const statusMatch = infoText.match(/Status:\s*(\w+)/);
        if (statusMatch) {
          metadata.status = statusMatch[1];
        }

        // Extract characters/pairings
        const charactersMatch = infoText.match(
          /(?:Characters?|Pairing):\s*([^-]+?)(?:\s*-|$)/
        );
        if (charactersMatch) {
          metadata.characters = charactersMatch[1].trim();
        }
      }

      // Extract current chapter information
      const urlMatch = window.location.href.match(/\/s\/(\d+)\/(\d+)\//);
      if (urlMatch) {
        metadata.storyId = urlMatch[1];
        metadata.currentChapter = parseInt(urlMatch[2], 10);
      }

      // Extract chapter title if present
      const chapterSelect = document.getElementById(
        "chap_select"
      ) as HTMLSelectElement;
      if (chapterSelect) {
        const selectedOption = chapterSelect.querySelector("option[selected]");
        if (selectedOption) {
          metadata.chapterTitle =
            selectedOption.textContent?.replace(/^\d+\.\s*/, "").trim() || "";
        }
      }

      // Calculate story completion percentage
      if (metadata.totalChapters && metadata.currentChapter) {
        metadata.completionPercentage = Math.round(
          (metadata.currentChapter / metadata.totalChapters) * 100
        );
      }

      // Determine fandom from title or other indicators
      const pageTitle = document.title;
      const titleParts = pageTitle.split("|");
      if (titleParts.length > 1) {
        metadata.fandom = titleParts[titleParts.length - 1].trim();
      }
    } catch (error) {
      console.error("Error extracting FF.net metadata:", error);
    }
  }

  /**
   * Extract detailed metadata specifically for WebpageDetails component
   */
  private extractDetailedMetadata(): WebsiteMetadata {
    const metadata: WebsiteMetadata = {
      title: document.title,
      url: window.location.href,
      siteName: "FanFiction.Net",
    };

    try {
      // Extract story title from the main title element
      const storyTitleElement = document.querySelector(
        "#profile_top b.xcontrast_txt"
      );
      if (storyTitleElement) {
        metadata.storyTitle = storyTitleElement.textContent?.trim();
      }

      // Extract chapter title and number from chapter selector
      const chapterSelect = document.getElementById(
        "chap_select"
      ) as HTMLSelectElement;
      if (chapterSelect) {
        const selectedOption = chapterSelect.querySelector(
          "option[selected]"
        ) as HTMLOptionElement;
        if (selectedOption) {
          const chapterText = selectedOption.textContent?.trim();
          const chapterMatch = chapterText?.match(/(\d+)\.\s*(.+)/);
          if (chapterMatch) {
            metadata.chapterNumber = parseInt(chapterMatch[1]);
            metadata.title = chapterMatch[2]; // Chapter title
          }
        }
      } else {
        // Try to extract from URL if no selector found
        const urlMatch = window.location.href.match(/\/s\/\d+\/(\d+)\//);
        if (urlMatch) {
          metadata.chapterNumber = parseInt(urlMatch[1]);
        }
      }

      // Extract author
      const authorElement = document.querySelector(
        '#profile_top a[href*="/u/"]'
      );
      if (authorElement) {
        metadata.author = authorElement.textContent?.trim();
      }

      // Extract story description
      const descriptionElement = document.querySelector("#summary");
      if (descriptionElement) {
        metadata.description = descriptionElement.textContent?.trim();
      }

      // Extract story metadata from the gray info section
      const storyInfoElement = document.querySelector("#profile_top .xgray");
      if (storyInfoElement) {
        const infoText = storyInfoElement.textContent || "";

        // Extract rating
        const ratingMatch = infoText.match(/Rated:\s*(\w+)/);
        if (ratingMatch) {
          metadata.rating = ratingMatch[1];
        }

        // Extract language
        const languageMatch = infoText.match(/Language:\s*(\w+)/);
        if (languageMatch) {
          metadata.language = languageMatch[1];
        }

        // Extract genres
        const genreMatch = infoText.match(/Genre:\s*([^-]+?)(?:\s*-|$)/);
        if (genreMatch) {
          metadata.genres = genreMatch[1].split("/").map((g) => g.trim());
        }

        // Extract word count
        const wordsMatch = infoText.match(/Words:\s*([\d,]+)/);
        if (wordsMatch) {
          metadata.wordCount = parseInt(wordsMatch[1].replace(/,/g, ""));
        }

        // Extract chapter count
        const chaptersMatch = infoText.match(/Chapters:\s*(\d+)/);
        if (chaptersMatch) {
          metadata.totalChapters = parseInt(chaptersMatch[1]);
        }

        // Extract published date
        const publishedMatch = infoText.match(
          /Published:\s*([^-]+?)(?:\s*-|$)/
        );
        if (publishedMatch) {
          const dateStr = publishedMatch[1].trim();
          const parsedDate = this.parseFanFictionDate(dateStr);
          if (parsedDate) {
            metadata.publishedDate = parsedDate.toISOString();
          }
        }

        // Extract updated date
        const updatedMatch = infoText.match(/Updated:\s*([^-]+?)(?:\s*-|$)/);
        if (updatedMatch) {
          const dateStr = updatedMatch[1].trim();
          const parsedDate = this.parseFanFictionDate(dateStr);
          if (parsedDate) {
            metadata.lastModified = parsedDate.toISOString();
          }
        }

        // Determine status
        if (metadata.totalChapters && metadata.chapterNumber) {
          metadata.status =
            metadata.chapterNumber >= metadata.totalChapters
              ? "complete"
              : "in-progress";
        } else if (infoText.includes("Complete")) {
          metadata.status = "complete";
        } else {
          metadata.status = "in-progress";
        }
      }

      // Extract fandom from breadcrumbs or page structure
      const fandomElement = document.querySelector(
        "#pre_story_links a:first-child"
      );
      if (fandomElement) {
        metadata.fandom = fandomElement.textContent?.trim();
      } else {
        // Fallback: extract from page title
        const titleParts = document.title.split("|");
        if (titleParts.length > 1) {
          metadata.fandom = titleParts[titleParts.length - 1].trim();
        }
      }
    } catch (error) {
      console.error(
        "Error extracting FanFiction.net detailed metadata:",
        error
      );
    }

    return metadata;
  }

  private parseFanFictionDate(dateStr: string): Date | null {
    try {
      // FanFiction.net uses various date formats
      // Common formats: "Dec 25, 2023", "12/25/2023", "25-Dec-23"
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  /**
   * Get the selector that was used to find content
   */
  private getUsedSelector(contentArea: HTMLElement): string {
    if (contentArea.id === "storytext") return "#storytext";

    for (const selector of this.config.selectors.content) {
      if (contentArea.matches(selector)) {
        return selector;
      }
    }
    return "fanfiction-handler-fallback";
  }

  /**
   * Assess content quality for fanfiction
   */
  private assessFanfictionQuality(text: string): ContentQuality {
    // Fanfiction quality indicators
    const indicators = {
      high: [
        /[""]/g, // Smart quotes
        /[—–]/g, // Em/en dashes
        /\b(?:although|however|therefore|meanwhile|furthermore)\b/gi, // Complex connectors
      ],
      medium: [
        /[.!?]["']?\s+[A-Z]/g, // Proper sentence structure
        /"[^"]*"/g, // Quoted dialogue
        /\b(?:said|asked|replied|whispered|shouted)\b/gi, // Dialogue tags
      ],
      poor: [
        /\b(u|ur|2|4)\b/gi, // Text speak
        /(.)\1{3,}/g, // Excessive repetition
        /^[a-z]/gm, // Lines starting with lowercase
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
    if (highRatio > 2 && mediumRatio > 10) return ContentQuality.HIGH;
    if (mediumRatio > 5) return ContentQuality.MEDIUM;

    return ContentQuality.MEDIUM; // Default for FF.net
  }

  /**
   * Get chapter navigation for FanFiction.net
   */
  async getChapterNavigation(): Promise<ChapterNavigation> {
    const navigation: ChapterNavigation = {
      hasPrevious: false,
      hasNext: false,
      currentChapter: 1,
      totalChapters: 1,
    };

    try {
      // FanFiction.net uses a select box for chapter navigation
      const chapterSelect = document.getElementById(
        "chap_select"
      ) as HTMLSelectElement;
      if (chapterSelect) {
        const options = chapterSelect.options;
        const selectedIndex = chapterSelect.selectedIndex;

        navigation.currentChapter = selectedIndex + 1;
        navigation.totalChapters = options.length;
        navigation.hasPrevious = selectedIndex > 0;
        navigation.hasNext = selectedIndex < options.length - 1;
        navigation.chapterSelector = chapterSelect;

        // Get URLs for previous/next chapters
        if (navigation.hasPrevious) {
          const prevOption = options[selectedIndex - 1] as HTMLOptionElement;
          navigation.previousUrl = this.buildChapterUrl(prevOption.value);
        }

        if (navigation.hasNext) {
          const nextOption = options[selectedIndex + 1] as HTMLOptionElement;
          navigation.nextUrl = this.buildChapterUrl(nextOption.value);
        }
      }
    } catch (error) {
      console.error("Error getting FanFiction.net chapter navigation:", error);
    }

    return navigation;
  }

  /**
   * Build chapter URL from chapter number
   */
  private buildChapterUrl(chapterNum: string): string {
    const currentUrl = window.location.href;
    const urlMatch = currentUrl.match(/^(.*\/s\/\d+)\/\d+(.*)$/);
    if (urlMatch) {
      return `${urlMatch[1]}/${chapterNum}${urlMatch[2]}`;
    }
    return currentUrl;
  }

  /**
   * Get optimal UI insertion point for FanFiction.net
   */
  getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
    // Look for the storytext container
    const storytext = document.getElementById("storytext");
    if (storytext) {
      return {
        element: storytext,
        position: "before",
        containerClass: "novelsynth-ffnet-ui",
      };
    }

    // Fallback to default behavior
    return super.getUIInsertionPoint(contentArea);
  }

  /**
   * Apply FanFiction.net specific formatting after enhancement
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    super.formatAfterEnhancement(contentArea);

    if (!contentArea) return;

    // Apply FF.net specific styling
    const paragraphs = contentArea.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const pElement = p as HTMLElement;
      pElement.style.marginBottom = "1.5em";
      pElement.style.textAlign = "left"; // Ensure left alignment
    });

    // Handle centered text (common in fanfiction for scene breaks, etc.)
    const centerElements = contentArea.querySelectorAll("center");
    centerElements.forEach((center) => {
      const centerElement = center as HTMLElement;
      centerElement.style.margin = "1.5em 0";
      centerElement.style.fontStyle = "italic";
      centerElement.style.textAlign = "center";
    });

    // Style horizontal rules (scene breaks)
    const hrs = contentArea.querySelectorAll("hr");
    hrs.forEach((hr) => {
      const hrElement = hr as HTMLElement;
      hrElement.style.margin = "2em auto";
      hrElement.style.width = "50%";
      hrElement.style.border = "none";
      hrElement.style.borderTop = "1px solid #ccc";
    });

    // Handle emphasis elements
    const emElements = contentArea.querySelectorAll("em, i");
    emElements.forEach((em) => {
      const emElement = em as HTMLElement;
      emElement.style.fontStyle = "italic";
    });

    const strongElements = contentArea.querySelectorAll("strong, b");
    strongElements.forEach((strong) => {
      const strongElement = strong as HTMLElement;
      strongElement.style.fontWeight = "bold";
    });
  }
}
