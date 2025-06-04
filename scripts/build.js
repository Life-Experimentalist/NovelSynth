#!/usr/bin/env node

/**
 * NovelSynth Extension Build Script
 * Complete build pipeline with metadata synchronization and distribution packaging
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { syncMetadata } = require("./sync-metadata");

class ExtensionBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.releasesDir = path.join(this.rootDir, "releases");
    this.startTime = Date.now();
  }

  displayBanner() {
    const os = require('os');
    const packageJson = require(path.join(this.rootDir, "package.json"));

    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                     NovelSynth Build System                  ║');
    console.log('║                  Browser Extension Builder                   ║');
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║ Project:     ${packageJson.name || 'NovelSynth'}`.padEnd(63) + '║');
    console.log(`║ Version:     ${packageJson.version || '1.0.0'}`.padEnd(63) + '║');
    console.log(`║ Author:      ${packageJson.author || 'VKrishna04'}`.padEnd(63) + '║');
    console.log(`║ License:     ${packageJson.license || 'Apache-2.0'}`.padEnd(63) + '║');
    console.log(`║ Homepage:    ${packageJson.homepage || 'N/A'}`.substring(0, 46).padEnd(63) + '║');
    console.log(`║ Platform:    ${os.platform()} ${os.arch()}`.padEnd(63) + '║');
    console.log(`║ Node.js:     ${process.version}`.padEnd(63) + '║');
    console.log(`║ Memory:      ${Math.round(os.totalmem() / 1024 / 1024 / 1024)}GB total, ${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB free`.padEnd(63) + '║');
    console.log(`║ CPU:         ${os.cpus()[0].model.substring(0, 46)}`.padEnd(63) + '║');
    console.log(`║ Working Dir: ${this.rootDir.substring(0, 46)}`.padEnd(63) + '║');
    console.log(`║ Target:      Chrome v3 + Firefox v2 Extensions`.padEnd(63) + '║');
    console.log(`║ Build Time:  ${new Date().toLocaleString()}`.padEnd(63) + '║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

    let icon;
    switch (level) {
      case 'success': icon = '✅'; break;
      case 'error': icon = '❌'; break;
      case 'warning': icon = '⚠️'; break;
      case 'progress': icon = '🔨'; break;
      case 'info': default: icon = 'ℹ️'; break;
    }

    console.log(`${icon} [${elapsed}s] ${message}`);
  }

  progress(current, total, task) {
    const percentage = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.round(percentage / 5)) + '░'.repeat(20 - Math.round(percentage / 5));
    console.log(`🔄 [${bar}] ${percentage}% - ${task}`);
  }

  async ensureDirectories() {
    this.log("Creating build directories...");
    [this.distDir, this.releasesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async cleanBuild() {
    this.log("Cleaning previous build...");
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }
    await this.ensureDirectories();
  }
  async syncMetadataStep() {
    this.log("Synchronizing metadata between manifest.json and package.json...");
    try {
      const success = syncMetadata();
      if (success) {
        this.log("Metadata synchronized successfully", 'success');
      } else {
        this.log("Metadata sync completed with warnings", 'warning');
      }
    } catch (error) {
      this.log("Metadata sync failed, continuing anyway...", 'warning');
    }
  }

  async buildWithWebpack() {
    this.log("Building extension with Webpack...");
    try {
      execSync("npm run build", {
        cwd: this.rootDir,
        stdio: "inherit",
      });
      this.log("Webpack build completed successfully", 'success');
    } catch (error) {
      this.log("Webpack build failed", 'error');
      throw error;
    }
  }

  copyDirectory(src, dest, exclude = []) {
    if (!fs.existsSync(src)) {
      throw new Error(`Source directory does not exist: ${src}`);
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);

    for (const item of items) {
      if (exclude.includes(item)) continue;

      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        this.copyDirectory(srcPath, destPath, exclude);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  createBrowserSpecificManifest(browser) {
    const manifestPath = path.join(this.distDir, "manifest.json");
    let manifest;

    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    } catch (error) {
      this.error(`Failed to read manifest.json from ${manifestPath}`);
      throw error;
    }

    if (browser === "firefox") {
      // Firefox-specific modifications for Manifest V2 compatibility
      if (manifest.manifest_version === 3) {
        manifest.manifest_version = 2;

        // Convert action to browser_action for Firefox
        if (manifest.action) {
          manifest.browser_action = manifest.action;
          delete manifest.action;
        }

        // Convert service_worker to background scripts
        if (manifest.background && manifest.background.service_worker) {
          manifest.background = {
            scripts: [manifest.background.service_worker],
            persistent: false,
          };
        }

        // Merge host_permissions into permissions for v2
        if (manifest.host_permissions) {
          manifest.permissions = [
            ...(manifest.permissions || []),
            ...manifest.host_permissions,
          ];
          delete manifest.host_permissions;
        }
      }

      // Add Firefox-specific browser settings
      manifest.browser_specific_settings = {
        gecko: {
          id: "novelsynth@life-experimentalist.com",
          strict_min_version: "109.0"
        }
      };
    }

    return manifest;
  }

  async packageForBrowser(browser) {
    this.log(`Creating ${browser} package...`);

    const browserDistDir = path.join(this.distDir, `${browser}-dist`);

    // Clean and create browser-specific dist directory
    if (fs.existsSync(browserDistDir)) {
      fs.rmSync(browserDistDir, { recursive: true });
    }

    // Copy all files from main dist to browser-specific dist
    this.copyDirectory(this.distDir, browserDistDir, [`${browser}-dist`, 'firefox-dist', 'chrome-dist']);

    // Create browser-specific manifest
    const manifest = this.createBrowserSpecificManifest(browser);
    fs.writeFileSync(
      path.join(browserDistDir, "manifest.json"),
      JSON.stringify(manifest, null, 2)
    );

    // Get version from package.json
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(this.rootDir, "package.json"), "utf8")
    );
    const version = packageJson.version;
    const timestamp = new Date().toISOString().split('T')[0];

    // Create zip package
    const zipName = `novelsynth-${browser}-v${version}-${timestamp}.zip`;
    const zipPath = path.join(this.releasesDir, zipName);

    try {
      // Use cross-platform zip command or PowerShell on Windows
      const isWindows = process.platform === 'win32';

      if (isWindows) {
        const powershellCommand = `Compress-Archive -Path "${browserDistDir}\\*" -DestinationPath "${zipPath}" -Force`;
        execSync(`powershell -Command "${powershellCommand}"`, {
          stdio: "pipe",
        });
      } else {
        // Unix-like systems
        execSync(`cd "${browserDistDir}" && zip -r "${zipPath}" .`, {
          stdio: "pipe",
        });
      }

      this.log(`✅ ${browser} package created: ${zipName}`);

      // Clean up browser-specific dist directory
      fs.rmSync(browserDistDir, { recursive: true });

      return zipName;
    } catch (error) {
      this.error(`Failed to create ${browser} package`);
      throw error;
    }
  }

  async createSourcePackage() {
    this.log("Creating source package for store reviews...");

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(this.rootDir, "package.json"), "utf8")
    );
    const version = packageJson.version;
    const timestamp = new Date().toISOString().split('T')[0];

    const sourceZipName = `novelsynth-source-v${version}-${timestamp}.zip`;
    const sourceZipPath = path.join(this.releasesDir, sourceZipName);

    const sourceFiles = [
      "src",
      "build",
      "package.json",
      "manifest.json",
      "tsconfig.json",
      "webpack.config.js",
      "README.md",
      ".gitignore"
    ];

    try {
      const isWindows = process.platform === 'win32';

      if (isWindows) {
        // Create temp directory with source files
        const tempSourceDir = path.join(this.rootDir, "temp-source");
        if (fs.existsSync(tempSourceDir)) {
          fs.rmSync(tempSourceDir, { recursive: true });
        }
        fs.mkdirSync(tempSourceDir);

        // Copy source files
        sourceFiles.forEach(file => {
          const srcPath = path.join(this.rootDir, file);
          const destPath = path.join(tempSourceDir, file);

          if (fs.existsSync(srcPath)) {
            const stat = fs.statSync(srcPath);
            if (stat.isDirectory()) {
              this.copyDirectory(srcPath, destPath);
            } else {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        });

        const powershellCommand = `Compress-Archive -Path "${tempSourceDir}\\*" -DestinationPath "${sourceZipPath}" -Force`;
        execSync(`powershell -Command "${powershellCommand}"`, {
          stdio: "pipe",
        });

        // Clean up temp directory
        fs.rmSync(tempSourceDir, { recursive: true });
      } else {
        // Unix-like systems
        const fileList = sourceFiles.join(" ");
        execSync(`zip -r "${sourceZipPath}" ${fileList}`, {
          cwd: this.rootDir,
          stdio: "pipe",
        });
      }

      this.log(`✅ Source package created: ${sourceZipName}`);
      return sourceZipName;
    } catch (error) {
      this.error("Failed to create source package");
      throw error;
    }
  }

  async generateReleaseNotes() {
    this.log("Generating release notes...");

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(this.rootDir, "package.json"), "utf8")
    );
    const version = packageJson.version;
    const timestamp = new Date().toISOString().split('T')[0];

    const releaseNotes = `# NovelSynth v${version} Release Notes

**Release Date:** ${timestamp}

## 📦 Package Information

- **Version:** ${version}
- **Build Date:** ${new Date().toISOString()}
- **Supported Browsers:** Chrome, Firefox
- **Manifest Version:** Chrome (v3), Firefox (v2)

## 📥 Installation Files

- \`novelsynth-chrome-v${version}-${timestamp}.zip\` - Chrome/Chromium extension
- \`novelsynth-firefox-v${version}-${timestamp}.zip\` - Firefox add-on
- \`novelsynth-source-v${version}-${timestamp}.zip\` - Source code for review

## 🚀 Installation Instructions

### Chrome/Chromium
1. Download \`novelsynth-chrome-v${version}-${timestamp}.zip\`
2. Extract the zip file
3. Open Chrome and navigate to \`chrome://extensions/\`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

### Firefox
1. Download \`novelsynth-firefox-v${version}-${timestamp}.zip\`
2. Extract the zip file
3. Open Firefox and navigate to \`about:debugging\`
4. Click "This Firefox" → "Load Temporary Add-on"
5. Select the \`manifest.json\` file from the extracted folder

## ⚙️ Configuration

1. Click the NovelSynth extension icon
2. Configure your AI provider API keys
3. Customize enhancement settings
4. Visit supported websites to start enhancing content

## 🌐 Supported Websites

- Fiction sites: FanFiction.Net, Archive of Our Own, Royal Road, WebNovel.com
- Technical sites: GeeksforGeeks, Medium, Substack
- News sites: Various news websites
- Any website with long-form content

## 🔧 Technical Details

- **AI Providers:** Gemini, OpenAI, Anthropic, HuggingFace, OpenRouter
- **Features:** Content enhancement, summarization, analysis, suggestions
- **Rate Limiting:** Built-in with configurable retry logic
- **Content Segmentation:** Handles large content while preserving formatting

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/LifeExperimentalist/novelsynth/issues)
- **Documentation:** [GitHub Pages](https://life-experimentalist.github.io/novelsynth)
- **Repository:** [GitHub](https://github.com/LifeExperimentalist/novelsynth)

---

Generated automatically by NovelSynth build system
`;

    const notesPath = path.join(this.releasesDir, `release-notes-v${version}.md`);
    fs.writeFileSync(notesPath, releaseNotes);

    this.log(`✅ Release notes generated: release-notes-v${version}.md`);
  }
  async build() {
    try {
      this.displayBanner();
      this.log("🚀 Starting NovelSynth extension build process...", 'info');
      console.log('');

      // Step 1: Sync metadata
      this.progress(1, 6, "Synchronizing metadata");
      await this.syncMetadataStep();

      // Step 2: Clean and prepare
      this.progress(2, 6, "Cleaning and preparing directories");
      await this.cleanBuild();

      // Step 3: Build with Webpack
      this.progress(3, 6, "Compiling with Webpack");
      await this.buildWithWebpack();

      // Step 4: Create browser packages
      this.progress(4, 6, "Creating browser packages");
      const packages = [];
      packages.push(await this.packageForBrowser("chrome"));
      packages.push(await this.packageForBrowser("firefox"));

      // Step 5: Create source package
      this.progress(5, 6, "Creating source package");
      packages.push(await this.createSourcePackage());

      // Step 6: Generate release notes
      this.progress(6, 6, "Generating release notes");
      await this.generateReleaseNotes();

      const buildTime = ((Date.now() - this.startTime) / 1000).toFixed(2);

      console.log('\n╔═══════════════════════════════════════════════════════════════╗');
      console.log('║                        BUILD SUCCESSFUL                      ║');
      console.log('╠═══════════════════════════════════════════════════════════════╣');
      console.log(`║ Total Build Time: ${buildTime}s`.padEnd(63) + '║');
      console.log(`║ Packages Created: ${packages.length}`.padEnd(63) + '║');
      console.log('╠═══════════════════════════════════════════════════════════════╣');
      console.log('║ Generated Packages:'.padEnd(63) + '║');
      packages.forEach(pkg => {
        console.log(`║   📦 ${pkg}`.substring(0, 63).padEnd(63) + '║');
      });
      console.log('╠═══════════════════════════════════════════════════════════════╣');
      console.log(`║ Release Notes: release-notes-v${JSON.parse(fs.readFileSync(path.join(this.rootDir, "package.json"), "utf8")).version}.md`.padEnd(63) + '║');
      console.log(`║ Website: https://life-experimentalist.github.io/novelsynth`.padEnd(63) + '║');
      console.log(`║ Repository: github.com/LifeExperimentalist/novelsynth`.padEnd(63) + '║');
      console.log('╚═══════════════════════════════════════════════════════════════╝');

    } catch (error) {
      const buildTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log('\n╔═══════════════════════════════════════════════════════════════╗');
      console.log('║                         BUILD FAILED                         ║');
      console.log('╠═══════════════════════════════════════════════════════════════╣');
      console.log(`║ Build Time: ${buildTime}s`.padEnd(63) + '║');
      console.log(`║ Error: ${error.message.substring(0, 54)}`.padEnd(63) + '║');
      console.log('╚═══════════════════════════════════════════════════════════════╝');
      console.error('\nDetailed Error:', error);
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
NovelSynth Extension Build System

Usage: node build/build.js [options]

Options:
  --help, -h     Show this help message

This script builds the NovelSynth extension for Chrome and Firefox,
creates distribution packages, and generates release notes.

The build process includes:
1. Metadata synchronization between manifest.json and package.json
2. Webpack compilation and optimization
3. Browser-specific manifest generation
4. Package creation (Chrome, Firefox, Source)
5. Release notes generation

Output: releases/ directory with distributable packages
    `);
    process.exit(0);
  }

  const builder = new ExtensionBuilder();
  builder.build();
}

module.exports = ExtensionBuilder;
