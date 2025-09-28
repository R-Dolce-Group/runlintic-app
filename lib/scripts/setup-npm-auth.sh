#!/bin/bash

# Setup NPM authentication for release scripts
# This script helps configure NPM token for IDE usage

set -euo pipefail

echo "🔧 NPM Authentication Setup"
echo "================================"

# Check if NPM token is already configured
if npm whoami >/dev/null 2>&1; then
    NPM_USER=$(npm whoami)
    echo "✅ Already authenticated to NPM as: $NPM_USER"
else
    echo "❌ Not authenticated to NPM"
    echo "💡 Run: npm login"
    exit 1
fi

# Check if we can get the auth token (this will fail but that's expected)
echo ""
echo "🔍 Checking NPM token configuration..."

# Create a simple .env file for IDE usage
if [[ ! -f ".env" ]]; then
    echo "📝 Creating .env file for IDE environment variables..."
    cat > .env << 'EOF'
# Environment variables for runlintic-app release scripts
# Add your tokens here for IDE usage

# GitHub token (get from: gh auth token)
GH_TOKEN=your_github_token_here

# NPM token (get from: npm token create --read-only or npm token create)
NPM_TOKEN=your_npm_token_here

# Note: Never commit this file to version control
EOF
    echo "✅ Created .env file"
    echo "💡 Edit .env and add your actual tokens"
else
    echo "✅ .env file already exists"
fi

# Add .env to .gitignore if not already there
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "✅ Added .env to .gitignore"
fi

echo ""
echo "📋 Next steps:"
echo "1. Get your GitHub token: gh auth token"
echo "2. Get your NPM token: npm token create --read-only"
echo "3. Edit .env file and replace the placeholder tokens"
echo "4. Your IDE should now be able to run the release scripts"
echo ""
echo "🔒 Security note: Never commit the .env file to version control"
