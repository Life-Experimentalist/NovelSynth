# Website Handlers System

A comprehensive TypeScript-based system for handling content extraction and enhancement across different websites in the NovelSynth browser extension.

## Overview

The website handlers system provides a modular, extensible architecture for:
- **Content Detection**: Automatically identifying and extracting relevant content
- **Site-Specific Optimization**: Tailored extraction logic for different websites
- **Quality Assessment**: Evaluating content quality for optimal AI processing
- **Navigation Support**: Chapter/page navigation for serial content
- **Formatting Preservation**: Maintaining site-specific styling and structure

## Architecture

### Core Components

1. **Types System** (`types.ts`) - Comprehensive TypeScript interfaces
2. **Base Handler** (`base-handler.ts`) - Abstract base class with common functionality
3. **Specific Handlers** - Site-specific implementations
4. **Handler Manager** (`handler-manager.ts`) - Registration and selection system
5. **Main Exports** (`index.ts`) - Clean API and convenience functions

### Handler Hierarchy

```
BaseWebsiteHandler (Abstract)
├── RanobesHandler (ranobes.net)
├── FanfictionHandler (fanfiction.net)
├── AO3Handler (archiveofourown.org)
├── RoyalRoadHandler (royalroad.com) [Example]
└── GenericHandler (fallback for any site)
```

## Implemented Handlers

### 1. Ranobes Handler (`ranobes-handler.ts`)
- **Target**: ranobes.net, ranobes.com, ranobes.top
- **Content Type**: Novel
- **Quality**: Low (machine-translated)
- **Features**: Russian novel site optimization, MT quality detection

### 2. FanFiction.net Handler (`fanfiction-handler.ts`)
- **Target**: fanfiction.net
- **Content Type**: Fanfiction
- **Quality**: Medium
- **Features**: Chapter navigation, author extraction, dialogue preservation

### 3. AO3 Handler (`ao3-handler.ts`)
- **Target**: archiveofourown.org, ao3.org
- **Content Type**: Fanfiction
- **Quality**: High
- **Features**: Tag extraction, series tracking, formatting preservation

### 4. Generic Handler (`generic-handler.ts`)
- **Target**: Any website (fallback)
- **Content Type**: Auto-detected
- **Quality**: Medium
- **Features**: Universal content extraction, automatic content type detection

## Usage

### Basic Usage

```typescript
import { handlerManager, extractCurrentPageContent } from './website-handlers';

// Get handler for current page
const handler = await handlerManager.getHandlerForCurrentSite();

// Extract content using convenience function
const result = await extractCurrentPageContent();

// Check if domain is supported
const isSupported = handlerManager.isDomainSupported('fanfiction.net');
```

### Direct Handler Usage

```typescript
import { FanfictionHandler } from './website-handlers';

const handler = new FanfictionHandler();

if (handler.canHandle()) {
  const content = await handler.extractContent();
  const navigation = await handler.getChapterNavigation();
}
```

### Handler Manager

```typescript
import { handlerManager } from './website-handlers';

// Register a custom handler
handlerManager.registerHandler('mysite', MySiteHandler, 100, true);

// Get all registered handlers
const handlers = handlerManager.getRegisteredHandlers();

// Get supported domains
const domains = handlerManager.getSupportedDomains();

// Test current page compatibility
const test = await handlerManager.testCurrentPage();
```

## Creating a New Handler

### Step 1: Create the Handler Class

```typescript
// my-site-handler.ts
import { BaseWebsiteHandler } from './base-handler';
import { WebsiteConfig, ContentExtractionResult, /* other types */ } from './types';

export class MySiteHandler extends BaseWebsiteHandler {

  protected initializeConfig(): WebsiteConfig {
    return {
      siteName: 'My Site',
      domains: ['mysite.com'],
      primaryContentType: ContentType.NOVEL,
      expectedQuality: ContentQuality.MEDIUM,
      selectors: {
        content: ['.main-content', '.story-text'],
        title: ['h1.title', '.story-title'],
        author: ['.author-name'],
        // ... other selectors
      },
      defaultPrompt: 'Custom prompt for this site...',
      features: {
        chapterNavigation: true,
        seriesTracking: false,
        authorProfiles: true
      }
    };
  }

  async extractContent(): Promise<ContentExtractionResult> {
    // Implement site-specific extraction logic
    const contentArea = await this.findContentArea();
    if (!contentArea) {
      return { found: false, /* ... */ };
    }

    // Clean and process content
    const cleanText = this.cleanSiteSpecificContent(contentArea);

    return {
      found: true,
      text: cleanText,
      metadata: await this.extractMetadata(),
      // ... other properties
    };
  }

  private cleanSiteSpecificContent(element: HTMLElement): string {
    // Implement site-specific cleaning logic
    return this.cleanTextContent(element);
  }
}
```

### Step 2: Register the Handler

```typescript
// In handler-manager.ts or during initialization
handlerManager.registerHandler('mysite', MySiteHandler, 100, true);
```

### Step 3: Export the Handler

```typescript
// In index.ts
export { MySiteHandler } from './my-site-handler';
```

## Configuration Options

### WebsiteConfig Interface

```typescript
interface WebsiteConfig {
  siteName: string;                    // Human-readable site name
  domains: string[];                   // Domain patterns to match
  primaryContentType: ContentType;     // Main content type
  expectedQuality: ContentQuality;     // Expected content quality
  selectors: WebsiteSelectors;         // CSS selectors for content
  defaultPrompt?: string;              // Default AI processing prompt
  styles?: Record<string, string>;     // Site-specific styling
  features?: {                         // Supported features
    chapterNavigation?: boolean;
    seriesTracking?: boolean;
    authorProfiles?: boolean;
  };
}
```

### Content Types

- `NOVEL` - Web novels, light novels, serialized fiction
- `FANFICTION` - Fan fiction and derivative works
- `NEWS` - News articles and journalism
- `BLOG` - Blog posts and personal articles
- `DOCUMENTATION` - Technical documentation
- `ACADEMIC` - Academic papers and research
- `ARTICLE` - General web articles
- `SOCIAL` - Social media posts
- `FORUM` - Forum posts and discussions
- `UNKNOWN` - Unclassified content

### Quality Levels

- `HIGH` - Professional content with good grammar and structure
- `MEDIUM` - Standard web content with minor issues
- `LOW` - Machine-translated or low-quality content
- `POOR` - Content with significant issues

## Advanced Features

### Content Validation

```typescript
protected initializeValidation(): ContentValidation {
  return {
    minLength: 500,                    // Minimum content length
    maxLength: 1000000,               // Maximum content length
    contentUrlPatterns: [             // URL patterns for valid content
      /\/story\/\d+/,
      /\/chapter\/\d+/
    ],
    excludeUrlPatterns: [             // URL patterns to exclude
      /\/profile\//,
      /\/search/
    ],
    requiredElements: ['.content'],    // Required page elements
    forbiddenElements: ['.ads']        // Elements that invalidate content
  };
}
```

### Quality Assessment

```typescript
private assessContentQuality(text: string): ContentQuality {
  const indicators = {
    high: [/[""]/g, /[—–]/g],        // Smart quotes, proper dashes
    medium: [/[.!?]\s+[A-Z]/g],      // Proper sentences
    poor: [/\b(u|ur|2|4)\b/gi]       // Text speak
  };

  // Calculate scores and return quality level
}
```

### Chapter Navigation

```typescript
async getChapterNavigation(): Promise<ChapterNavigation> {
  return {
    hasPrevious: boolean,
    hasNext: boolean,
    currentChapter: number,
    totalChapters: number,
    previousUrl?: string,
    nextUrl?: string,
    chapterSelector?: HTMLElement
  };
}
```

### UI Integration

```typescript
getUIInsertionPoint(contentArea?: HTMLElement): UIInsertionPoint {
  return {
    element: targetElement,           // Where to insert UI
    position: 'before' | 'after' | 'prepend' | 'append',
    containerClass: 'css-class-name'  // CSS class for styling
  };
}
```

## Testing and Debugging

### Test Current Page

```typescript
const test = await handlerManager.testCurrentPage();
console.log('Selected handler:', test.selectedHandler);
console.log('Available handlers:', test.availableHandlers);
console.log('Validation results:', test.validationResults);
```

### Handler Statistics

```typescript
const stats = handlerManager.getStatistics();
console.log('Total handlers:', stats.totalHandlers);
console.log('Enabled handlers:', stats.enabledHandlers);
console.log('Supported domains:', stats.supportedDomains);
console.log('Content types:', stats.contentTypes);
```

### Debug Mode

Set up debug logging in handlers:

```typescript
console.log(`Handler '${this.config.siteName}' processing:`, {
  url: window.location.href,
  contentFound: !!contentArea,
  contentLength: text.length,
  quality: quality,
  metadata: metadata
});
```

## Integration with NovelSynth

The handler system integrates with the main NovelSynth extension through:

1. **Content Detection**: Automatic handler selection based on current page
2. **AI Processing**: Site-specific prompts for optimal enhancement
3. **UI Injection**: Optimal placement of enhancement controls
4. **Content Formatting**: Post-enhancement formatting preservation
5. **Navigation**: Chapter-by-chapter processing support

## Best Practices

1. **Selector Specificity**: Use specific CSS selectors that won't break with site updates
2. **Graceful Degradation**: Always provide fallback extraction methods
3. **Content Validation**: Implement robust validation to avoid processing inappropriate pages
4. **Quality Assessment**: Accurately assess content quality for optimal AI processing
5. **Performance**: Cache handler instances and minimize DOM queries
6. **Error Handling**: Comprehensive error handling with meaningful error messages
7. **Testing**: Test handlers on actual website pages before deployment

## Future Enhancements

- **Machine Learning**: Automatic selector optimization based on success rates
- **Community Handlers**: User-contributed handlers for additional sites
- **Dynamic Configuration**: Runtime configuration updates without code changes
- **Performance Monitoring**: Handler performance metrics and optimization
- **A/B Testing**: Testing different extraction strategies for optimal results
