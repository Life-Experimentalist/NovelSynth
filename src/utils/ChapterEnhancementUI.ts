import type { UserSettings } from "../types";
import { StorageManager } from "./StorageManager";

interface ActionConfig {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export class ChapterEnhancementUI {
  private container: HTMLElement | null = null;
  private settings: UserSettings | null = null;
  private onActionCallback: ((action: string) => void) | null = null;

  // Available actions
  private readonly availableActions: ActionConfig[] = [
    {
      id: "enhance",
      label: "Enhance",
      icon: "✨",
      description: "Improve writing quality and readability",
    },
    {
      id: "summarize",
      label: "Summarize",
      icon: "📄",
      description: "Create a concise summary",
    },
    {
      id: "analyze",
      label: "Analyze",
      icon: "🔍",
      description: "Analyze themes and writing style",
    },
    {
      id: "suggestions",
      label: "Suggestions",
      icon: "💡",
      description: "Get improvement suggestions",
    },
    {
      id: "translate",
      label: "Translate",
      icon: "🌐",
      description: "Translate to different language",
    },
    {
      id: "grammar",
      label: "Grammar Check",
      icon: "📝",
      description: "Check and fix grammar issues",
    },
    {
      id: "style",
      label: "Style Check",
      icon: "🎨",
      description: "Improve writing style",
    },
    {
      id: "dialogue",
      label: "Dialogue",
      icon: "💬",
      description: "Enhance dialogue quality",
    },
  ];

  // Default last used actions
  private lastUsedActions: string[] = ["enhance", "summarize"];

  constructor(settings: UserSettings | null = null) {
    this.settings = settings;
    this.loadLastUsedActions();
  }

  /**
   * Load the last used actions from storage
   */
  private async loadLastUsedActions(): Promise<void> {
    try {
      const stored = await StorageManager.getLastUsedActions();
      if (stored && stored.length >= 2) {
        this.lastUsedActions = stored.slice(0, 2);
      }
    } catch (error) {
      console.warn("Failed to load last used actions:", error);
    }
  }

  /**
   * Save the last used actions to storage
   */
  private async saveLastUsedActions(): Promise<void> {
    try {
      await StorageManager.setLastUsedActions(this.lastUsedActions);
    } catch (error) {
      console.warn("Failed to save last used actions:", error);
    }
  }

  /**
   * Update the last used actions when a new action is triggered
   */
  private updateLastUsedActions(actionId: string): void {
    // If action is already in the top 2, move it to first position
    const currentIndex = this.lastUsedActions.indexOf(actionId);
    if (currentIndex === 0) {
      // Already first, do nothing
      return;
    } else if (currentIndex === 1) {
      // Move from second to first
      this.lastUsedActions = [actionId, this.lastUsedActions[0]];
    } else {
      // New action, add to first and shift others
      this.lastUsedActions = [actionId, this.lastUsedActions[0]];
    }

    this.saveLastUsedActions();
    this.updateButtonsDisplay();
  }

  /**
   * Create the chapter enhancement UI
   */
  createUI(insertionPoint: {
    element: HTMLElement;
    position: "before" | "after" | "inside";
  }): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "novelsynth-chapter-ui";
    this.container.innerHTML = this.getUIHTML();

    // Add event listeners
    this.setupEventListeners();

    // Insert at the specified position
    this.insertUI(insertionPoint);

    return this.container;
  }

  /**
   * Get the HTML structure for the UI
   */
  private getUIHTML(): string {
    const primaryActions = this.lastUsedActions.slice(0, 2);
    const dropdownActions = this.availableActions.filter(
      (action) => !primaryActions.includes(action.id)
    );

    return `
      <div class="novelsynth-enhancement-bar">
        <div class="novelsynth-primary-actions">
          ${primaryActions
            .map((actionId) => {
              const action = this.availableActions.find(
                (a) => a.id === actionId
              );
              return action
                ? `
              <button class="novelsynth-action-btn primary" data-action="${
                action.id
              }" title="${action.description || action.label}">
                <span class="icon">${action.icon}</span>
                <span class="label">${action.label}</span>
              </button>
            `
                : "";
            })
            .join("")}
        </div>

        <div class="novelsynth-dropdown-container">
          <button class="novelsynth-dropdown-btn" type="button">
            <span class="icon">⚙️</span>
            <span class="label">More Actions</span>
            <span class="chevron">▼</span>
          </button>
          <div class="novelsynth-dropdown-menu" style="display: none;">
            ${dropdownActions
              .map(
                (action) => `
              <button class="novelsynth-dropdown-item" data-action="${
                action.id
              }" title="${action.description || action.label}">
                <span class="icon">${action.icon}</span>
                <span class="label">${action.label}</span>
                <span class="description">${action.description || ""}</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="novelsynth-status-indicator" style="display: none;">
          <span class="status-text">Processing...</span>
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
  }

  /**
   * Insert the UI at the specified position
   */
  private insertUI(insertionPoint: {
    element: HTMLElement;
    position: "before" | "after" | "inside";
  }): void {
    if (!this.container) return;

    switch (insertionPoint.position) {
      case "before":
        insertionPoint.element.parentElement?.insertBefore(
          this.container,
          insertionPoint.element
        );
        break;
      case "after":
        insertionPoint.element.parentElement?.insertBefore(
          this.container,
          insertionPoint.element.nextSibling
        );
        break;
      case "inside":
        insertionPoint.element.insertBefore(
          this.container,
          insertionPoint.element.firstChild
        );
        break;
    }
  }

  /**
   * Setup event listeners for the UI
   */
  private setupEventListeners(): void {
    if (!this.container) return;

    // Primary action buttons
    const primaryButtons = this.container.querySelectorAll(
      ".novelsynth-action-btn.primary"
    );
    primaryButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const actionId = (e.target as HTMLElement).closest("button")?.dataset
          .action;
        if (actionId) {
          this.handleAction(actionId);
        }
      });
    });

    // Dropdown toggle
    const dropdownBtn = this.container.querySelector(
      ".novelsynth-dropdown-btn"
    );
    const dropdownMenu = this.container.querySelector(
      ".novelsynth-dropdown-menu"
    ) as HTMLElement;

    if (dropdownBtn && dropdownMenu) {
      dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = dropdownMenu.style.display !== "none";
        dropdownMenu.style.display = isVisible ? "none" : "block";

        // Update chevron direction
        const chevron = dropdownBtn.querySelector(".chevron");
        if (chevron) {
          chevron.textContent = isVisible ? "▼" : "▲";
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
        const chevron = dropdownBtn.querySelector(".chevron");
        if (chevron) {
          chevron.textContent = "▼";
        }
      });
    }

    // Dropdown action buttons
    const dropdownItems = this.container.querySelectorAll(
      ".novelsynth-dropdown-item"
    );
    dropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const actionId = (e.target as HTMLElement).closest("button")?.dataset
          .action;
        if (actionId) {
          this.handleAction(actionId);
          // Close dropdown after selection
          if (dropdownMenu) {
            dropdownMenu.style.display = "none";
            const chevron = dropdownBtn?.querySelector(".chevron");
            if (chevron) {
              chevron.textContent = "▼";
            }
          }
        }
      });
    });
  }

  /**
   * Handle action button clicks
   */
  private handleAction(actionId: string): void {
    // Update last used actions
    this.updateLastUsedActions(actionId);

    // Call the registered callback
    if (this.onActionCallback) {
      this.onActionCallback(actionId);
    }
  }

  /**
   * Update the buttons display after last used actions change
   */
  private updateButtonsDisplay(): void {
    if (!this.container) return;

    // Re-create the UI with updated actions
    this.container.innerHTML = this.getUIHTML();
    this.setupEventListeners();
  }

  /**
   * Set the callback function for when actions are triggered
   */
  setActionCallback(callback: (action: string) => void): void {
    this.onActionCallback = callback;
  }

  /**
   * Show processing state
   */
  showProcessing(actionLabel: string = "Processing"): void {
    if (!this.container) return;

    const statusIndicator = this.container.querySelector(
      ".novelsynth-status-indicator"
    ) as HTMLElement;
    const statusText = this.container.querySelector(
      ".status-text"
    ) as HTMLElement;

    if (statusIndicator && statusText) {
      statusText.textContent = `${actionLabel}...`;
      statusIndicator.style.display = "flex";

      // Disable all buttons during processing
      const buttons = this.container.querySelectorAll("button");
      buttons.forEach((btn) => {
        btn.disabled = true;
      });
    }
  }

  /**
   * Hide processing state
   */
  hideProcessing(): void {
    if (!this.container) return;

    const statusIndicator = this.container.querySelector(
      ".novelsynth-status-indicator"
    ) as HTMLElement;

    if (statusIndicator) {
      statusIndicator.style.display = "none";

      // Re-enable all buttons
      const buttons = this.container.querySelectorAll("button");
      buttons.forEach((btn) => {
        btn.disabled = false;
      });
    }
  }

  /**
   * Remove the UI from the page
   */
  remove(): void {
    if (this.container && this.container.parentElement) {
      this.container.parentElement.removeChild(this.container);
      this.container = null;
    }
  }

  /**
   * Check if the UI is currently visible
   */
  isVisible(): boolean {
    return this.container !== null && this.container.parentElement !== null;
  }
}
