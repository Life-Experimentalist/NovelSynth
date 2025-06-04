# NovelSynth Development & Testing Guide

## 🚀 Quick Start

This guide helps you get NovelSynth running for development and testing.

### Prerequisites
- Node.js 16+ and npm
- Git
- A code editor (VS Code recommended)

### Setup Steps

1. **Clone and Install**
   ```bash
   git clone https://github.com/LifeExperimentalist/novelsynth.git
   cd novelsynth
   npm install
   ```

2. **Sync Metadata and Build**
   ```bash
   npm run sync-metadata
   npm run build:dev
   ```

3. **Load in Browser**
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, load unpacked from `dist/`
   - **Firefox**: Go to `about:debugging`, load temporary add-on, select `dist/manifest.json`

## 🧪 Testing Instructions

### 1. Basic Functionality Test
- Install the extension following the development setup
- Visit a test website (e.g., fanfiction.net story)
- Look for the NovelSynth enhancement button
- Try clicking it (should show API key requirement if not configured)

### 2. API Configuration Test
- Click the extension icon in browser toolbar
- Go to Settings
- Add a test API key (Gemini is recommended for testing)
- Verify the key is saved and the provider is selected

### 3. Content Enhancement Test
- Visit a supported website with long-form content
- Click the enhancement button
- Verify the processing banner appears
- Check that enhanced content is displayed
- Verify word count statistics are shown

### 4. Cross-Browser Testing
- Test on both Chrome and Firefox
- Verify all features work consistently
- Check for any browser-specific issues

## 🏗️ Build Commands

```bash
# Development build with watching
npm run build:dev
npm run watch

# Production build
npm run build

# Full release build (Chrome + Firefox packages)
npm run build:full

# Metadata synchronization
npm run sync-metadata

# Type checking
npm run type-check
```

## 🔍 Debugging

### Browser DevTools
1. Open DevTools (F12)
2. Check Console for errors
3. Look for NovelSynth-related messages
4. Use Network tab to monitor API calls

### Extension Debugging
- **Background Script**: `chrome://extensions/` → Details → Inspect views: service worker
- **Content Script**: Regular page DevTools, look for injected scripts
- **Popup**: Right-click extension icon → Inspect popup

## ✅ Test Checklist

- [ ] Extension loads without errors
- [ ] Settings popup opens and functions
- [ ] API keys can be saved and loaded
- [ ] Content detection works on test sites
- [ ] Enhancement processing completes successfully
- [ ] Word count statistics are accurate
- [ ] UI elements display properly
- [ ] No console errors or warnings

---

This is a hobby-level project, so testing may be basic but functional. Report any issues on GitHub!