// Background script (Service Worker) for NovelSynth extension
// Handles communication between popup, content scripts, and storage
// Cross-browser compatible (Chrome, Edge, Firefox)

// Cross-browser API compatibility
const browser: any = (() => {
  // @ts-ignore
  if (typeof chrome !== "undefined" && chrome.runtime) {
    return chrome;
  }
  // @ts-ignore
  if (typeof browser !== "undefined" && browser.runtime) {
    // @ts-ignore
    return browser;
  }
  throw new Error("Extension APIs not available");
})();

// Detect browser type for specific compatibility adjustments
const getBrowserInfo = (): { name: string; version: string | null } => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Firefox")) {
    return {
      name: "firefox",
      version: userAgent.match(/Firefox\/(\d+)/)?.[1] || null,
    };
  } else if (userAgent.includes("Edg")) {
    return {
      name: "edge",
      version: userAgent.match(/Edg\/(\d+)/)?.[1] || null,
    };
  } else if (userAgent.includes("Chrome")) {
    return {
      name: "chrome",
      version: userAgent.match(/Chrome\/(\d+)/)?.[1] || null,
    };
  }
  return { name: "unknown", version: null };
};

const browserInfo = getBrowserInfo();
console.log("NovelSynth running on:", browserInfo);

// Extension state
interface ExtensionState {
  isActive: boolean;
  currentTabId?: number;
  floatingPanelVisible: Record<number, boolean>;
  browserInfo: { name: string; version: string | null };
}

const state: ExtensionState = {
  isActive: true,
  floatingPanelVisible: {},
  browserInfo,
};

// Initialize extension
browser.runtime.onInstalled.addListener((details: any) => {
  console.log("NovelSynth installed:", details.reason);

  if (details.reason === "install") {
    // Set default configuration
    initializeDefaultConfig();
  }
});

// Handle extension startup
browser.runtime.onStartup.addListener(() => {
  console.log("NovelSynth started");
  state.isActive = true;
});

// Initialize default configuration
async function initializeDefaultConfig() {
  const defaultConfig = {
    version: "2.0.0",
    features: [],
    aiProviders: [
      {
        id: "gemini",
        name: "Google Gemini",
        displayName: "Gemini Pro",
        enabled: false,
        models: [
          {
            id: "gemini-pro",
            name: "Gemini Pro",
            displayName: "Gemini Pro",
            maxTokens: 2048,
            capabilities: ["text_generation", "analysis"],
          },
          {
            id: "gemini-1.5-pro",
            name: "Gemini 1.5 Pro",
            displayName: "Gemini 1.5 Pro",
            maxTokens: 4096,
            capabilities: ["text_generation", "analysis"],
          },
        ],
        rateLimits: {
          requestsPerMinute: 60,
          requestsPerHour: 1000,
          requestsPerDay: 10000,
          retryAfter: 1000,
          backoffMultiplier: 2,
        },
        supportedFeatures: [],
      },
    ],
    websiteHandlers: [],
    ui: {
      theme: "auto",
      isPopupOpen: false,
      isFloatingPanelOpen: false,
    },
  };

  await chrome.storage.sync.set({ config: defaultConfig });
  console.log("NovelSynth: Default configuration initialized");
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message.type || message.action);

  // Handle both old and new message formats
  const messageType = message.type || message.action;

  switch (messageType) {
    case "GET_CONFIG":
      handleGetConfig(sendResponse);
      return true; // Async response

    case "SAVE_CONFIG":
      handleSaveConfig(message.config, sendResponse);
      return true;

    case "TOGGLE_FLOATING_PANEL":
      handleToggleFloatingPanel(sender.tab?.id, sendResponse);
      return true;

    case "EXECUTE_FEATURE":
      // Handle both old and new formats
      if (message.featureId && message.content) {
        // New format from TopButtonPanel
        handleExecuteFeatureNew(message, sender.tab?.id, sendResponse);
      } else {
        // Legacy format
        handleExecuteFeature(message.execution, sender.tab?.id, sendResponse);
      }
      return true;

    case "UPDATE_RECENT_FEATURES":
      handleUpdateRecentFeatures(
        message.featureId,
        sender.tab?.id,
        sendResponse
      );
      return true;

    case "CONTENT_CHANGED":
      handleContentChanged(message, sender.tab?.id);
      break;

    case "TEST_AI_SERVICE":
      handleTestAIService(message.providerId, sendResponse);
      return true;

    case "processAIRequest":
      // Handle AI processing requests from content script
      handleProcessAIRequest(message.data, sendResponse);
      return true;

    default:
      sendResponse({ error: "Unknown message type" });
  }
});

// Get configuration from storage
async function handleGetConfig(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.sync.get(["config"]);
    sendResponse({ config: result.config });
  } catch (error) {
    console.error("Failed to get config:", error);
    sendResponse({ error: "Failed to load configuration" });
  }
}

// Save configuration to storage
async function handleSaveConfig(
  config: any,
  sendResponse: (response: any) => void
) {
  try {
    await chrome.storage.sync.set({ config });
    sendResponse({ success: true });
  } catch (error) {
    console.error("Failed to save config:", error);
    sendResponse({ error: "Failed to save configuration" });
  }
}

// Toggle floating panel visibility
async function handleToggleFloatingPanel(
  tabId: number | undefined,
  sendResponse: (response: any) => void
) {
  if (!tabId) {
    sendResponse({ error: "No active tab" });
    return;
  }

  try {
    const isVisible = !state.floatingPanelVisible[tabId];
    state.floatingPanelVisible[tabId] = isVisible;

    // Send message to content script
    await chrome.tabs.sendMessage(tabId, {
      type: "TOGGLE_FLOATING_PANEL",
      visible: isVisible,
    });

    sendResponse({ success: true, visible: isVisible });
  } catch (error) {
    console.error("Failed to toggle floating panel:", error);
    sendResponse({ error: "Failed to toggle panel" });
  }
}

// Handle feature execution
async function handleExecuteFeature(
  execution: any,
  tabId: number | undefined,
  sendResponse: (response: any) => void
) {
  if (!tabId) {
    sendResponse({ error: "No active tab" });
    return;
  }

  try {
    // Get selected text from content script
    const contentResponse = await chrome.tabs.sendMessage(tabId, {
      type: "GET_SELECTED_TEXT",
    });

    if (!contentResponse.selectedText) {
      sendResponse({ error: "No text selected" });
      return;
    }

    // Update execution with selected text
    execution.selectedContent = contentResponse.selectedText;

    // TODO: Process with AI service
    // For now, return a mock result
    const result = {
      featureId: execution.featureId,
      success: true,
      result: `AI processed result for: ${contentResponse.selectedText.substring(
        0,
        50
      )}...`,
      timestamp: Date.now(),
    };

    sendResponse(result);
  } catch (error) {
    console.error("Failed to execute feature:", error);
    sendResponse({
      featureId: execution.featureId,
      success: false,
      error: "Failed to execute feature",
      timestamp: Date.now(),
    });
  }
}

// Handle feature execution from TopButtonPanel (new format)
async function handleExecuteFeatureNew(
  message: any,
  tabId: number | undefined,
  sendResponse: (response: any) => void
) {
  if (!tabId) {
    sendResponse({ success: false, error: "No active tab" });
    return;
  }

  try {
    // Forward the request to the content script for processing
    const response = await chrome.tabs.sendMessage(tabId, {
      action: "executeFeature",
      data: {
        featureId: message.featureId,
        content: message.content,
      },
    });

    sendResponse({ success: true, data: response });
  } catch (error) {
    console.error("Failed to execute feature:", error);
    sendResponse({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to execute feature",
    });
  }
}

// Handle recent features update
async function handleUpdateRecentFeatures(
  featureId: string,
  tabId: number | undefined,
  sendResponse: (response: any) => void
) {
  if (!tabId) {
    sendResponse({ success: false, error: "No active tab" });
    return;
  }

  try {
    // Forward to content script
    chrome.tabs.sendMessage(tabId, {
      action: "updateRecentFeatures",
      data: { featureId },
    });

    sendResponse({ success: true });
  } catch (error) {
    console.error("Failed to update recent features:", error);
    sendResponse({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update recent features",
    });
  }
}

// Handle AI processing requests
async function handleProcessAIRequest(
  data: any,
  sendResponse: (response: any) => void
) {
  try {
    // TODO: Implement actual AI processing
    // For now, return mock response
    const mockResult = `Enhanced content: ${data.content.substring(0, 100)}...`;

    sendResponse({
      success: true,
      data: {
        result: mockResult,
        featureId: data.featureId,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Failed to process AI request:", error);
    sendResponse({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process AI request",
    });
  }
}

// Handle content change notifications
function handleContentChanged(message: any, tabId: number | undefined) {
  console.log("Content changed on tab", tabId, "URL:", message.url);

  // Update extension icon based on website support
  updateExtensionIcon(tabId, message.domain);
}

// Update extension icon based on current website
function updateExtensionIcon(tabId: number | undefined, domain: string) {
  if (!tabId) return;

  // Check if current site is supported
  const supportedDomains = [
    "fanfiction.net",
    "archiveofourown.org",
    "royalroad.com",
    "webnovel.com",
    "wattpad.com",
  ];

  const isSupported = supportedDomains.some((supported) =>
    domain.includes(supported)
  );

  // Set appropriate icon
  const iconPath = isSupported ? "icons/icon-light" : "icons/icon-dark";

  chrome.action.setIcon({
    tabId,
    path: {
      16: `${iconPath}-16.png`,
      32: `${iconPath}-32.png`,
      48: `${iconPath}-48.png`,
      128: `${iconPath}-128.png`,
    },
  });

  // Update title
  const title = isSupported
    ? "NovelSynth - Enhanced for this site"
    : "NovelSynth - AI Reading Companion";

  chrome.action.setTitle({ tabId, title });
}

// Test AI service connection
async function handleTestAIService(
  providerId: string,
  sendResponse: (response: any) => void
) {
  try {
    // Get API key from storage
    const result = await chrome.storage.sync.get(["config"]);
    const config = result.config;

    if (!config) {
      sendResponse({ success: false, error: "No configuration found" });
      return;
    }

    const provider = config.aiProviders.find((p: any) => p.id === providerId);
    if (!provider || !provider.apiKey) {
      sendResponse({ success: false, error: "Provider not configured" });
      return;
    }

    // TODO: Implement actual API testing
    // For now, simulate a test
    setTimeout(() => {
      sendResponse({ success: true });
    }, 1000);
  } catch (error) {
    console.error("Failed to test AI service:", error);
    sendResponse({ success: false, error: "Test failed" });
  }
}

// Handle tab updates to update icon
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const domain = new URL(tab.url).hostname;
    updateExtensionIcon(tabId, domain);
  }
});

// Handle tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then((tab) => {
    if (tab.url) {
      const domain = new URL(tab.url).hostname;
      updateExtensionIcon(activeInfo.tabId, domain);
    }
  });
});

// Clean up floating panel state when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete state.floatingPanelVisible[tabId];
});

console.log("NovelSynth background script loaded");
