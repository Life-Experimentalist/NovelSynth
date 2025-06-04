/**
 * Cross-browser compatibility layer for extension APIs
 * Handles differences between Chrome and Firefox extension APIs
 * Both browsers now support Manifest V3 with unified API access
 */

// Type declarations for browser APIs
declare const browser: any;
declare const chrome: any;

// Detect browser type - Firefox supports both 'browser' and 'chrome' API in MV3
const isFirefox =
  typeof browser !== "undefined" && browser?.runtime && !window.chrome;
const isChrome = typeof chrome !== "undefined" && chrome?.runtime;

// Use appropriate API - Firefox prefers 'browser', Chrome uses 'chrome'
const extensionAPI = isFirefox ? browser : chrome;

/**
 * Cross-browser storage wrapper
 */
export class CrossBrowserStorage {
  static async set(data: Record<string, any>): Promise<void> {
    if (isFirefox) {
      return browser.storage.local.set(data);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.set(data, resolve);
      });
    }
  }

  static async get(
    keys?: string | string[] | Record<string, any> | null
  ): Promise<any> {
    if (isFirefox) {
      return browser.storage.local.get(keys);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(keys || null, resolve);
      });
    }
  }

  static async remove(keys: string | string[]): Promise<void> {
    if (isFirefox) {
      return browser.storage.local.remove(keys);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.remove(keys, resolve);
      });
    }
  }

  static async clear(): Promise<void> {
    if (isFirefox) {
      return browser.storage.local.clear();
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.clear(resolve);
      });
    }
  }
}

/**
 * Cross-browser runtime wrapper
 */
export class CrossBrowserRuntime {
  static sendMessage(message: any): Promise<any> {
    if (isFirefox) {
      return browser.runtime.sendMessage(message);
    } else {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response: any) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    }
  }

  static onMessage(
    callback: (
      message: any,
      sender: any,
      sendResponse: (response: any) => void
    ) => void
  ): void {
    if (isFirefox) {
      browser.runtime.onMessage.addListener(callback);
    } else {
      chrome.runtime.onMessage.addListener(callback);
    }
  }

  static getURL(path: string): string {
    if (isFirefox) {
      return browser.runtime.getURL(path);
    } else {
      return chrome.runtime.getURL(path);
    }
  }
}

/**
 * Cross-browser tabs wrapper
 */
export class CrossBrowserTabs {
  static async query(queryInfo: any): Promise<any[]> {
    if (isFirefox) {
      return browser.tabs.query(queryInfo);
    } else {
      return new Promise((resolve) => {
        chrome.tabs.query(queryInfo, resolve);
      });
    }
  }

  static async sendMessage(tabId: number, message: any): Promise<any> {
    if (isFirefox) {
      return browser.tabs.sendMessage(tabId, message);
    } else {
      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, message, (response: any) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    }
  }
}

/**
 * Cross-browser context menus wrapper
 */
export class CrossBrowserContextMenus {
  static create(createProperties: any): void {
    if (isFirefox) {
      browser.contextMenus.create(createProperties);
    } else {
      chrome.contextMenus.create(createProperties);
    }
  }

  static onClicked(callback: (info: any, tab: any) => void): void {
    if (isFirefox) {
      browser.contextMenus.onClicked.addListener(callback);
    } else {
      chrome.contextMenus.onClicked.addListener(callback);
    }
  }

  static removeAll(): Promise<void> {
    if (isFirefox) {
      return browser.contextMenus.removeAll();
    } else {
      return new Promise((resolve) => {
        chrome.contextMenus.removeAll(resolve);
      });
    }
  }
}

// Export the appropriate API
export { extensionAPI };
export const getBrowser = () => (isFirefox ? "firefox" : "chrome");
export const isExtensionContext = () => isFirefox || isChrome;
