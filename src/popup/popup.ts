/**
 * NovelSynth Popup Interface
 * Main user interface for the browser extension
 */

interface PopupElements {
  enhanceBtn: HTMLButtonElement;
  summarizeBtn: HTMLButtonElement;
  toggleBtn: HTMLButtonElement;
  statusDiv: HTMLDivElement;
  settingsBtn: HTMLButtonElement;
  storageInfo: HTMLDivElement;
}

class PopupInterface {
  private elements!: PopupElements;
  private currentTab?: chrome.tabs.Tab;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.loadCurrentTab();
  }

  private initializeElements() {
    this.elements = {
      enhanceBtn: document.getElementById("enhance-btn") as HTMLButtonElement,
      summarizeBtn: document.getElementById(
        "summarize-btn"
      ) as HTMLButtonElement,
      toggleBtn: document.getElementById("toggle-btn") as HTMLButtonElement,
      statusDiv: document.getElementById("status") as HTMLDivElement,
      settingsBtn: document.getElementById("settings-btn") as HTMLButtonElement,
      storageInfo: document.getElementById("storage-info") as HTMLDivElement,
    };
  }

  private setupEventListeners() {
    this.elements.enhanceBtn?.addEventListener("click", () => {
      this.enhanceContent();
    });

    this.elements.summarizeBtn?.addEventListener("click", () => {
      this.summarizeContent();
    });

    this.elements.toggleBtn?.addEventListener("click", () => {
      this.toggleContent();
    });

    this.elements.settingsBtn?.addEventListener("click", () => {
      this.openSettings();
    });

    // Load storage info
    this.loadStorageInfo();
  }

  private async loadCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      this.currentTab = tab;
      await this.updateStatus();
    } catch (error) {
      console.error("Failed to load current tab:", error);
    }
  }

  private async updateStatus() {
    if (!this.currentTab?.id) return;

    try {
      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: "getContentStatus",
      });

      if (response?.hasEnhanced) {
        this.showStatus("Content enhanced ✨", "success");
        this.elements.toggleBtn.style.display = "block";
      } else if (response?.isProcessing) {
        this.showStatus("Processing...", "processing");
      } else {
        this.showStatus("Ready to enhance", "ready");
      }
    } catch (error) {
      this.showStatus("Page not supported", "error");
      this.elements.enhanceBtn.disabled = true;
      this.elements.summarizeBtn.disabled = true;
    }
  }

  private async enhanceContent() {
    if (!this.currentTab?.id) return;

    try {
      this.showStatus("Enhancing content...", "processing");
      this.elements.enhanceBtn.disabled = true;

      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: "enhanceContent",
        options: {},
      });

      setTimeout(() => {
        this.updateStatus();
        this.elements.enhanceBtn.disabled = false;
      }, 2000);
    } catch (error) {
      this.showStatus("Enhancement failed", "error");
      this.elements.enhanceBtn.disabled = false;
    }
  }

  private async summarizeContent() {
    if (!this.currentTab?.id) return;

    try {
      this.showStatus("Generating summary...", "processing");
      this.elements.summarizeBtn.disabled = true;

      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: "summarizeContent",
        options: {},
      });

      setTimeout(() => {
        this.updateStatus();
        this.elements.summarizeBtn.disabled = false;
      }, 2000);
    } catch (error) {
      this.showStatus("Summary failed", "error");
      this.elements.summarizeBtn.disabled = false;
    }
  }

  private async toggleContent() {
    if (!this.currentTab?.id) return;

    try {
      await chrome.tabs.sendMessage(this.currentTab.id, {
        action: "toggleContent",
      });

      this.showStatus("Content toggled", "success");
    } catch (error) {
      this.showStatus("Toggle failed", "error");
    }
  }

  private showStatus(
    message: string,
    type: "ready" | "processing" | "success" | "error"
  ) {
    if (!this.elements.statusDiv) return;

    this.elements.statusDiv.textContent = message;
    this.elements.statusDiv.className = `status ${type}`;
  }

  private async loadStorageInfo() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GET_STORAGE_STATS",
      });

      if (response?.success && this.elements.storageInfo) {
        const stats = response.data;
        this.elements.storageInfo.textContent = `Stored: ${
          stats.totalItems
        } items (${this.formatBytes(stats.totalSize)})`;
      }
    } catch (error) {
      console.error("Failed to load storage info:", error);
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private openSettings() {
    chrome.runtime.openOptionsPage();
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PopupInterface();
});
