#!/usr/bin/env node

/**
 * Dynamic Footer Update Script
 * Automatically updates footer information before commits
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class FooterUpdater {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.footerPath = path.join(this.projectRoot, "wiki", "_Footer.md");
    this.manifestPath = path.join(this.projectRoot, "manifest.json");
    this.packagePath = path.join(this.projectRoot, "package.json");
  }

  async updateFooter() {
    console.log("🔄 Updating footer with dynamic information...");

    try {
      // Gather dynamic information
      const dynamicInfo = await this.gatherDynamicInfo();

      // Read current footer
      const footerContent = fs.readFileSync(this.footerPath, "utf8");

      // Update footer content
      const updatedContent = this.replaceDynamicContent(
        footerContent,
        dynamicInfo
      );

      // Write updated footer
      fs.writeFileSync(this.footerPath, updatedContent, "utf8");

      console.log("✅ Footer updated successfully!");
      console.log("📊 Updated information:");
      console.log(`   Version: ${dynamicInfo.version}`);
      console.log(`   Last Updated: ${dynamicInfo.lastUpdated}`);
      console.log(`   AI Providers: ${dynamicInfo.aiProviders}`);
      console.log(`   Website Handlers: ${dynamicInfo.websiteHandlers}`);
    } catch (error) {
      console.error("❌ Error updating footer:", error.message);
      process.exit(1);
    }
  }

  async gatherDynamicInfo() {
    const info = {
      version: this.getVersion(),
      lastUpdated: this.getLastUpdated(),
      aiProviders: await this.countAIProviders(),
      websiteHandlers: await this.countWebsiteHandlers(),
      browsers: this.getSupportedBrowsers(),
      license: this.getLicense(),
    };

    return info;
  }

  getVersion() {
    try {
      // Try package.json first
      if (fs.existsSync(this.packagePath)) {
        const packageData = JSON.parse(
          fs.readFileSync(this.packagePath, "utf8")
        );
        return packageData.version;
      }

      // Fallback to manifest.json
      if (fs.existsSync(this.manifestPath)) {
        const manifestData = JSON.parse(
          fs.readFileSync(this.manifestPath, "utf8")
        );
        return manifestData.version;
      }

      return "1.0.0";
    } catch (error) {
      console.warn("⚠️ Could not read version, using default");
      return "1.0.0";
    }
  }

  getLastUpdated() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  }

  async countAIProviders() {
    try {
      // Count provider files in src/providers/ directory
      const providersDir = path.join(this.projectRoot, "src", "providers");
      if (!fs.existsSync(providersDir)) {
        return this.getDefaultProviderCount();
      }

      const files = fs.readdirSync(providersDir);
      const providerFiles = files.filter(
        (file) => file.endsWith("Provider.ts") || file.endsWith("Provider.js")
      );

      return providerFiles.length || this.getDefaultProviderCount();
    } catch (error) {
      return this.getDefaultProviderCount();
    }
  }

  getDefaultProviderCount() {
    // Default known providers: OpenAI, Anthropic, Google Gemini, Cohere, Hugging Face
    return 5;
  }

  async countWebsiteHandlers() {
    try {
      // Count handler files in src/handlers/ directory
      const handlersDir = path.join(this.projectRoot, "src", "handlers");
      if (!fs.existsSync(handlersDir)) {
        return this.getDefaultHandlerCount();
      }

      const files = fs.readdirSync(handlersDir);
      const handlerFiles = files.filter(
        (file) => file.endsWith("Handler.ts") || file.endsWith("Handler.js")
      );

      return handlerFiles.length || this.getDefaultHandlerCount();
    } catch (error) {
      return this.getDefaultHandlerCount();
    }
  }

  getDefaultHandlerCount() {
    // Default known handlers: AO3, FFN, Wattpad, Royal Road, etc.
    return 10;
  }

  getSupportedBrowsers() {
    // Check manifest for browser compatibility
    try {
      const manifestData = JSON.parse(
        fs.readFileSync(this.manifestPath, "utf8")
      );
      const manifestVersion = manifestData.manifest_version;

      if (manifestVersion === 3) {
        return "Chrome, Firefox, Edge";
      } else if (manifestVersion === 2) {
        return "Chrome, Firefox";
      }

      return "Chrome, Firefox, Edge";
    } catch (error) {
      return "Chrome, Firefox, Edge";
    }
  }

  getLicense() {
    try {
      if (fs.existsSync(this.packagePath)) {
        const packageData = JSON.parse(
          fs.readFileSync(this.packagePath, "utf8")
        );
        return packageData.license || "Apache-2.0";
      }

      if (fs.existsSync(this.manifestPath)) {
        const manifestData = JSON.parse(
          fs.readFileSync(this.manifestPath, "utf8")
        );
        return manifestData.license || "Apache-2.0";
      }

      return "Apache-2.0";
    } catch (error) {
      return "Apache-2.0";
    }
  }

  replaceDynamicContent(content, info) {
    // Replace project stats section
    const statsRegex = /### 🎯 Project Stats[\s\S]*?(?=\n###|\n---|\n<div|$)/;
    const newStats = `### 🎯 Project Stats
- **Version**: ${info.version} | **Last Updated**: ${info.lastUpdated}
- **Browsers**: ${info.browsers} | **AI Providers**: ${info.aiProviders}+ Supported
- **Websites**: ${info.websiteHandlers}+ Official Handlers | **License**: ${info.license}`;

    return content.replace(statsRegex, newStats);
  }

  // Method to check if update is needed (for git hooks)
  shouldUpdate() {
    try {
      // Check if footer was modified recently
      const stats = fs.statSync(this.footerPath);
      const lastModified = stats.mtime;
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

      return lastModified < hourAgo;
    } catch (error) {
      return true; // Update if we can't determine
    }
  }
}

// CLI interface
if (require.main === module) {
  const updater = new FooterUpdater();

  const args = process.argv.slice(2);

  if (args.includes("--check")) {
    // Just check if update is needed
    console.log(updater.shouldUpdate() ? "UPDATE_NEEDED" : "UP_TO_DATE");
  } else if (args.includes("--force") || updater.shouldUpdate()) {
    // Update footer
    updater.updateFooter();
  } else {
    console.log("📋 Footer is up to date");
  }
}

module.exports = FooterUpdater;
