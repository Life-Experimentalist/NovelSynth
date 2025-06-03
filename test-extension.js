#!/usr/bin/env node

/**
 * NovelSynth Extension Testing Script
 * Comprehensive testing for all extension functionality
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

class ExtensionTester {
  constructor() {
    this.testResults = [];
    this.distPath = path.join(__dirname, "dist");
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  logTest(testName, passed, details = "") {
    const status = passed ? "✅ PASS" : "❌ FAIL";
    const color = passed ? colors.green : colors.red;
    this.log(`${status} ${testName}${details ? " - " + details : ""}`, color);
    this.testResults.push({ testName, passed, details });
  }

  async runAllTests() {
    this.log(
      "🚀 Starting NovelSynth Extension Tests",
      colors.cyan + colors.bold
    );
    this.log("============================================", colors.cyan);

    // Test build files
    await this.testBuildFiles();

    // Test manifest
    await this.testManifest();

    // Test TypeScript compilation
    await this.testTypeScript();

    // Test JavaScript syntax
    await this.testJavaScriptSyntax();

    // Test required files
    await this.testRequiredFiles();

    // Test icon files
    await this.testIconFiles();

    // Summary
    this.printSummary();
  }

  async testBuildFiles() {
    this.log("\n📦 Testing Build Files", colors.blue + colors.bold);

    const requiredFiles = [
      "background.js",
      "content.js",
      "popup.js",
      "popup.html",
      "manifest.json",
      "content.css",
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.distPath, file);
      const exists = fs.existsSync(filePath);
      this.logTest(`Build file: ${file}`, exists, exists ? "Found" : "Missing");
    }
  }

  async testManifest() {
    this.log("\n📋 Testing Manifest File", colors.blue + colors.bold);

    const manifestPath = path.join(this.distPath, "manifest.json");

    if (!fs.existsSync(manifestPath)) {
      this.logTest("Manifest exists", false, "File not found");
      return;
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      // Test required fields
      this.logTest(
        "Manifest version",
        !!manifest.manifest_version,
        `v${manifest.manifest_version}`
      );
      this.logTest("Extension name", !!manifest.name, manifest.name);
      this.logTest("Extension version", !!manifest.version, manifest.version);
      this.logTest("Description", !!manifest.description, "Present");

      // Test permissions
      const hasPermissions =
        manifest.permissions && manifest.permissions.length > 0;
      this.logTest(
        "Permissions defined",
        hasPermissions,
        hasPermissions ? manifest.permissions.join(", ") : "None"
      );

      // Test background script
      const hasBackground =
        manifest.background && manifest.background.service_worker;
      this.logTest(
        "Background service worker",
        hasBackground,
        hasBackground ? manifest.background.service_worker : "Missing"
      );

      // Test content scripts
      const hasContentScripts =
        manifest.content_scripts && manifest.content_scripts.length > 0;
      this.logTest(
        "Content scripts",
        hasContentScripts,
        hasContentScripts
          ? `${manifest.content_scripts.length} scripts`
          : "Missing"
      );

      // Test action (popup)
      const hasAction = manifest.action && manifest.action.default_popup;
      this.logTest(
        "Extension popup",
        hasAction,
        hasAction ? manifest.action.default_popup : "Missing"
      );
    } catch (error) {
      this.logTest("Manifest valid JSON", false, error.message);
    }
  }

  async testTypeScript() {
    this.log("\n🔍 Testing TypeScript Compilation", colors.blue + colors.bold);

    const { exec } = require("child_process");

    return new Promise((resolve) => {
      exec("npx tsc --noEmit", (error, stdout, stderr) => {
        if (error) {
          this.logTest("TypeScript compilation", false, "Has errors");
          if (stderr) {
            this.log(`TypeScript errors:\n${stderr}`, colors.red);
          }
        } else {
          this.logTest("TypeScript compilation", true, "No errors");
        }
        resolve();
      });
    });
  }

  async testJavaScriptSyntax() {
    this.log("\n🔧 Testing JavaScript Syntax", colors.blue + colors.bold);

    const jsFiles = ["background.js", "content.js", "popup.js"];

    for (const file of jsFiles) {
      const filePath = path.join(this.distPath, file);

      if (!fs.existsSync(filePath)) {
        this.logTest(`JS Syntax: ${file}`, false, "File not found");
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, "utf8");

        // Basic syntax check - look for obvious issues
        const hasUnterminatedString = /["'][^"']*$/.test(
          content.split("\n").join(" ")
        );
        const hasMismatchedBraces = this.checkBraceMatching(content);
        const hasUnterminatedComment = /\/\*(?!.*\*\/)/.test(content);

        const syntaxOk =
          !hasUnterminatedString &&
          !hasMismatchedBraces &&
          !hasUnterminatedComment;
        this.logTest(
          `JS Syntax: ${file}`,
          syntaxOk,
          syntaxOk ? "OK" : "Potential issues"
        );
      } catch (error) {
        this.logTest(`JS Syntax: ${file}`, false, error.message);
      }
    }
  }

  checkBraceMatching(content) {
    const braces = { "{": 0, "[": 0, "(": 0 };
    const closing = { "}": "{", "]": "[", ")": "(" };

    for (const char of content) {
      if (braces.hasOwnProperty(char)) {
        braces[char]++;
      } else if (closing.hasOwnProperty(char)) {
        braces[closing[char]]--;
      }
    }

    return Object.values(braces).some((count) => count !== 0);
  }

  async testRequiredFiles() {
    this.log("\n📁 Testing Required Files", colors.blue + colors.bold);

    const requiredPaths = [
      { path: "popup.html", type: "HTML file" },
      { path: "content.css", type: "CSS file" },
      { path: "icons", type: "Icons directory" },
    ];

    for (const { path: filePath, type } of requiredPaths) {
      const fullPath = path.join(this.distPath, filePath);
      const exists = fs.existsSync(fullPath);

      if (exists && filePath === "icons") {
        // Check if it's a directory with icon files
        const isDir = fs.statSync(fullPath).isDirectory();
        const hasIcons =
          isDir && fs.readdirSync(fullPath).some((f) => f.endsWith(".png"));
        this.logTest(
          type,
          hasIcons,
          hasIcons ? "Directory with icons" : "Empty directory"
        );
      } else {
        this.logTest(type, exists, exists ? "Found" : "Missing");
      }
    }
  }

  async testIconFiles() {
    this.log("\n🎨 Testing Icon Files", colors.blue + colors.bold);

    const iconSizes = ["16", "32", "48", "128"];
    const iconsDir = path.join(this.distPath, "icons");

    if (!fs.existsSync(iconsDir)) {
      this.logTest("Icons directory", false, "Missing");
      return;
    }

    for (const size of iconSizes) {
      const iconPath = path.join(iconsDir, `icon${size}.png`);
      const exists = fs.existsSync(iconPath);
      this.logTest(
        `Icon ${size}x${size}`,
        exists,
        exists ? "Found" : "Missing"
      );
    }
  }

  printSummary() {
    this.log("\n📊 Test Summary", colors.magenta + colors.bold);
    this.log("===================", colors.magenta);

    const passed = this.testResults.filter((r) => r.passed).length;
    const total = this.testResults.length;
    const percentage = Math.round((passed / total) * 100);

    this.log(
      `\nTests passed: ${passed}/${total} (${percentage}%)`,
      percentage >= 90
        ? colors.green
        : percentage >= 70
        ? colors.yellow
        : colors.red
    );

    if (percentage < 100) {
      this.log("\n❌ Failed Tests:", colors.red + colors.bold);
      this.testResults
        .filter((r) => !r.passed)
        .forEach((test) => {
          this.log(
            `  • ${test.testName}${test.details ? " - " + test.details : ""}`,
            colors.red
          );
        });
    }

    this.log("\n🎯 Recommendations:", colors.cyan + colors.bold);

    if (percentage >= 90) {
      this.log("✨ Extension is ready for testing!", colors.green);
      this.log("Next steps:", colors.blue);
      this.log("  1. Load extension in browser", colors.blue);
      this.log("  2. Test on supported websites", colors.blue);
      this.log("  3. Configure API keys", colors.blue);
      this.log("  4. Test enhancement features", colors.blue);
    } else if (percentage >= 70) {
      this.log("⚠️  Extension has some issues but may work", colors.yellow);
      this.log("Fix the failed tests before browser testing", colors.yellow);
    } else {
      this.log("🚨 Extension has critical issues", colors.red);
      this.log("Must fix failed tests before proceeding", colors.red);
    }

    this.log(
      "\n📖 For detailed testing instructions, see README.md",
      colors.cyan
    );
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ExtensionTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ExtensionTester;
