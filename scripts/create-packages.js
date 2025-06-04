#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Read package.json to get version
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = packageJson.version;

// Create releases directory if it doesn't exist
const releasesDir = path.join(__dirname, "..", "releases");
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir, { recursive: true });
}

// Check if dist folder exists
const distDir = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ folder not found. Run "npm run build" first.');
  process.exit(1);
}

console.log("📦 Creating release packages...");

try {
  // Create Chrome package
  const chromeZip = `novelsynth-chrome-v${version}.zip`;
  console.log(`📦 Creating ${chromeZip}...`);

  if (process.platform === "win32") {
    // Windows: Use PowerShell compression
    execSync(
      `powershell -Command "Compress-Archive -Path 'dist\\*' -DestinationPath 'releases\\${chromeZip}' -Force"`,
      { stdio: "inherit" }
    );
  } else {
    // Unix-like systems: Use zip command
    execSync(`cd dist && zip -r ../releases/${chromeZip} . && cd ..`, {
      stdio: "inherit",
    });
  }

  // Create Firefox package (same content, different name for clarity)
  const firefoxZip = `novelsynth-firefox-v${version}.zip`;
  console.log(`📦 Creating ${firefoxZip}...`);

  if (process.platform === "win32") {
    // Windows: Use PowerShell compression
    execSync(
      `powershell -Command "Compress-Archive -Path 'dist\\*' -DestinationPath 'releases\\${firefoxZip}' -Force"`,
      { stdio: "inherit" }
    );
  } else {
    // Unix-like systems: Use zip command
    execSync(`cd dist && zip -r ../releases/${firefoxZip} . && cd ..`, {
      stdio: "inherit",
    });
  }

  console.log("✅ Release packages created successfully!");
  console.log(`📁 Chrome package: releases/${chromeZip}`);
  console.log(`📁 Firefox package: releases/${firefoxZip}`);
  console.log("");
  console.log("🚀 Ready for distribution!");
  console.log("");
  console.log("Next steps:");
  console.log("1. Test the packages in each browser");
  console.log("2. Upload to Chrome Web Store / Firefox Add-ons");
  console.log("3. Create GitHub release with these files");
} catch (error) {
  console.error("❌ Error creating packages:", error.message);
  process.exit(1);
}

// Show package info
try {
  const chromeStats = fs.statSync(
    path.join(releasesDir, `novelsynth-chrome-v${version}.zip`)
  );
  const firefoxStats = fs.statSync(
    path.join(releasesDir, `novelsynth-firefox-v${version}.zip`)
  );

  console.log("");
  console.log("📊 Package Information:");
  console.log(
    `Chrome package size: ${(chromeStats.size / 1024).toFixed(2)} KB`
  );
  console.log(
    `Firefox package size: ${(firefoxStats.size / 1024).toFixed(2)} KB`
  );
} catch (error) {
  // Ignore stats errors
}
