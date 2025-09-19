# Runlintic Dashboard Documentation

The runlintic dashboard provides a web-based interface for all CLI functionality, making it easy to manage your project's code quality, dependencies, and releases through an intuitive browser interface.

## Prerequisites

### System Requirements
- **Node.js**: Version 22.16.0 or higher
- **npm**: Version 8.0.0 or higher (included with Node.js)
- **Operating System**: macOS, Linux, or Windows
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

### Check Your Environment
```bash
# Verify Node.js version
node --version
# Should output: v22.16.0 or higher

# Verify npm version
npm --version
# Should output: 8.0.0 or higher
```

## Installation

### Option 1: Local Project Installation (Recommended)
```bash
# Install in your project
npm install @rdolcegroup/runlintic-app

# Use with npx
npx runlintic dashboard
```

### Option 2: Global Installation
```bash
# Install globally
npm install -g @rdolcegroup/runlintic-app

# Use directly
runlintic dashboard
```

### Option 3: One-time Use
```bash
# Run without installing (downloads temporarily)
npx @rdolcegroup/runlintic-app dashboard
```

### Verify Installation
```bash
# Check if runlintic is installed correctly
npx runlintic --version

# Test help command
npx runlintic help

# Should show dashboard in command list
npx runlintic help | grep dashboard
```

## Quick Start

### Launch Dashboard
```bash
# Launch with default settings (random port, auto-open browser)
npx runlintic dashboard

# Launch on specific port
npx runlintic dashboard --port 3000

# Launch without opening browser
npx runlintic dashboard --no-open

# Launch on all network interfaces (use with caution)
npx runlintic dashboard --host 0.0.0.0 --port 3000
```

### Access Dashboard
After launching, the dashboard will:
1. Start a secure local web server
2. Generate a unique access token for this session
3. Automatically open your browser (unless `--no-open` is used)
4. Display the dashboard URL with token for manual access

Example output:
```
🎯 Starting runlintic dashboard server...
📁 Project: /path/to/your/project
🔐 Generated secure access token
🚀 Dashboard server running at: http://127.0.0.1:54321/?t=ABC123xyz789
🔒 Secure token: ABC123xyz789
📊 API endpoints available at: http://127.0.0.1:54321/api
🌐 Dashboard opened in browser
```

## Features

### Project Overview
- **Health Score**: Overall project health (0-100) based on linting, type checking, and dependencies
- **Quick Actions**: One-click access to common operations
- **Project Context**: Automatic detection of project type, frameworks, and configuration
- **Recent Activity**: Timeline of dashboard actions and git commits

### Dependency Management
- **Security Analysis**: Real-time vulnerability scanning
- **Outdated Packages**: Visual list of packages with available updates
- **Unused Dependencies**: Detection of packages that can be safely removed
- **Risk Assessment**: Color-coded risk levels for dependency updates
- **Update Scheduler**: Plan and execute dependency updates

### Git Operations
- **Status Overview**: Visual representation of git repository state
- **Commit Generation**: AI-powered conventional commit message creation
- **Recent Commits**: Timeline view of project history
- **Branch Information**: Current branch status and change tracking

### Code Quality
- **Lint Results**: Real-time ESLint results with error/warning counts
- **Type Checking**: TypeScript error detection and reporting
- **Format Status**: Code formatting consistency checks
- **Quality Trends**: Historical code quality metrics

## API Endpoints

All endpoints require authentication via the session token.

### Authentication
Include the token in requests using either:
- **Query parameter**: `?t=YOUR_TOKEN`
- **Authorization header**: `Authorization: Bearer YOUR_TOKEN`

### Health Endpoints
```bash
# Get server status
GET /api/health

# Run comprehensive health check
POST /api/health/run

# Run specific checks
GET /api/health/lint
GET /api/health/typecheck
```

### Project Endpoints
```bash
# Get project context
GET /api/project/context

# Get basic project info
GET /api/project/info
```

### Dependencies Endpoints
```bash
# Get dependency statistics
GET /api/dependencies/stats

# Run comprehensive analysis
POST /api/dependencies/analyze

# Security-focused analysis
GET /api/dependencies/security

# Available updates
GET /api/dependencies/updates

# Dependency health check
GET /api/dependencies/health
```

### Git Endpoints
```bash
# Get git status
GET /api/git/status

# Generate commit message
POST /api/git/commit/generate

# Create commit
POST /api/git/commit/create
Body: { "message": "your commit message" }

# Get recent commits
GET /api/git/commits?limit=10
```

## Testing the Dashboard

### Manual API Testing
You can test individual API endpoints using curl or your browser:

```bash
# Get your token from the dashboard launch output
TOKEN="your_token_here"

# Test health endpoint
curl "http://127.0.0.1:PORT/api/health?t=$TOKEN"

# Test project context
curl "http://127.0.0.1:PORT/api/project/context?t=$TOKEN"

# Test dependency stats
curl "http://127.0.0.1:PORT/api/dependencies/stats?t=$TOKEN"

# Test git status
curl "http://127.0.0.1:PORT/api/git/status?t=$TOKEN"
```

### Using the Temporary Dashboard
The current implementation includes a temporary HTML interface for testing:

1. **API Testing Interface**: Click buttons to test different endpoints
2. **Response Viewer**: See real API responses in formatted JSON
3. **Development Status**: Track implementation progress
4. **Security Information**: View your session token and security details

### Browser Testing
Open the dashboard URL in your browser and:
1. Test each API endpoint using the interactive buttons
2. Verify all responses return proper JSON data
3. Check that authentication works correctly
4. Confirm project context detection is accurate

### Automated Testing
For quick automated verification of the dashboard:

```bash
# Run the comprehensive test script
./docs/testing/test-dashboard.sh

# Or from project root
chmod +x docs/testing/test-dashboard.sh
docs/testing/test-dashboard.sh
```

The test script will:
- ✅ Verify system requirements (Node.js 22.16.0+)
- ✅ Check runlintic installation
- ✅ Test dashboard server launch
- ✅ Validate API authentication
- ✅ Provide clear success/failure feedback

📖 **See also**: [`docs/dashboard/DASHBOARD-TESTING.md`](./DASHBOARD-TESTING.md) for detailed testing procedures.

## Security

### Local-Only by Default
- Server binds to `127.0.0.1` (loopback) by default
- Only accessible from the same machine
- No network exposure unless explicitly configured

### Token Authentication
- Unique token generated per session using crypto-secure random bytes
- Token required for all API access
- No persistent sessions - tokens expire when server stops

### Network Access Warning
Using `--host 0.0.0.0` exposes the dashboard to your local network:
```bash
⚠️  WARNING: --host 0.0.0.0 exposes dashboard to local network
🔒 Ensure your firewall is properly configured
🛡️  Only use on trusted networks
```

## Troubleshooting

### Installation Issues

#### Command Not Found
```bash
# If "runlintic: command not found"
npm install @rdolcegroup/runlintic-app

# Or use full package name
npx @rdolcegroup/runlintic-app dashboard

# Check if globally installed
npm list -g @rdolcegroup/runlintic-app
```

#### Permission Errors
```bash
# On macOS/Linux, you might need to fix npm permissions
# Option 1: Use npx (recommended)
npx runlintic dashboard

# Option 2: Fix npm global permissions
# See: https://docs.npmjs.com/resolving-eacces-permissions-errors
```

#### Version Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Reinstall package
npm uninstall @rdolcegroup/runlintic-app
npm install @rdolcegroup/runlintic-app

# Check installed version
npx runlintic --version
```

### Dashboard Won't Start
```bash
# Check if port is already in use
npx runlintic dashboard --port 3001

# Verify node version (requires Node.js 22+)
node --version

# Run health check first
npx runlintic health-check

# Check package installation
npx runlintic --version
```

### API Endpoints Return 401
- Verify you're using the correct token from the launch output
- Check that the token is included in the request
- Ensure you're making requests to the correct port

### Browser Doesn't Open
```bash
# Launch without auto-open, then manually visit URL
npx runlintic dashboard --no-open

# Check if your default browser is configured
open http://127.0.0.1:PORT/?t=TOKEN
```

### Module Not Found Errors
```bash
# Reinstall dependencies
npm install

# Verify installation
npx runlintic --version

# Check file permissions
ls -la node_modules/@rdolcegroup/runlintic-app/
```

## Development Status

### Current Implementation (Phase 1)
- ✅ Secure Express.js server with token authentication
- ✅ Complete REST API for all CLI functions
- ✅ Project context detection and health checking
- ✅ Temporary HTML interface for testing
- ✅ Full CLI integration with argument parsing

### Upcoming Features (Phase 2)
- 🔄 React-based dashboard UI
- 🔄 Real-time WebSocket updates
- 🔄 Interactive data visualization
- 🔄 Advanced dependency management interface

### Future Enhancements (Phase 3+)
- ⏳ Team collaboration features
- ⏳ Analytics and reporting
- ⏳ Custom workflow automation
- ⏳ Plugin system for extensions

## Command Line Options

### Basic Usage
```bash
runlintic dashboard [options]
```

### Options
- `--port <number>`: Specify port number (default: random free port)
- `--host <string>`: Specify host address (default: 127.0.0.1)
- `--no-open`: Don't automatically open browser
- `--help`: Show help information

### Examples
```bash
# Development setup
runlintic dashboard --port 3000 --no-open

# Team demo (use with caution)
runlintic dashboard --host 0.0.0.0 --port 8080

# Production-like testing
runlintic dashboard --host 127.0.0.1 --port 3000
```

## Integration with Existing Workflow

### Package.json Scripts
Add dashboard to your project scripts:
```json
{
  "scripts": {
    "dashboard": "runlintic dashboard",
    "dashboard:dev": "runlintic dashboard --port 3000 --no-open"
  }
}
```

### Team Development
Each team member can run their own dashboard instance:
```bash
# Developer A
npm run dashboard -- --port 3001

# Developer B
npm run dashboard -- --port 3002
```

### CI/CD Integration
The dashboard API can be used for automated project analysis:
```bash
# Health check in CI
curl -f "http://127.0.0.1:$PORT/api/health/run?t=$TOKEN" || exit 1

# Dependency security scan
curl "http://127.0.0.1:$PORT/api/dependencies/security?t=$TOKEN"
```

## Support

### Getting Help
- **Documentation**: Check this file and other docs in `/docs`
- **CLI Help**: Run `npx runlintic help`
- **Health Check**: Run `npx runlintic health-check`
- **Issues**: Report bugs at https://github.com/R-Dolce-Group/runlintic-app/issues

### Common Questions

**Q: Can I run multiple dashboard instances?**
A: Yes, each instance uses a different port and token.

**Q: Is the dashboard secure for production use?**
A: The dashboard is designed for local development. For production monitoring, use the CLI commands in your CI/CD pipeline.

**Q: Can I customize the dashboard interface?**
A: The current HTML interface is temporary. The upcoming React dashboard will be fully customizable.

**Q: Does the dashboard work with monorepos?**
A: Yes, it automatically detects monorepo structure and provides appropriate context.

---

*Last updated: Dashboard Phase 1 Implementation*