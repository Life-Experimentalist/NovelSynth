# NovelSynth Testing Guide

## 🔧 **Quick Start Testing**

### Install Dependencies
```bash
npm install
```

### Build Extension (Unified for All Browsers)
```bash
# Single build works for Chrome, Firefox, and Edge
npm run build

# Development build with source maps
npm run build:dev
```

### Load in Chrome/Edge
```bash
# After building:
# 1. Go to chrome://extensions/ (Chrome) or edge://extensions/ (Edge)
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the 'dist' folder
```

### Load in Firefox
```bash
# After building:
# 1. Go to about:debugging
# 2. Click "This Firefox"
# 3. Click "Load Temporary Add-on"
# 4. Select manifest.json from 'dist' folder

# Or use web-ext for development:
cd dist && npx web-ext run
```

## 🚀 **Cross-Browser Compatibility**

### Manifest V3 Unified Support
- ✅ **Chrome 88+**: Full Manifest V3 support
- ✅ **Firefox 109+**: Full Manifest V3 support
- ✅ **Edge 88+**: Full Manifest V3 support

### Single Build Process
- One `manifest.json` works across all browsers
- Unified extension API with cross-browser compatibility layer
- Same `dist/` folder can be loaded in any supported browser

## 📦 **Release Packaging**

### Create Release Packages
```bash
# Build and create versioned packages
npm run prepare-release

# This creates in releases/ folder:
# - novelsynth-chrome-v1.0.0.zip
# - novelsynth-firefox-v1.0.0.zip
```

### Package Structure
Both packages contain identical files from `dist/`:
```
dist/
├── manifest.json         # Unified manifest for all browsers
├── background.js         # Service worker
├── content.js           # Content script
├── popup.js             # Popup interface
├── popup.html           # Popup HTML
├── content.css          # Content styles
└── icons/               # Extension icons
```

## 🧪 **How to Test the Extension**

### Step 1: Build the Extension
```bash
# Install dependencies (first time only)
npm install

# Build extension for all browsers
npm run build
```

### Step 2: Load in Chrome
1. Open Chrome browser
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/` folder
6. Extension should appear in toolbar with NovelSynth icon

### Step 3: Load in Firefox
1. Open Firefox browser
2. Go to `about:debugging`
3. Click "This Firefox" in left sidebar
4. Click "Load Temporary Add-on..."
5. Navigate to `dist/` folder and select `manifest.json`
6. Extension should appear in toolbar

### Step 4: Load in Edge
1. Open Microsoft Edge browser
2. Go to `edge://extensions/`
3. Enable "Developer mode" (toggle in left sidebar)
4. Click "Load unpacked"
5. Select the `dist/` folder
6. Extension should appear in toolbar

### Step 5: Test Functionality
1. Navigate to a supported website (e.g., fanfiction.net story)
2. Click the NovelSynth extension icon
3. Configure your AI provider (Google Gemini recommended)
4. Try enhancing content on the page
5. Verify toggle between original/enhanced content works

## 🎯 **Cross-Browser Testing Checklist**

### ✅ Chrome Testing
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly
- [ ] Content detection works
- [ ] AI enhancement functions
- [ ] Settings persist across sessions

### ✅ Firefox Testing
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly
- [ ] Content detection works
- [ ] AI enhancement functions
- [ ] Settings persist across sessions

### ✅ Edge Testing
- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens correctly
- [ ] Content detection works
- [ ] AI enhancement functions
- [ ] Settings persist across sessions

## 📦 **Creating Release Packages**

### Build and Package for Distribution
```bash
# Create versioned packages for both browsers
npm run package

# This creates in releases/ folder:
# - novelsynth-chrome-v1.0.0.zip
# - novelsynth-firefox-v1.0.0.zip
```

### Manual Package Creation
```bash
# Build first
npm run build

# Create packages manually
npm run package:only
```

Both packages contain identical files and work on their respective platforms.

## 📝 Content Detection Testing

### Fiction Sites
- [ ] **FanFiction.Net**
  - Visit: https://www.fanfiction.net/s/5782108/1/
  - [ ] Content detection banner appears
  - [ ] "Enhance" button visible
  - [ ] Content type detected as "novel"

- [ ] **Archive of Our Own**
  - Visit any long fanfiction
  - [ ] Content detection works
  - [ ] Site-specific handler loads

- [ ] **Royal Road**
  - Visit any web novel chapter
  - [ ] Content detection works
  - [ ] Enhancement options appear

### Technical Sites
- [ ] **GeeksforGeeks**
  - Visit: https://www.geeksforgeeks.org/javascript-tutorial/
  - [ ] Content detected as "technical"
  - [ ] Enhancement preserves code blocks

- [ ] **Medium**
  - Visit any long-form article
  - [ ] Content detection works
  - [ ] Article-specific enhancements

### News Sites
- [ ] **Any News Site**
  - Visit long news articles
  - [ ] Content detected as "news" or "article"
  - [ ] Summarization features work

## 🤖 AI Functionality Testing

### Content Enhancement
- [ ] **Basic Enhancement**
  - Select content on test site
  - Click "Enhance" button
  - [ ] Processing banner appears
  - [ ] Model and provider shown correctly
  - [ ] Word count statistics displayed
  - [ ] Enhanced content returned
  - [ ] Original formatting preserved

- [ ] **Different Content Types**
  - [ ] Novel content enhancement works
  - [ ] Technical content preserves code
  - [ ] Article enhancement maintains structure

### Summarization
- [ ] **Article Summarization**
  - Use summarize feature on long article
  - [ ] Summary generated successfully
  - [ ] Key points preserved
  - [ ] Reasonable length reduction

### Analysis and Suggestions
- [ ] **Content Analysis**
  - Run analysis on sample content
  - [ ] Analysis provides insights
  - [ ] Writing style feedback

- [ ] **Smart Suggestions**
  - Generate suggestions for content
  - [ ] Relevant suggestions provided
  - [ ] Context-appropriate recommendations

## ⚙️ Settings and Configuration

### Provider Testing
- [ ] **Gemini** (if API key available)
  - [ ] Content enhancement works
  - [ ] Model selection functions
  - [ ] Rate limiting respected

- [ ] **OpenAI** (if API key available)
  - [ ] API integration works
  - [ ] Different models selectable

- [ ] **Other Providers**
  - Test available providers
  - [ ] Proper error handling for missing keys
  - [ ] Fallback behavior works

### Model Selection
- [ ] **Feature-Specific Models**
  - [ ] Different models for enhancement/summarization
  - [ ] Model switching works correctly
  - [ ] Performance differences observable

### Rate Limiting
- [ ] **Rate Limit Settings**
  - [ ] Enable/disable rate limiting
  - [ ] Adjust wait times
  - [ ] Retry logic functions
  - [ ] Error messages informative

## 🔍 Error Handling and Edge Cases

### API Errors
- [ ] **Invalid API Key**
  - [ ] Clear error message shown
  - [ ] User directed to settings
  - [ ] Extension remains functional

- [ ] **Rate Limit Exceeded**
  - [ ] Retry logic activates
  - [ ] User informed of wait time
  - [ ] Automatic retry works

- [ ] **Network Issues**
  - [ ] Timeout handling works
  - [ ] Offline behavior graceful

### Content Edge Cases
- [ ] **Very Long Content**
  - Test with 10,000+ word articles
  - [ ] Content segmentation works
  - [ ] Images preserved
  - [ ] Formatting maintained

- [ ] **Short Content**
  - [ ] Below threshold content ignored
  - [ ] No false positives

- [ ] **Complex Formatting**
  - [ ] Tables preserved
  - [ ] Lists maintained
  - [ ] Code blocks intact

## 🎨 UI/UX Testing

### Popup Interface
- [ ] **Responsive Design**
  - [ ] Popup renders correctly
  - [ ] Tabs function properly
  - [ ] Settings save correctly

- [ ] **Dark/Light Mode**
  - [ ] Theme switching works
  - [ ] Consistent styling

### Content Integration
- [ ] **Processing Banner**
  - [ ] Shows during processing
  - [ ] Displays progress information
  - [ ] Dismissible by user

- [ ] **Enhancement Controls**
  - [ ] Buttons appear correctly
  - [ ] Hover states work
  - [ ] Click handling responsive

## 📊 Performance Testing

### Memory Usage
- [ ] **Extension Overhead**
  - Monitor in `chrome://extensions/`
  - [ ] Memory usage reasonable (<20MB)
  - [ ] No memory leaks over time

### Processing Speed
- [ ] **Enhancement Speed**
  - [ ] Small content (<1000 words): <10 seconds
  - [ ] Medium content (1000-5000 words): <30 seconds
  - [ ] Large content (>5000 words): Segments properly

### Network Usage
- [ ] **API Efficiency**
  - [ ] Only necessary requests made
  - [ ] Proper content segmentation
  - [ ] No excessive retries

## 🔒 Security and Privacy

### Data Handling
- [ ] **Local Storage Only**
  - [ ] API keys stored locally
  - [ ] No data sent to NovelSynth servers
  - [ ] Clear data deletion works

### Permissions
- [ ] **Minimal Permissions**
  - [ ] Only required permissions requested
  - [ ] Host permissions work correctly
  - [ ] No unnecessary access

## ✅ Final Validation

### Cross-Browser Compatibility
- [ ] **Chrome** - All features work
- [ ] **Firefox** - All features work
- [ ] **Edge** (optional) - Basic functionality

### Documentation
- [ ] **README.md** - Complete and accurate
- [ ] **Installation instructions** - Clear and correct
- [ ] **Configuration guide** - Comprehensive

### Release Preparation
- [ ] **Version numbers** - Consistent across files
- [ ] **Package creation** - `npm run package:chrome` works
- [ ] **File compression** - Release packages created

---

## 🎯 Success Criteria

**Extension is ready for release when:**
- [ ] All critical tests pass (90%+ overall)
- [ ] At least one AI provider fully functional
- [ ] Content detection works on major sites
- [ ] No critical errors in browser console
- [ ] Documentation is complete
- [ ] Cross-browser compatibility confirmed

**Known Issues Log:**
- Document any known issues or limitations
- Include workarounds where available
- Note planned fixes for future versions
