import type {
  UserSettings,
  CustomPrompts,
  ContentStorage,
  ContentToggleState,
  StorageStats,
  ContentType,
} from "../types";

export class StorageManager {
  private static readonly STORAGE_KEY = "novelsynth_settings";
  private static readonly CONTENT_STORAGE_KEY = "novelsynth_content";
  private static readonly DEFAULT_SETTINGS: UserSettings = {
    selectedProvider: "gemini",
    selectedModels: {
      enhance: "gemini-1.5-flash",
      summarize: "gemini-1.5-flash",
      analyze: "gemini-1.5-flash",
      suggestions: "gemini-1.5-flash",
    },
    apiKeys: {},
    enabledFeatures: ["summarize", "analyze", "suggestions", "enhance"],
    enabledHandlers: [
      "FanFiction.Net",
      "Archive of Our Own",
      "Royal Road",
      "WebNovel.com",
      "GeeksforGeeks",
      "Medium",
      "Generic News",
    ],
    theme: "auto",
    customPrompts: {
      enhancement: {},
      summary: {},
      permanent: {},
      website: {},
      novel: {},
    },
    autoDetectContentType: true,
    showWordCount: true,
    showProcessingBanner: true,
    rateLimiting: {
      enabled: true,
      waitTime: 1000,
      retryAttempts: 3,
    },
  };

  static async getSettings(): Promise<UserSettings> {
    try {
      const result = await chrome.storage.sync.get(this.STORAGE_KEY);
      const stored = result[this.STORAGE_KEY];

      if (stored) {
        // Merge with defaults to ensure all properties exist
        return { ...this.DEFAULT_SETTINGS, ...stored };
      }

      return this.DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings:", error);
      return this.DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };

      await chrome.storage.sync.set({
        [this.STORAGE_KEY]: updatedSettings,
      });

      return true;
    } catch (error) {
      console.error("Failed to save settings:", error);
      return false;
    }
  }

  static async updateApiKey(
    provider: string,
    apiKey: string
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      settings.apiKeys[provider] = apiKey;
      return await this.saveSettings(settings);
    } catch (error) {
      console.error("Failed to update API key:", error);
      return false;
    }
  }

  static async removeApiKey(provider: string): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      delete settings.apiKeys[provider];
      return await this.saveSettings(settings);
    } catch (error) {
      console.error("Failed to remove API key:", error);
      return false;
    }
  }

  static async setSelectedProvider(provider: string): Promise<boolean> {
    return await this.saveSettings({ selectedProvider: provider });
  }

  static async setSelectedModel(
    featureType: keyof UserSettings["selectedModels"],
    modelId: string
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const updatedModels = {
        ...settings.selectedModels,
        [featureType]: modelId,
      };
      return await this.saveSettings({ selectedModels: updatedModels });
    } catch (error) {
      console.error("Failed to set selected model:", error);
      return false;
    }
  }

  static async setSelectedModels(
    models: Partial<UserSettings["selectedModels"]>
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const updatedModels = {
        ...settings.selectedModels,
        ...models,
      };
      return await this.saveSettings({ selectedModels: updatedModels });
    } catch (error) {
      console.error("Failed to set selected models:", error);
      return false;
    }
  }

  static async setCustomPrompt(
    promptType: keyof CustomPrompts,
    promptKey: string,
    promptValue: string
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const currentPrompts = settings.customPrompts || {
        enhancement: {},
        summary: {},
        permanent: {},
        website: {},
        novel: {},
      };

      const updatedPrompts = {
        ...currentPrompts,
      };

      updatedPrompts[promptType] = {
        ...currentPrompts[promptType],
        [promptKey]: promptValue,
      };

      return await this.saveSettings({ customPrompts: updatedPrompts });
    } catch (error) {
      console.error("Failed to set custom prompt:", error);
      return false;
    }
  }

  static async removeCustomPrompt(
    promptType: keyof CustomPrompts,
    promptKey: string
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      if (!settings.customPrompts) return true;

      const updatedPrompts = {
        ...settings.customPrompts,
      };

      updatedPrompts[promptType] = {
        ...settings.customPrompts[promptType],
      };

      delete updatedPrompts[promptType][promptKey];

      return await this.saveSettings({ customPrompts: updatedPrompts });
    } catch (error) {
      console.error("Failed to remove custom prompt:", error);
      return false;
    }
  }

  static async setRateLimitingSettings(
    rateLimiting: Partial<UserSettings["rateLimiting"]>
  ): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const updatedRateLimiting = {
        ...settings.rateLimiting,
        ...rateLimiting,
      };
      return await this.saveSettings({ rateLimiting: updatedRateLimiting });
    } catch (error) {
      console.error("Failed to set rate limiting settings:", error);
      return false;
    }
  }

  static async setContentDetectionSettings(settings: {
    autoDetectContentType?: boolean;
    showWordCount?: boolean;
    showProcessingBanner?: boolean;
  }): Promise<boolean> {
    return await this.saveSettings(settings);
  }

  static async toggleFeature(feature: string): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const enabledFeatures = [...settings.enabledFeatures];

      const index = enabledFeatures.indexOf(feature);
      if (index >= 0) {
        enabledFeatures.splice(index, 1);
      } else {
        enabledFeatures.push(feature);
      }

      return await this.saveSettings({ enabledFeatures });
    } catch (error) {
      console.error("Failed to toggle feature:", error);
      return false;
    }
  }

  static async toggleHandler(handler: string): Promise<boolean> {
    try {
      const settings = await this.getSettings();
      const enabledHandlers = [...settings.enabledHandlers];

      const index = enabledHandlers.indexOf(handler);
      if (index >= 0) {
        enabledHandlers.splice(index, 1);
      } else {
        enabledHandlers.push(handler);
      }

      return await this.saveSettings({ enabledHandlers });
    } catch (error) {
      console.error("Failed to toggle handler:", error);
      return false;
    }
  }

  static async clearAllData(): Promise<boolean> {
    try {
      await chrome.storage.sync.remove(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to clear data:", error);
      return false;
    }
  }

  // Listen for storage changes
  static onSettingsChanged(callback: (settings: UserSettings) => void): void {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "sync" && changes[this.STORAGE_KEY]) {
        const newSettings = changes[this.STORAGE_KEY].newValue;
        if (newSettings) {
          callback({ ...this.DEFAULT_SETTINGS, ...newSettings });
        }
      }
    });
  }
  /**
   * Store enhanced content with original for toggle functionality
   */
  static async storeContent(
    pageUrl: string,
    originalContent: string,
    enhancedContent: string,
    metadata: {
      timestamp: string;
      provider: string;
      model: string;
      contentType: ContentType;
      processingTime?: number;
      websiteId: string;
    }
  ): Promise<boolean> {
    try {
      const contentStorage: ContentStorage = {
        pageUrl,
        originalContent,
        enhancedContent,
        timestamp: Date.now(),
        contentHash: this.generateContentHash(originalContent),
        contentType: metadata.contentType as ContentType,
        websiteId: metadata.websiteId,
      };

      const existing = await this.getStoredContent();
      existing[pageUrl] = contentStorage;

      // Keep only the most recent 50 entries to manage storage
      const entries = Object.entries(existing);
      if (entries.length > 50) {
        const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const limited = Object.fromEntries(sorted.slice(0, 50));
        await chrome.storage.local.set({ [this.CONTENT_STORAGE_KEY]: limited });
      } else {
        await chrome.storage.local.set({
          [this.CONTENT_STORAGE_KEY]: existing,
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to store content:", error);
      return false;
    }
  }

  /**
   * Retrieve stored content for a URL
   */
  static async getStoredContentForUrl(
    pageUrl: string
  ): Promise<ContentStorage | null> {
    try {
      const stored = await this.getStoredContent();
      return stored[pageUrl] || null;
    } catch (error) {
      console.error("Failed to retrieve content:", error);
      return null;
    }
  }

  /**
   * Get all stored content
   */
  static async getStoredContent(): Promise<Record<string, ContentStorage>> {
    try {
      const result = await chrome.storage.local.get(this.CONTENT_STORAGE_KEY);
      return result[this.CONTENT_STORAGE_KEY] || {};
    } catch (error) {
      console.error("Failed to get stored content:", error);
      return {};
    }
  }

  /**
   * Clear stored content for a URL or all content
   */
  static async clearStoredContent(pageUrl?: string): Promise<boolean> {
    try {
      if (pageUrl) {
        const stored = await this.getStoredContent();
        delete stored[pageUrl];
        await chrome.storage.local.set({ [this.CONTENT_STORAGE_KEY]: stored });
      } else {
        await chrome.storage.local.remove(this.CONTENT_STORAGE_KEY);
      }
      return true;
    } catch (error) {
      console.error("Failed to clear stored content:", error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats(): Promise<StorageStats> {
    try {
      const stored = await this.getStoredContent();
      const entries = Object.values(stored);

      const totalSize = JSON.stringify(stored).length;
      const totalItems = entries.length;
      const oldestItem = entries.reduce(
        (oldest, current) =>
          current.timestamp < oldest.timestamp ? current : oldest,
        entries[0]
      );
      const newestItem = entries.reduce(
        (newest, current) =>
          current.timestamp > newest.timestamp ? current : newest,
        entries[0]
      );

      return {
        totalSize,
        totalItems,
        oldestItem: oldestItem?.timestamp || undefined,
        newestItem: newestItem?.timestamp || undefined,
      };
    } catch (error) {
      console.error("Failed to get storage stats:", error);
      return {
        totalSize: 0,
        totalItems: 0,
      };
    }
  }

  /**
   * Manage content toggle state for a specific URL
   */
  static async setToggleState(
    pageUrl: string,
    isShowingEnhanced: boolean
  ): Promise<boolean> {
    try {
      const toggleStates = await this.getToggleStates();
      const content = await this.getStoredContentForUrl(pageUrl);

      toggleStates[pageUrl] = {
        isShowingEnhanced,
        hasEnhancedContent: !!content?.enhancedContent,
        hasSummary: !!content?.summary,
        isProcessing: false,
      };

      await chrome.storage.local.set({
        novelsynth_toggle_states: toggleStates,
      });
      return true;
    } catch (error) {
      console.error("Failed to set toggle state:", error);
      return false;
    }
  }

  /**
   * Get toggle state for a URL
   */
  static async getToggleState(
    pageUrl: string
  ): Promise<ContentToggleState | null> {
    try {
      const toggleStates = await this.getToggleStates();
      return toggleStates[pageUrl] || null;
    } catch (error) {
      console.error("Failed to get toggle state:", error);
      return null;
    }
  }

  /**
   * Get all toggle states
   */
  static async getToggleStates(): Promise<Record<string, ContentToggleState>> {
    try {
      const result = await chrome.storage.local.get("novelsynth_toggle_states");
      return result["novelsynth_toggle_states"] || {};
    } catch (error) {
      console.error("Failed to get toggle states:", error);
      return {};
    }
  }

  /**
   * Generate a simple hash for content to detect changes
   */
  private static generateContentHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}
