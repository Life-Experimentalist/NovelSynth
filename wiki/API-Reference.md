# API Reference

## 🔌 Core APIs

### StorageManager

The `StorageManager` class handles all data persistence for NovelSynth using Chrome's storage APIs.

#### Methods

```typescript
class StorageManager {
  /**
   * Store enhanced content with metadata
   * @param url - Page URL as unique identifier
   * @param originalContent - Original page content
   * @param enhancedContent - AI-enhanced content
   * @param metadata - Processing metadata
   */
  static async storeContent(
    url: string,
    originalContent: string,
    enhancedContent: string,
    metadata: ContentMetadata
  ): Promise<void>

  /**
   * Retrieve all stored content
   * @returns Record mapping URLs to stored content
   */
  static async getStoredContent(): Promise<Record<string, ContentStorage>>

  /**
   * Clear stored content for specific URL
   * @param url - Target URL to clear
   */
  static async clearStoredContent(url: string): Promise<void>

  /**
   * Get storage usage statistics
   * @returns Storage stats including size and item count
   */
  static async getStorageStats(): Promise<StorageStats>

  /**
   * Clear all stored content (use with caution)
   */
  static async clearAllContent(): Promise<void>
}
```

#### Types

```typescript
interface ContentStorage {
  originalContent: string;      // Original page content
  enhancedContent: string;      // AI-enhanced version
  metadata: ContentMetadata;    // Processing information
  timestamp: string;            // Storage timestamp (ISO format)
}

interface ContentMetadata {
  timestamp: string;            // Processing timestamp
  provider: string;             // AI provider used ('gemini', 'openai', etc.)
  model: string;               // Specific model used
  contentType: ContentType;     // Detected content type
  websiteId: string;           // Website identifier
  processingTime?: number;      // Processing duration (ms)
  wordCount?: number;          // Content word count
  enhancementType?: string;     // Type of enhancement applied
}

interface StorageStats {
  totalItems: number;          // Number of stored items
  totalSize: number;           // Total storage size (bytes)
  lastCleanup: string;         // Last cleanup timestamp
  quota: number;               // Storage quota limit
}
```

#### Usage Examples

```typescript
// Store enhanced content
await StorageManager.storeContent(
  'https://example.com/story',
  'Original story text...',
  'Enhanced story text...',
  {
    timestamp: new Date().toISOString(),
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    contentType: 'novel',
    websiteId: 'fanfiction',
    processingTime: 5420,
    wordCount: 1250
  }
);

// Retrieve stored content
const storedData = await StorageManager.getStoredContent();
const storyData = storedData['https://example.com/story'];

// Check storage usage
const stats = await StorageManager.getStorageStats();
console.log(`Stored ${stats.totalItems} items using ${stats.totalSize} bytes`);
```

---

### AIServiceManager

Orchestrates AI provider interactions and manages multiple services.

#### Methods

```typescript
class AIServiceManager {
  /**
   * Enhance content using configured AI provider
   * @param content - Text content to enhance
   * @param options - Enhancement configuration
   * @returns Processing result with enhanced content
   */
  async enhanceContent(
    content: string,
    options: EnhancementOptions
  ): Promise<ProcessingResult>

  /**
   * Generate content summary
   * @param content - Text content to summarize
   * @param options - Summarization configuration
   * @returns Processing result with summary
   */
  async summarizeContent(
    content: string,
    options: SummarizationOptions
  ): Promise<ProcessingResult>

  /**
   * Analyze content structure and themes
   * @param content - Text content to analyze
   * @returns Content analysis results
   */
  async analyzeContent(content: string): Promise<ContentAnalysis>

  /**
   * Generate content suggestions
   * @param content - Text content for suggestions
   * @param options - Suggestion configuration
   * @returns Processing result with suggestions
   */
  async generateSuggestions(
    content: string,
    options: SuggestionOptions
  ): Promise<ProcessingResult>

  /**
   * Get available AI providers
   * @returns List of configured providers
   */
  getAvailableProviders(): AIProvider[]

  /**
   * Set active AI provider
   * @param providerId - Provider identifier
   */
  setActiveProvider(providerId: string): void

  /**
   * Check if provider is configured and ready
   * @param providerId - Provider to check
   * @returns True if provider is ready
   */
  isProviderReady(providerId: string): Promise<boolean>
}
```

#### Types

```typescript
interface EnhancementOptions {
  enhancementType: EnhancementType;  // Type of enhancement
  contentType?: ContentType;         // Content type hint
  preserveFormatting?: boolean;      // Keep original formatting
  targetLength?: 'shorter' | 'longer' | 'same'; // Length preference
  tone?: 'formal' | 'casual' | 'academic';      // Tone adjustment
  customPrompt?: string;             // Custom enhancement prompt
}

interface ProcessingResult {
  success: boolean;                  // Processing success status
  originalContent?: string;          // Original content
  enhancedContent?: string;          // Enhanced content
  summary?: string;                  // Generated summary
  suggestions?: string[];            // Content suggestions
  metadata?: {                       // Processing metadata
    title?: string;
    contentType?: ContentType;
    timestamp?: string;
    wordCount?: number;
    enhancementType?: string;
  };
  error?: string;                    // Error message if failed
  processingTime?: number;           // Processing duration (ms)
}

interface ContentAnalysis {
  contentType: ContentType;          // Detected content type
  readabilityScore: number;          // Readability rating (1-100)
  themes: string[];                  // Detected themes
  sentiment: 'positive' | 'negative' | 'neutral'; // Content sentiment
  wordCount: number;                 // Total word count
  estimatedReadingTime: number;      // Reading time (minutes)
  suggestions: {                     // Improvement suggestions
    grammar: string[];
    style: string[];
    structure: string[];
  };
}
```

#### Usage Examples

```typescript
const aiManager = new AIServiceManager();

// Enhance content
const result = await aiManager.enhanceContent(
  'This is some content with mistake.',
  {
    enhancementType: 'grammar',
    contentType: 'article',
    preserveFormatting: true,
    tone: 'formal'
  }
);

if (result.success) {
  console.log('Enhanced:', result.enhancedContent);
}

// Analyze content
const analysis = await aiManager.analyzeContent(content);
console.log(`Readability: ${analysis.readabilityScore}/100`);
console.log(`Themes: ${analysis.themes.join(', ')}`);
```

---

### ContentProcessor

Handles content extraction, analysis, and page manipulation.

#### Methods

```typescript
class ContentProcessor {
  /**
   * Process current page content
   * @param options - Processing configuration
   * @returns Processing result
   */
  async processCurrentPage(options: ProcessingOptions): Promise<ProcessingResult>

  /**
   * Check if current page can be processed
   * @returns True if page is supported
   */
  canHandleCurrentPage(): boolean

  /**
   * Replace page content with enhanced version
   * @param content - New content to display
   */
  replacePageContent(content: string): void

  /**
   * Get current content display state
   * @returns True if showing enhanced content
   */
  isShowingEnhanced(): boolean

  /**
   * Set content display state
   * @param enhanced - Whether to show enhanced content
   */
  setShowingEnhanced(enhanced: boolean): void

  /**
   * Extract content from current page
   * @returns Extracted text content
   */
  extractPageContent(): string

  /**
   * Extract page title
   * @returns Page title
   */
  extractPageTitle(): string

  /**
   * Detect content type of current page
   * @returns Detected content type
   */
  detectContentType(): ContentType

  /**
   * Get page metadata
   * @returns Page metadata object
   */
  getPageMetadata(): PageMetadata
}
```

#### Types

```typescript
interface ProcessingOptions {
  enhancementType?: EnhancementType; // Type of processing
  useSelection?: boolean;            // Process selected text only
  selectedText?: string;             // Selected text content
  chunkSize?: number;               // Content chunk size
  preserveFormatting?: boolean;      // Keep original formatting
}

interface PageMetadata {
  title: string;                     // Page title
  url: string;                       // Page URL
  contentType: ContentType;          // Detected content type
  websiteId: string;                // Website identifier
  wordCount: number;                // Content word count
  language?: string;                // Detected language
  author?: string;                  // Content author
  publishDate?: string;             // Publication date
}
```

---

### ProcessingBanner

Provides user feedback during content processing operations.

#### Methods

```typescript
class ProcessingBanner {
  /**
   * Create new processing banner
   * @param config - Banner configuration
   */
  constructor(config: BannerConfig)

  /**
   * Show processing state with spinner
   * @param message - Status message
   */
  showProcessing(message: string): void

  /**
   * Show success state with toggle controls
   * @param message - Success message
   */
  showSuccess(message: string): void

  /**
   * Show error state
   * @param message - Error message
   */
  showError(message: string): void

  /**
   * Update processing progress
   * @param percentage - Progress percentage (0-100)
   * @param message - Progress message
   */
  updateProgress(percentage: number, message?: string): void

  /**
   * Show toggle controls for enhanced content
   */
  showToggleControls(): void

  /**
   * Remove banner from page
   */
  destroy(): void

  /**
   * Check if banner is currently visible
   * @returns True if banner is visible
   */
  isVisible(): boolean
}
```

#### Types

```typescript
interface BannerConfig {
  provider: string;                  // AI provider name
  model: string;                     // AI model name
  showWordCount: boolean;            // Show word count info
  showProcessingBanner: boolean;     // Enable banner display
  position?: 'top' | 'bottom';      // Banner position
  theme?: 'light' | 'dark';         // Visual theme
  autoHide?: number;                // Auto-hide delay (ms)
}
```

#### Usage Examples

```typescript
// Create and show processing banner
const banner = new ProcessingBanner({
  provider: 'gemini',
  model: 'gemini-1.5-pro',
  showWordCount: true,
  showProcessingBanner: true,
  position: 'top',
  theme: 'dark'
});

// Show processing state
banner.showProcessing('Enhancing content with Gemini...');

// Update progress
banner.updateProgress(50, 'Processing chunk 2 of 4...');

// Show success with toggle
banner.showSuccess('Content enhanced! Click to toggle view.');

// Remove banner
banner.destroy();
```

---

## 🎨 Website Handler API

### BaseWebsiteHandler

Abstract base class for site-specific content extraction.

#### Methods to Implement

```typescript
abstract class BaseWebsiteHandler {
  /**
   * Check if handler can process current page
   * @returns True if page is supported
   */
  abstract canHandle(): boolean

  /**
   * Extract main content from page
   * @returns Extracted text content
   */
  abstract extractContent(): string

  /**
   * Extract page title
   * @returns Page title
   */
  abstract extractTitle(): string

  /**
   * Extract page metadata
   * @returns Page metadata
   */
  extractMetadata(): any {
    return {
      websiteId: this.getWebsiteId(),
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format content area after enhancement
   * @param contentArea - Enhanced content element
   */
  formatAfterEnhancement(contentArea: HTMLElement): void {
    // Default formatting - override for site-specific styling
  }

  /**
   * Get website identifier
   * @returns Website ID string
   */
  abstract getWebsiteId(): string
}
```

#### Handler Implementation Example

```typescript
export class CustomSiteHandler extends BaseWebsiteHandler {
  canHandle(): boolean {
    return window.location.hostname.includes('customsite.com');
  }

  extractContent(): string {
    const contentSelector = '.main-content, .story-text, .article-body';
    const contentElement = document.querySelector(contentSelector);
    return contentElement?.textContent?.trim() || '';
  }

  extractTitle(): string {
    const titleElement = document.querySelector('h1.title, .story-title');
    return titleElement?.textContent?.trim() || document.title;
  }

  extractMetadata(): any {
    return {
      ...super.extractMetadata(),
      author: document.querySelector('.author-name')?.textContent,
      category: document.querySelector('.category')?.textContent,
      tags: this.extractTags(),
      chapterInfo: this.getChapterInfo()
    };
  }

  formatAfterEnhancement(contentArea: HTMLElement): void {
    // Apply site-specific styling
    contentArea.style.fontFamily = 'Georgia, serif';
    contentArea.style.lineHeight = '1.8';
    contentArea.style.fontSize = '18px';
  }

  getWebsiteId(): string {
    return 'customsite';
  }

  private extractTags(): string[] {
    const tagElements = document.querySelectorAll('.tag');
    return Array.from(tagElements).map(el => el.textContent?.trim() || '');
  }

  private getChapterInfo(): any {
    // Extract chapter-specific information
    return {
      current: this.getCurrentChapter(),
      total: this.getTotalChapters(),
      hasNext: this.hasNextChapter(),
      hasPrevious: this.hasPreviousChapter()
    };
  }
}
```

---

## 🔧 Extension APIs

### Chrome Extension APIs Used

#### Storage API
```typescript
// Sync storage for settings
chrome.storage.sync.set({ key: value });
chrome.storage.sync.get(['key'], (result) => {});

// Local storage for content
chrome.storage.local.set({ key: value });
chrome.storage.local.get(['key'], (result) => {});
```

#### Runtime API
```typescript
// Message passing
chrome.runtime.sendMessage({ type: 'ACTION', payload: data });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {});

// Extension info
const manifest = chrome.runtime.getManifest();
const extensionId = chrome.runtime.id;
```

#### Tabs API
```typescript
// Query active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {});

// Send message to tab
chrome.tabs.sendMessage(tabId, message, (response) => {});

// Create new tab
chrome.tabs.create({ url: 'https://example.com' });
```

#### Context Menus API
```typescript
// Create context menu
chrome.contextMenus.create({
  id: 'enhance-content',
  title: 'Enhance with NovelSynth',
  contexts: ['selection', 'page']
});

// Handle clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {});
```

### Event System

#### Message Types
```typescript
// Background to Content Script
interface BackgroundMessage {
  action: 'enhanceContent' | 'toggleContent' | 'getStatus';
  options?: any;
}

// Content Script to Background
interface ContentMessage {
  type: 'ENHANCE_CONTENT' | 'GET_SETTINGS' | 'UPDATE_SETTINGS';
  payload?: any;
}

// Popup to Background
interface PopupMessage {
  type: 'GET_SETTINGS' | 'UPDATE_SETTINGS' | 'GET_STORAGE_STATS';
  payload?: any;
}
```

#### Event Handlers
```typescript
// In background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ENHANCE_CONTENT':
      return handleEnhanceContent(message.payload);
    case 'GET_SETTINGS':
      return getSettings();
    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

// In content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'enhanceContent':
      this.handleEnhanceContent(message.options);
      break;
    case 'toggleContent':
      this.handleToggleContent();
      break;
  }
});
```

---

## 📊 Performance Considerations

### Content Chunking
For large content, implement chunking to avoid API limits:

```typescript
private async processLargeContent(content: string): Promise<ProcessingResult> {
  const maxChunkSize = 4000; // tokens
  const chunks = this.splitIntoChunks(content, maxChunkSize);
  const processedChunks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const result = await this.aiService.enhanceContent(chunk, options);

    if (result.success) {
      processedChunks.push(result.enhancedContent || chunk);
    } else {
      processedChunks.push(chunk); // Keep original on failure
    }

    // Update progress
    const progress = ((i + 1) / chunks.length) * 100;
    this.banner?.updateProgress(progress, `Processing chunk ${i + 1} of ${chunks.length}`);
  }

  return {
    success: true,
    enhancedContent: processedChunks.join('\n\n'),
    originalContent: content
  };
}
```

### Caching Strategy
Implement caching to reduce API calls:

```typescript
class CacheManager {
  private static cache = new Map<string, ProcessingResult>();
  private static maxAge = 24 * 60 * 60 * 1000; // 24 hours

  static async getCached(key: string): Promise<ProcessingResult | null> {
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      return cached;
    }
    return null;
  }

  static setCached(key: string, result: ProcessingResult): void {
    this.cache.set(key, {
      ...result,
      cachedAt: Date.now()
    });
  }

  private static isValid(result: any): boolean {
    return (Date.now() - result.cachedAt) < this.maxAge;
  }
}
```