# Developer Documentation

## 🏗️ Architecture Overview

NovelSynth follows a modular, event-driven architecture designed for extensibility and maintainability.

### Core Components

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Background    │  Content Script │     Popup       │
│   Service       │                 │   Interface     │
├─────────────────┼─────────────────┼─────────────────┤
│ • Lifecycle Mgmt│ • Page Analysis │ • User Controls │
│ • API Requests  │ • Content Inject│ • Settings UI   │
│ • Context Menus │ • Enhancement   │ • Status Display│
│ • Message Hub   │ • Toggle System │ • Action Buttons│
└─────────────────┴─────────────────┴─────────────────┘
           │                │                │
           └────────────────┼────────────────┘
                            │
     ┌─────────────────────────────────────────────┐
     │            Shared Services                  │
     ├─────────────────────────────────────────────┤
     │ • AIServiceManager  • StorageManager        │
     │ • ContentProcessor  • ProcessingBanner      │
     │ • WebsiteHandlers   • SettingsManager       │
     └─────────────────────────────────────────────┘
```

### File Structure

```
src/
├── background.ts              # Extension service worker
├── content.ts                 # Content script injection
├── popup.ts                   # Popup interface logic
├── services/                  # Service layer
│   ├── ai/                   # AI provider integrations
│   │   ├── BaseAIService.ts  # Abstract AI service
│   │   ├── GeminiService.ts  # Google Gemini impl.
│   │   ├── OpenAIService.ts  # OpenAI impl.
│   │   └── AIServiceManager.ts # Service coordinator
│   └── storage/              # Data persistence
│       └── StorageManager.ts # Chrome storage wrapper
├── utils/                    # Utility classes
│   ├── ContentProcessor.ts   # Content analysis & processing
│   ├── ProcessingBanner.ts   # UI feedback component
│   ├── SettingsManager.ts    # Configuration management
│   └── website-handlers/     # Site-specific extractors
│       ├── BaseWebsiteHandler.ts
│       ├── FanfictionHandler.ts
│       └── [other handlers]
├── types/                    # TypeScript definitions
│   └── index.ts             # Global type exports
└── popup/                   # React popup components
    ├── index.tsx           # Entry point
    ├── Popup.tsx           # Main component
    └── components/         # UI components
```

## 🔧 Core Classes

### Background Script

**Purpose**: Extension lifecycle management and inter-component communication

```typescript
class BackgroundScript {
  private setupEventListeners(): void {
    // Installation/update handling
    chrome.runtime.onInstalled.addListener(this.handleInstall);

    // Message routing
    chrome.runtime.onMessage.addListener(this.handleMessage);

    // Context menu management
    chrome.contextMenus.onClicked.addListener(this.handleContextMenu);
  }

  private async handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): Promise<void> {
    switch (message.type) {
      case 'ENHANCE_CONTENT':
        return this.enhanceContent(sender.tab?.id, message.payload);
      case 'GET_SETTINGS':
        return this.getSettings();
      // ... other message types
    }
  }
}
```

### Content Script

**Purpose**: Page content detection, extraction, and manipulation

```typescript
class ContentScript {
  private contentProcessor: ContentProcessor;
  private processingBanner: ProcessingBanner | null = null;

  async handleEnhanceContent(options: EnhancementOptions): Promise<void> {
    // 1. Show processing banner
    this.processingBanner = new ProcessingBanner(config);

    // 2. Process content through AI service
    const result = await this.contentProcessor.processCurrentPage(options);

    // 3. Store and display enhanced content
    if (result.success) {
      await StorageManager.storeContent(url, original, enhanced, metadata);
      this.showToggleBanner();
    }
  }

  async handleToggleContent(): Promise<void> {
    // Switch between original and enhanced content
    const storedData = await StorageManager.getStoredContent();
    const isEnhanced = this.contentProcessor.isShowingEnhanced();

    if (isEnhanced) {
      this.contentProcessor.replacePageContent(storedData.originalContent);
    } else {
      this.contentProcessor.replacePageContent(storedData.enhancedContent);
    }
  }
}
```

### AI Service Manager

**Purpose**: Abstract AI provider interactions and handle multiple services

```typescript
class AIServiceManager {
  private services: Map<string, BaseAIService> = new Map();
  private currentProvider: string = 'gemini';

  async enhanceContent(
    content: string,
    options: EnhancementOptions
  ): Promise<ProcessingResult> {
    const service = this.services.get(this.currentProvider);
    if (!service) throw new Error('No AI service available');

    // Add retry logic and error handling
    try {
      return await service.enhanceContent(content, options);
    } catch (error) {
      // Fallback to secondary provider if available
      return this.retryWithFallback(content, options, error);
    }
  }

  private async retryWithFallback(
    content: string,
    options: EnhancementOptions,
    originalError: Error
  ): Promise<ProcessingResult> {
    const fallbackProviders = this.getFallbackProviders();

    for (const provider of fallbackProviders) {
      try {
        const service = this.services.get(provider);
        return await service.enhanceContent(content, options);
      } catch (fallbackError) {
        console.warn(`Fallback provider ${provider} failed:`, fallbackError);
      }
    }

    throw originalError; // All providers failed
  }
}
```

## 🔌 Adding New Features

### Adding AI Providers

#### 1. Create Service Class

```typescript
// src/services/ai/ClaudeService.ts
export class ClaudeService extends BaseAIService {
  provider: AIProvider = {
    name: "Anthropic Claude",
    id: "claude",
    apiEndpoint: "https://api.anthropic.com/v1",
    requiresAuth: true,
    authType: "api_key",
    features: ["enhance", "summarize", "analyze"],
    models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
    defaultModel: "claude-3-sonnet"
  };

  async enhanceContent(
    content: string,
    options: EnhancementOptions
  ): Promise<ProcessingResult> {
    const apiKey = await this.getApiKey();

    const response = await fetch(`${this.provider.apiEndpoint}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.provider.defaultModel,
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: this.buildEnhancementPrompt(content, options)
          }
        ]
      })
    });

    return this.parseResponse(await response.json());
  }

  private buildEnhancementPrompt(
    content: string,
    options: EnhancementOptions
  ): string {
    return `Please enhance this content by improving ${options.enhancementType}:

${content}

Please maintain the original meaning and structure while making improvements.`;
  }
}
```

#### 2. Register in AIServiceManager

```typescript
// src/services/ai/AIServiceManager.ts
constructor() {
  this.services.set('gemini', new GeminiService());
  this.services.set('openai', new OpenAIService());
  this.services.set('claude', new ClaudeService()); // Add new service
}
```

#### 3. Update UI Options

```typescript
// src/popup/components/ProviderSelector.tsx
const AVAILABLE_PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini', icon: '🤖' },
  { id: 'openai', name: 'OpenAI GPT', icon: '🧠' },
  { id: 'claude', name: 'Anthropic Claude', icon: '🎭' }
];
```

### Adding Website Handlers

#### 1. Create Handler Class

```typescript
// src/utils/website-handlers/WattpadHandler.ts
export class WattpadHandler extends BaseWebsiteHandler {
  canHandle(): boolean {
    return window.location.hostname.includes('wattpad.com');
  }

  extractContent(): string {
    // Wattpad-specific content extraction
    const contentElement = document.querySelector('[data-testid="story-part-content"]');
    return contentElement?.textContent || '';
  }

  extractTitle(): string {
    const titleElement = document.querySelector('h1[data-testid="story-part-title"]');
    return titleElement?.textContent || document.title;
  }

  extractMetadata(): any {
    return {
      websiteId: 'wattpad',
      storyTitle: document.querySelector('h2.story-title')?.textContent,
      author: document.querySelector('.author-name')?.textContent,
      chapter: this.extractChapterNumber(),
      tags: this.extractTags()
    };
  }

  private extractChapterNumber(): number {
    const chapterText = document.querySelector('.chapter-number')?.textContent;
    return parseInt(chapterText?.replace(/\D/g, '') || '1');
  }

  private extractTags(): string[] {
    const tagElements = document.querySelectorAll('.tag-item');
    return Array.from(tagElements).map(el => el.textContent?.trim() || '');
  }

  formatAfterEnhancement(contentArea: HTMLElement): void {
    // Apply Wattpad-specific styling to enhanced content
    contentArea.style.fontFamily = 'Georgia, serif';
    contentArea.style.lineHeight = '1.6';
    contentArea.style.fontSize = '16px';
  }
}
```

#### 2. Register Handler

```typescript
// src/utils/ContentProcessor.ts
private detectWebsiteHandler(): void {
  const handlers = [
    new FanfictionHandler(),
    new WattpadHandler(), // Add new handler
    new AO3Handler(),
    // ... other handlers
  ];

  for (const handler of handlers) {
    if (handler.canHandle()) {
      this.currentHandler = handler;
      break;
    }
  }
}
```

### Adding Enhancement Types

#### 1. Update Types

```typescript
// src/types/index.ts
export type EnhancementType =
  | "improve"     // General improvement
  | "grammar"     // Grammar and spelling
  | "style"       // Writing style enhancement
  | "clarity"     // Clarity and readability
  | "expand"      // Expand content
  | "condense"    // Make more concise
  | "formalize"   // Make more formal
  | "simplify";   // Simplify language
```

#### 2. Update AI Service Prompts

```typescript
// src/services/ai/BaseAIService.ts
protected buildEnhancementPrompt(
  content: string,
  options: EnhancementOptions
): string {
  const prompts = {
    improve: "Improve the overall quality of this content while maintaining its original meaning:",
    grammar: "Fix grammar, spelling, and punctuation errors in this content:",
    style: "Enhance the writing style and flow of this content:",
    clarity: "Improve the clarity and readability of this content:",
    expand: "Expand and elaborate on this content with more detail:",
    condense: "Make this content more concise while preserving key information:",
    formalize: "Make this content more formal and professional:",
    simplify: "Simplify the language in this content for better understanding:"
  };

  return `${prompts[options.enhancementType]}

${content}

Enhanced version:`;
}
```

## 🧪 Testing

### Unit Tests

```typescript
// tests/services/GeminiService.test.ts
describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(() => {
    service = new GeminiService();
  });

  test('should enhance content successfully', async () => {
    const content = "This is a test content with some grammar mistake.";
    const options: EnhancementOptions = {
      enhancementType: 'grammar',
      contentType: 'article'
    };

    const result = await service.enhanceContent(content, options);

    expect(result.success).toBe(true);
    expect(result.enhancedContent).toBeDefined();
    expect(result.originalContent).toBe(content);
  });

  test('should handle API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API Error'));

    const result = await service.enhanceContent("test", {});

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// tests/integration/ContentScript.test.ts
describe('ContentScript Integration', () => {
  test('should enhance page content end-to-end', async () => {
    // Setup test page
    document.body.innerHTML = `
      <div class="story-content">
        This is test story content with mistake.
      </div>
    `;

    const contentScript = new ContentScript();

    // Mock AI service response
    jest.spyOn(AIServiceManager.prototype, 'enhanceContent')
      .mockResolvedValue({
        success: true,
        enhancedContent: "This is test story content without mistakes.",
        originalContent: "This is test story content with mistake.",
        metadata: { contentType: 'novel' }
      });

    await contentScript.handleEnhanceContent({});

    // Verify content was enhanced
    const content = document.querySelector('.story-content')?.textContent;
    expect(content).toContain('without mistakes');
  });
});
```

### E2E Tests

```typescript
// tests/e2e/extension.test.ts
describe('Extension E2E', () => {
  test('should load and enhance content on fanfiction.net', async () => {
    await page.goto('https://www.fanfiction.net/s/12345/1/Test-Story');

    // Wait for extension to load
    await page.waitForSelector('.novelsynth-banner', { timeout: 5000 });

    // Click enhance button
    await page.click('.enhance-button');

    // Wait for enhancement to complete
    await page.waitForSelector('.toggle-banner', { timeout: 30000 });

    // Verify content was enhanced
    const enhancedContent = await page.$eval('#storytext', el => el.textContent);
    expect(enhancedContent).toBeDefined();
    expect(enhancedContent.length).toBeGreaterThan(0);
  });
});
```

## 📦 Build Process

### Development Build

```bash
# Start development with hot reload
npm run dev

# Build for development (with source maps)
npm run build:dev

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
# Clean previous build
npm run clean

# Build for production
npm run build

# Run full test suite
npm run test

# Package for distribution
npm run package
```

### Build Configuration

```javascript
// webpack.config.js
module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: './src/background.ts',
    content: './src/content.ts',
    popup: './src/popup.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

## 🚀 Deployment

### Browser Store Submission

#### Chrome Web Store
1. Build production package: `npm run package:chrome`
2. Create developer account
3. Upload `.zip` file
4. Fill store listing details
5. Submit for review

#### Firefox Add-ons
1. Build Firefox package: `npm run package:firefox`
2. Sign add-on: `web-ext sign`
3. Submit to AMO review
4. Publish after approval

### Continuous Integration

```yaml
# .github/workflows/build.yml
name: Build and Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: extension-build
          path: dist/
```