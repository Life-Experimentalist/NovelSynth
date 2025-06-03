import {
  ContentType,
  PromptType,
  DEFAULT_ENHANCEMENT_PROMPTS,
  DEFAULT_SUMMARY_PROMPTS,
  PERMANENT_PROMPT,
  WEBSITE_PROMPTS,
  NOVEL_PROMPTS,
} from "./PromptManager";
import type { UserSettings } from "../types";

export interface PromptComponents {
  basePrompt: string;
  websitePrompt: string;
  novelPrompt: string;
  permanentPrompt: string;
}

export interface NovelContext {
  title: string;
  author?: string;
  genre?: string;
  customPrompt?: string;
}

export class PromptBuilder {
  private settings: UserSettings;
  private novelContexts: Map<string, NovelContext> = new Map();

  constructor(settings: UserSettings) {
    this.settings = settings;
    this.loadNovelContexts();
  }

  /**
   * Build a complete prompt for content enhancement
   */
  buildEnhancementPrompt(
    contentType: ContentType,
    websiteId: string,
    novelTitle?: string
  ): PromptComponents {
    const basePrompt = this.getEnhancementPrompt(contentType);
    const websitePrompt = this.getWebsitePrompt(websiteId);
    const novelPrompt = this.getNovelPrompt(novelTitle);
    const permanentPrompt = PERMANENT_PROMPT;

    return {
      basePrompt,
      websitePrompt,
      novelPrompt,
      permanentPrompt,
    };
  }

  /**
   * Build a complete prompt for content summarization
   */
  buildSummaryPrompt(
    contentType: ContentType,
    websiteId: string,
    novelTitle?: string
  ): PromptComponents {
    const basePrompt = this.getSummaryPrompt(contentType);
    const websitePrompt = this.getWebsitePrompt(websiteId);
    const novelPrompt = this.getNovelPrompt(novelTitle);
    const permanentPrompt = PERMANENT_PROMPT;

    return {
      basePrompt,
      websitePrompt,
      novelPrompt,
      permanentPrompt,
    };
  }

  /**
   * Combine prompt components into a single prompt string
   */
  combinePrompts(components: PromptComponents, content: string): string {
    const promptParts = [];

    // Add base prompt
    if (components.basePrompt) {
      promptParts.push(components.basePrompt);
    }

    // Add website-specific prompt
    if (components.websitePrompt) {
      promptParts.push(`\n**Website Context:** ${components.websitePrompt}`);
    }

    // Add novel-specific prompt
    if (components.novelPrompt) {
      promptParts.push(`\n**Novel Context:** ${components.novelPrompt}`);
    }

    // Add permanent prompt
    if (components.permanentPrompt) {
      promptParts.push(components.permanentPrompt);
    }

    // Add content
    promptParts.push(`\n\n**Content to process:**\n${content}`);

    return promptParts.join("\n");
  }

  /**
   * Get enhancement prompt for content type
   */
  private getEnhancementPrompt(contentType: ContentType): string {
    // Check for custom user prompt first
    const customPrompt =
      this.settings.customPrompts?.enhancement?.[contentType];
    if (customPrompt) {
      return customPrompt;
    }

    // Fall back to default
    return (
      DEFAULT_ENHANCEMENT_PROMPTS[contentType] ||
      DEFAULT_ENHANCEMENT_PROMPTS[ContentType.GENERIC]
    );
  }

  /**
   * Get summary prompt for content type
   */
  private getSummaryPrompt(contentType: ContentType): string {
    // Check for custom user prompt first
    const customPrompt = this.settings.customPrompts?.summary?.[contentType];
    if (customPrompt) {
      return customPrompt;
    }

    // Fall back to default
    return (
      DEFAULT_SUMMARY_PROMPTS[contentType] ||
      DEFAULT_SUMMARY_PROMPTS[ContentType.GENERIC]
    );
  }

  /**
   * Get website-specific prompt
   */
  private getWebsitePrompt(websiteId: string): string {
    // Check for custom user prompt first
    const customPrompt = this.settings.customPrompts?.website?.[websiteId];
    if (customPrompt) {
      return customPrompt;
    } // Fall back to default
    const websitePrompts = WEBSITE_PROMPTS as Record<string, string>;
    return websitePrompts[websiteId] || websitePrompts["generic"];
  }

  /**
   * Get novel-specific prompt
   */
  private getNovelPrompt(novelTitle?: string): string {
    if (!novelTitle) {
      return "";
    }

    const novelKey = this.normalizeNovelTitle(novelTitle);

    // Check for custom user prompt first
    const customPrompt = this.settings.customPrompts?.novel?.[novelKey];
    if (customPrompt) {
      return customPrompt;
    }

    // Check stored novel context
    const novelContext = this.novelContexts.get(novelKey);
    if (novelContext?.customPrompt) {
      return novelContext.customPrompt;
    }

    // Fall back to default
    return NOVEL_PROMPTS["default"];
  }

  /**
   * Store novel context for future use
   */
  storeNovelContext(novelTitle: string, context: Partial<NovelContext>): void {
    const novelKey = this.normalizeNovelTitle(novelTitle);
    const existingContext = this.novelContexts.get(novelKey) || {
      title: novelTitle,
    };

    this.novelContexts.set(novelKey, {
      ...existingContext,
      ...context,
    });

    this.saveNovelContexts();
  }

  /**
   * Get novel context
   */
  getNovelContext(novelTitle: string): NovelContext | undefined {
    const novelKey = this.normalizeNovelTitle(novelTitle);
    return this.novelContexts.get(novelKey);
  }
  /**
   * Update custom prompt for a specific type and key
   */
  updateCustomPrompt(type: PromptType, key: string, prompt: string): void {
    if (!this.settings.customPrompts) {
      this.settings.customPrompts = {
        enhancement: {},
        summary: {},
        permanent: {},
        website: {},
        novel: {},
      };
    }

    if (!this.settings.customPrompts[type]) {
      this.settings.customPrompts[type] = {};
    }

    this.settings.customPrompts[type][key] = prompt;
  }

  /**
   * Get all available prompts for editing
   */
  getAllPrompts(): { [key: string]: any } {
    return {
      enhancement: {
        defaults: DEFAULT_ENHANCEMENT_PROMPTS,
        custom: this.settings.customPrompts?.enhancement || {},
      },
      summary: {
        defaults: DEFAULT_SUMMARY_PROMPTS,
        custom: this.settings.customPrompts?.summary || {},
      },
      website: {
        defaults: WEBSITE_PROMPTS,
        custom: this.settings.customPrompts?.website || {},
      },
      novel: {
        defaults: NOVEL_PROMPTS,
        custom: this.settings.customPrompts?.novel || {},
        contexts: Object.fromEntries(this.novelContexts),
      },
    };
  }
  /**
   * Reset prompt to default
   */
  resetPromptToDefault(type: PromptType, key: string): void {
    if (this.settings.customPrompts && this.settings.customPrompts[type]) {
      delete this.settings.customPrompts[type]![key];
    }
  }

  /**
   * Normalize novel title for consistent storage
   */
  private normalizeNovelTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50); // Limit length
  }

  /**
   * Load novel contexts from storage
   */
  private async loadNovelContexts(): Promise<void> {
    try {
      const stored = await chrome.storage.local.get("novelContexts");
      if (stored.novelContexts) {
        this.novelContexts = new Map(Object.entries(stored.novelContexts));
      }
    } catch (error) {
      console.error("Failed to load novel contexts:", error);
    }
  }

  /**
   * Save novel contexts to storage
   */
  private async saveNovelContexts(): Promise<void> {
    try {
      const contextObj = Object.fromEntries(this.novelContexts);
      await chrome.storage.local.set({ novelContexts: contextObj });
    } catch (error) {
      console.error("Failed to save novel contexts:", error);
    }
  }

  /**
   * Extract novel title from content or page
   */
  static extractNovelTitle(
    content: string,
    pageTitle: string
  ): string | undefined {
    // Try to extract from page title first
    const titlePatterns = [
      /^(.+?)\s*-\s*Chapter/i,
      /^(.+?)\s*-\s*Vol/i,
      /^(.+?)\s*Chapter/i,
      /^(.+?)\s*Vol/i,
      /^(.+?)\s*:\s*Chapter/i,
      /^(.+?)\s*\|\s*Chapter/i,
    ];

    for (const pattern of titlePatterns) {
      const match = pageTitle.match(pattern);
      if (match && match[1].trim().length > 3) {
        return match[1].trim();
      }
    }

    // Try to extract from content structure
    const contentLines = content.split("\n").slice(0, 10);
    for (const line of contentLines) {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 100) {
        // Look for title-like patterns
        if (/^[A-Z][^.!?]*$/.test(trimmed) && !trimmed.includes("Chapter")) {
          return trimmed;
        }
      }
    }

    return undefined;
  }
}
