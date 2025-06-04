# Browser Extension Testing Guide

**Complete guide for testing NovelSynth across different browsers**

## 🦊 Firefox Testing

### Method 1: Temporary Installation (Development)
1. **Open Firefox Developer Tools**
   - Open Firefox
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Or press `Ctrl+Shift+Alt+I` and go to "This Firefox"

2. **Load Extension**
   - Click "Load Temporary Add-on..."
   - Navigate to your extension folder: `v:\Code\ProjectCode\NovelSynth`
   - Select `manifest.json`
   - Click "Open"

3. **Verify Installation**
   - Extension should appear in the list with a green dot
   - Check browser toolbar for NovelSynth icon
   - Test functionality on a supported website

### Method 2: Permanent Installation (For Testing)
1. **Create XPI Package**
   ```bash
   # In your project directory
   zip -r novelsynth.xpi * -x "node_modules/*" ".git/*" "*.md"
   ```

2. **Install XPI**
   - Go to `about:addons`
   - Click gear icon → "Install Add-on From File..."
   - Select your `.xpi` file

### Firefox Debugging
- **Console Logs**: `about:debugging` → Your extension → "Inspect"
- **Background Script**: Access service worker console
- **Content Scripts**: Use browser DevTools on any page
- **Storage**: DevTools → Storage tab → Extension Storage

## 🌐 Microsoft Edge Testing

### Method 1: Developer Mode Installation
1. **Enable Developer Mode**
   - Open Edge
   - Go to `edge://extensions/`
   - Toggle "Developer mode" ON (top-right corner)

2. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Navigate to: `v:\Code\ProjectCode\NovelSynth`
   - Select the folder (not manifest.json directly)
   - Click "Select Folder"

3. **Verify Installation**
   - Extension appears in extensions list
   - NovelSynth icon visible in toolbar
   - Test on supported websites

### Method 2: Package and Install
1. **Create Package**
   ```bash
   # Create a zip file of your extension
   cd v:\Code\ProjectCode\NovelSynth
   powershell Compress-Archive -Path * -DestinationPath novelsynth.zip
   ```

2. **Install Package**
   - Go to `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select your folder
   - OR drag and drop the .zip file onto the extensions page

### Edge Debugging Tools
- **Extension Console**: `edge://extensions/` → Details → "Inspect views: background page"
- **Content Script Debugging**: F12 DevTools on any webpage
- **Network Monitoring**: DevTools → Network tab
- **Storage Inspection**: DevTools → Application → Storage

## 🔧 Advanced Testing Setup

### Cross-Browser Testing Script
Create `scripts/test-extension.bat`:

```batch
@echo off
echo Starting Cross-Browser Extension Testing...

echo.
echo 1. Firefox Testing Instructions:
echo    - Go to about:debugging#/runtime/this-firefox
echo    - Click "Load Temporary Add-on"
echo    - Select manifest.json from: %CD%
echo    - OR use built version from: %CD%\scripts\dist\firefox\
echo.

echo 2. Edge Testing Instructions:
echo    - Go to edge://extensions/
echo    - Enable "Developer mode"
echo    - Click "Load unpacked"
echo    - Select folder: %CD%
echo    - OR use built version from: %CD%\scripts\dist\edge\
echo.

echo 3. Chrome Testing Instructions (if available):
echo    - Go to chrome://extensions/
echo    - Enable "Developer mode"
echo    - Click "Load unpacked"
echo    - Select folder: %CD%
echo    - OR use built version from: %CD%\scripts\dist\chrome\
echo.

pause
```

### Automated Testing Setup
Create `scripts/auto-reload.js`:

```javascript
// Auto-reload extension during development
const fs = require('fs');
const path = require('path');

class ExtensionReloader {
  constructor(manifestPath) {
    this.manifestPath = manifestPath;
    this.lastModified = new Map();
    this.watchFiles();
  }

  watchFiles() {
    const watchPaths = [
      'src/',
      'popup/',
      'content/',
      'background/',
      'manifest.json'
    ];

    watchPaths.forEach(watchPath => {
      if (fs.existsSync(watchPath)) {
        fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
          if (filename && this.shouldReload(filename)) {
            console.log(`📁 File changed: ${filename}`);
            this.triggerReload();
          }
        });
      }
    });

    console.log('🔄 Watching for file changes...');
    console.log('💡 Reload extension manually in browser after changes');
  }

  shouldReload(filename) {
    const ext = path.extname(filename);
    return ['.js', '.css', '.html', '.json'].includes(ext);
  }

  triggerReload() {
    console.log('🔄 Changes detected - Please reload extension in browser');
    console.log('Firefox: about:debugging → Reload');
    console.log('Edge: edge://extensions/ → Reload');
  }
}

// Start watching
new ExtensionReloader('./manifest.json');
```

## 🧪 Testing Checklist

### Basic Functionality Tests
- [ ] Extension loads without errors
- [ ] Popup opens and displays correctly
- [ ] Content scripts inject properly
- [ ] Background service worker starts
- [ ] API key storage works
- [ ] Settings save and load correctly

### Website Compatibility Tests
- [ ] Archive of Our Own (archiveofourown.org)
- [ ] FanFiction.Net (fanfiction.net)
- [ ] Wattpad (wattpad.com)
- [ ] Royal Road (royalroad.com)
- [ ] Generic websites with long content

### AI Provider Tests
- [ ] OpenAI integration
- [ ] Anthropic integration
- [ ] Google Gemini integration
- [ ] Provider fallback functionality
- [ ] Rate limiting handling

### Error Handling Tests
- [ ] Invalid API keys
- [ ] Network failures
- [ ] Rate limit exceeded
- [ ] Malformed content
- [ ] Provider unavailability

## 🚨 Common Issues and Solutions

### Firefox Issues
**Issue**: "background.service_worker is currently disabled"
**Solution**: Updated manifest.json to include both service_worker and scripts

**Issue**: Content Security Policy errors
**Solution**: Add to manifest.json:
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'"
}
```

### Edge Issues
**Issue**: Extension doesn't load
**Solution**: Ensure Developer Mode is enabled and folder contains manifest.json

**Issue**: API calls blocked
**Solution**: Check host_permissions in manifest.json includes target domains

### General Debugging
**Issue**: Background script not working
**Solution**: Check browser console for service worker errors

**Issue**: Content script not injecting
**Solution**: Verify matches patterns in manifest.json

**Issue**: Popup not opening
**Solution**: Check popup.html path and ensure file exists

## 📊 Performance Testing

### Memory Usage Monitoring
```javascript
// Add to background script for monitoring
setInterval(() => {
  if (chrome.system && chrome.system.memory) {
    chrome.system.memory.getInfo((info) => {
      console.log('Memory usage:', {
        total: info.capacity,
        available: info.availableCapacity
      });
    });
  }
}, 30000); // Check every 30 seconds
```

### Network Performance
- Monitor API response times
- Track rate limit handling
- Measure content processing speed
- Analyze memory usage patterns

---

This guide provides comprehensive testing instructions for both Firefox and Edge, ensuring NovelSynth works perfectly across different browser environments.