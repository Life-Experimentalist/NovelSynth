import type { SiteHandler } from "../../types";
import { fanfictionHandler } from "./fanfiction";
import { archiveOfOurOwnHandler } from "./archiveOfOurOwn";
import { royalRoadHandler } from "./royalRoad";
import { webnovelHandler } from "./webnovel";
import { geeksForGeeksHandler } from "./geeksForGeeks";
import { mediumHandler } from "./medium";
import { genericNewsHandler } from "./genericNews";

export class SiteHandlerManager {
  private handlers: SiteHandler[] = [];
  private enabledHandlers: Set<string> = new Set();

  constructor() {
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    this.handlers = [
      fanfictionHandler,
      archiveOfOurOwnHandler,
      royalRoadHandler,
      webnovelHandler,
      geeksForGeeksHandler,
      mediumHandler,
      genericNewsHandler,
    ].sort((a, b) => b.priority - a.priority); // Sort by priority descending

    // Enable all handlers by default
    this.handlers.forEach((handler) => {
      if (handler.isEnabled) {
        this.enabledHandlers.add(handler.name);
      }
    });
  }

  getHandlers(): SiteHandler[] {
    return this.handlers.filter((handler) =>
      this.enabledHandlers.has(handler.name)
    );
  }

  getAllHandlers(): SiteHandler[] {
    return [...this.handlers];
  }

  getHandlerForDomain(domain: string): SiteHandler | null {
    const enabledHandlers = this.getHandlers();

    for (const handler of enabledHandlers) {
      for (const handlerDomain of handler.domains) {
        if (domain.includes(handlerDomain) || handlerDomain.includes(domain)) {
          return handler;
        }
      }
    }

    return null;
  }

  enableHandler(handlerName: string): void {
    const handler = this.handlers.find((h) => h.name === handlerName);
    if (handler) {
      this.enabledHandlers.add(handlerName);
    }
  }

  disableHandler(handlerName: string): void {
    this.enabledHandlers.delete(handlerName);
  }

  isHandlerEnabled(handlerName: string): boolean {
    return this.enabledHandlers.has(handlerName);
  }

  updateHandlerSettings(enabledHandlers: string[]): void {
    this.enabledHandlers.clear();
    enabledHandlers.forEach((name) => this.enabledHandlers.add(name));
  }

  /**
   * Add a custom handler at runtime
   */
  addCustomHandler(handler: SiteHandler): void {
    // Check if handler with same name already exists
    const existingIndex = this.handlers.findIndex(
      (h) => h.name === handler.name
    );

    if (existingIndex >= 0) {
      // Replace existing handler
      this.handlers[existingIndex] = handler;
    } else {
      // Add new handler
      this.handlers.push(handler);
      // Re-sort by priority
      this.handlers.sort((a, b) => b.priority - a.priority);
    }

    if (handler.isEnabled) {
      this.enabledHandlers.add(handler.name);
    }
  }

  /**
   * Remove a handler
   */
  removeHandler(handlerName: string): boolean {
    const index = this.handlers.findIndex((h) => h.name === handlerName);
    if (index >= 0) {
      this.handlers.splice(index, 1);
      this.enabledHandlers.delete(handlerName);
      return true;
    }
    return false;
  }
}
