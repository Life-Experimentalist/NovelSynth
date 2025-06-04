#!/usr/bin/env node

/**
 * Auto-reload Extension Development Script
 * Watches for file changes and provides reload instructions
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

class ExtensionReloader {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.lastModified = new Map();
    this.isWindows = os.platform() === "win32";
    this.watchers = [];
  }

  start() {
    console.log("🔄 NovelSynth Development Watcher");
    console.log("==================================");
    console.log(`📂 Watching: ${this.projectRoot}`);
    console.log(`🖥️  Platform: ${os.platform()}`);
    console.log("");

    this.showBrowserInstructions();
    this.watchFiles();
    this.setupGracefulShutdown();
  }

  showBrowserInstructions() {
    console.log("🧪 Browser Extension Reload Instructions:");
    console.log("");

    if (this.isWindows) {
      console.log("🦊 Firefox:");
      console.log("   1. Go to: about:debugging#/runtime/this-firefox");
      console.log('   2. Find NovelSynth → Click "Reload"');
      console.log("");
      console.log("🌐 Edge:");
      console.log("   1. Go to: edge://extensions/");
      console.log("   2. Find NovelSynth → Click reload icon");
      console.log("");
      console.log("🟢 Chrome:");
      console.log("   1. Go to: chrome://extensions/");
      console.log("   2. Find NovelSynth → Click reload icon");
    } else {
      console.log(
        "🦊 Firefox: about:debugging → This Firefox → NovelSynth → Reload"
      );
      console.log("🟢 Chrome: chrome://extensions/ → NovelSynth → Reload");
      console.log("🌐 Edge: edge://extensions/ → NovelSynth → Reload");
    }

    console.log("");
    console.log("💡 Pro tip: Keep browser DevTools open to see console logs");
    console.log("💡 Press Ctrl+C to stop watching");
    console.log("");
    console.log("📝 Watching for changes...");
    console.log("");
  }

  watchFiles() {
    const watchPaths = [
      { path: "src/", description: "Source files" },
      { path: "background.js", description: "Background script" },
      { path: "content.js", description: "Content script" },
      { path: "content.css", description: "Content styles" },
      { path: "popup.html", description: "Popup HTML" },
      { path: "popup.js", description: "Popup script" },
      { path: "popup.css", description: "Popup styles" },
      { path: "manifest.json", description: "Extension manifest" },
      { path: "_locales/", description: "Localization files" },
    ];

    watchPaths.forEach(({ path: watchPath, description }) => {
      const fullPath = path.join(this.projectRoot, watchPath);

      if (fs.existsSync(fullPath)) {
        try {
          const watcher = fs.watch(
            fullPath,
            { recursive: true },
            (eventType, filename) => {
              if (filename && this.shouldReload(filename)) {
                this.handleFileChange(watchPath, filename, description);
              }
            }
          );

          this.watchers.push(watcher);
          console.log(`👁️  Watching: ${watchPath} (${description})`);
        } catch (error) {
          console.log(`⚠️  Could not watch: ${watchPath} (${error.message})`);
        }
      }
    });

    console.log("");
  }

  shouldReload(filename) {
    const ext = path.extname(filename).toLowerCase();
    const reloadExtensions = [
      ".js",
      ".css",
      ".html",
      ".json",
      ".ts",
      ".tsx",
      ".jsx",
    ];

    // Skip temporary files and hidden files
    if (
      filename.startsWith(".") ||
      filename.includes("~") ||
      filename.includes(".tmp")
    ) {
      return false;
    }

    return reloadExtensions.includes(ext);
  }

  handleFileChange(watchPath, filename, description) {
    const timestamp = new Date().toLocaleTimeString();
    const fileKey = `${watchPath}/${filename}`;
    const now = Date.now();

    // Debounce rapid changes (ignore changes within 500ms)
    if (this.lastModified.has(fileKey)) {
      const lastTime = this.lastModified.get(fileKey);
      if (now - lastTime < 500) {
        return;
      }
    }

    this.lastModified.set(fileKey, now);

    console.log(`🔄 [${timestamp}] Changed: ${filename} (${description})`);
    this.showReloadReminder(filename);
  }

  showReloadReminder(filename) {
    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
      case ".js":
        if (filename.includes("background")) {
          console.log(
            "   💡 Background script changed → Reload extension in browser"
          );
        } else if (filename.includes("content")) {
          console.log(
            "   💡 Content script changed → Reload extension + refresh page"
          );
        } else if (filename.includes("popup")) {
          console.log("   💡 Popup script changed → Reload extension");
        } else {
          console.log("   💡 Script changed → Reload extension");
        }
        break;

      case ".css":
        if (filename.includes("content")) {
          console.log(
            "   💡 Content styles changed → Reload extension + refresh page"
          );
        } else {
          console.log("   💡 Styles changed → Reload extension");
        }
        break;

      case ".html":
        console.log("   💡 HTML changed → Reload extension");
        break;

      case ".json":
        if (filename === "manifest.json") {
          console.log("   🚨 Manifest changed → Must reload extension!");
        } else {
          console.log("   💡 JSON changed → Reload extension");
        }
        break;

      default:
        console.log("   💡 File changed → Consider reloading extension");
    }

    console.log("");
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      console.log("");
      console.log("🛑 Stopping file watcher...");

      this.watchers.forEach((watcher) => {
        try {
          watcher.close();
        } catch (error) {
          // Ignore close errors
        }
      });

      console.log("✅ File watcher stopped");
      console.log("🚀 Happy coding!");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    // Windows-specific handling
    if (this.isWindows) {
      process.on("SIGBREAK", shutdown);
    }
  }
}

// Additional utility functions
class DevUtils {
  static showQuickCommands() {
    console.log("🔧 Quick Development Commands:");
    console.log("");
    console.log("📦 Build commands:");
    console.log("   npm run build              - Build for all browsers");
    console.log("   npm run build:extension    - Build extension only");
    console.log("   npm run package           - Build + create packages");
    console.log("");
    console.log("🧹 Cleanup commands:");
    console.log("   npm run clean             - Clean build files");
    console.log("   npm run clean-build       - Clean + rebuild");
    console.log("");
    console.log("📝 Maintenance commands:");
    console.log("   npm run update-footer     - Update project info");
    console.log("   npm run test              - Run all tests");
    console.log("");
  }

  static showBrowserDevTools() {
    console.log("🛠️  Browser DevTools Tips:");
    console.log("");
    console.log("🔍 Debugging:");
    console.log("   • Background script: Extension page → Inspect views");
    console.log("   • Content script: F12 on any webpage → Console");
    console.log("   • Popup: Right-click popup → Inspect");
    console.log("");
    console.log("📊 Performance:");
    console.log("   • Monitor memory usage in DevTools");
    console.log("   • Check network requests in Network tab");
    console.log("   • Profile scripts in Performance tab");
    console.log("");
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    DevUtils.showQuickCommands();
    DevUtils.showBrowserDevTools();
    process.exit(0);
  }

  const reloader = new ExtensionReloader();
  reloader.start();
}

module.exports = { ExtensionReloader, DevUtils };
