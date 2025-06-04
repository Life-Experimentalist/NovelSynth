#!/bin/sh
#
# Pre-commit hook to automatically update footer information
# This runs before every commit to ensure footer stats are current
#

echo "🔄 Running pre-commit footer update..."

# Change to project root directory
cd "$(git rev-parse --show-toplevel)"

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo "⚠️  Node.js not found. Skipping footer update."
    exit 0
fi

# Check if update script exists
if [ ! -f "scripts/update-footer.js" ]; then
    echo "⚠️  Footer update script not found. Skipping."
    exit 0
fi

# Update footer
echo "📝 Updating footer with latest information..."
node scripts/update-footer.js --force

# Check if footer was modified
if git diff --cached --name-only | grep -q "wiki/_Footer.md"; then
    echo "📋 Footer already staged for commit"
elif git diff --name-only | grep -q "wiki/_Footer.md"; then
    echo "📋 Adding updated footer to commit..."
    git add wiki/_Footer.md
    echo "✅ Footer updated and staged"
else
    echo "📋 Footer up to date"
fi

echo "✨ Pre-commit checks completed successfully!"
exit 0