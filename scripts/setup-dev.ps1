# NovelSynth Development Environment Setup
# PowerShell version with Unicode support

param(
    [switch]$SkipInstall,
    [switch]$SkipHooks,
    [switch]$SkipFooter
)

Write-Host "🚀 Setting up NovelSynth Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "manifest.json")) {
    Write-Host "❌ Error: Please run this script from the NovelSynth project root directory" -ForegroundColor Red
    Write-Host "   Current directory: $PWD"
    Write-Host "   Expected to find: manifest.json"
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
if (-not $SkipInstall) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    if (Test-Path "package.json") {
        try {
            npm install
            Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ npm install failed, continuing..." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "⚠️ package.json not found, skipping npm install" -ForegroundColor Yellow
    }
}

# Setup Git hooks
if (-not $SkipHooks) {
    Write-Host ""
    Write-Host "🔧 Setting up Git hooks..." -ForegroundColor Yellow

    # Create hooks directory if it doesn't exist
    if (-not (Test-Path ".git\hooks")) {
        New-Item -ItemType Directory -Path ".git\hooks" -Force | Out-Null
    }

    # Copy pre-commit hook
    if (Test-Path "scripts\pre-commit.sh") {
        Copy-Item "scripts\pre-commit.sh" ".git\hooks\pre-commit" -Force
        Write-Host "✅ Pre-commit hook installed" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Pre-commit hook script not found, skipping..." -ForegroundColor Yellow
    }
}

# Update footer
if (-not $SkipFooter) {
    Write-Host ""
    Write-Host "📋 Updating footer with current information..." -ForegroundColor Yellow
    if (Test-Path "scripts\update-footer.js") {
        try {
            node scripts\update-footer.js --force
            Write-Host "✅ Footer updated successfully" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️ Footer update failed, continuing..." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "⚠️ Footer update script not found, skipping..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🧪 Testing extension setup..." -ForegroundColor Magenta
Write-Host ""
Write-Host "Firefox Testing:" -ForegroundColor Cyan
Write-Host "  1. Open Firefox"
Write-Host "  2. Go to about:debugging#/runtime/this-firefox"
Write-Host "  3. Click 'Load Temporary Add-on...'"
Write-Host "  4. Select manifest.json from: $PWD"
Write-Host ""
Write-Host "Edge Testing:" -ForegroundColor Blue
Write-Host "  1. Open Edge"
Write-Host "  2. Go to edge://extensions/"
Write-Host "  3. Enable 'Developer mode'"
Write-Host "  4. Click 'Load unpacked'"
Write-Host "  5. Select this folder: $PWD"
Write-Host ""

Write-Host "✨ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Available npm scripts:" -ForegroundColor Cyan
Write-Host "  npm run update-footer     - Update footer information"
Write-Host "  npm run build            - Build extension package"
Write-Host "  npm run test             - Run tests"
Write-Host "  npm run dev              - Start development mode"
Write-Host "  npm run package          - Create distribution package"
Write-Host "  npm run clean            - Clean build directory"
Write-Host "  npm run clean-build      - Clean and rebuild"
Write-Host ""

Write-Host "💡 The footer will be automatically updated before each git commit!" -ForegroundColor Yellow
Write-Host ""

# Optional: Open browser for quick testing
$openBrowser = Read-Host "Would you like to open Firefox for testing? (y/N)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    try {
        Start-Process "firefox" "about:debugging#/runtime/this-firefox"
    }
    catch {
        Write-Host "⚠️ Could not open Firefox automatically" -ForegroundColor Yellow
    }
}

Read-Host "Press Enter to continue"