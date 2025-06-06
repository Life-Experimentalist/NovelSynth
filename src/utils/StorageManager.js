/**
 * StorageManager utility for handling extension storage
 * Provides functions for getting and setting items in storage
 */
class StorageManager {
  /**
   * Get an item from storage
   * @param {string} key - The key to get
   * @returns {Promise<any>} - The stored value
   */
  static async getItem(key) {
    console.log("Getting item from storage:", key);
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        console.log("Retrieved item:", key, result[key]);
        resolve(result[key]);
      });
    });
  }
  /**
   * Set an item in storage
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  static async setItem(key, value) {
    console.log("Setting item in storage:", key, value);
    return new Promise((resolve) => {
      const data = {};
      data[key] = value;
      chrome.storage.sync.set(data, () => {
        console.log("Item set successfully:", key);
        resolve();
      });
    });
  }

  /**
   * Remove an item from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  static async removeItem(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(key, () => {
        resolve();
      });
    });
  }

  /**
   * Get all settings
   * @returns {Promise<Object>} - All settings
   */
  static async getSettings() {
    console.log("Getting all settings");
    const settings = (await this.getItem("settings")) || {};
    console.log("Retrieved settings:", settings);
    return settings;
  }

  /**
   * Save all settings
   * @param {Object} settings - The settings object to save
   * @returns {Promise<void>}
   */
  static async saveSettings(settings) {
    console.log("Saving settings:", settings);
    return this.setItem("settings", settings);
  }

  /**
   * Get local storage item (for larger data)
   * @param {string} key - The key to get
   * @returns {Promise<any>} - The stored value
   */
  static async getLocalItem(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }

  /**
   * Set local storage item (for larger data)
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  static async setLocalItem(key, value) {
    return new Promise((resolve) => {
      const data = {};
      data[key] = value;
      chrome.storage.local.set(data, () => {
        resolve();
      });
    });
  }

  /**
   * Get content history
   * @returns {Promise<Object>} - Content history object
   */
  static async getContentHistory() {
    return this.getLocalItem("contentHistory") || {};
  }

  /**
   * Add item to content history
   * @param {string} url - The URL of the content
   * @param {Object} data - The content data
   * @returns {Promise<void>}
   */
  static async addToContentHistory(url, data) {
    const history = await this.getContentHistory();
    history[url] = {
      ...history[url],
      ...data,
      lastAccessed: Date.now(),
    };
    return this.setLocalItem("contentHistory", history);
  }

  /**
   * Get cached result for URL
   * @param {string} url - The URL to get cached result for
   * @returns {Promise<Object|null>} - The cached result or null
   */
  static async getCachedResult(url) {
    const history = await this.getContentHistory();
    return history[url]?.result || null;
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  static async clearAll() {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        chrome.storage.local.clear(() => {
          resolve();
        });
      });
    });
  }

  /**
   * Get storage usage information
   * @returns {Promise<Object>} - Storage usage information
   */
  static async getStorageUsage() {
    return new Promise((resolve) => {
      chrome.storage.sync.getBytesInUse(null, (syncBytes) => {
        chrome.storage.local.getBytesInUse(null, (localBytes) => {
          resolve({
            sync: {
              bytesUsed: syncBytes,
              bytesTotal: chrome.storage.sync.QUOTA_BYTES,
              percentUsed: (syncBytes / chrome.storage.sync.QUOTA_BYTES) * 100,
            },
            local: {
              bytesUsed: localBytes,
              bytesTotal: chrome.storage.local.QUOTA_BYTES,
              percentUsed:
                (localBytes / chrome.storage.local.QUOTA_BYTES) * 100,
            },
          });
        });
      });
    });
  }
}

export default StorageManager;
