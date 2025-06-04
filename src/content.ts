import { ContentProcessor } from "./utils/ContentProcessor";
import { StorageManager } from "./utils/StorageManager";
import { ProcessingBanner } from "./utils/ProcessingBanner";

class ContentScript {
  private contentProcessor: ContentProcessor;
  private processingBanner: ProcessingBanner | null = null;
  private isProcessing = false;

  constructor() {
    this.contentProcessor = new ContentProcessor();
    this.init();
  }

  private async init() {
    // Check if content was previously enhanced and restore it
    await this.restoreEnhancedContent();

    // Set up message listeners
    this.setupMessageListeners();

    // Auto-detect and enhance content if enabled
    this.autoDetectContent();
  }

  private setupMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case "enhanceContent":
          this.handleEnhanceContent(message.options);
          sendResponse({ success: true });
          break;
        case "toggleContent":
          this.handleToggleContent();
          sendResponse({ success: true });
          break;
        case "getContentStatus":
          sendResponse({
            hasEnhanced: this.hasEnhancedContent(),
            isProcessing: this.isProcessing,
          });
          break;
      }
      return true;
    });
  }

  private async restoreEnhancedContent() {
    try {
      const url = window.location.href;
      const allStoredContent = await StorageManager.getStoredContent(); // Adjusted: Call with 0 arguments
      const storedData = allStoredContent[url]; // Access data for the specific URL

      if (storedData && storedData.enhancedContent) {
        // Content was previously enhanced, show toggle banner
        this.showToggleBanner();
      }
    } catch (error) {
      console.error("Failed to restore enhanced content:", error);
    }
  }

  private async handleEnhanceContent(options: any = {}) {
    if (this.isProcessing) {
      console.log("Enhancement already in progress");
      return;
    }

    try {
      this.isProcessing = true;

      // Show processing banner
      const currentConfig = {
        provider: "gemini",
        model: "gemini-1.5-pro",
        showWordCount: true,
        showProcessingBanner: true,
      };
      this.processingBanner = new ProcessingBanner(currentConfig);

      // Process content
      const result = await this.contentProcessor.processCurrentPage(options);
      if (result.success && result.enhancedContent) {
        // Store both original and enhanced content
        const url = window.location.href;
        const originalContent = result.originalContent || "";
        const enhancedContent = result.enhancedContent;

        // Cast result.metadata to any to handle potentially undeclared properties locally
        const metadata = result.metadata as any;

        // Construct metadata to match expected structure for storeContent
        const metadataForStorage: any = {
          timestamp: new Date().toISOString(),
          provider: currentConfig.provider,
          model: currentConfig.model,
          contentType: metadata?.contentType || "generic",
        };

        if (metadata?.websiteId) {
          metadataForStorage.websiteId = metadata.websiteId;
        }
        if (metadata?.processingTime) {
          metadataForStorage.processingTime = metadata.processingTime;
        }

        await StorageManager.storeContent(
          url,
          originalContent,
          enhancedContent,
          metadataForStorage
        );

        // Update banner to show success with toggle
        this.showToggleBanner();
      } else {
        // Show error in console
        console.error("Enhancement failed:", result.error);
      }
    } catch (error) {
      console.error("Enhancement error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private showToggleBanner() {
    if (this.processingBanner) {
      // this.processingBanner.destroy(); // Method not yet defined
    }

    const config = {
      provider: "gemini",
      model: "gemini-1.5-pro",
      showWordCount: true,
      showProcessingBanner: true,
    };
    this.processingBanner = new ProcessingBanner(config);
  }

  private async handleToggleContent() {
    try {
      const url = window.location.href;
      const allStoredContent = await StorageManager.getStoredContent();
      const storedData = allStoredContent[url];

      if (!storedData) {
        console.error("No stored content found for toggle");
        return;
      }

      // const isCurrentlyEnhanced = this.contentProcessor.isShowingEnhanced(); // Method not yet defined
      const isCurrentlyEnhanced = false; // Placeholder

      if (isCurrentlyEnhanced) {
        if (storedData.originalContent) {
          this.contentProcessor.replacePageContent(
            storedData.originalContent as string
          );
          // this.contentProcessor.setShowingEnhanced(false); // Method not yet defined
        }
      } else {
        if (storedData.enhancedContent) {
          this.contentProcessor.replacePageContent(
            storedData.enhancedContent as string
          );
          // this.contentProcessor.setShowingEnhanced(true); // Method not yet defined
        }
      }
      console.log("Toggle content executed (placeholder logic)");
    } catch (error) {
      console.error("Failed to toggle content:", error);
    }
  }

  private async handleRemoveEnhancement() {
    try {
      const url = window.location.href;
      const allStoredContent = await StorageManager.getStoredContent();
      const storedData = allStoredContent[url];

      if (storedData && storedData.originalContent) {
        this.contentProcessor.replacePageContent(
          storedData.originalContent as string
        );
        // this.contentProcessor.setShowingEnhanced(false); // Method not yet defined
      }

      await StorageManager.clearStoredContent(url);

      if (this.processingBanner) {
        // this.processingBanner.destroy(); // Method not yet defined
        this.processingBanner = null;
      }

      console.log("Enhancement removed, original content restored");
    } catch (error) {
      console.error("Failed to remove enhancement:", error);
    }
  }

  private hasEnhancedContent(): boolean {
    return this.processingBanner !== null;
  }

  private autoDetectContent() {
    chrome.storage.sync.get(["autoEnhance"], (result) => {
      if (result.autoEnhance && this.contentProcessor.canHandleCurrentPage()) {
        setTimeout(() => {
          this.handleEnhanceContent({ auto: true });
        }, 2000);
      }
    });
  }
}

// Initialize content script when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ContentScript();
  });
} else {
  new ContentScript();
}
