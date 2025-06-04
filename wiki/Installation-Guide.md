# Installation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Modern browser (Chrome 88+, Firefox 85+, Edge 88+)
- AI provider API key (Google Gemini recommended)

### Development Installation

#### 1. Clone and Setup
```bash
git clone https://github.com/LifeExperimentalist/novelsynth.git
cd novelsynth
npm install
```

#### 2. Build Extension
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Watch mode for development
npm run watch
```

#### 3. Load in Browser

**Chrome/Edge:**
1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode" toggle
3. Click "Load unpacked"
4. Select the `dist` folder

**Firefox:**
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from `dist` folder

#### 4. Configure API Keys
1. Click NovelSynth extension icon
2. Go to Settings
3. Add your Google Gemini API key
4. Test with a sample enhancement

### Production Installation

#### Chrome Web Store
*Coming soon - extension under review*

#### Firefox Add-ons
*Coming soon - extension under review*

#### Manual Installation
1. Download latest release from [Releases](https://github.com/LifeExperimentalist/novelsynth/releases)
2. Unzip the package
3. Follow browser-specific loading instructions above

## 🔧 Configuration

### API Key Setup

#### Google Gemini (Recommended)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create new project if needed
4. Click "Create API Key"
5. Copy key to NovelSynth settings

**Free Tier Limits:**
- 15 requests per minute
- 1 million tokens per day
- Rate limit resets daily

#### OpenAI (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create account and add payment method
3. Generate new secret key
4. Add to NovelSynth as secondary provider

**Pricing:**
- GPT-4 Turbo: $0.01 per 1K tokens
- GPT-3.5 Turbo: $0.0015 per 1K tokens

### Settings Overview

#### Enhancement Settings
- **Primary Provider**: Google Gemini
- **Enhancement Mode**: Improve (balanced enhancement)
- **Auto-Enhancement**: Disabled (manual control)
- **Content Types**: Novels, Articles, Technical docs

#### Performance Settings
- **Chunk Size**: 4000 tokens (optimal for most content)
- **Processing Timeout**: 30 seconds
- **Cache Duration**: 7 days
- **Background Processing**: Enabled

## ⚠️ Troubleshooting Installation

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
npm --version   # Should be 8+
```

#### Extension Loading Failed
1. Check browser developer mode is enabled
2. Verify `dist` folder contains all required files
3. Check browser console for errors
4. Try refreshing extension page

#### TypeScript Compilation Errors
```bash
# Install TypeScript globally
npm install -g typescript

# Check TypeScript configuration
npx tsc --noEmit

# Rebuild with clean slate
npm run clean && npm run build
```

#### API Key Issues
1. Verify key format (Google keys start with `AI...`)
2. Check API quota and billing status
3. Test key with simple API call
4. Ensure no extra spaces or characters

### Getting Help
- 📧 Create issue on [GitHub](https://github.com/LifeExperimentalist/novelsynth/issues)
- 💬 Join our [Discord community](#)
- 📖 Check [FAQ](FAQ.md) for common questions