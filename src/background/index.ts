import { AIServiceManager } from "../services/ai/AIServiceManager";
import { SiteHandlerManager } from "../services/handlers/SiteHandlerManager";
import { StorageManager } from "../utils/StorageManager";
import type { ExtensionMessage, ContentAnalysis, AIResponse } from "../types";

class BackgroundService {
  private aiManager: AIServiceManager;
  private handlerManager: SiteHandlerManager;

  constructor() {
    this.aiManager = new AIServiceManager();
    this.handlerManager = new SiteHandlerManager();
    this.init();
  }

  private async init(): Promise<void> {
    // Load user settings and initialize services
    const settings = await StorageManager.getSettings();
    await this.aiManager.loadSettingsAndInitialize(settings);
    this.handlerManager.updateHandlerSettings(settings.enabledHandlers); // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener(
      (
        message: ExtensionMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
      ) => {
        this.handleMessage(message, sender, sendResponse);
        return true; // Keep the message channel open for async response
      }
    );

    // Listen for settings changes
    StorageManager.onSettingsChanged(async (settings) => {
      await this.aiManager.loadSettingsAndInitialize(settings);
      this.handlerManager.updateHandlerSettings(settings.enabledHandlers);
    });

    console.log("NovelSynth background service initialized");
  }

  private async handleMessage(
    message: ExtensionMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<void> {
    try {
      switch (message.type) {
        case "ANALYZE_CONTENT":
          await this.handleAnalyzeContent(message.payload, sendResponse);
          break;
        case "GET_AI_RESPONSE":
          await this.handleGetAIResponse(message.payload, sendResponse);
          break;

        case "GET_AVAILABLE_MODELS":
          await this.handleGetAvailableModels(message.payload, sendResponse);
          break;

        case "GET_SETTINGS":
          await this.handleGetSettings(sendResponse);
          break;

        case "UPDATE_SETTINGS":
          await this.handleUpdateSettings(message.payload, sendResponse);
          break;

        default:
          sendResponse({ error: "Unknown message type" });
      }
    } catch (error) {
      console.error("Error handling message:", error);
      sendResponse({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async handleAnalyzeContent(
    payload: { content: string; url: string },
    sendResponse: (response: any) => void
  ): Promise<void> {
    const { content, url } = payload;
    const domain = new URL(url).hostname;

    // Get appropriate handler for the domain
    const handler = this.handlerManager.getHandlerForDomain(domain);
    const handlers = handler ? [handler] : this.handlerManager.getHandlers();

    // Import ContentDetector dynamically to avoid circular dependencies
    const { ContentDetector } = await import("../utils/ContentDetector");

    // Analyze content
    const analysis = ContentDetector.analyzeContent(handlers);

    sendResponse({
      analysis,
      handler: handler?.name || "Generic",
      success: true,
    });
  }
  private async handleGetAIResponse(
    payload: {
      type: "enhance" | "summarize" | "analyze" | "suggestions";
      content: string;
      options?: any;
    },
    sendResponse: (response: any) => void
  ): Promise<void> {
    const { type, content, options } = payload;

    let response: AIResponse;

    switch (type) {
      case "enhance":
        // Use the enhanced method with basic enhancement prompt
        response = await this.aiManager.enhance(
          content,
          "Enhance this content to improve readability, flow, and overall quality while maintaining the original meaning and style.",
          "enhance",
          options
        );
        break;
      case "summarize":
        response = await this.aiManager.summarize(content, options);
        break;
      case "analyze":
        response = await this.aiManager.analyze(content, options);
        break;
      case "suggestions":
        response = await this.aiManager.generateSuggestions(content, options);
        break;
      default:
        response = { error: "Invalid AI request type" };
    }

    sendResponse({
      response,
      provider: this.aiManager.getCurrentProvider(),
      success: !response.error,
    });
  }

  private async handleGetAvailableModels(
    payload: { providerId?: string },
    sendResponse: (response: any) => void
  ): Promise<void> {
    try {
      const { providerId } = payload;

      if (providerId) {
        const models = this.aiManager.getAvailableModels(providerId);
        sendResponse({ success: true, models });
      } else {
        const allModels = this.aiManager.getAllAvailableModels();
        sendResponse({ success: true, models: allModels });
      }
    } catch (error) {
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private async handleGetSettings(
    sendResponse: (response: any) => void
  ): Promise<void> {
    const settings = await StorageManager.getSettings();
    const providers = this.aiManager.getAvailableProviders();
    const handlers = this.handlerManager.getAllHandlers();

    sendResponse({
      settings,
      providers,
      handlers,
      success: true,
    });
  }

  private async handleUpdateSettings(
    payload: any,
    sendResponse: (response: any) => void
  ): Promise<void> {
    const success = await StorageManager.saveSettings(payload);

    if (success) {
      // Reinitialize services with new settings
      const settings = await StorageManager.getSettings();
      await this.aiManager.loadSettingsAndInitialize(settings);
      this.handlerManager.updateHandlerSettings(settings.enabledHandlers);
    }

    sendResponse({ success });
  }
}

// Initialize the background service
new BackgroundService();
