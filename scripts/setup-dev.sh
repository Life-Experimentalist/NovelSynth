#!/bin/bash

# NovelSynth Development Environment Setup for Unix/Linux/macOS
# This script sets up the development environment for non-Windows users

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis (should work in most modern terminals)
ROCKET="🚀"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
PACKAGE="📦"
WRENCH="🔧"
CLIPBOARD="📋"
SPARKLES="✨"
INFO="💡"

echo -e "${CYAN}${ROCKET} Setting up NovelSynth Development Environment...${NC}"
echo ""

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=macOS;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGW;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${BLUE}🖥️  Detected platform: ${MACHINE}${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo -e "${RED}${ERROR} Error: Please run this script from the NovelSynth project root directory${NC}"
    echo "   Current directory: $(pwd)"
    echo "   Expected to find: manifest.json"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${CYAN}🔍 Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}${CHECK} Node.js: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}${ERROR} Node.js is required but not found${NC}"
    echo -e "${INFO} Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}${CHECK} npm: v${NPM_VERSION}${NC}"
else
    echo -e "${RED}${ERROR} npm is required but not found${NC}"
    exit 1
fi

# Check git (optional)
if command_exists git; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}${CHECK} Git: ${GIT_VERSION}${NC}"
else
    echo -e "${YELLOW}${WARNING} Git not found (optional, but recommended for development)${NC}"
fi

# Check zip utility
if command_exists zip; then
    echo -e "${GREEN}${CHECK} zip utility available${NC}"
else
    echo -e "${YELLOW}${WARNING} zip utility not found (needed for packaging)${NC}"
    case "${MACHINE}" in
        Linux)
            echo -e "${INFO} Install with: sudo apt install zip (Ubuntu/Debian) or sudo yum install zip (CentOS/RHEL)"
            ;;
        macOS)
            echo -e "${INFO} zip should be available by default. If not, install with: brew install zip"
            ;;
    esac
fi

echo ""

# Install dependencies
echo -e "${YELLOW}${PACKAGE} Installing dependencies...${NC}"
if [ -f "package.json" ]; then
    if npm install; then
        echo -e "${GREEN}${CHECK} Dependencies installed successfully${NC}"
    else
        echo -e "${YELLOW}${WARNING} npm install failed, continuing...${NC}"
    fi
else
    echo -e "${YELLOW}${WARNING} package.json not found, skipping npm install${NC}"
fi

echo ""

# Setup Git hooks
echo -e "${YELLOW}${WRENCH} Setting up Git hooks...${NC}"

# Create hooks directory if it doesn't exist
if [ ! -d ".git/hooks" ]; then
    mkdir -p ".git/hooks"
fi

# Copy pre-commit hook
if [ -f "scripts/pre-commit.sh" ]; then
    cp "scripts/pre-commit.sh" ".git/hooks/pre-commit"
    chmod +x ".git/hooks/pre-commit"
    echo -e "${GREEN}${CHECK} Pre-commit hook installed${NC}"
else
    echo -e "${YELLOW}${WARNING} Pre-commit hook script not found, skipping...${NC}"
fi

echo ""

# Update footer
echo -e "${YELLOW}${CLIPBOARD} Updating footer with current information...${NC}"
if [ -f "scripts/update-footer.js" ]; then
    if node scripts/update-footer.js --force; then
        echo -e "${GREEN}${CHECK} Footer updated successfully${NC}"
    else
        echo -e "${YELLOW}${WARNING} Footer update failed, continuing...${NC}"
    fi
else
    echo -e "${YELLOW}${WARNING} Footer update script not found, skipping...${NC}"
fi

echo ""

# Browser setup instructions
echo -e "${PURPLE}🧪 Browser Testing Setup:${NC}"
echo ""
echo -e "${CYAN}Firefox Testing:${NC}"
echo "  1. Open Firefox"
echo "  2. Go to: about:debugging#/runtime/this-firefox"
echo "  3. Click 'Load Temporary Add-on...'"
echo "  4. Select manifest.json from: $(pwd)"
echo ""
echo -e "${BLUE}Chrome Testing:${NC}"
echo "  1. Open Chrome"
echo "  2. Go to: chrome://extensions/"
echo "  3. Enable 'Developer mode' (top-right toggle)"
echo "  4. Click 'Load unpacked'"
echo "  5. Select this folder: $(pwd)"
echo ""
echo -e "${GREEN}Edge Testing:${NC}"
echo "  1. Open Edge"
echo "  2. Go to: edge://extensions/"
echo "  3. Enable 'Developer mode'"
echo "  4. Click 'Load unpacked'"
echo "  5. Select this folder: $(pwd)"
echo ""

# Show success message
echo -e "${GREEN}${SPARKLES} Setup completed successfully!${NC}"
echo ""
echo -e "${CYAN}📝 Available npm scripts:${NC}"
echo "  npm run update-footer     - Update footer information"
echo "  npm run build            - Build extension package"
echo "  npm run package          - Create distribution packages"
echo "  npm run test             - Run tests"
echo "  npm run dev              - Start development mode"
echo "  npm run clean            - Clean build directory"
echo "  npm run clean-build      - Clean and rebuild"
echo ""

# Platform-specific additional instructions
case "${MACHINE}" in
    macOS)
        echo -e "${INFO} macOS users: You may need to allow extensions in Safari if you plan to test there"
        ;;
    Linux)
        echo -e "${INFO} Linux users: Make sure you have the latest version of your browser for best compatibility"
        ;;
esac

echo -e "${INFO} The footer will be automatically updated before each git commit!"
echo ""
echo -e "${GREEN}🚀 Happy coding!${NC}"

# Optional: Ask if user wants to build the extension immediately
echo ""
read -p "Would you like to build the extension now? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔨 Building extension...${NC}"
    npm run build
    echo ""
    echo -e "${GREEN}${CHECK} Build completed! Check scripts/dist/ for the built extension${NC}"
fi