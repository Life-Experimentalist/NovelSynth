#!/usr/bin/env node

/**
 * Cross-Platform Extension Packaging Script
 * Creates proper packages for different browsers (ZIP, CRX, XPI)
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

class ExtensionPackager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.scriptsDir = path.join(this.projectRoot, "scripts");
    this.distDir = path.join(this.scriptsDir, "dist");
    this.packagesDir = path.join(this.scriptsDir, "packages");
    this.buildTime = new Date().toISOString();
    this.platform = os.platform();
  }

  async package() {
    console.log("📦 Creating Extension Packages...");
    console.log(`🖥️  Platform: ${this.platform}`);
    console.log(`📅 Build time: ${this.buildTime}`);

    try {
      // Ensure build exists
      await this.ensureBuild();

      // Create packages directory
      this.createPackagesDir();

      // Create browser-specific packages
      await this.createBrowserPackages();

      console.log("✅ Packaging completed successfully!");
      console.log(`📦 Packages created in: ${this.packagesDir}`);

      this.showPackageSummary();
    } catch (error) {
      console.error("❌ Packaging failed:", error.message);
      process.exit(1);
    }
  }

  async ensureBuild() {
    if (!fs.existsSync(this.distDir)) {
      console.log("🔨 No build found, creating build first...");
      const BuildExtension = require("./build-extension");
      const builder = new BuildExtension();
      await builder.build();
    }
  }

  createPackagesDir() {
    if (fs.existsSync(this.packagesDir)) {
      console.log("🧹 Cleaning previous packages...");
      fs.rmSync(this.packagesDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.packagesDir, { recursive: true });
  }

  async createBrowserPackages() {
    const browsers = ["chrome", "firefox", "edge"];
    const version = this.getVersion();

    for (const browser of browsers) {
      console.log(`📦 Creating ${browser} package...`);
      await this.createBrowserPackage(browser, version);
    }
  }

  async createBrowserPackage(browser, version) {
    const browserDir = path.join(this.distDir, browser);

    if (!fs.existsSync(browserDir)) {
      console.warn(`⚠️ No build found for ${browser}, skipping...`);
      return;
    }

    switch (browser) {
      case "firefox":
        await this.createFirefoxPackage(browserDir, version);
        break;
      case "chrome":
        await this.createChromePackage(browserDir, version);
        break;
      case "edge":
        await this.createEdgePackage(browserDir, version);
        break;
    }
  }

  async createFirefoxPackage(browserDir, version) {
    // Firefox uses .xpi (which is just a ZIP with .xpi extension)
    const packageName = `novelsynth-firefox-v${version}.xpi`;
    const packagePath = path.join(this.packagesDir, packageName);

    try {
      await this.createZipPackage(browserDir, packagePath);

      // Also create a .zip version for manual installation
      const zipName = `novelsynth-firefox-v${version}.zip`;
      const zipPath = path.join(this.packagesDir, zipName);
      await this.createZipPackage(browserDir, zipPath);

      console.log(`✅ Created ${packageName} and ${zipName}`);
    } catch (error) {
      console.error(`❌ Failed to create Firefox package:`, error.message);
    }
  }

  async createChromePackage(browserDir, version) {
    // Chrome uses .zip for Chrome Web Store
    const packageName = `novelsynth-chrome-v${version}.zip`;
    const packagePath = path.join(this.packagesDir, packageName);

    try {
      await this.createZipPackage(browserDir, packagePath);

      // Try to create .crx if possible (requires private key)
      await this.createCrxPackage(browserDir, version);

      console.log(`✅ Created ${packageName}`);
    } catch (error) {
      console.error(`❌ Failed to create Chrome package:`, error.message);
    }
  }

  async createEdgePackage(browserDir, version) {
    // Edge uses .zip (same as Chrome)
    const packageName = `novelsynth-edge-v${version}.zip`;
    const packagePath = path.join(this.packagesDir, packageName);

    try {
      await this.createZipPackage(browserDir, packagePath);
      console.log(`✅ Created ${packageName}`);
    } catch (error) {
      console.error(`❌ Failed to create Edge package:`, error.message);
    }
  }

  async createZipPackage(sourceDir, packagePath) {
    const isWindows = this.platform === "win32";

    if (isWindows) {
      // Windows PowerShell
      const cmd = `powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${packagePath}' -Force"`;
      execSync(cmd, { cwd: this.projectRoot });
    } else {
      // Unix/Linux/macOS
      const sourceBasename = path.basename(sourceDir);
      const packagesBasename = path.basename(packagePath);
      const cmd = `cd "${path.dirname(
        sourceDir
      )}" && zip -r "../packages/${packagesBasename}" "${sourceBasename}/"`;
      execSync(cmd, { cwd: this.projectRoot, shell: "/bin/bash" });
    }
  }

  async createCrxPackage(browserDir, version) {
    // Chrome .crx creation (requires chrome or chromium)
    const keyPath = path.join(this.scriptsDir, "chrome-extension-key.pem");

    if (!fs.existsSync(keyPath)) {
      console.log("💡 No Chrome private key found, skipping .crx creation");
      console.log(
        `   Generate key: chrome --pack-extension="${browserDir}" --pack-extension-key="${keyPath}"`
      );
      return;
    }

    try {
      const packageName = `novelsynth-chrome-v${version}.crx`;
      const packagePath = path.join(this.packagesDir, packageName);

      // Try to use chrome/chromium to create .crx
      const chromeCmd = this.getChromeCommand();
      if (chromeCmd) {
        const cmd = `"${chromeCmd}" --pack-extension="${browserDir}" --pack-extension-key="${keyPath}"`;
        execSync(cmd, { cwd: this.projectRoot });

        // Move the created .crx to packages directory
        const createdCrx = path.join(
          path.dirname(browserDir),
          `${path.basename(browserDir)}.crx`
        );
        if (fs.existsSync(createdCrx)) {
          fs.renameSync(createdCrx, packagePath);
          console.log(`✅ Created ${packageName}`);
        }
      }
    } catch (error) {
      console.log(
        "💡 Could not create .crx package (Chrome not found or key issues)"
      );
    }
  }

  getChromeCommand() {
    const possiblePaths = {
      win32: [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
      ],
      darwin: [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
      ],
      linux: [
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
        "/usr/bin/chromium-browser",
        "/snap/bin/chromium",
      ],
    };

    const paths = possiblePaths[this.platform] || [];

    for (const chromePath of paths) {
      try {
        const expandedPath = chromePath.replace(
          "%USERNAME%",
          os.userInfo().username
        );
        if (fs.existsSync(expandedPath)) {
          return expandedPath;
        }
      } catch (error) {
        continue;
      }
    }

    // Try command line versions
    try {
      execSync("chrome --version", { stdio: "ignore" });
      return "chrome";
    } catch (error) {
      try {
        execSync("chromium --version", { stdio: "ignore" });
        return "chromium";
      } catch (error) {
        return null;
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

  showPackageSummary() {
    console.log("\n📊 Package Summary:");
    console.log("===================");

    if (!fs.existsSync(this.packagesDir)) {
      console.log("No packages created");
      return;
    }

    const files = fs.readdirSync(this.packagesDir);
    const packages = files.filter((f) => f.match(/\.(zip|xpi|crx)$/));

    console.log(`📦 Packages created: ${packages.length}`);
    packages.forEach((pkg) => {
      const size = fs.statSync(path.join(this.packagesDir, pkg)).size;
      const sizeKB = Math.round(size / 1024);
      const type = path.extname(pkg).toUpperCase();
      console.log(`   ${pkg} (${sizeKB} KB) ${type}`);
    });

    console.log("\n🚀 Installation Instructions:");
    console.log(
      "Firefox: Install .xpi directly or load .zip as temporary add-on"
    );
    console.log("Chrome: Upload .zip to Chrome Web Store or load unpacked");
    console.log("Edge: Upload .zip to Edge Add-ons store or load unpacked");

    if (packages.some((p) => p.endsWith(".crx"))) {
      console.log(
        "Chrome: .crx can be installed directly (enable Developer mode)"
      );
    }

    console.log("\n📋 Package Details:");
    console.log(
      "• .zip - Standard archive for store upload or manual installation"
    );
    console.log("• .xpi - Firefox signed package (can be installed directly)");
    console.log("• .crx - Chrome extension package (requires Developer mode)");
  }
}

// CLI interface
if (require.main === module) {
  const packager = new ExtensionPackager();
  packager.package();
}

module.exports = ExtensionPackager;
