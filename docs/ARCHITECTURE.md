# NovelSynth Extension Architecture

## 📚 Documentation Index

This document provides a comprehensive overview of the NovelSynth browser extension architecture. For detailed visual diagrams and data flows, see:

- **[Architecture Diagrams](./ARCHITECTURE_DIAGRAMS.md)** - Comprehensive Mermaid diagrams
- **[Data Flow Documentation](./DATA_FLOW.md)** - Detailed data flow charts
- **[Build System](../wiki/Build-System.md)** - Build pipeline and tooling
- **[System Architecture](../wiki/System-Architecture.md)** - Interactive diagrams

## Overview

NovelSynth is a modular browser extension that provides AI-powered content enhancement for web novels, articles, and long-form content. The architecture is designed to be extensible, maintainable, and cross-browser compatible.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NovelSynth Extension                    │
├─────────────────────────────────────────────────────────────┤
│  Background Script (Service Worker)                         │
│  ├─ Message Router                                          │
│  ├─ AI Service Manager                                      │
│  └─ Storage Manager                                         │
├─────────────────────────────────────────────────────────────┤
│  Content Scripts (Per Website)                              │
│  ├─ Content Detector                                        │
│  ├─ Site Handler Manager                                    │
│  ├─ Processing Banner                                       │
│  └─ UI Controller                                           │
├─────────────────────────────────────────────────────────────┤
│  Popup Interface (React)                                    │
│  ├─ Settings Management                                     │
│  ├─ Provider Configuration                                  │
│  └─ Model Selection                                         │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── background/              # Background script (service worker)
│   └── index.ts            # Main background script entry
├── content/                # Content scripts
│   ├── index.ts           # Main content script
│   └── content.css        # Content script styles
├── popup/                  # Extension popup UI
│   ├── index.tsx          # Popup entry point
│   ├── Popup.tsx          # Main popup component
│   ├── popup.html         # Popup HTML template
│   └── popup.css          # Popup styles
├── services/              # Modular service providers
│   ├── ai/               # AI service providers
│   │   ├── BaseAIService.ts
│   │   ├── GeminiService.ts
│   │   ├── OpenAIService.ts
│   │   ├── AnthropicService.ts
│   │   ├── HuggingFaceService.ts
│   │   ├── OpenRouterService.ts
│   │   └── AIServiceManager.ts
│   └── handlers/         # Website-specific handlers
│       ├── fanfiction.ts
│       ├── archiveOfOurOwn.ts
│       ├── geeksForGeeks.ts
│       ├── medium.ts
│       ├── royalRoad.ts
│       ├── webnovel.ts
│       ├── genericNews.ts
│       └── SiteHandlerManager.ts
├── utils/                 # Utility functions and classes
│   ├── ContentDetector.ts  # Content type detection
│   ├── ContentSegmenter.ts # Large content handling
│   ├── ProcessingBanner.ts # User feedback
│   ├── PromptBuilder.ts    # Modular prompt construction
│   ├── PromptManager.ts    # Prompt management
│   ├── RateLimiter.ts      # API rate limiting
│   ├── StorageManager.ts   # Settings persistence
│   └── WordCounter.ts      # Text analysis
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared type definitions
└── icons/                # Extension icons
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## 🔧 Core Components

### 1. AI Service Manager (`AIServiceManager`)

**Purpose**: Centralized management of multiple AI providers with automatic failover and rate limiting.

**Key Features**:
- Provider abstraction layer
- Dynamic model selection per feature type
- Rate limiting and retry logic
- Content segmentation for large texts
- Error handling and fallbacks

**Supported Providers**:
- Google Gemini
- OpenAI GPT
- Anthropic Claude
- HuggingFace Models
- OpenRouter

### 2. Site Handler Manager (`SiteHandlerManager`)

**Purpose**: Website-specific content detection and extraction logic.

**Key Features**:
- Modular handler registration
- Automatic site detection
- Content area identification
- Title and metadata extraction
- Navigation context awareness

**Supported Sites**:
- Fiction: FanFiction.Net, Archive of Our Own, Royal Road, WebNovel.com
- Technical: GeeksforGeeks, Medium, Substack
- News: Generic news detection
- Universal: Fallback for any long-form content

### 3. Prompt Management System

**Purpose**: Modular prompt construction for different content types and operations.

**Components**:
- `PromptManager`: Central prompt registry
- `PromptBuilder`: Dynamic prompt construction
- User-customizable prompts per operation type

**Prompt Types**:
- Enhancement: Content improvement prompts
- Summary: Summarization prompts
- Analysis: Content analysis prompts
- Suggestions: Improvement suggestions
- Permanent: Always-included context
- Website: Site-specific prompts
- Novel: Story-specific prompts

### 4. Content Processing Pipeline

```
Content Detection → Segmentation → AI Processing → Result Assembly → Display
```

1. **Detection**: Identify content type and extract relevant text
2. **Segmentation**: Break large content into manageable chunks
3. **Processing**: Send to AI provider with appropriate prompts
4. **Assembly**: Combine processed segments maintaining formatting
5. **Display**: Show enhanced content with statistics

### 5. Storage Management (`StorageManager`)

**Purpose**: Persistent storage of user settings, API keys, and custom prompts.

**Storage Types**:
- User preferences (providers, models, features)
- API keys (encrypted browser storage)
- Custom prompts (user modifications)
- Rate limiting state
- Processing statistics

## 🔄 Communication Flow

### Background ↔ Content Script Communication

```typescript
// Content Script → Background
chrome.runtime.sendMessage({
  action: 'enhance',
  data: { content, contentType, options }
});

// Background → Content Script
chrome.tabs.sendMessage(tabId, {
  action: 'enhancementComplete',
  data: { enhanced, stats, processingTime }
});
```

### AI Service Integration

```typescript
interface AIService {
  enhance(content: string, prompt: string, options?: any): Promise<AIResponse>;
  summarize(content: string, options?: any): Promise<AIResponse>;
  analyze(content: string, options?: any): Promise<AIResponse>;
  getAvailableModels(): AIModel[];
}
```

## 🚀 Extension Lifecycle

### 1. Installation/Startup
- Initialize storage with default settings
- Register content scripts
- Set up background service worker

### 2. Page Load
- Content script injection
- Site handler detection
- Content analysis and UI injection

### 3. User Interaction
- UI activation through extension button
- Content enhancement request
- Real-time processing feedback

### 4. Processing Flow
- Content segmentation (if needed)
- Rate limit checking
- AI service calls with retry logic
- Result assembly and display

## 🔒 Security Considerations

### API Key Management
- Keys stored in browser's secure storage
- Never transmitted to NovelSynth servers
- Direct communication with AI providers only

### Content Privacy
- No content logging or storage
- Processing happens client-side
- User data remains with chosen AI provider

### Permissions
- `activeTab`: Access current page content
- `storage`: Store user preferences
- `scripting`: Inject content scripts
- `<all_urls>`: Universal content detection

## 🧪 Testing Strategy

### Unit Tests
- Individual component testing
- AI service mock implementations
- Storage manager validation

### Integration Tests
- End-to-end content processing
- Cross-browser compatibility
- Performance benchmarks

### Manual Testing
- Real-world website testing
- User workflow validation
- Error scenario handling

## 📈 Performance Optimization

### Content Segmentation
- Intelligent chunking based on content structure
- Preserve formatting and images
- Parallel processing where possible

### Rate Limiting
- Provider-specific limits
- Exponential backoff
- User-configurable thresholds

### Caching
- Model metadata caching
- Prompt template caching
- User preference caching

## 🔮 Future Extensibility

### Adding New AI Providers
1. Extend `BaseAIService` class
2. Implement required methods
3. Add to `AIServiceManager` registry
4. Update UI for provider selection

### Adding New Website Handlers
1. Extend `BaseWebsiteHandler` class
2. Implement site-specific selectors
3. Register in `SiteHandlerManager`
4. Add site-specific prompts

### Adding New Features
1. Define new action types
2. Update message interfaces
3. Implement in background service
4. Add UI controls in popup

## 📚 Dependencies

### Runtime Dependencies
- React 19.1.0 (popup UI)
- Chrome/Firefox Extension APIs

### Build Dependencies
- TypeScript 5.8.3
- Webpack 5.99.9
- Babel (React/TypeScript compilation)

### Development Dependencies
- @types/chrome (Chrome API types)
- @types/react (React type definitions)
- Various webpack loaders and plugins

---

This architecture provides a solid foundation for the NovelSynth extension while maintaining flexibility for future enhancements and modifications.