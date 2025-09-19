# Dashboard Testing Guide

Quick reference for testing the runlintic dashboard implementation.

## Prerequisites

Before testing the dashboard, ensure you have:

### 1. System Requirements

```bash
# Check Node.js version (must be 22.16.0+)
node --version

# Check npm version
npm --version
```

### 2. Install Runlintic

Choose one installation method:

```bash
# Option A: Local installation (recommended)
npm install @rdolcegroup/runlintic-app

# Option B: Global installation
npm install -g @rdolcegroup/runlintic-app

# Option C: One-time use (no installation)
# Just use npx @rdolcegroup/runlintic-app dashboard
```

### 3. Verify Installation

```bash
# Check installation worked
npx runlintic --version

# Verify dashboard command exists
npx runlintic help | grep dashboard
```

## Quick Test Commands

### 1. Basic Launch Test

```bash
# Test dashboard launches successfully
npx runlintic dashboard --no-open --port 3000

# Expected output:
# 🎯 Starting runlintic dashboard server...
# 📁 Project: /path/to/your/project
# 🔐 Generated secure access token
# 🚀 Dashboard server running at: http://127.0.0.1:3000/?t=TOKEN
```

### 2. API Endpoint Tests

After launching the dashboard, test each endpoint:

```bash
# Save your token (from dashboard output)
export TOKEN="your_token_here"
export PORT="3000"

# Test basic health
curl "http://127.0.0.1:$PORT/api/health?t=$TOKEN"

# Test project context
curl "http://127.0.0.1:$PORT/api/project/context?t=$TOKEN"

# Test dependency stats
curl "http://127.0.0.1:$PORT/api/dependencies/stats?t=$TOKEN"

# Test git status
curl "http://127.0.0.1:$PORT/api/git/status?t=$TOKEN"
```

### 3. Browser Interface Test

1. Launch dashboard: `npx runlintic dashboard --port 3000`
2. Browser should auto-open to dashboard
3. Click "Test" buttons for each API endpoint
4. Verify JSON responses appear correctly

### 4. Automated Test Script

For comprehensive automated testing:

```bash
# Run the automated test script
./docs/testing/test-dashboard.sh

# Or from project root
chmod +x docs/testing/test-dashboard.sh
docs/testing/test-dashboard.sh
```

**What the script tests:**

- ✅ System requirements verification
- ✅ Package installation validation
- ✅ Dashboard server launch
- ✅ API endpoint authentication
- ✅ Basic functionality checks

**Expected output:**

```
🧪 Testing Runlintic Dashboard
==============================

🔧 Checking system requirements...
✅ Node.js version: 22.16.0 (OK)
✅ npm version: 10.8.1

📦 Checking runlintic installation...
✅ Runlintic found: 7.2.0

📋 Testing CLI command recognition...
✅ Dashboard command found in help

🚀 Testing dashboard launch...
✅ Dashboard server started successfully

🔐 Testing API endpoints...
✅ Authentication is working (401 without token)

🎉 Dashboard basic tests completed successfully!
```

## Expected Responses

### Health Endpoint

```json
{
  "status": "online",
  "project": "/path/to/project",
  "uptime": 123.456,
  "memory": {...},
  "timestamp": "2025-09-18T..."
}
```

### Project Context

```json
{
  "projectRoot": "/path/to/project",
  "hasPackageJson": true,
  "isMonorepo": false,
  "hasGit": true,
  "projectType": "node.js",
  "frameworks": ["..."],
  "timestamp": "2025-09-18T..."
}
```

### Git Status

```json
{
  "currentBranch": "feature/dashboard-uiux-phase4",
  "hasChanges": true,
  "stagedFiles": [...],
  "unstagedFiles": [...],
  "lastUpdated": "2025-09-18T..."
}
```

## Troubleshooting Tests

### If Dashboard Won't Start

```bash
# Check node version
node --version  # Should be 22+

# Try different port
npx runlintic dashboard --port 3001

# Check for port conflicts
lsof -i :3000

# Run health check first
npx runlintic health-check
```

### If API Returns Errors

```bash
# Verify token format
echo $TOKEN  # Should be base64url string

# Test without token (should get 401)
curl "http://127.0.0.1:$PORT/api/health"

# Test with wrong token (should get 401)
curl "http://127.0.0.1:$PORT/api/health?t=invalid"
```

### Common Error Responses

**Missing Token (401):**

```json
{
  "code": "MISSING_TOKEN",
  "message": "Authentication token required",
  "hint": "Provide token via Authorization header or ?t=token query parameter"
}
```

**Invalid Token (401):**

```json
{
  "code": "INVALID_TOKEN",
  "message": "Invalid authentication token",
  "hint": "Use the token provided when dashboard was launched"
}
```

## Test Checklist

### ✅ CLI Integration

- [ ] `runlintic dashboard` command is recognized
- [ ] Help output includes dashboard in command list
- [ ] Arguments parsing works (`--port`, `--host`, `--no-open`)
- [ ] Error handling for missing dependencies

### ✅ Server Functionality

- [ ] Server starts without errors
- [ ] Random port assignment works (default)
- [ ] Custom port assignment works
- [ ] Token generation and display
- [ ] Graceful shutdown on Ctrl+C

### ✅ Security

- [ ] API requires authentication token
- [ ] Invalid tokens are rejected (401)
- [ ] Missing tokens are rejected (401)
- [ ] Server binds to 127.0.0.1 by default

### ✅ API Endpoints

- [ ] `/api/health` returns server status
- [ ] `/api/project/context` returns project info
- [ ] `/api/dependencies/stats` returns dependency data
- [ ] `/api/git/status` returns git information
- [ ] All endpoints return valid JSON

### ✅ Browser Interface

- [ ] HTML page loads correctly
- [ ] Test buttons work for all endpoints
- [ ] API responses display in result area
- [ ] Security token is shown on page
- [ ] Development status is accurate

### ✅ Error Handling

- [ ] Invalid API endpoints return 404
- [ ] Server errors return 500 with details
- [ ] Missing project files handled gracefully
- [ ] Network binding errors are reported

## Performance Tests

### Response Time

```bash
# Test API response times
time curl "http://127.0.0.1:$PORT/api/health?t=$TOKEN"
time curl "http://127.0.0.1:$PORT/api/project/context?t=$TOKEN"
```

### Memory Usage

```bash
# Monitor memory during operation
ps aux | grep node

# Check process stats
curl "http://127.0.0.1:$PORT/api/health?t=$TOKEN" | jq .memory
```

### Concurrent Requests

```bash
# Test multiple simultaneous requests
for i in {1..5}; do
  curl "http://127.0.0.1:$PORT/api/health?t=$TOKEN" &
done
wait
```

## Integration Tests

### With Existing CLI Commands

```bash
# Verify CLI still works while dashboard is running
npx runlintic health-check
npx runlintic deps:analyze
npx runlintic commit --dry-run
```

### With Project Operations

```bash
# Test with actual project changes
touch test-file.txt
curl "http://127.0.0.1:$PORT/api/git/status?t=$TOKEN"

# Verify changes are detected
rm test-file.txt
```

## Reporting Issues

When reporting dashboard issues, include:

1. **Environment**:

   ```bash
   node --version
   npm --version
   npx runlintic --version
   ```

2. **Command used**:

   ```bash
   npx runlintic dashboard --port 3000
   ```

3. **Expected vs actual behavior**

4. **Console output** (full output from dashboard launch)

5. **API test results**:

   ```bash
   curl -v "http://127.0.0.1:PORT/api/health?t=TOKEN"
   ```

6. **Project context**:
   ```bash
   npx runlintic health-check
   ```

## Related Documentation

- **Complete Dashboard Guide**: [`docs/dashboard/DASHBOARD.md`](./DASHBOARD.md)
- **CLI Commands Reference**: [`docs/cli-commands-reference.md`](../cli-commands-reference.md)
- **Installation Guide**: [`docs/installation-guide.md`](../installation-guide.md)
- **Automated Test Script**: [`docs/testing/test-dashboard.sh`](../testing/test-dashboard.sh)

## Quick Start Summary

```bash
# 1. Install runlintic
npm install @rdolcegroup/runlintic-app

# 2. Verify installation
npx runlintic --version

# 3. Run automated tests
./docs/testing/test-dashboard.sh

# 4. Launch dashboard
npx runlintic dashboard --port 3000

# 5. Test in browser
# Click "Test" buttons for each API endpoint
```

---

_Quick reference for testing dashboard implementation_
