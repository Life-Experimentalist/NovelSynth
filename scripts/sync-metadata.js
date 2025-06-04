#!/usr/bin/env node

/**
 * Build Synchronization Script
 * Synchronizes metadata between manifest.json and package.json
 */

const fs = require("fs");
const path = require("path");

// File paths
const ROOT_DIR = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT_DIR, "manifest.json");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");

/**
 * Reads and parses a JSON file with comment support
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    // Remove comments and clean up the JSON
    const cleanContent = content
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/[\x00-\x1F\x7F]/g, "") // Remove control characters
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .trim();

    return JSON.parse(cleanContent);
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Writes JSON to file with proper formatting
 */
function writeJsonFile(filePath, data) {
  try {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Display system information banner
 */
function displayBanner() {
  const os = require('os');
  const packageJson = readJsonFile(PACKAGE_PATH);

  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                     NovelSynth Build System                  ║');
  console.log('║                   Metadata Synchronization                   ║');
  console.log('╠═══════════════════════════════════════════════════════════════╣');
  console.log(`║ Project:     ${packageJson.name || 'NovelSynth'}`.padEnd(63) + '║');
  console.log(`║ Version:     ${packageJson.version || '1.0.0'}`.padEnd(63) + '║');
  console.log(`║ Author:      ${packageJson.author || 'VKrishna04'}`.padEnd(63) + '║');
  console.log(`║ Platform:    ${os.platform()} ${os.arch()}`.padEnd(63) + '║');
  console.log(`║ Node.js:     ${process.version}`.padEnd(63) + '║');
  console.log(`║ Working Dir: ${process.cwd()}`.substring(0, 46).padEnd(63) + '║');
  console.log(`║ Timestamp:   ${new Date().toLocaleString()}`.padEnd(63) + '║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log('');
}

/**
 * Main synchronization function
 */
function syncMetadata() {
  displayBanner();
  console.log("🔄 Syncing metadata from manifest.json to package.json...\n");

  // Read both files
  const manifest = readJsonFile(MANIFEST_PATH);
  const packageJson = readJsonFile(PACKAGE_PATH);

  // Create backup
  const backupDir = path.join(ROOT_DIR, "build", "backup");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(
    path.join(backupDir, `package-backup-${timestamp}.json`),
    JSON.stringify(packageJson, null, 2)
  );

  // Sync data from manifest to package.json (manifest is source of truth)
  const updatedPackage = {
    ...packageJson,
    name: (manifest.name || "novelsynth").toLowerCase().replace(/\s+/g, ""),
    version: manifest.version,
    description: manifest.description,
    author: manifest.author,
    license: manifest.license,
    homepage: manifest.homepage_url || "https://life-experimentalist.github.io/novelsynth",
    repository: {
      type: manifest.repository?.type || "git",
      url: manifest.repository?.url || "https://github.com/LifeExperimentalist/novelsynth",
    },
    bugs: {
      url: (manifest.repository?.url || "https://github.com/LifeExperimentalist/novelsynth") + "/issues"
    },
    keywords: [
      "browser-extension",
      "ai",
      "content-enhancement",
      "web-novels",
      "text-processing",
      "chrome-extension",
      "firefox-addon"
    ],
    extensionInfo: {
      manifestVersion: manifest.manifest_version,
      shortName: manifest.short_name,
      permissions: manifest.permissions,
      hostPermissions: manifest.host_permissions,
      lastSync: new Date().toISOString(),
    }
  };

  // Write updated package.json
  writeJsonFile(PACKAGE_PATH, updatedPackage);

  // Display sync summary
  console.log("\n📋 Sync Summary:");
  console.log(`   Name: ${updatedPackage.name}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Author: ${manifest.author}`);
  console.log(`   License: ${manifest.license}`);
  console.log(`   Homepage: ${updatedPackage.homepage}`);
  console.log(`   Repository: ${updatedPackage.repository.url}`);

  console.log("\n✅ Metadata synchronization completed!");
  return true;
}

/**
 * CLI interface
 */
function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
NovelSynth Build Metadata Synchronization

Usage: node build/sync-metadata.js [options]

Options:
  --help, -h     Show this help message
  --check        Check for inconsistencies without making changes

This script synchronizes metadata from manifest.json to package.json.
    `);
    return;
  }

  if (args.includes("--check")) {
    console.log("🔍 Checking for metadata inconsistencies...\n");

    const manifest = readJsonFile(MANIFEST_PATH);
    const packageJson = readJsonFile(PACKAGE_PATH);

    const issues = [];

    if (manifest.version !== packageJson.version) {
      issues.push(`Version: manifest(${manifest.version}) vs package(${packageJson.version})`);
    }

    if (manifest.author !== packageJson.author) {
      issues.push(`Author: manifest(${manifest.author}) vs package(${packageJson.author})`);
    }

    if (manifest.license !== packageJson.license) {
      issues.push(`License: manifest(${manifest.license}) vs package(${packageJson.license})`);
    }

    if (issues.length === 0) {
      console.log("✅ No inconsistencies found!");
    } else {
      console.log("⚠️  Found inconsistencies:");
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log("\nRun without --check to fix these issues.");
    }

    return;
  }

  syncMetadata();
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { syncMetadata, readJsonFile, writeJsonFile };
