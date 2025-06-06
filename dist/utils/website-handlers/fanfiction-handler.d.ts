import { BaseWebsiteHandler } from "./BaseWebsiteHandler";
export declare class FanfictionHandler extends BaseWebsiteHandler {
    extractTitle(): string;
    getChapterNavigation(): any;
    formatAfterEnhancement(contentArea: HTMLElement): void;
    /**
     * Find content area specific to FanFiction.net
     */
    findContentArea(): HTMLElement | null;
    /**
     * Get ideal insertion point for UI controls
     * Override from base to provide FanFiction.net-specific placement
     */
    getUIInsertionPoint(contentArea: HTMLElement): {
        element: HTMLElement;
        position: "before" | "after" | "inside";
    };
}
