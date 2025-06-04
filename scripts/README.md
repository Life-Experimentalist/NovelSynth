# NovelSynth Scripts Directory

This directory contains all build, development, and maintenance scripts for the NovelSynth extension.

## 📁 Directory Structure

```
scripts/
├── dist/                       # Build output directory (auto-generated)
│   ├── chrome/                 # Chrome extension build
│   ├── firefox/                # Firefox extension build
│   ├── edge/                   # Edge extension build
│   └── *.zip                   # Packaged extensions
├── build-extension.js          # Main build script
├── update-footer.js            # Dynamic footer updater
├── test-extension.bat          # Cross-browser testing helper
├── setup-dev.bat               # Development environment setup
├── pre-commit.sh               # Git pre-commit hook
└── README.md                   # This file
```

## 🛠️ Available Scripts

### Build Scripts
- **`build-extension.js`** - Creates browser-specific builds and packages
- **`npm run build`** - Complete build process with footer update

### Development Scripts
- **`update-footer.js`** - Updates footer with current project stats
- **`setup-dev.bat`** - One-time development environment setup (Windows CMD)
- **`setup-dev.ps1`** - One-time development environment setup (Windows PowerShell with emoji support)
- **`test-extension.bat`** - Interactive browser testing helper

### Automation Scripts
- **`pre-commit.sh`** - Auto-updates footer before git commits

## 🚀 Quick Start

### First-time Setup
```bash
# Windows Command Prompt (ASCII-only)
scripts\setup-dev.bat

# Windows PowerShell (with emoji support)
npm run setup:ps
# OR: powershell -ExecutionPolicy Bypass -File scripts/setup-dev.ps1

# Cross-platform manual setup
npm install
npm run update-footer
```

### Building the Extension
```bash
# Build for all browsers
npm run build

# Clean build (removes old dist files)
npm run clean-build

# Just update footer
npm run update-footer
```

### Testing in Browsers
```bash
# Interactive testing guide
scripts\test-extension.bat

# Or manually load unpacked extension:
# - Development: Load from project root
# - Production: Load from scripts/dist/[browser]/
```

## 📦 Build Output

The `dist/` directory structure after building:

```
scripts/dist/
├── chrome/
│   ├── manifest.json       # Chrome-optimized manifest
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   └── ...                 # All extension files
├── firefox/
│   ├── manifest.json       # Firefox-optimized manifest
│   └── ...                 # All extension files
├── edge/
│   ├── manifest.json       # Edge-optimized manifest
│   └── ...                 # All extension files
├── novelsynth-chrome-v1.0.0.zip
├── novelsynth-firefox-v1.0.0.zip
└── novelsynth-edge-v1.0.0.zip
```

## 🔧 Browser-Specific Modifications

The build script automatically applies browser-specific modifications:

### Firefox
- Adds `browser_specific_settings` for gecko compatibility
- Includes both `service_worker` and `scripts` in background section
- Sets minimum Firefox version to 88.0

### Chrome
- Uses standard Manifest V3 format
- Removes Firefox-specific fields
- Optimized for Chrome Web Store

### Edge
- Uses Chromium-compatible format
- Same as Chrome with Edge-specific optimizations

## 🔄 Automated Footer Updates

The footer update system automatically tracks:
- **Version**: From package.json or manifest.json
- **Last Updated**: Current date
- **AI Providers**: Count of files in `src/providers/`
- **Website Handlers**: Count of files in `src/handlers/`
- **Browser Support**: Based on manifest version

### Manual Footer Update
```bash
# Update footer now
npm run update-footer

# Force update (ignore recent update check)
npm run update-footer-force

# Check if update is needed
npm run check-footer
```

### Automatic Updates
Footer updates automatically:
- Before every git commit (via pre-commit hook)
- During build process
- During development setup

## 🌐 Cross-Platform Support

### Automatic Platform Detection
The setup system automatically detects your operating system and runs the appropriate setup:

```bash
# Universal setup (recommended)
npm run setup

# Platform-specific options
npm run setup:ps    # Windows PowerShell (with emojis)
npm run setup:bat   # Windows Command Prompt (ASCII only)
npm run setup:sh    # Unix/Linux/macOS (with emojis)
```

### Platform-Specific Features

#### Windows
- **PowerShell Script**: Full emoji support, colored output, execution policy handling
- **Batch Script**: ASCII-only, universal compatibility
- **Auto-detection**: Checks PowerShell execution policy and chooses best option

#### Linux/macOS
- **Shell Script**: Full emoji support, colored output
- **Package Detection**: Automatically detects missing utilities (zip, git)
- **Permission Handling**: Automatically makes scripts executable

## 📦 Advanced Packaging System

### Package Formats by Browser

| Browser     | Store Format | Dev Format | Direct Install    |
| ----------- | ------------ | ---------- | ----------------- |
| **Firefox** | `.zip`       | `.zip`     | `.xpi`            |
| **Chrome**  | `.zip`       | `.zip`     | `.crx` (with key) |
| **Edge**    | `.zip`       | `.zip`     | `.zip`            |

### Package Creation
```bash
# Create all packages
npm run package

# Create packages only (skip build)
npm run package:only

# Clean and package
npm run clean-package
```

### Package Output Structure
```
scripts/packages/
├── novelsynth-firefox-v1.0.0.zip    # Store upload
├── novelsynth-firefox-v1.0.0.xpi    # Direct install
├── novelsynth-chrome-v1.0.0.zip     # Store upload
├── novelsynth-chrome-v1.0.0.crx     # Direct install (if key exists)
└── novelsynth-edge-v1.0.0.zip       # Store upload
```

## 🔄 Development Workflow

### Real-time Development
```bash
# Start file watcher with reload instructions
npm run dev

# Shows:
# - File change notifications
# - Browser reload reminders
# - Performance tips
```

### Development Commands
```bash
# Quick development cycle
npm run clean-build    # Clean + build
npm run dev            # Watch for changes
npm run test           # Run tests
npm run package        # Create packages

# Individual steps
npm run build          # Build only
npm run update-footer  # Update project info
npm run clean          # Clean build files
```

## 🛡️ PowerShell Execution Policy Handling

### Automatic Policy Detection
The setup system automatically handles PowerShell execution policies:

1. **Checks current policy**: `Get-ExecutionPolicy`
2. **Tests script execution**: Tries running a simple script
3. **Falls back gracefully**: Uses batch script if PowerShell is restricted
4. **Provides instructions**: Shows how to enable PowerShell if desired

### Manual PowerShell Setup
If you want to enable PowerShell scripts permanently:

```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use bypass for single execution:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-dev.ps1
```

## 🧪 Testing Guidelines

### Development Testing
1. Load unpacked extension from project root
2. Test core functionality
3. Check browser console for errors
4. Verify on multiple websites

### Production Testing
1. Build extension: `npm run build`
2. Load from `scripts/dist/[browser]/`
3. Test packaged functionality
4. Verify browser-specific features

### Supported Test Sites
- Archive of Our Own (archiveofourown.org)
- FanFiction.Net (fanfiction.net)
- Wattpad (wattpad.com)
- Royal Road (royalroad.com)
- Generic long-form content sites

## 🔧 Extension Development Utilities

### File Watching (`auto-reload.js`)
- **Real-time monitoring**: Watches all extension files
- **Smart filtering**: Only triggers on relevant file types
- **Debounced changes**: Prevents spam from rapid saves
- **Reload instructions**: Shows specific reload steps per file type

### Cross-Platform Testing
- **Automated browser detection**: Finds installed browsers
- **Testing scripts**: Platform-specific testing helpers
- **Development tips**: Performance and debugging guidance

### Build Optimization
- **Browser-specific builds**: Optimized manifest for each browser
- **Size optimization**: Excludes unnecessary files
- **Validation**: Checks for common extension issues

## 🚀 Production Release Workflow

### Complete Release Process
```bash
# 1. Update version in package.json and manifest.json
# 2. Run full test and build
npm run release

# This automatically runs:
# - npm run test          (linting + extension tests)
# - npm run package       (build + create packages)
```

### Store Submission
1. **Firefox**: Upload `.zip` to [addons.mozilla.org](https://addons.mozilla.org)
2. **Chrome**: Upload `.zip` to [Chrome Web Store](https://chrome.google.com/webstore/developer/dashboard)
3. **Edge**: Upload `.zip` to [Edge Add-ons](https://partner.microsoft.com/en-us/dashboard/microsoftedge)

### Version Management
- Version is automatically read from `package.json`
- Consistent across all builds and packages
- Included in package filenames for easy identification

---

## 💡 Pro Tips

### Development Efficiency
- Use `npm run dev` for real-time development
- Keep browser DevTools open to see console output
- Test on multiple sites to ensure compatibility
- Use the file watcher to know exactly what to reload

### Cross-Platform Development
- Test scripts on different operating systems
- Use the cross-platform setup for consistent environments
- Leverage platform-specific features when available

### Browser Testing
- Load unpacked extensions for development
- Use packaged versions for final testing
- Test browser-specific features (especially Firefox vs Chrome)
- Verify permissions work correctly across browsers

For more detailed information, see the main project documentation in `/docs/` directory and to the `wiki` section of this project's repository.