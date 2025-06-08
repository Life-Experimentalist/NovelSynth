# NovelSynth Wiki

Welcome to the comprehensive documentation for **NovelSynth** - the AI-powered browser extension that enhances your reading experience across the web.

## 📋 Table of Contents

1. [Getting Started](#-getting-started)
   - [What is NovelSynth?](#what-is-novelsynth)
   - [Key Features](#key-features)
     - [AI-Powered Enhancement](#-ai-powered-enhancement)
     - [Smart Website Detection](#-smart-website-detection)
     - [Persistent Storage](#-persistent-storage)
     - [Customizable Settings](#-customizable-settings)
2. [Installation Guide](#-installation-guide)
3. [User Manual](#-user-manual)
4. [Developer Documentation](#-developer-documentation)
5. [AI Providers & Configuration](#-ai-providers--configuration)
6. [Supported Websites](#-supported-websites)
7. [API Reference](#-api-reference)
8. [Troubleshooting](#️-troubleshooting)
   - [Common Issues](#common-issues)
   - [Debug Mode](#debug-mode)
   - [Performance Issues](#performance-issues)
   - [Getting Help](#getting-help)
9. [Contributing](#-contributing)
10. [Changelog](#-changelog)

---

## 🚀 Getting Started

### What is NovelSynth?

NovelSynth is an intelligent browser extension that uses AI to enhance your reading experience on websites containing long-form content like novels, articles, and technical documentation. It can:

- **Enhance Content**: Improve grammar, style, and readability
- **Summarize**: Create concise summaries of long articles
- **Analyze**: Provide insights about content structure and themes
- **Toggle Views**: Switch between original and enhanced content
- **Cross-Platform**: Works on Chrome, Firefox, and Edge

### Key Features

#### 🤖 **AI-Powered Enhancement**
- Multiple AI providers (Google Gemini, OpenAI, Anthropic)
- Context-aware content processing
- Maintains original meaning while improving readability

#### 🎯 **Smart Website Detection**
- Automatic detection of content-rich websites
- Specialized handlers for popular platforms
- Custom content extraction algorithms

#### 💾 **Persistent Storage**
- Content saved across sessions
- Quick toggle between original/enhanced versions
- Offline access to processed content

#### 🔧 **Customizable Settings**
- Choose your preferred AI provider
- Adjust enhancement intensity
- Configure auto-enhancement rules

---

## 📦 Installation Guide

### Chrome/Edge Installation

1. **Download the Extension**
   ```bash
   # Clone the repository
   git clone https://github.com/LifeExperimentalist/novelsynth.git
   cd novelsynth

   # Install dependencies
   npm install

   # Build the extension
   npm run build
   ```

2. **Load in Browser**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

3. **Configure API Keys**
   - Click the NovelSynth extension icon
   - Navigate to Settings
   - Add your AI provider API keys

### Firefox Installation

1. **Build for Firefox**
   ```bash
   npm run build:firefox
   npm run package:firefox
   ```

2. **Install Add-on**
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the generated `.xpi` file

### Production Installation

Visit the browser extension stores:
- [Chrome Web Store](#) (Coming Soon)
- [Firefox Add-ons](#) (Coming Soon)
- [Edge Add-ons](#) (Coming Soon)

---

## 📖 User Manual

### First Time Setup

#### 1. **API Key Configuration**
NovelSynth requires API access to AI providers:

**Google Gemini** (Recommended)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to NovelSynth settings

**OpenAI** (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Generate a new secret key
3. Add to NovelSynth settings

#### 2. **Choose Your Settings**
- **Primary AI Provider**: Select your preferred AI service
- **Enhancement Mode**: Choose between "Improve", "Grammar", "Style", etc.
- **Auto-Enhancement**: Enable automatic processing on supported sites
- **Content Types**: Select which types of content to process

### Using NovelSynth

#### **Method 1: Right-Click Context Menu**
1. Visit any supported website
2. Right-click on text content
3. Select "Enhance with NovelSynth"
4. Wait for processing to complete

#### **Method 2: Extension Popup**
1. Click the NovelSynth icon in your browser toolbar
2. Choose your desired action:
   - 🚀 **Enhance Content**: Improve the current page
   - 📝 **Summarize**: Create a summary
   - 🔄 **Toggle View**: Switch between original/enhanced
   - ⚙️ **Settings**: Configure preferences

#### **Method 3: Keyboard Shortcuts**
- `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac): Enhance content
- `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac): Summarize
- `Ctrl+Shift+T` (Windows/Linux) or `Cmd+Shift+T` (Mac): Toggle view

### Managing Enhanced Content

#### **Viewing Options**
- **Toggle Banner**: Appears after enhancement, allows switching views
- **Original/Enhanced Indicator**: Shows current view state
- **Word Count**: Displays before/after word counts

#### **Storage Management**
- Enhanced content is automatically saved
- Access stored content from the popup
- Clear storage to free up space
- Export enhanced content (Coming Soon)

---

## 🔧 Developer Documentation

### Architecture Overview

NovelSynth follows a modular architecture designed for extensibility and maintainability:

```
NovelSynth/
├── src/
│   ├── background.ts          # Extension lifecycle management
│   ├── content.ts             # Page content manipulation
│   ├── popup.ts               # User interface
│   ├── services/              # AI service integrations
│   │   ├── ai/
│   │   │   ├── BaseAIService.ts
│   │   │   ├── GeminiService.ts
│   │   │   └── AIServiceManager.ts
│   ├── utils/                 # Core utilities
│   │   ├── ContentProcessor.ts
│   │   ├── StorageManager.ts
│   │   ├── ProcessingBanner.ts
│   │   └── website-handlers/  # Site-specific handlers
│   └── types/                 # TypeScript definitions
├── manifest.json              # Extension manifest
├── popup.html                 # Popup interface
└── webpack.config.js          # Build configuration
```

### Core Components

#### **1. Background Script (`background.ts`)**
Manages extension lifecycle, handles API requests, and coordinates between components.

```typescript
class BackgroundScript {
  // Handles extension installation and updates
  private handleFirstInstall(): void

  // Processes messages from content scripts and popup
  private handleMessage(message: any, sender: chrome.runtime.MessageSender): Promise<any>

  // Manages context menus
  private setupContextMenus(): void
}
```

#### **2. Content Script (`content.ts`)**
Injected into web pages to detect and process content.

```typescript
class ContentScript {
  // Main content enhancement pipeline
  private async handleEnhanceContent(options: any): Promise<void>

  // Toggle between original and enhanced content
  private async handleToggleContent(): Promise<void>

  // Detect if current page has processable content
  private autoDetectContent(): void
}
```

#### **3. AI Service Manager (`AIServiceManager.ts`)**
Abstracts AI provider interactions and manages multiple services.

```typescript
class AIServiceManager {
  // Process content using selected AI provider
  async enhanceContent(content: string, options: EnhancementOptions): Promise<ProcessingResult>

  // Generate content summaries
  async summarizeContent(content: string, options: SummarizationOptions): Promise<ProcessingResult>

  // Analyze content structure and themes
  async analyzeContent(content: string): Promise<ContentAnalysis>
}
```

### Adding New AI Providers

#### **Step 1: Create Service Class**
```typescript
// src/services/ai/YourAIService.ts
export class YourAIService extends BaseAIService {
  provider: AIProvider = {
    name: "Your AI Service",
    id: "your-ai",
    apiEndpoint: "https://api.yourai.com",
    requiresAuth: true,
    authType: "api_key",
    features: ["enhance", "summarize"],
    models: ["model-1", "model-2"],
    defaultModel: "model-1"
  };

  async enhanceContent(content: string, options: EnhancementOptions): Promise<ProcessingResult> {
    // Implementation here
  }
}
```

#### **Step 2: Register in Manager**
```typescript
// src/services/ai/AIServiceManager.ts
this.services.set('your-ai', new YourAIService());
```

### Adding Website Handlers

#### **Step 1: Create Handler Class**
```typescript
// src/utils/website-handlers/YourSiteHandler.ts
export class YourSiteHandler extends BaseWebsiteHandler {
  canHandle(): boolean {
    return window.location.hostname.includes('yoursite.com');
  }

  extractContent(): string {
    // Site-specific content extraction
  }

  extractTitle(): string {
    // Site-specific title extraction
  }
}
```

#### **Step 2: Register Handler**
```typescript
// src/utils/ContentProcessor.ts
private detectWebsiteHandler(): void {
  const handlers = [
    new YourSiteHandler(),
    new FanfictionHandler(),
    // ... other handlers
  ];
}
```

### Building and Testing

#### **Development Build**
```bash
npm run build:dev    # Development build with source maps
npm run watch        # Watch mode for development
npm run dev          # Development server with auto-reload
```

#### **Production Build**
```bash
npm run build        # Production build
npm run package      # Create distribution packages
npm run test         # Run test suite
```

#### **Testing**
```bash
npm run test:types   # TypeScript type checking
npm run test:extension # Extension functionality tests
npm run lint         # Code quality checks
```

---

## 🤖 AI Providers & Configuration

### Google Gemini (Primary)

**Supported Models:**
- `gemini-1.5-pro`: Best for complex content enhancement
- `gemini-1.5-flash`: Faster processing, good for summaries
- `gemini-pro`: Standard model for general use
- `gemini-pro-vision`: Image and text processing (future feature)

**Configuration:**
```json
{
  "provider": "gemini",
  "model": "gemini-1.5-pro",
  "temperature": 0.7,
  "maxTokens": 8192,
  "features": ["enhance", "summarize", "analyze", "suggestions"]
}
```

**API Key Setup:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create project and enable Gemini API
3. Generate API key
4. Add to NovelSynth settings

### OpenAI (Secondary)

**Supported Models:**
- `gpt-4-turbo`: Best quality for enhancement
- `gpt-4`: High-quality processing
- `gpt-3.5-turbo`: Cost-effective option

**Configuration:**
```json
{
  "provider": "openai",
  "model": "gpt-4-turbo",
  "temperature": 0.3,
  "maxTokens": 4000,
  "features": ["enhance", "summarize"]
}
```

### Anthropic Claude (Future)

**Planned Models:**
- `claude-3-opus`: Premium model
- `claude-3-sonnet`: Balanced performance
- `claude-3-haiku`: Fast processing

---

## 🌐 Supported Websites

### Novel Platforms
- **FanFiction.Net**: Full support with chapter navigation
- **Archive of Our Own**: Content extraction and enhancement
- **Wattpad**: Story content processing
- **Royal Road**: LitRPG and fantasy novel support
- **Webnovel**: Popular light novel platform

### Article Platforms
- **Medium**: Blog post enhancement
- **Wikipedia**: Article improvement
- **News Sites**: General article processing
- **Technical Blogs**: Code-aware enhancement

### Documentation Sites
- **GitHub README**: Markdown processing
- **GitBook**: Documentation enhancement
- **Confluence**: Wiki content improvement

### Adding New Website Support

To add support for a new website:

1. **Create Handler Class**
   ```typescript
   export class NewSiteHandler extends BaseWebsiteHandler {
     canHandle(): boolean {
       return window.location.hostname.includes('newsite.com');
     }

     extractContent(): string {
       // Implement content extraction logic
       const contentElement = document.querySelector('.main-content');
       return contentElement?.textContent || '';
     }

     extractTitle(): string {
       return document.querySelector('h1.title')?.textContent || document.title;
     }
   }
   ```

2. **Register in ContentProcessor**
   ```typescript
   private detectWebsiteHandler(): void {
     const handlers = [
       new NewSiteHandler(),
       // ... existing handlers
     ];
   }
   ```

3. **Test and Submit PR**
   - Test on the target website
   - Ensure content extraction works correctly
   - Submit pull request with handler

---

## 🔍 API Reference

### Storage Manager

#### **Methods**
```typescript
class StorageManager {
  // Store enhanced content
  static async storeContent(
    url: string,
    originalContent: string,
    enhancedContent: string,
    metadata: ContentMetadata
  ): Promise<void>

  // Retrieve stored content
  static async getStoredContent(): Promise<Record<string, ContentStorage>>

  // Clear content for specific URL
  static async clearStoredContent(url: string): Promise<void>

  // Get storage statistics
  static async getStorageStats(): Promise<StorageStats>
}
```

#### **Types**
```typescript
interface ContentStorage {
  originalContent: string;
  enhancedContent: string;
  metadata: ContentMetadata;
  timestamp: string;
}

interface ContentMetadata {
  timestamp: string;
  provider: string;
  model: string;
  contentType: ContentType;
  websiteId: string;
  processingTime?: number;
}
```

### Processing Banner

#### **Methods**
```typescript
class ProcessingBanner {
  constructor(config: BannerConfig)

  // Show processing state
  showProcessing(message: string): void

  // Show success state with toggle
  showSuccess(message: string): void

  // Show error state
  showError(message: string): void

  // Update progress
  updateProgress(percentage: number): void

  // Remove banner
  destroy(): void
}
```

### Content Processor

#### **Methods**
```typescript
class ContentProcessor {
  // Process current page content
  async processCurrentPage(options: ProcessingOptions): Promise<ProcessingResult>

  // Check if current page can be processed
  canHandleCurrentPage(): boolean

  // Replace page content
  replacePageContent(content: string): void

  // Toggle content display state
  isShowingEnhanced(): boolean
  setShowingEnhanced(enhanced: boolean): void
}
```

---

## 🛠️ Troubleshooting

### Common Issues

#### **Extension Not Loading**
1. Check browser developer mode is enabled
2. Verify all required files are in `dist` folder
3. Check console for TypeScript compilation errors
4. Ensure manifest.json permissions are correct

#### **AI Enhancement Failing**
1. **Check API Key**: Verify key is correct and has proper permissions
2. **Network Issues**: Check internet connection and firewall settings
3. **Rate Limits**: Wait if you've exceeded API rate limits
4. **Content Size**: Large content may need to be processed in chunks

#### **Content Not Detected**
1. **Website Support**: Check if site has a dedicated handler
2. **Content Structure**: Verify page has extractable text content
3. **JavaScript Loading**: Ensure content is fully loaded before processing
4. **Ad Blockers**: Some ad blockers may interfere with content detection

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// In browser console
localStorage.setItem('novelsynth-debug', 'true');
```

### Performance Issues

#### **Slow Processing**
1. Switch to faster AI model (e.g., `gemini-1.5-flash`)
2. Reduce content chunk size in settings
3. Check system resources and close unnecessary tabs
4. Clear extension storage if full

#### **Memory Usage**
1. Regularly clear stored content
2. Disable auto-enhancement on resource-constrained devices
3. Use content chunking for very large documents

### Getting Help

1. **Check Documentation**: Review this wiki thoroughly
2. **GitHub Issues**: Search existing issues or create new one
3. **Debug Logs**: Include debug logs when reporting issues
4. **System Info**: Provide browser version and extension version

---

## 🤝 Contributing

### Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/LifeExperimentalist/novelsynth.git
   cd novelsynth
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Build**
   ```bash
   npm run dev
   ```

### Code Standards

#### **TypeScript**
- Use strict type checking
- Document all public methods
- Follow consistent naming conventions

#### **Testing**
- Write unit tests for new features
- Test on multiple browsers
- Verify website handler compatibility

#### **Documentation**
- Update this wiki for new features
- Include code examples
- Document breaking changes

### Contribution Areas

#### **High Priority**
- New AI provider integrations
- Website handler development
- Performance optimizations
- Bug fixes and stability improvements

#### **Medium Priority**
- UI/UX improvements
- Additional enhancement modes
- Mobile browser support
- Internationalization

#### **Low Priority**
- Advanced analytics
- Content export features
- Browser sync integration
- Premium features

### Submitting Changes

1. **Fork Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes** with tests
4. **Update Documentation**
5. **Submit Pull Request**

---

## 📈 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release with Google Gemini support
- ✅ FanFiction.Net handler implementation
- ✅ Content enhancement and summarization
- ✅ Toggle between original/enhanced content
- ✅ Cross-browser compatibility (Chrome, Firefox, Edge)
- ✅ Persistent content storage
- ✅ Context menu integration

### Upcoming Features

#### **Version 1.1.0** (Next Release)
- 🔄 OpenAI GPT-4 integration
- 🔄 Additional website handlers (AO3, Wattpad)
- 🔄 Enhanced UI with React components
- 🔄 Performance optimizations
- 🔄 Improved error handling

#### **Version 1.2.0** (Future)
- 🔄 Anthropic Claude integration
- 🔄 Content export functionality
- 🔄 Advanced analytics dashboard
- 🔄 Mobile browser support
- 🔄 Premium features

#### **Version 2.0.0** (Long-term)
- 🔄 Machine learning content classification
- 🔄 Real-time collaborative enhancement
- 🔄 Advanced customization options
- 🔄 API for third-party integrations

---

## 📄 License

NovelSynth is released under the [Apache License 2.0](../LICENSE.md).

## 🙏 Acknowledgments

- Google Gemini AI for powerful content processing
- Open source community for tools and libraries
- Beta testers and early adopters
- Contributors and maintainers

---

*Last Updated: $(date)*
*Wiki Version: 1.0.0*