# NovelSynth

**AI-powered content enhancement for web novels, articles, and long-form content**

NovelSynth is a cross-browser extension (Firefox/Chrome) that detects long-form content and provides AI-powered enhancement capabilities including content enhancement, summarization, analysis, and intelligent suggestions.

![NovelSynth Logo](src/icons/icon128.png)

## ✨ Features

- **Smart Content Detection** - Automatically detects long-form content like web novels, technical articles, and news
- **Multi-Provider AI Support** - Supports Gemini, OpenAI, Anthropic, HuggingFace, and OpenRouter
- **Content Enhancement** - Improves readability, fixes grammar, and enhances narrative flow
- **Intelligent Summarization** - Creates concise summaries while preserving key information
- **Content Analysis** - Analyzes writing style, structure, and provides insights
- **Smart Suggestions** - Offers context-aware suggestions for improvement
- **Rate Limiting** - Built-in rate limiting with retry logic
- **Content Segmentation** - Handles large content while preserving images and formatting

## 🌐 Supported Websites

- **Fiction Sites**: FanFiction.Net, Archive of Our Own, Royal Road, WebNovel.com
- **Technical Sites**: GeeksforGeeks, Medium, Substack
- **News Sites**: Generic news detection
- **Universal Support**: Works on any website with long-form content

## 🚀 Installation

### For Users

#### Chrome
1. Download the latest release from [Releases](releases/)
2. Extract the `novelsynth-chrome.zip` file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked" and select the extracted folder

#### Firefox
1. Download the latest release from [Releases](releases/)
2. Extract the `novelsynth-firefox.zip` file
3. Open Firefox and go to `about:debugging`
4. Click "This Firefox" → "Load Temporary Add-on"
5. Select the `manifest.json` file from the extracted folder

### For Developers

#### Prerequisites
- Node.js 16+ and npm
- Git

#### Build from Source
```bash
# Clone the repository
git clone https://github.com/LifeExperimentalist/novelsynth.git
cd novelsynth

# Install dependencies
npm install

# Sync metadata and build for development
npm run build:dev

# Build production release packages
npm run build:full

# Watch mode for development
npm run watch
```

#### Load Extension in Browser
After building, the extension files will be in the `dist/` folder:

**Chrome:**
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked" and select the `dist/` folder

**Firefox:**
1. Go to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `dist/manifest.json`

## ⚙️ Configuration

### API Keys Setup
1. Click the NovelSynth extension icon
2. Go to Settings
3. Add your API keys for supported providers:
   - **Gemini**: Get from [Google AI Studio](https://aistudio.google.com/)
   - **OpenAI**: Get from [OpenAI Platform](https://platform.openai.com/)
   - **Anthropic**: Get from [Anthropic Console](https://console.anthropic.com/)
   - **HuggingFace**: Get from [HuggingFace Hub](https://huggingface.co/settings/tokens)
   - **OpenRouter**: Get from [OpenRouter](https://openrouter.ai/)

### Model Selection
Configure different models for different features:
- **Enhancement**: For content improvement
- **Summarization**: For creating summaries
- **Analysis**: For content analysis
- **Suggestions**: For generating suggestions

### Rate Limiting
- **Enable/Disable**: Toggle rate limiting
- **Wait Time**: Delay between requests (milliseconds)
- **Retry Attempts**: Number of retry attempts on failure

## 🔧 Development

### Project Structure
```
src/
├── background/          # Service worker
├── content/            # Content scripts
├── popup/              # Extension popup UI
├── services/           # AI service providers
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

### Testing

#### Manual Testing
1. Build the extension: `npm run build:dev`
2. Load in browser (see installation instructions)
3. Visit a supported website with long-form content
4. Click the enhancement button that appears
5. Configure API keys in the popup settings

#### Test Sites
- **Fiction**: https://www.fanfiction.net/s/5782108/1/Harry-Potter-and-the-Methods-of-Rationality
- **Technical**: https://www.geeksforgeeks.org/javascript-tutorial/
- **News**: Any major news article
- **Blog**: Medium articles or personal blogs

#### Development Testing
```bash
# Watch mode for development
npm run watch

# Type checking
npx tsc --noEmit

# Build test
npm run build
```

### Architecture

#### AI Service Manager
- Manages multiple AI providers
- Handles rate limiting and retry logic
- Supports content segmentation for large texts

#### Content Detection
- Automatically detects content type
- Supports custom site handlers
- Configurable detection patterns

#### Storage Management
- User settings persistence
- Custom prompt management
- API key secure storage

#### Processing Pipeline
1. **Content Detection** - Identifies long-form content
2. **Content Segmentation** - Breaks large content into manageable chunks
3. **AI Processing** - Sends to selected AI provider
4. **Result Assembly** - Combines processed segments
5. **Display** - Shows enhanced content to user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Test thoroughly
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add JSDoc comments for public APIs
- Update tests for new features
- Ensure cross-browser compatibility

## 📝 License

Licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for details.

## 🛠️ Troubleshooting

### Common Issues

**Extension not loading:**
- Check that all files are in the `dist/` folder
- Ensure manifest.json is valid
- Check browser console for errors

**API calls failing:**
- Verify API keys are correctly entered
- Check rate limiting settings
- Ensure internet connection

**Content not detected:**
- Try refreshing the page
- Check if the site is supported
- Verify content meets minimum length requirements

### Debug Mode
1. Open browser DevTools (F12)
2. Check Console tab for error messages
3. Look for NovelSynth-related logs

## 📊 Performance

- **Memory Usage**: ~5-10MB typical
- **Processing Speed**: Depends on AI provider and content length
- **Network Usage**: Only during AI processing requests

## 🔐 Privacy

- API keys stored locally in browser
- No data sent to NovelSynth servers
- All processing done via selected AI providers
- Content only shared with chosen AI service

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/LifeExperimentalist/novelsynth/issues)
- **Discussions**: [GitHub Discussions](https://github.com/LifeExperimentalist/novelsynth/discussions)
- **Documentation**: [GitHub Pages](https://life-experimentalist.github.io/novelsynth)

---

**Version**: 1.0.0
**Last Updated**: December 2024
