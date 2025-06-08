# NovelSynth - AI-Powered Browser Extension

A modular browser extension for enhancing web novels, articles, and educational content using AI services.

## Features

- 🎯 **Modular Architecture**: Easy to add new AI services, content handlers, and features
- 🚀 **Multiple AI Services**: Support for Gemini, OpenAI, Anthropic (extensible)
- 📱 **Dual Interface**: Standard popup and floating quick-access popup
- 🎨 **Modern UI**: Built with React, TypeScript, and Ant Design
- 🔧 **Customizable Prompts**: Edit prompts for each feature and content type
- 📝 **Smart Content Detection**: Automatic content type detection for novels, articles, code, etc.

## Architecture

### Core Components

- **AI Services**: Modular AI service handlers (`src/services/ai/`)
- **Content Handlers**: Website-specific content extractors (`src/services/content/`)
- **Features**: AI-powered features like enhance, summarize, explain (`src/features/`)
- **UI Components**: React components for popup and floating interface (`src/popup/`)

### Extension Structure

```
src/
├── types/           # TypeScript interfaces
├── store/           # Zustand state management
├── services/
│   ├── ai/          # AI service implementations
│   └── content/     # Content extraction handlers
├── features/        # Feature definitions and registry
├── popup/           # Main popup interface
├── content/         # Content script (floating UI + injection)
└── background/      # Background service worker
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

```bash
# Start development server (for popup testing)
npm run dev

# Build extension
npm run build:extension

# Watch mode for development
npm run watch
```

### 3. Load Extension

1. Build the extension: `npm run build:extension`
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

### 4. Configure AI Services

1. Click the extension icon to open the popup
2. Go to the "Services" tab
3. Enter your API key for Gemini (or other services)
4. Select your preferred model

## Adding New Features

### 1. Create Feature Definition

Add to `src/features/defaults.ts`:

```typescript
{
  id: 'my-feature',
  name: 'My Feature',
  description: 'What this feature does',
  icon: '🎯',
  category: 'enhance',
  supportedModes: ['novel', 'article'],
  defaultPrompts: {
    novel: 'Prompt for novel content...',
    article: 'Prompt for article content...',
    // ... other modes
  },
  config: {