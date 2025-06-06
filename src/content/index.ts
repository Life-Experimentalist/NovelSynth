import type { ExtensionMessage, ContentAnalysis, UserSettings } from "../types";
import { ProcessingBanner } from "../utils/ProcessingBanner";
import { WordCounter } from "../utils/WordCounter";
import { ChapterEnhancementUI } from "../utils/ChapterEnhancementUI";
import { ContentProcessor } from "../utils/ContentProcessor";
import { ContentDetector } from "../utils/ContentDetector";

class ContentScript {
  private isInitialized = false;
  private analysis: ContentAnalysis | null = null;
  private novelSynthUI: HTMLElement | null = null;
  private chapterEnhancementUI: ChapterEnhancementUI | null = null;
  private processingBanner: ProcessingBanner | null = null;
  private settings: UserSettings | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    if (this.isInitialized) return;

    // Wait for page to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initialize());
    } else {
      await this.initialize();
    }
  }
  private async initialize(): Promise<void> {
    try {
      // Load user settings
      await this.loadSettings();

      // Initialize processing banner if settings are available
      if (this.settings) {
        this.processingBanner = new ProcessingBanner({
          provider: this.settings.selectedProvider,
          model: this.settings.selectedModels.enhance, // Default to enhance model
          showWordCount: this.settings.showWordCount,
          showProcessingBanner: this.settings.showProcessingBanner,
        });
      }

      // Analyze current page content
      await this.analyzeCurrentPage();

      // Show UI based on content type and whether it's a chapter page
      if (this.analysis?.isLongForm) {
        this.createEnhancementUI();
      }

      this.isInitialized = true;
      console.log("NovelSynth content script initialized");
    } catch (error) {
      console.error("Failed to initialize NovelSynth:", error);
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      const response = await this.sendMessage({
        type: "GET_SETTINGS",
        payload: {},
      });

      if (response.success) {
        this.settings = response.settings;
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  private async analyzeCurrentPage(): Promise<void> {
    const content = this.extractPageContent();

    if (content.trim().length < 100) {
      return; // Not enough content to analyze
    }

    try {
      const response = await this.sendMessage({
        type: "ANALYZE_CONTENT",
        payload: {
          content,
          url: window.location.href,
        },
      });

      if (response.success) {
        this.analysis = response.analysis;
        console.log("Content analysis:", this.analysis);
      }
    } catch (error) {
      console.error("Failed to analyze content:", error);
    }
  }

  private extractPageContent(): string {
    // Create a clone to avoid modifying the original DOM
    const clone = document.cloneNode(true) as Document;

    // Remove unwanted elements
    const unwantedSelectors = [
      "script",
      "style",
      "nav",
      "header",
      "footer",
      "aside",
      ".advertisement",
      ".ads",
      ".popup",
      ".modal",
      ".overlay",
    ];

    unwantedSelectors.forEach((selector) => {
      clone.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Try to find main content
    const contentSelectors = [
      "main",
      "article",
      ".content",
      ".post-content",
      ".article-content",
      ".entry-content",
      "#content",
      ".chapter-content",
      ".story-content",
    ];

    for (const selector of contentSelectors) {
      const element = clone.querySelector(selector);
      if (element && element.textContent && element.textContent.length > 500) {
        return element.textContent.trim().replace(/\s+/g, " ");
      }
    } // Fallback to body content
    return clone.body?.textContent?.trim().replace(/\s+/g, " ") || "";
  }

  private isChapterPage(): boolean {
    // Check URL patterns that typically indicate chapter pages
    const url = window.location.href.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();

    // Common chapter URL patterns
    const chapterPatterns = [
      /\/chapter[-_]?\d+/i,
      /\/ch[-_]?\d+/i,
      /\/part[-_]?\d+/i,
      /\/episode[-_]?\d+/i,
      /\/read/i,
      /\/story/i,
      /\/fic/i,
    ];

    if (chapterPatterns.some((pattern) => pattern.test(pathname))) {
      return true;
    }

    // Check for common novel/story domains
    const hostname = window.location.hostname.toLowerCase();
    const novelDomains = [
      "fanfiction.net",
      "archiveofourown.org",
      "royalroad.com",
      "webnovel.com",
      "ranobes.net",
      "lightnovelworld.com",
      "novelfull.com",
    ];

    if (novelDomains.some((domain) => hostname.includes(domain))) {
      // On novel sites, check for content length and structure
      const contentSelectors = [
        ".chapter-content",
        ".story-content",
        "#storytext",
        ".text-chapter",
        ".chapter-text",
        ".content",
      ];

      for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (
          element &&
          element.textContent &&
          element.textContent.length > 1000
        ) {
          return true;
        }
      }
    }

    // Check if page has substantial narrative content
    if (
      this.analysis &&
      this.analysis.contentType === "novel" &&
      this.analysis.wordCount > 500
    ) {
      return true;
    }

    return false;
  }

  private findContentInsertionPoint(): {
    element: HTMLElement;
    position: "before" | "after" | "inside";
  } | null {
    // Try to find the best insertion point for the enhancement UI
    const contentSelectors = [
      ".chapter-content",
      ".story-content",
      "#storytext",
      ".text-chapter",
      ".chapter-text",
      "main article",
      "main",
      "article",
      ".content",
      ".post-content",
      ".entry-content",
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && element.textContent && element.textContent.length > 500) {
        return {
          element: element,
          position: "before",
        };
      }
    }

    // Fallback to body if no content area found
    return {
      element: document.body,
      position: "inside",
    };
  }

  private createEnhancementUI(): void {
    // Check if this looks like a chapter page
    if (this.isChapterPage()) {
      this.createChapterEnhancementUI();
    } else {
      // Fall back to the floating action button for non-chapter pages
      this.createNovelSynthUI();
    }
  }

  private createChapterEnhancementUI(): void {
    if (this.chapterEnhancementUI) return;

    // Find the best insertion point
    const insertionPoint = this.findContentInsertionPoint();
    if (!insertionPoint) {
      console.warn(
        "Could not find suitable insertion point for chapter enhancement UI"
      );
      // Fall back to floating action button
      this.createNovelSynthUI();
      return;
    }

    // Create the chapter enhancement UI
    this.chapterEnhancementUI = new ChapterEnhancementUI(this.settings);

    // Set up the action callback
    this.chapterEnhancementUI.setActionCallback(async (action: string) => {
      await this.handleChapterAction(action);
    });

    // Create and insert the UI
    this.chapterEnhancementUI.createUI(insertionPoint);

    console.log("Chapter enhancement UI created and inserted");
  }

  private async handleChapterAction(action: string): Promise<void> {
    if (!this.chapterEnhancementUI) return;

    try {
      // Show processing state
      this.chapterEnhancementUI.showProcessing(
        action.charAt(0).toUpperCase() + action.slice(1)
      );

      // Map the action to the existing handler
      const actionMap: {
        [key: string]: "enhance" | "summarize" | "analyze" | "suggestions";
      } = {
        enhance: "enhance",
        summarize: "summarize",
        analyze: "analyze",
        suggestions: "suggestions",
        grammar: "enhance", // Grammar check uses enhance with specific options
        style: "enhance", // Style check uses enhance with specific options
        translate: "enhance", // Translation uses enhance with specific options
        dialogue: "enhance", // Dialogue enhancement uses enhance with specific options
      };

      const mappedAction = actionMap[action] || "enhance";
      await this.handleAction(mappedAction);
    } catch (error) {
      console.error(`Failed to handle ${action}:`, error);
    } finally {
      // Hide processing state
      if (this.chapterEnhancementUI) {
        this.chapterEnhancementUI.hideProcessing();
      }
    }
  }

  private createNovelSynthUI(): void {
    if (this.novelSynthUI) return;

    // Create floating action button
    this.novelSynthUI = document.createElement("div");
    this.novelSynthUI.id = "novelsynth-fab";
    this.novelSynthUI.innerHTML = `
      <div class="novelsynth-fab-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="novelsynth-panel" style="display: none;">
        <div class="novelsynth-header">
          <h3>NovelSynth</h3>
          <span class="novelsynth-close">&times;</span>
        </div>
        <div class="novelsynth-content">
          <div class="novelsynth-info">
            <p><strong>Content Type:</strong> ${
              this.analysis?.contentType || "Unknown"
            }</p>
            <p><strong>Word Count:</strong> ${
              this.analysis?.wordCount?.toLocaleString() || "Unknown"
            }</p>
            <p><strong>Reading Time:</strong> ${
              this.analysis?.readingTime || "Unknown"
            } min</p>
          </div>          <div class="novelsynth-actions">
            <button class="novelsynth-btn" data-action="enhance">✨ Enhance</button>
            <button class="novelsynth-btn" data-action="summarize">📄 Summarize</button>
            <button class="novelsynth-btn" data-action="analyze">🔍 Analyze</button>
            <button class="novelsynth-btn" data-action="suggestions">💡 Suggestions</button>
          </div>
          <div class="novelsynth-result" style="display: none;"></div>
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();

    // Append to page
    document.body.appendChild(this.novelSynthUI);
  }

  private addEventListeners(): void {
    if (!this.novelSynthUI) return;

    const fab = this.novelSynthUI.querySelector(".novelsynth-fab-button");
    const panel = this.novelSynthUI.querySelector(
      ".novelsynth-panel"
    ) as HTMLElement;
    const closeBtn = this.novelSynthUI.querySelector(".novelsynth-close");
    const actionBtns = this.novelSynthUI.querySelectorAll(".novelsynth-btn");

    // Toggle panel
    fab?.addEventListener("click", () => {
      panel.style.display = panel.style.display === "none" ? "block" : "none";
    });

    // Close panel
    closeBtn?.addEventListener("click", () => {
      panel.style.display = "none";
    });

    // Action buttons
    actionBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const action = (e.target as HTMLElement).getAttribute("data-action");
        if (action) {
          await this.handleAction(
            action as "summarize" | "analyze" | "suggestions"
          );
        }
      });
    });
  }
  private async handleAction(
    action: "enhance" | "summarize" | "analyze" | "suggestions"
  ): Promise<void> {
    const resultDiv = this.novelSynthUI?.querySelector(
      ".novelsynth-result"
    ) as HTMLElement;
    if (!resultDiv) return;

    // Show loading
    resultDiv.style.display = "block";
    resultDiv.innerHTML = '<div class="novelsynth-loading">Processing...</div>';

    try {
      const content = this.extractPageContent();
      const wordCount = WordCounter.countWords(content); // Show processing banner if enabled
      if (this.processingBanner && this.settings?.showProcessingBanner) {
        const contentElement = document.querySelector("main") || document.body;
        this.processingBanner.showProcessingBanner(contentElement);
      }

      const response = await this.sendMessage({
        type: "GET_AI_RESPONSE",
        payload: {
          type: action,
          content: content.substring(0, 8000), // Limit content length
          options: {},
        },
      });

      // Hide processing banner
      if (this.processingBanner) {
        this.processingBanner.removeBanner();
      }

      if (response.success && response.response) {
        this.displayResult(action, response.response, resultDiv);
      } else {
        resultDiv.innerHTML = `<div class="novelsynth-error">Error: ${
          response.response?.error || "Unknown error"
        }</div>`;
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);

      // Hide processing banner on error
      if (this.processingBanner) {
        this.processingBanner.removeBanner();
      }

      resultDiv.innerHTML = `<div class="novelsynth-error">Failed to ${action} content</div>`;
    }
  }

  private getModelForAction(action: string): string {
    if (!this.settings) return "unknown";

    switch (action) {
      case "enhance":
        return this.settings.selectedModels.enhance;
      case "summarize":
        return this.settings.selectedModels.summarize;
      case "analyze":
        return this.settings.selectedModels.analyze;
      case "suggestions":
        return this.settings.selectedModels.suggestions;
      default:
        return this.settings.selectedModels.enhance;
    }
  }

  private displayResult(
    action: string,
    result: any,
    container: HTMLElement
  ): void {
    let html = `<div class="novelsynth-result-header">${
      action.charAt(0).toUpperCase() + action.slice(1)
    } Result:</div>`;

    if (action === "summarize" && result.summary) {
      html += `<div class="novelsynth-summary">${result.summary}</div>`;
    } else if (action === "analyze" && result.analysis) {
      html += `<div class="novelsynth-analysis">${result.analysis}</div>`;
    } else if (action === "suggestions" && result.suggestions) {
      html += '<div class="novelsynth-suggestions"><ul>';
      result.suggestions.forEach((suggestion: string) => {
        html += `<li>${suggestion}</li>`;
      });
      html += "</ul></div>";
    } else {
      html += '<div class="novelsynth-error">No result available</div>';
    }

    container.innerHTML = html;
  }

  private async sendMessage(message: ExtensionMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
}

// Initialize content script
new ContentScript();
