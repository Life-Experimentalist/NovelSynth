/**
 * Background script for NovelSynth extension
 * Handles API calls, storage management, and message routing
 */

import StorageManager from "./utils/StorageManager";
import { detectContentType } from "./utils/ContentDetector";

// Define API clients
const apiClients = {
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    completionsEndpoint: "/chat/completions",
    modelsEndpoint: "/models",
    models: [],
  },
  gemini: {
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1",
    completionsEndpoint: "/models/gemini-pro:generateContent",
    modelsEndpoint: "/models",
    models: [],
  },
  claude: {
    name: "Anthropic Claude",
    baseUrl: "https://api.anthropic.com/v1",
    completionsEndpoint: "/messages",
    modelsEndpoint: "/models",
    models: [],
  },
  local: {
    name: "Local Models",
    baseUrl: "http://localhost:11434/api",
    completionsEndpoint: "/generate",
    modelsEndpoint: "/models",
    models: [],
  },
};

// Listen for installation or update
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    console.log("NovelSynth extension installed");
    await initializeDefaultSettings();
  } else if (details.reason === "update") {
    console.log("NovelSynth extension updated");
    await updateSettings();
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  switch (message.action) {
    case "enhanceContent":
      enhanceContent(message.settings)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true; // Keep the message channel open for async response

    case "summarizeContent":
      summarizeContent(message.settings)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "analyzeContent":
      analyzeContent(message.settings)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "fetchModels":
      fetchModels(message.provider)
        .then((models) => sendResponse({ success: true, models }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "testConnection":
      testConnection(message.provider, message.apiKey, message.endpoint)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;

    case "openPopup":
      openPopup();
      sendResponse({ success: true });
      break;

    case "saveToLibrary":
      saveToLibrary(message.data)
        .then(() => sendResponse({ success: true }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;
  }
});

// Add message listener for popup actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "enhanceContent") {
    console.log(
      "Background received enhance content request for tab:",
      request.tabId
    );

    // Get settings
    chrome.storage.sync.get(["settings", "prompts"], (data) => {
      const settings = data.settings || {};
      const prompts = data.prompts || {};

      // Determine content type and get appropriate prompt
      chrome.tabs.sendMessage(
        request.tabId,
        {
          action: "getContentInfo",
        },
        (contentInfo) => {
          const contentType = contentInfo?.type || "general";
          const prompt =
            prompts[contentType]?.enhance ||
            "Enhance this text to improve readability.";

          // Send enhance request to content script
          chrome.tabs.sendMessage(
            request.tabId,
            {
              action: "processContent",
              operation: "enhance",
              settings: settings,
              prompt: prompt,
            },
            (response) => {
              sendResponse(response);
            }
          );
        }
      );
    });

    return true; // Keep the message channel open for async response
  }
});

// Initialize default settings
async function initializeDefaultSettings() {
  const defaultSettings = {
    apiKey: "",
    model: "gpt-4o",
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    chunkingEnabled: true,
    chunkSize: 12000,
    useEmoji: false,
    showBanner: true,
    debugMode: false,
    customEndpoint: "",
    theme: "auto",
    accentColor: "#667eea",
  };

  const defaultPrompts = {
    novels: {
      enhance:
        "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the narrative more engaging and natural-sounding.",
      summary:
        "Summarize this text, focusing on the main plot points, character development, and key events. Keep the summary concise but comprehensive.",
      analysis:
        "Analyze this text focusing on: writing style, character development, plot structure, themes, and overall quality. Provide constructive feedback.",
    },
    news: {
      enhance:
        "Enhance this news article to improve clarity and readability while preserving all factual information. Fix grammar, punctuation, and awkward phrasing. Maintain the journalistic tone.",
      summary:
        "Summarize this news article, focusing on the key facts, main points, and essential details. Keep the summary objective and factual.",
      analysis:
        "Analyze this news article focusing on: clarity of reporting, factual presentation, balance of perspectives, and informational value.",
    },
    learning: {
      enhance:
        "Enhance this educational content to improve clarity and readability while preserving all instructional information. Make complex concepts easier to understand without oversimplifying.",
      summary:
        "Summarize this educational content, focusing on key concepts, main points, and essential information. Structure the summary in a way that facilitates learning.",
      analysis:
        "Analyze this educational content focusing on: clarity of explanation, logical progression, educational value, and engagement level.",
    },
    general: {
      enhance:
        "Enhance this text to improve readability and flow while preserving the original meaning. Fix grammar, punctuation, and awkward phrasing. Make the writing more clear and engaging.",
      summary:
        "Summarize this text, focusing on the main points and key information. Keep the summary concise but comprehensive.",
      analysis:
        "Analyze this text focusing on: clarity, structure, style, and overall effectiveness of communication.",
    },
    permanent:
      'Maintain all formatting from the original text including paragraph breaks, dialogue formatting, and any special text styles. Do not add "enhanced version" labels or any meta-commentary about the changes.',
  };

  // Save default settings and prompts
  try {
    await chrome.storage.sync.set({ settings: defaultSettings });
    await chrome.storage.sync.set({ prompts: defaultPrompts });
    console.log("Default settings and prompts initialized");
  } catch (error) {
    console.error("Error initializing default settings:", error);
  }
}

// Update settings when extension updates
async function updateSettings() {
  try {
    // Get current settings
    const { settings = {} } = await chrome.storage.sync.get("settings");

    // Add any new settings that might be missing
    const updatedSettings = {
      apiKey: settings.apiKey || "",
      model: settings.model || "gpt-4o",
      temperature: settings.temperature || 0.7,
      topP: settings.topP || 0.95,
      topK: settings.topK || 40,
      maxOutputTokens: settings.maxOutputTokens || 8192,
      chunkingEnabled:
        settings.chunkingEnabled !== undefined
          ? settings.chunkingEnabled
          : true,
      chunkSize: settings.chunkSize || 12000,
      useEmoji: settings.useEmoji || false,
      showBanner:
        settings.showBanner !== undefined ? settings.showBanner : true,
      debugMode: settings.debugMode || false,
      customEndpoint: settings.customEndpoint || "",
      theme: settings.theme || "auto",
      accentColor: settings.accentColor || "#667eea",
    };

    // Save updated settings
    await chrome.storage.sync.set({ settings: updatedSettings });
    console.log("Settings updated");
  } catch (error) {
    console.error("Error updating settings:", error);
  }
}

// Enhance content
async function enhanceContent(settings) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs || tabs.length === 0) {
    throw new Error("No active tab found");
  }

  const tabId = tabs[0].id;

  // Get content from the active tab
  const contentResponse = await chrome.tabs.sendMessage(tabId, {
    action: "getPageContent",
  });

  if (!contentResponse || !contentResponse.content) {
    throw new Error("Failed to get page content");
  }

  const content = contentResponse.content;

  // Get settings
  const { settings: storedSettings = {}, prompts = {} } =
    await chrome.storage.sync.get(["settings", "prompts"]);

  // Merge with provided settings
  const mergedSettings = { ...storedSettings, ...settings };

  // Get prompt based on content type
  const contentType = settings?.promptType || "general";
  const enhancePrompt =
    prompts[contentType]?.enhance || prompts.general.enhance;
  const permanentPrompt = prompts.permanent || "";

  // Combine prompts
  const finalPrompt = `${enhancePrompt}\n\n${permanentPrompt}`;

  // Process content through AI (implement the real API call here)
  // For demo purposes, we're returning the original content
  return {
    original: content,
    enhanced: `${content}\n\n[Enhanced version would appear here in real implementation]`,
    promptUsed: finalPrompt,
    model: mergedSettings.model,
    contentType,
  };
}

// Summarize content
async function summarizeContent(settings) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs || tabs.length === 0) {
    throw new Error("No active tab found");
  }

  const tabId = tabs[0].id;

  // Get content from the active tab
  const contentResponse = await chrome.tabs.sendMessage(tabId, {
    action: "getPageContent",
  });

  if (!contentResponse || !contentResponse.content) {
    throw new Error("Failed to get page content");
  }

  const content = contentResponse.content;

  // Get settings
  const { settings: storedSettings = {}, prompts = {} } =
    await chrome.storage.sync.get(["settings", "prompts"]);

  // Merge with provided settings
  const mergedSettings = { ...storedSettings, ...settings };

  // Get prompt based on content type
  const contentType = settings?.promptType || "general";
  const summaryPrompt =
    prompts[contentType]?.summary || prompts.general.summary;

  // Process content through AI (implement the real API call here)
  // For demo purposes, we're returning a mock summary
  return {
    original: content,
    summary: `[Summary would appear here in real implementation]\n\nThis text covers the following key points:\n- Point 1\n- Point 2\n- Point 3`,
    promptUsed: summaryPrompt,
    model: mergedSettings.model,
    contentType,
  };
}

// Analyze content
async function analyzeContent(settings) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs || tabs.length === 0) {
    throw new Error("No active tab found");
  }

  const tabId = tabs[0].id;

  // Get content from the active tab
  const contentResponse = await chrome.tabs.sendMessage(tabId, {
    action: "getPageContent",
  });

  if (!contentResponse || !contentResponse.content) {
    throw new Error("Failed to get page content");
  }

  const content = contentResponse.content;

  // Get settings
  const { settings: storedSettings = {}, prompts = {} } =
    await chrome.storage.sync.get(["settings", "prompts"]);

  // Merge with provided settings
  const mergedSettings = { ...storedSettings, ...settings };

  // Get prompt based on content type
  const contentType = settings?.promptType || "general";
  const analysisPrompt =
    prompts[contentType]?.analysis || prompts.general.analysis;

  // Process content through AI (implement the real API call here)
  // For demo purposes, we're returning a mock analysis
  return {
    original: content,
    analysis: `[Analysis would appear here in real implementation]\n\nStrengths:\n- Point 1\n- Point 2\n\nAreas for Improvement:\n- Point 1\n- Point 2\n\nOverall assessment: This content is well structured but could benefit from more concise language.`,
    promptUsed: analysisPrompt,
    model: mergedSettings.model,
    contentType,
  };
}

// Fetch available models from an API provider
async function fetchModels(provider) {
  // Get API settings
  const { modelConfig = {} } = await chrome.storage.sync.get("modelConfig");

  if (!modelConfig[provider]) {
    throw new Error(`No configuration found for ${provider}`);
  }

  const { apiKey, endpoint } = modelConfig[provider];

  if (!apiKey && provider !== "local") {
    throw new Error(`API key required for ${provider}`);
  }

  const apiClient = apiClients[provider];

  if (!apiClient) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const baseUrl = endpoint || apiClient.baseUrl;
  const url = `${baseUrl}${apiClient.modelsEndpoint}`;

  // For demo purposes, return mock models
  // In a real implementation, you would fetch models from the API
  switch (provider) {
    case "openai":
      return ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"];

    case "gemini":
      return ["gemini-1.0-pro", "gemini-1.0-ultra"];

    case "claude":
      return ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"];

    case "local":
      return ["llama3-8b", "mistral-7b", "vicuna-13b"];

    default:
      return [];
  }
}

// Test connection to an API provider
async function testConnection(provider, apiKey, endpoint) {
  const apiClient = apiClients[provider];

  if (!apiClient) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  if (!apiKey && provider !== "local") {
    throw new Error(`API key required for ${provider}`);
  }

  // For demo purposes, always return success
  // In a real implementation, you would test the connection to the API
  return {
    status: "connected",
    provider: apiClient.name,
    endpoint: endpoint || apiClient.baseUrl,
  };
}

// Open the extension popup
function openPopup() {
  chrome.windows.getCurrent((win) => {
    chrome.action.openPopup({ windowId: win.id });
  });
}

// Save content to library
async function saveToLibrary(data) {
  if (!data || !data.content || !data.url) {
    throw new Error("Invalid data");
  }

  try {
    // Get existing content history
    const { contentHistory = {} } = await chrome.storage.local.get(
      "contentHistory"
    );

    // Add new entry
    contentHistory[data.url] = {
      ...data,
      lastAccessed: Date.now(),
    };

    // Save updated history
    await chrome.storage.local.set({ contentHistory });

    return { success: true, message: "Content saved to library" };
  } catch (error) {
    console.error("Error saving to library:", error);
    throw error;
  }
}
