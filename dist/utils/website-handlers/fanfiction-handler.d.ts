import { BaseWebsiteHandler } from "./BaseWebsiteHandler";
export declare class FanfictionHandler extends BaseWebsiteHandler {
    extractTitle(): string;
    getChapterNavigation(): any;
    formatAfterEnhancement(contentArea: HTMLElement): void;
    /**
     * Find content area specific to FanFiction.net
     */
    findContentArea(): HTMLElement | null;
}
