// Content script for NovelSynth extension
import { extractCurrentPageContent } from "@/utils/website-handlers";
import { ContentType } from "@/utils/website-handlers/types";
import type { ContentMode } from "@/types";
import { serviceRegistry } from "@/services/ai/registry";
import { featureRegistry } from "@/features/registry";
import { topButtonInjector } from "./topButtonInjector";

console.log("NovelSynth content script loaded");

// Helper function to map new ContentExtractionResult to legacy ExtractedContent interface
function mapToExtractedContent(result: any): any {
  if (!result || !result.found) {
    return {
      title: document.title,
      content: document.body.textContent?.slice(0, 5000) || "",
      contentType: "general",
      metadata: {
        url: window.location.href,
        domain: window.location.hostname,
      },
    };
  }

  // Map ContentType enum to legacy string format
  const contentTypeMap: Record<string, string> = {
    [ContentType.NOVEL]: "novel",
    [ContentType.FANFICTION]: "novel", // Map to novel for existing features
    [ContentType.NEWS]: "article",
    [ContentType.BLOG]: "article",
    [ContentType.DOCUMENTATION]: "technical",
    [ContentType.ACADEMIC]: "academic",
    [ContentType.ARTICLE]: "article",
    [ContentType.SOCIAL]: "general",
    [ContentType.FORUM]: "general",
    [ContentType.UNKNOWN]: "general",
  };

  return {
    title: result.metadata.title,
    content: result.text,
    contentType: contentTypeMap[result.contentType] || "general",
    metadata: {
      url: window.location.href,
      domain: window.location.hostname,
      author: result.metadata.author,
      language: result.metadata.language,
      quality: result.quality,
      selector: result.selector,
      ...result.metadata.extra,
    },
  };
}

// State management
let floatingPopup: HTMLElement | null = null;
let injectedButtons: HTMLElement[] = [];
let topButtonsContainer: HTMLElement | null = null;
let isFloatingPopupVisible = false;

// Recent features tracking
let recentFeatures: string[] = ["enhance", "summarize"]; // Default recent features
const MAX_RECENT_FEATURES = 5;

// Initialize content script
function init() {
  console.log("Initializing NovelSynth content script");

  // Load extension settings
  loadSettings();

  // Create floating popup
  createFloatingPopup();

  // Inject top buttons
  injectTopButtons();

  // Listen for messages from popup and background
  setupMessageListener();
}

// Load extension settings from storage
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get("novelsynth-storage");
    const settings = result["novelsynth-storage"];

    if (settings?.ui?.floatingPopupEnabled) {
      isFloatingPopupVisible = true;
    }

    // Load recent features
    await loadRecentFeatures();

    console.log("Loaded settings:", settings);
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
}

// Load recent features from storage
async function loadRecentFeatures() {
  try {
    const result = await chrome.storage.local.get("novelsynth-recent-features");
    const storedRecent = result["novelsynth-recent-features"];

    if (storedRecent && Array.isArray(storedRecent)) {
      recentFeatures = storedRecent.slice(0, MAX_RECENT_FEATURES);
    }

    console.log("Loaded recent features:", recentFeatures);
  } catch (error) {
    console.error("Failed to load recent features:", error);
  }
}

// Update recent features when a feature is used
async function updateRecentFeatures(featureId: string) {
  try {
    // Remove if already exists
    recentFeatures = recentFeatures.filter((id) => id !== featureId);

    // Add to front
    recentFeatures.unshift(featureId);

    // Keep only MAX_RECENT_FEATURES
    recentFeatures = recentFeatures.slice(0, MAX_RECENT_FEATURES);

    // Save to storage
    await chrome.storage.local.set({
      "novelsynth-recent-features": recentFeatures,
    });

    // Update top buttons
    topButtonInjector.updateRecent(recentFeatures);

    console.log("Updated recent features:", recentFeatures);
  } catch (error) {
    console.error("Failed to update recent features:", error);
  }
}

// Create floating popup at bottom right
function createFloatingPopup() {
  if (floatingPopup) return;

  // Create popup container
  floatingPopup = document.createElement("div");
  floatingPopup.id = "novelsynth-floating-popup";
  floatingPopup.innerHTML = `
    <div class="ns-floating-container">
      <button class="ns-floating-toggle" title="NovelSynth Quick Access">
        ✨
      </button>
      <div class="ns-floating-menu" style="display: none;">
        <div class="ns-menu-header">
          <span>NovelSynth</span>
          <button class="ns-close-btn">&times;</button>
        </div>
        <div class="ns-menu-content">
          <div class="ns-quick-buttons">
            <button class="ns-feature-btn" data-feature="enhance">
              <span class="ns-icon">✨</span>
              <span>Enhance</span>
            </button>
            <button class="ns-feature-btn" data-feature="summarize">
              <span class="ns-icon">📝</span>
              <span>Summarize</span>
            </button>
          </div>
          <div class="ns-all-features">
            <button class="ns-more-btn">More Features</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const styles = `
    #novelsynth-floating-popup {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .ns-floating-container {
      position: relative;
    }

    .ns-floating-toggle {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .ns-floating-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .ns-floating-menu {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .ns-menu-header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .ns-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ns-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .ns-menu-content {
      padding: 16px;
    }

    .ns-quick-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }

    .ns-feature-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }

    .ns-feature-btn:hover {
      background: #f1f5f9;
      border-color: #6366f1;
      transform: translateY(-1px);
    }

    .ns-icon {
      font-size: 16px;
    }

    .ns-more-btn {
      width: 100%;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s ease;
    }

    .ns-more-btn:hover {
      background: #5855eb;
    }

    .ns-top-buttons {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 999998;
      display: flex;
      gap: 8px;
    }

    .ns-top-btn {
      background: rgba(99, 102, 241, 0.9);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
    }

    .ns-top-btn:hover {
      background: rgba(99, 102, 241, 1);
      transform: translateY(-1px);
    }
  `;

  // Add styles to page
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Add popup to page
  document.body.appendChild(floatingPopup);

  // Set up event listeners
  setupFloatingPopupEvents();

  // Show/hide based on settings
  if (!isFloatingPopupVisible) {
    floatingPopup.style.display = "none";
  }
}

// Set up floating popup event listeners
function setupFloatingPopupEvents() {
  if (!floatingPopup) return;

  const toggle = floatingPopup.querySelector(
    ".ns-floating-toggle"
  ) as HTMLElement;
  const menu = floatingPopup.querySelector(".ns-floating-menu") as HTMLElement;
  const closeBtn = floatingPopup.querySelector(".ns-close-btn") as HTMLElement;
  const moreBtn = floatingPopup.querySelector(".ns-more-btn") as HTMLElement;

  // Toggle menu
  toggle?.addEventListener("click", () => {
    const isVisible = menu.style.display !== "none";
    menu.style.display = isVisible ? "none" : "block";
  });

  // Close menu
  closeBtn?.addEventListener("click", () => {
    menu.style.display = "none";
  });

  // Feature buttons
  const featureButtons = floatingPopup.querySelectorAll(".ns-feature-btn");
  featureButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const featureId = (e.currentTarget as HTMLElement).dataset.feature;
      if (featureId) {
        executeFeature(featureId);
        menu.style.display = "none";
      }
    });
  });

  // More features button
  moreBtn?.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openPopup" });
    menu.style.display = "none";
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!floatingPopup?.contains(e.target as Node)) {
      menu.style.display = "none";
    }
  });
}

// Inject top buttons
function injectTopButtons() {
  // Use the React-based top button injector
  topButtonInjector.updateRecent(recentFeatures);
  topButtonInjector.inject();
}

// Execute a feature
async function executeFeature(featureId: string, selectedText?: string) {
  try {
    console.log("Executing feature:", featureId);

    // Get content
    const content = selectedText || extractContent();
    if (!content) {
      showNotification("No content found to process", "error");
      return;
    }

    // Show loading state
    showNotification("Processing...", "info");

    // Get feature configuration
    const feature = featureRegistry.get(featureId);
    if (!feature) {
      showNotification("Feature not found", "error");
      return;
    } // Determine content type
    const extractionResult = await extractCurrentPageContent();
    const contentData = mapToExtractedContent(extractionResult);
    const contentType = (contentData?.contentType || "general") as ContentMode;

    // Get prompt
    const prompt =
      feature.defaultPrompts[contentType] || feature.defaultPrompts.general;

    // Send to background for processing
    const response = await chrome.runtime.sendMessage({
      action: "processAIRequest",
      data: {
        featureId,
        prompt,
        content,
        contentType,
      },
    });

    if (response.success) {
      // Display result
      displayResult(response.data.result, featureId);
      showNotification("Feature executed successfully!", "success");

      // Update recent features
      await updateRecentFeatures(featureId);
    } else {
      showNotification("Failed to process request", "error");
    }
  } catch (error) {
    console.error("Feature execution error:", error);
    showNotification("An error occurred", "error");
  }
}

// Extract content from page
async function extractContent(): Promise<string> {
  const extractionResult = await extractCurrentPageContent();
  const extracted = mapToExtractedContent(extractionResult);
  return extracted?.content || "";
}

// Display AI result
function displayResult(result: string, featureId: string) {
  // Create result modal
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; color: #1f2937;">NovelSynth Result</h3>
          <button style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
          " onclick="this.closest('div').remove()">&times;</button>
        </div>
        <div style="
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          white-space: pre-wrap;
          line-height: 1.6;
          color: #374151;
        ">${result}</div>
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button style="
            background: #6366f1;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            cursor: pointer;
          " onclick="navigator.clipboard.writeText('${result.replace(
            /'/g,
            "\\'"
          )}')">Copy</button>
          <button style="
            background: #e5e7eb;
            color: #374151;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            cursor: pointer;
          " onclick="this.closest('div').remove()">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Remove modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Show notification
function showNotification(message: string, type: "success" | "error" | "info") {
  const notification = document.createElement("div");
  const bgColor =
    type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#6366f1";

  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 1000001;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease;
    ">
      ${message}
    </div>
  `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Set up message listener
function setupMessageListener() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message);

    switch (message.action) {
      case "executeFeature":
        // Handle feature execution from TopButtonPanel
        if (message.data) {
          executeFeature(message.data.featureId, message.data.content)
            .then(() => {
              sendResponse({ success: true });
            })
            .catch((error) => {
              sendResponse({ success: false, error: error.message });
            });
          return true; // Keep message channel open for async response
        } else {
          // Legacy format
          executeFeature(message.featureId, message.selectedText);
        }
        break;

      case "updateRecentFeatures":
        // Handle recent features update
        if (message.data?.featureId) {
          updateRecentFeatures(message.data.featureId);
        }
        break;

      case "toggleFloatingPopup":
        toggleFloatingPopup(message.visible);
        break;

      case "getPageContent":
        const content = extractContent();
        sendResponse({ content });
        break;

      case "refreshTopButtons":
        // Refresh top buttons when recent features change
        loadRecentFeatures().then(() => {
          topButtonInjector.updateRecent(recentFeatures);
        });
        break;
    }
  });
}

// Toggle floating popup visibility
function toggleFloatingPopup(visible: boolean) {
  if (floatingPopup) {
    floatingPopup.style.display = visible ? "block" : "none";
    isFloatingPopupVisible = visible;
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export {};
