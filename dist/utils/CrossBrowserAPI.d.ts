/**
 * Cross-browser compatibility layer for extension APIs
 * Handles differences between Chrome and Firefox extension APIs
 * Both browsers now support Manifest V3 with unified API access
 */
declare const extensionAPI: any;
/**
 * Cross-browser storage wrapper
 */
export declare class CrossBrowserStorage {
    static set(data: Record<string, any>): Promise<void>;
    static get(keys?: string | string[] | Record<string, any> | null): Promise<any>;
    static remove(keys: string | string[]): Promise<void>;
    static clear(): Promise<void>;
}
/**
 * Cross-browser runtime wrapper
 */
export declare class CrossBrowserRuntime {
    static sendMessage(message: any): Promise<any>;
    static onMessage(callback: (message: any, sender: any, sendResponse: (response: any) => void) => void): void;
    static getURL(path: string): string;
}
/**
 * Cross-browser tabs wrapper
 */
export declare class CrossBrowserTabs {
    static query(queryInfo: any): Promise<any[]>;
    static sendMessage(tabId: number, message: any): Promise<any>;
}
/**
 * Cross-browser context menus wrapper
 */
export declare class CrossBrowserContextMenus {
    static create(createProperties: any): void;
    static onClicked(callback: (info: any, tab: any) => void): void;
    static removeAll(): Promise<void>;
}
export { extensionAPI };
export declare const getBrowser: () => "firefox" | "chrome";
export declare const isExtensionContext: () => any;
