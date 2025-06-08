// Background script for NovelSynth extension

console.log("NovelSynth background script loaded");

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed/updated:", details.reason);

  if (details.reason === "install") {
    // Set up default configuration
    chrome.storage.local.set({
      "novelsynth-storage": {
        services: {},
        features: {},
        ui: {
          recentFeatures: [],
          floatingPopupEnabled: true,
        },
        prompts: {},
      },
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  switch (message.action) {
    case "processAIRequest":
      handleAIRequest(message.data)
        .then((response) => sendResponse({ success: true, data: response }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true; // Keep message channel open for async response

    case "getContentInfo":
      getContentInfo(sender.tab?.id)
        .then((response) => sendResponse({ success: true, data: response }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    default:
      console.warn("Unknown message action:", message.action);
  }
});

// AI request processing
async function handleAIRequest(requestData: any) {
  try {
    // This would typically involve:
    // 1. Getting the selected AI service configuration
    // 2. Preparing the request
    // 3. Making the API call
    // 4. Returning the response

    console.log("Processing AI request:", requestData);

    // For now, return a mock response
    return {
      result:
        "This is a mock AI response. The actual implementation will process the request with the configured AI service.",
      usage: {
        inputTokens: 100,
        outputTokens: 50,
      },
    };
  } catch (error) {
    console.error("AI request processing error:", error);
    throw error;
  }
}

// Get content information from active tab
async function getContentInfo(tabId?: number) {
  if (!tabId) {
    throw new Error("No tab ID provided");
  }

  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        return {
          url: window.location.href,
          title: document.title,
          domain: window.location.hostname,
        };
      },
    });

    return results[0]?.result || null;
  } catch (error) {
    console.error("Content info extraction error:", error);
    throw error;
  }
}

// Context menu setup (optional)
chrome.runtime.onStartup.addListener(() => {
  setupContextMenus();
});

function setupContextMenus() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "novelsynth-enhance",
      title: "Enhance with NovelSynth",
      contexts: ["selection"],
    });

    chrome.contextMenus.create({
      id: "novelsynth-summarize",
      title: "Summarize with NovelSynth",
      contexts: ["selection"],
    });
  });
}

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;

  switch (info.menuItemId) {
    case "novelsynth-enhance":
      chrome.tabs.sendMessage(tab.id, {
        action: "executeFeature",
        featureId: "enhance",
        selectedText: info.selectionText,
      });
      break;

    case "novelsynth-summarize":
      chrome.tabs.sendMessage(tab.id, {
        action: "executeFeature",
        featureId: "summarize",
        selectedText: info.selectionText,
      });
      break;
  }
});

export {};
