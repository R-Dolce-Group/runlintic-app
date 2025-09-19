#!/bin/bash

# Runlintic Dashboard Test Script
# Quick automated testing of dashboard functionality

set -e

echo "🧪 Testing Runlintic Dashboard"
echo "=============================="
echo ""

# Check Node.js version
echo "🔧 Checking system requirements..."
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js not found. Please install Node.js 22.16.0 or higher"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="22.16.0"
if ! printf '%s\n%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
    echo "❌ Node.js version $NODE_VERSION is too old. Required: $REQUIRED_VERSION+"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION (OK)"

# Check if npm is available
if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Check if runlintic is installed or can be run
echo "📦 Checking runlintic installation..."
if npx runlintic --version >/dev/null 2>&1; then
    echo "✅ Runlintic found: $(npx runlintic --version)"
else
    echo "❌ Runlintic not found. Please install with:"
    echo "   npm install @rdolcegroup/runlintic-app"
    echo "   or use: npx @rdolcegroup/runlintic-app dashboard"
    exit 1
fi
echo ""

# Test CLI command recognition
echo "📋 Testing CLI command recognition..."
if npx runlintic help | grep -q "dashboard"; then
    echo "✅ Dashboard command found in help"
else
    echo "❌ Dashboard command not found in help"
    exit 1
fi

# Test dashboard launch (background with timeout)
echo "🚀 Testing dashboard launch..."
PORT=3333
timeout 10s npx runlintic dashboard --port $PORT --no-open &
DASHBOARD_PID=$!

# Wait for server to start
sleep 3

# Test if server is running
if curl -s "http://127.0.0.1:$PORT" >/dev/null; then
    echo "✅ Dashboard server started successfully"
else
    echo "❌ Dashboard server failed to start"
    kill $DASHBOARD_PID 2>/dev/null || true
    exit 1
fi

# Extract token from server output (simplified)
# In real testing, you'd capture the actual token from the server output
TOKEN="test-token"

echo "🔐 Testing API endpoints..."

# Test health endpoint
if curl -s "http://127.0.0.1:$PORT/api/health" | grep -q "Authentication token required"; then
    echo "✅ Authentication is working (401 without token)"
else
    echo "❌ Authentication not working properly"
fi

# Cleanup
kill $DASHBOARD_PID 2>/dev/null || true
wait $DASHBOARD_PID 2>/dev/null || true

echo "🎉 Dashboard basic tests completed successfully!"
echo ""
echo "📖 For manual testing:"
echo "   npx runlintic dashboard --port 3000"
echo "   Then open http://127.0.0.1:3000 in your browser"
echo ""
echo "📦 Installation options:"
echo "   npm install @rdolcegroup/runlintic-app          # Local install"
echo "   npm install -g @rdolcegroup/runlintic-app       # Global install"
echo "   npx @rdolcegroup/runlintic-app dashboard        # One-time use"
echo ""
echo "📚 Documentation:"
echo "   docs/DASHBOARD.md - Complete dashboard guide"
echo "   docs/DASHBOARD-TESTING.md - Testing procedures"