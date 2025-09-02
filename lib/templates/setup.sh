#!/bin/bash

# ===========================================
# Runlintic New Developer Setup Script
# ===========================================
# Run this script to set up a new developer environment
# Usage: chmod +x setup.sh && ./setup.sh

set -e  # Exit on any error

echo "🚀 Setting up Runlintic development environment..."
echo "================================================"

# ===========================================
# Environment Checks
# ===========================================

echo "🔍 Checking environment prerequisites..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js >= 22"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -c 2-)
REQUIRED_VERSION="22.0.0"

if ! npx semver "$NODE_VERSION" -r ">=$REQUIRED_VERSION" &> /dev/null; then
    echo "⚠️  Node.js version $NODE_VERSION detected"
    echo "   Runlintic requires Node.js >= $REQUIRED_VERSION"
    echo "   Consider using nvm: nvm install 22"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Node.js $(node --version) and npm $(npm --version) detected"

# ===========================================
# Project Setup
# ===========================================

echo ""
echo "📦 Installing project dependencies..."

# Install dependencies
npm install

echo "✅ Dependencies installed"

# ===========================================
# Runlintic Initialization
# ===========================================

echo ""
echo "🔧 Initializing Runlintic..."

# Run runlintic init if not already done
if [ ! -f "tsconfig.json" ] || [ ! -f "eslint.config.js" ]; then
    npx runlintic init
    echo "✅ Runlintic configuration files created"
else
    echo "⚠️  Runlintic config files already exist, skipping init"
fi

# ===========================================
# Health Check
# ===========================================

echo ""
echo "🏥 Running health check..."

if npm run health-check; then
    echo "✅ Health check passed"
else
    echo "⚠️  Health check found issues - review output above"
fi

# ===========================================
# Git Setup (if in git repo)
# ===========================================

if [ -d ".git" ]; then
    echo ""
    echo "🔀 Configuring Git hooks..."
    
    # Install husky if package.json has it
    if npm list husky &> /dev/null; then
        npx husky install
        echo "✅ Git hooks configured with Husky"
    else
        echo "ℹ️  No Husky configuration found, skipping Git hooks"
    fi
fi

# ===========================================
# GitHub Token Setup Reminder
# ===========================================

echo ""
echo "🔑 GitHub Token Setup (for releases):"
echo "   1. Go to: https://github.com/settings/tokens"
echo "   2. Generate new token with 'repo' permissions" 
echo "   3. Run: export GH_TOKEN='your_token_here'"
echo "   4. Test with: npm run release:dry"

# ===========================================
# VSCode Setup (if detected)
# ===========================================

if command -v code &> /dev/null && [ -f ".vscode/settings.json" ]; then
    echo ""
    echo "🎨 VSCode detected - settings and extensions configured"
    echo "   Recommended: Install the extensions listed in .vscode/extensions.json"
fi

# ===========================================
# Final Instructions
# ===========================================

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "📋 Daily Commands:"
echo "   npm run health-check      # Check project health"
echo "   npm run check-all         # Run quality checks"
echo "   npm run lint:fix          # Fix linting issues"
echo "   npm run format            # Format code"
echo ""
echo "📚 Documentation:"
echo "   📖 RUNLINTIC-GUIDE.md      # Complete user guide"
echo "   ⚡ RUNLINTIC-QUICKSTART.md # Quick reference"
echo "   👥 RUNLINTIC-WORKFLOW.md   # Team workflows"
echo ""
echo "🚀 Release Setup (maintainers only):"
echo "   1. Set GitHub token: export GH_TOKEN='your_token'"
echo "   2. Test release: npm run release:dry"
echo ""
echo "🆘 Need help? Run: npx runlintic help"

# ===========================================
# Optional: Open documentation
# ===========================================

echo ""
read -p "📖 Open RUNLINTIC-GUIDE.md for detailed instructions? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code RUNLINTIC-GUIDE.md
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open RUNLINTIC-GUIDE.md
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open RUNLINTIC-GUIDE.md
    else
        echo "📖 Please open RUNLINTIC-GUIDE.md in your preferred editor"
    fi
fi

echo ""
echo "✨ Happy coding with Runlintic!"