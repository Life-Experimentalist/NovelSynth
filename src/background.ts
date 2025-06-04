/**
 * NovelSynth Background Script
 * Handles extension lifecycle, context menus, and API coordination
 */

import { StorageManager } from "./utils/StorageManager";

class BackgroundScript {
  constructor() {
    this.setupEventListeners();
    this.setupContextMenus();
  }

  private setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === "install") {
        this.handleFirstInstall();
      } else if (details.reason === "update") {
        this.handleUpdate(details.previousVersion);
      }
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  private setupContextMenus() {
    chrome.contextMenus.create({
      id: "enhance-content",
      title: "Enhance with NovelSynth",
      contexts: ["selection", "page"],
    });

    chrome.contextMenus.create({
      id: "summarize-content",
      title: "Summarize with NovelSynth",
      contexts: ["selection", "page"],
    });
  }

  private handleFirstInstall() {
    // Set default settings
    const defaultSettings = {
      selectedProvider: "gemini",
      selectedModels: {
        enhance: "gemini-1.5-pro",
        summarize: "gemini-1.5-pro",
        analyze: "gemini-1.5-pro",
        suggestions: "gemini-1.5-pro",
      },
      autoDetectContentType: true,
      showWordCount: true,
      showProcessingBanner: true,
      enabledFeatures: ["enhance", "summarize", "analyze"],
    };

    chrome.storage.sync.set(defaultSettings);

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL("welcome.html"),
    });
  }

  private handleUpdate(previousVersion?: string) {
    console.log(
      `NovelSynth updated from ${previousVersion} to ${
        chrome.runtime.getManifest().version
      }`
    );

    // Handle any migration logic here
    if (previousVersion && this.shouldMigrate(previousVersion)) {
      this.migrateSettings();
    }
  }

  private async handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) {
    try {
      switch (message.type) {
        case "GET_SETTINGS":
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;

        case "UPDATE_SETTINGS":
          await this.updateSettings(message.payload);
          sendResponse({ success: true });
          break;

        case "ENHANCE_CONTENT":
          await this.enhanceContent(sender.tab?.id, message.payload);
          sendResponse({ success: true });
          break;

        case "GET_STORAGE_STATS":
          const stats = await StorageManager.getStorageStats();
          sendResponse({ success: true, data: stats });
          break;

        case "CLEAR_STORAGE":
          await StorageManager.clearStoredContent();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: "Unknown message type" });
      }
    } catch (error) {
      console.error("Background script error:", error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async handleContextMenuClick(
    info: chrome.contextMenus.OnClickData,
    tab?: chrome.tabs.Tab
  ) {
    if (!tab?.id) return;

    switch (info.menuItemId) {
      case "enhance-content":
        await chrome.tabs.sendMessage(tab.id, {
          action: "enhanceContent",
          options: {
            useSelection: !!info.selectionText,
            selectedText: info.selectionText,
          },
        });
        break;

      case "summarize-content":
        await chrome.tabs.sendMessage(tab.id, {
          action: "summarizeContent",
          options: {
            useSelection: !!info.selectionText,
            selectedText: info.selectionText,
          },
        });
        break;
    }
  }

  private async getSettings(): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, resolve);
    });
  }

  private async updateSettings(newSettings: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(newSettings, resolve);
    });
  }

  private async enhanceContent(tabId?: number, options?: any): Promise<void> {
    if (!tabId) return;

    await chrome.tabs.sendMessage(tabId, {
      action: "enhanceContent",
      options: options || {},
    });
  }

  private shouldMigrate(previousVersion: string): boolean {
    // Add version comparison logic here
    return false;
  }

  private async migrateSettings(): Promise<void> {
    // Add migration logic here
    console.log("Migrating settings...");
  }
}

// Initialize background script
new BackgroundScript();

console.log("NovelSynth background script loaded");
