/**
 * NovelSynth Popup Interface
 * Main user interface for the browser extension
 */
interface PopupElements {
    enhanceBtn: HTMLButtonElement;
    summarizeBtn: HTMLButtonElement;
    toggleBtn: HTMLButtonElement;
    statusDiv: HTMLDivElement;
    settingsBtn: HTMLButtonElement;
    storageInfo: HTMLDivElement;
}
declare class PopupInterface {
    private elements;
    private currentTab?;
    constructor();
    private initializeElements;
    private setupEventListeners;
    private loadCurrentTab;
    private updateStatus;
    private enhanceContent;
    private summarizeContent;
    private toggleContent;
    private showStatus;
    private loadStorageInfo;
    private formatBytes;
    private openSettings;
}
