#!/usr/bin/env node

/**
 * Cross-Platform Setup Script
 * Auto-detects platform and runs appropriate setup
 */

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");
const os = require("os");

class CrossPlatformSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.scriptsDir = path.join(this.projectRoot, "scripts");
    this.platform = os.platform();
    this.isWindows = this.platform === "win32";
    this.isMac = this.platform === "darwin";
    this.isLinux = this.platform === "linux";
  }

  async setup() {
    console.log("🚀 NovelSynth Cross-Platform Setup");
    console.log(`🖥️  Detected platform: ${this.getPlatformName()}`);
    console.log("");

    try {
      // Check prerequisites
      await this.checkPrerequisites();

      // Run platform-specific setup
      if (this.isWindows) {
        await this.setupWindows();
      } else {
        await this.setupUnix();
      }

      console.log("✅ Setup completed successfully!");
      this.showPostSetupInstructions();
    } catch (error) {
      console.error("❌ Setup failed:", error.message);
      process.exit(1);
    }
  }

  getPlatformName() {
    switch (this.platform) {
      case "win32":
        return "Windows";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return this.platform;
    }
  }

  async checkPrerequisites() {
    console.log("🔍 Checking prerequisites...");

    // Check if we're in the right directory
    if (!fs.existsSync(path.join(this.projectRoot, "manifest.json"))) {
      throw new Error(
        "Please run this script from the NovelSynth project root directory"
      );
    }

    // Check Node.js
    try {
      const nodeVersion = execSync("node --version", {
        encoding: "utf8",
      }).trim();
      console.log(`✅ Node.js: ${nodeVersion}`);
    } catch (error) {
      throw new Error(
        "Node.js is required but not found. Please install Node.js 16+ from https://nodejs.org/"
      );
    }

    // Check npm
    try {
      const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
      console.log(`✅ npm: v${npmVersion}`);
    } catch (error) {
      throw new Error("npm is required but not found");
    }

    // Check git (optional but recommended)
    try {
      const gitVersion = execSync("git --version", { encoding: "utf8" }).trim();
      console.log(`✅ Git: ${gitVersion}`);
    } catch (error) {
      console.log(
        "⚠️  Git not found (optional, but recommended for development)"
      );
    }

    console.log("");
  }

  async setupWindows() {
    console.log("🔧 Setting up for Windows...");

    // Check PowerShell availability and execution policy
    const canRunPowerShell = await this.checkPowerShellPolicy();

    if (canRunPowerShell) {
      console.log("✅ PowerShell available with proper execution policy");
      await this.runPowerShellSetup();
    } else {
      console.log("⚠️  PowerShell restricted, using Command Prompt setup");
      await this.runBatchSetup();
    }
  }

  async setupUnix() {
    console.log(`🔧 Setting up for ${this.getPlatformName()}...`);

    // Install dependencies
    await this.installDependencies();

    // Setup git hooks
    await this.setupGitHooks();

    // Update footer
    await this.updateFooter();

    console.log("📋 Setup completed for Unix-like system");
  }

  async checkPowerShellPolicy() {
    try {
      // Check if PowerShell can run scripts
      const policy = execSync('powershell -Command "Get-ExecutionPolicy"', {
        encoding: "utf8",
        timeout: 5000,
      }).trim();

      console.log(`🔒 PowerShell Execution Policy: ${policy}`);

      // Policies that allow script execution
      const allowedPolicies = ["Unrestricted", "RemoteSigned", "Bypass"];

      if (allowedPolicies.includes(policy)) {
        return true;
      }

      // Try to run a simple script to test
      execSync(
        "powershell -ExecutionPolicy Bypass -Command \"Write-Host 'Test'\"",
        {
          stdio: "ignore",
          timeout: 3000,
        }
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  async runPowerShellSetup() {
    console.log("🎨 Running PowerShell setup (with emoji support)...");

    const psScript = path.join(this.scriptsDir, "setup-dev.ps1");

    if (!fs.existsSync(psScript)) {
      throw new Error("PowerShell setup script not found");
    }

    try {
      execSync(`powershell -ExecutionPolicy Bypass -File "${psScript}"`, {
        stdio: "inherit",
        cwd: this.projectRoot,
      });
    } catch (error) {
      console.log("⚠️  PowerShell setup failed, falling back to batch setup");
      await this.runBatchSetup();
    }
  }

  async runBatchSetup() {
    console.log("📝 Running Command Prompt setup...");

    const batScript = path.join(this.scriptsDir, "setup-dev.bat");

    if (!fs.existsSync(batScript)) {
      throw new Error("Batch setup script not found");
    }

    execSync(`"${batScript}"`, {
      stdio: "inherit",
      cwd: this.projectRoot,
    });
  }

  async installDependencies() {
    console.log("📦 Installing dependencies...");

    if (fs.existsSync(path.join(this.projectRoot, "package.json"))) {
      try {
        execSync("npm install", {
          stdio: "inherit",
          cwd: this.projectRoot,
        });
        console.log("✅ Dependencies installed");
      } catch (error) {
        console.log("⚠️  npm install failed, continuing...");
      }
    } else {
      console.log("⚠️  package.json not found, skipping npm install");
    }
  }

  async setupGitHooks() {
    console.log("🔗 Setting up Git hooks...");

    const hooksDir = path.join(this.projectRoot, ".git", "hooks");
    const preCommitHook = path.join(hooksDir, "pre-commit");
    const preCommitScript = path.join(this.scriptsDir, "pre-commit.sh");

    // Create hooks directory if it doesn't exist
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Copy pre-commit hook
    if (fs.existsSync(preCommitScript)) {
      fs.copyFileSync(preCommitScript, preCommitHook);

      // Make executable on Unix systems
      if (!this.isWindows) {
        try {
          execSync(`chmod +x "${preCommitHook}"`);
        } catch (error) {
          console.log("⚠️  Could not make pre-commit hook executable");
        }
      }

      console.log("✅ Pre-commit hook installed");
    } else {
      console.log("⚠️  Pre-commit hook script not found, skipping...");
    }
  }

  async updateFooter() {
    console.log("📋 Updating footer...");

    const footerScript = path.join(this.scriptsDir, "update-footer.js");

    if (fs.existsSync(footerScript)) {
      try {
        execSync(`node "${footerScript}" --force`, {
          stdio: "inherit",
          cwd: this.projectRoot,
        });
        console.log("✅ Footer updated");
      } catch (error) {
        console.log("⚠️  Footer update failed, continuing...");
      }
    } else {
      console.log("⚠️  Footer update script not found, skipping...");
    }
  }

  showPostSetupInstructions() {
    console.log("");
    console.log("🎉 Setup Complete!");
    console.log("==================");
    console.log("");
    console.log("📝 Available commands:");
    console.log(
      "  npm run build              - Build extension for all browsers"
    );
    console.log("  npm run package            - Create distribution packages");
    console.log("  npm run dev                - Start development mode");
    console.log("  npm run update-footer      - Update project information");
    console.log("  npm run test               - Run tests");
    console.log("  npm run clean              - Clean build files");
    console.log("");

    if (this.isWindows) {
      console.log("🧪 Testing in browsers:");
      console.log("  scripts\\test-extension.bat - Interactive testing guide");
      console.log("");
      console.log("💡 PowerShell users can also use:");
      console.log(
        "  npm run setup:ps           - PowerShell setup (with emojis)"
      );
    } else {
      console.log("🧪 Testing in browsers:");
      console.log("  Firefox: about:debugging#/runtime/this-firefox");
      console.log("  Chrome:  chrome://extensions/ (Developer mode)");
      console.log("  Edge:    edge://extensions/ (Developer mode)");
    }

    console.log("");
    console.log("🚀 Happy coding!");
  }

  static async autoSetup() {
    const setup = new CrossPlatformSetup();
    await setup.setup();
  }
}

// CLI interface
if (require.main === module) {
  CrossPlatformSetup.autoSetup().catch((error) => {
    console.error("Setup failed:", error.message);
    process.exit(1);
  });
}

module.exports = CrossPlatformSetup;
