// NovelSynth Background Service Worker
console.log("NovelSynth background service worker starting...");

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("NovelSynth extension installed successfully");

  // Initialize default settings if needed
  chrome.storage.sync.get(["apiKey"], (result) => {
    if (!result.apiKey) {
      console.log("No API key found, user needs to configure extension");
    }
  });
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log("NovelSynth extension started");
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request.action);

  // Handle ping requests
  if (request.action === "ping") {
    sendResponse({ status: "pong", timestamp: Date.now() });
    return false; // Synchronous response
  }

  // Handle other background tasks
  if (request.action === "getSettings") {
    chrome.storage.sync.get(null, (result) => {
      sendResponse({ success: true, settings: result });
    });
    return true; // Asynchronous response
  }

  // Handle settings save
  if (request.action === "saveSettings") {
    chrome.storage.sync.set(request.settings, () => {
      sendResponse({ success: true });
    });
    return true; // Asynchronous response
  }

  // For unknown actions, respond immediately
  sendResponse({ success: false, error: "Unknown action: " + request.action });
  return false;
});

// Handle action button click (when extension is clicked)
if (chrome.action && chrome.action.onClicked) {
  chrome.action.onClicked.addListener(async (tab) => {
    console.log("Extension icon clicked for tab:", tab.id);

    try {
      // Check if we can access the tab
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://") ||
        tab.url.startsWith("edge://") ||
        tab.url.startsWith("moz-extension://")
      ) {
        console.log("Cannot access special browser pages");
        return;
      }

      // Try to communicate with existing content script first
      try {
        await chrome.tabs.sendMessage(tab.id, { action: "ping" });
        console.log("Content script already active");
      } catch (error) {
        // Content script not active, inject it
        console.log("Injecting content script...");
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });

        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ["content.css"],
        });

        console.log("Content script injected successfully");
      }
    } catch (error) {
      console.error("Failed to handle action click:", error);
    }
  });
} else {
  console.warn("chrome.action.onClicked not available");
}

console.log("NovelSynth background service worker loaded successfully");
