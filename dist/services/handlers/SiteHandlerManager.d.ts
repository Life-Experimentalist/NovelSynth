import type { SiteHandler } from "../../types";
export declare class SiteHandlerManager {
    private handlers;
    private enabledHandlers;
    constructor();
    private initializeHandlers;
    getHandlers(): SiteHandler[];
    getAllHandlers(): SiteHandler[];
    getHandlerForDomain(domain: string): SiteHandler | null;
    enableHandler(handlerName: string): void;
    disableHandler(handlerName: string): void;
    isHandlerEnabled(handlerName: string): boolean;
    updateHandlerSettings(enabledHandlers: string[]): void;
    /**
     * Add a custom handler at runtime
     */
    addCustomHandler(handler: SiteHandler): void;
    /**
     * Remove a handler
     */
    removeHandler(handlerName: string): boolean;
}
