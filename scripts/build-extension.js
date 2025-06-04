#!/usr/bin/env node

/**
 * Extension Build and Package Script
 * Creates distribution packages for different browsers
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ExtensionBuilder {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.scriptsDir = path.join(this.projectRoot, "scripts");
    this.distDir = path.join(this.scriptsDir, "dist");
    this.buildTime = new Date().toISOString();
  }

  async build() {
    console.log("🔨 Building NovelSynth Extension...");
    console.log(`📅 Build time: ${this.buildTime}`);

    try {
      // Clean and create dist directory
      this.cleanDist();
      this.createDist();

      // Copy extension files
      await this.copyFiles();

      // Create browser-specific packages
      await this.createBrowserPackages();

      console.log("✅ Build completed successfully!");
      console.log(`📦 Distribution files created in: ${this.distDir}`);

      this.showBuildSummary();
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
    }
  }

  cleanDist() {
    if (fs.existsSync(this.distDir)) {
      console.log("🧹 Cleaning previous build...");
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
  }

  createDist() {
    fs.mkdirSync(this.distDir, { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "chrome"), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "firefox"), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "edge"), { recursive: true });
  }

  async copyFiles() {
    console.log("📋 Copying extension files...");

    const filesToCopy = [
      "manifest.json",
      "background.js",
      "content.js",
      "content.css",
      "popup.html",
      "popup.js",
      "popup.css",
      "icons/",
      "src/",
      "_locales/",
    ];

    const browsers = ["chrome", "firefox", "edge"];

    for (const browser of browsers) {
      const browserDir = path.join(this.distDir, browser);

      for (const file of filesToCopy) {
        const sourcePath = path.join(this.projectRoot, file);
        const destPath = path.join(browserDir, file);

        if (fs.existsSync(sourcePath)) {
          if (fs.statSync(sourcePath).isDirectory()) {
            this.copyDirectory(sourcePath, destPath);
          } else {
            fs.copyFileSync(sourcePath, destPath);
          }
        }
      }

      // Browser-specific manifest modifications
      await this.customizeForBrowser(browser, browserDir);
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  async customizeForBrowser(browser, browserDir) {
    const manifestPath = path.join(browserDir, "manifest.json");

    if (!fs.existsSync(manifestPath)) return;

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    switch (browser) {
      case "firefox":
        // Firefox-specific modifications
        manifest.browser_specific_settings = {
          gecko: {
            id: "novelsynth@life-experimentalist.com",
            strict_min_version: "88.0",
          },
        };

        // Ensure background scripts for Firefox compatibility
        if (manifest.background && manifest.background.service_worker) {
          manifest.background.scripts = [manifest.background.service_worker];
        }
        break;

      case "edge":
        // Edge-specific modifications
        // Edge uses Chromium base, so mostly compatible with Chrome
        break;

      case "chrome":
        // Chrome-specific modifications
        // Remove Firefox-specific fields if they exist
        delete manifest.browser_specific_settings;
        break;
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  async createBrowserPackages() {
    console.log("📦 Creating distribution packages...");

    const browsers = ["chrome", "firefox", "edge"];

    for (const browser of browsers) {
      const browserDir = path.join(this.distDir, browser);
      const packageName = `novelsynth-${browser}-v${this.getVersion()}.zip`;
      const packagePath = path.join(this.distDir, packageName);

      try {
        // Create zip package
        if (process.platform === "win32") {
          // Windows PowerShell
          execSync(
            `powershell Compress-Archive -Path "${browserDir}\\*" -DestinationPath "${packagePath}"`,
            {
              cwd: this.projectRoot,
            }
          );
        } else {
          // Unix/Linux/Mac
          execSync(`cd "${browserDir}" && zip -r "../${packageName}" ./*`, {
            cwd: this.projectRoot,
            shell: "/bin/bash",
          });
        }

        console.log(`✅ Created ${packageName}`);
      } catch (error) {
        console.error(`❌ Failed to create ${packageName}:`, error.message);
      }
    }
  }

  getVersion() {
    try {
      const packagePath = path.join(this.projectRoot, "package.json");
      if (fs.existsSync(packagePath)) {
        const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
        return packageData.version;
      }

      const manifestPath = path.join(this.projectRoot, "manifest.json");
      if (fs.existsSync(manifestPath)) {
        const manifestData = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        return manifestData.version;
      }

      return "1.0.0";
    } catch (error) {
      return "1.0.0";
    }
  }

  showBuildSummary() {
    console.log("\n📊 Build Summary:");
    console.log("================");

    const files = fs.readdirSync(this.distDir);
    const packages = files.filter((f) => f.endsWith(".zip"));

    console.log(`📦 Packages created: ${packages.length}`);
    packages.forEach((pkg) => {
      const size = fs.statSync(path.join(this.distDir, pkg)).size;
      const sizeKB = Math.round(size / 1024);
      console.log(`   ${pkg} (${sizeKB} KB)`);
    });
    console.log("\n🚀 Installation Instructions:");
    console.log(
      "Chrome: chrome://extensions/ → Load unpacked → Select scripts/dist/chrome/"
    );
    console.log(
      "Firefox: about:debugging → Load Temporary Add-on → Select scripts/dist/firefox/"
    );
    console.log(
      "Edge: edge://extensions/ → Load unpacked → Select scripts/dist/edge/"
    );

    console.log("\n📋 Or install packaged versions:");
    packages.forEach((pkg) => {
      const browser = pkg.split("-")[1];
      console.log(`${browser}: Install ${pkg}`);
    });
  }
}

// CLI interface
if (require.main === module) {
  const builder = new ExtensionBuilder();
  builder.build();
}

module.exports = ExtensionBuilder;
