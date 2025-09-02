# Runlintic User Guide

Welcome to **@rdolcegroup/runlintic-app** - your toolkit for automating code quality, cleanup, and releases in Next.js Turbo monorepos!

## 🚀 Quick Start

### 1. Verify Installation

```bash
# Check that runlintic is available
npx runlintic --version
npx runlintic help
```

### 2. Initialize Your Project

```bash
# Initialize runlintic configs in your project root
npx runlintic init

# Verify created files
ls -la | grep -E "(eslint|tsconfig|release-it|commitlint)"
```

### 3. Run Health Check

```bash
# Test your project health
npx runlintic health-check
```

## 📋 Essential Commands

### Setup & Health

```bash
npx runlintic init                # Initialize project configs
npx runlintic health-check        # Comprehensive health check
```

### Code Quality (Parallel Execution)

```bash
npx runlintic check-all           # Run lint + typecheck + deps (40% faster)
npx runlintic lint                # Run ESLint with zero warnings
npx runlintic lint:fix            # Auto-fix ESLint issues
npx runlintic typecheck           # TypeScript type checking
npx runlintic format              # Prettier formatting + package.json sorting
```

### Maintenance & Cleanup

```bash
npx runlintic maintenance         # Run knip + depcheck + workspace fixes
npx runlintic clean               # Clean build artifacts
npx runlintic clean:all           # Complete clean (removes node_modules)
```

### Release Management

```bash
# Setup GitHub token first
export GH_TOKEN="your_github_token"

# Test releases (safe)
npx runlintic release:dry         # Preview changes without releasing

# Create releases
npx runlintic release:patch       # Create patch release (1.0.0 → 1.0.1)
npx runlintic release:minor       # Create minor release (1.0.0 → 1.1.0)
npx runlintic release:major       # Create major release (1.0.0 → 2.0.0)
```

## 🔧 Package.json Integration (Recommended)

Add these scripts to your `package.json` for team consistency:

```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "lint:fix": "runlintic lint:fix",
    "format": "runlintic format",
    "maintenance": "runlintic maintenance",
    "release:dry": "runlintic release:dry",
    "release:patch": "runlintic release:patch",
    "release:minor": "runlintic release:minor"
  }
}
```

Then use via npm:

```bash
npm run health-check
npm run lint
npm run release:dry
```

## 🏢 Monorepo Usage

### Root Level Commands

Run these from your monorepo root:

```bash
npx runlintic init                # Set up root configs
npx runlintic health-check        # Check entire monorepo
npx runlintic release:dry          # Test monorepo release
```

### Individual Package Commands

Run these from specific packages (apps/web, packages/ui, etc.):

```bash
npx runlintic lint                # Lint specific package
npx runlintic typecheck           # Type check specific package
npx runlintic format              # Format specific package
```

### Turbo Integration

If you have `turbo.json`, runlintic works seamlessly:

```bash
# Turbo handles workspace coordination
npx runlintic check-all           # Runs across all workspaces
```

## 🚀 Release Workflow Setup

### 1. GitHub Token Setup

Create a GitHub Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Export in your shell:

```bash
export GH_TOKEN="your_github_token_here"
echo $GH_TOKEN  # Verify token is set
```

### 2. Test Release Workflow

Always test before actual releases:

```bash
# Test different release types (safe - no actual release)
npx runlintic release:dry
npx runlintic release:patch --dry-run
npx runlintic release:minor --dry-run
npx runlintic release:major --dry-run
```

### 3. Create Releases

```bash
# Patch release (bug fixes)
npx runlintic release:patch

# Minor release (new features, backward compatible)
npx runlintic release:minor

# Major release (breaking changes)
npx runlintic release:major
```

## 🔍 Project Structure Support

Runlintic automatically detects and optimizes for:

### ✅ Next.js Turbo Monorepos

```
your-project/
├── apps/
│   ├── web/          # Next.js app
│   └── docs/         # Documentation site
├── packages/
│   ├── ui/           # Shared UI components
│   └── config/       # Shared configs
├── package.json      # Root package.json
├── turbo.json        # Turbo configuration
└── RUNLINTIC-GUIDE.md # This guide!
```

### ✅ Standard Node.js Projects

```
your-project/
├── src/
├── package.json
├── tsconfig.json     # Created by runlintic init
├── eslint.config.js  # Created by runlintic init
└── RUNLINTIC-GUIDE.md
```

## 💡 Pro Tips

### Performance Optimization

- Use `npx runlintic check-all` for **40% faster** parallel execution
- Run `health-check` before releases to catch issues early
- Use `maintenance` regularly to keep dependencies clean

### Team Workflow

- Add npm scripts to package.json for consistency
- Use `runlintic init` in new team member onboarding
- Set up GitHub token in team documentation
- Run `release:dry` to preview changes before releasing

### Troubleshooting

```bash
# If commands seem slow
npx runlintic maintenance         # Clean up unused dependencies

# If linting fails
npx runlintic lint:fix           # Auto-fix common issues

# If release fails
export GH_TOKEN="your_token"     # Ensure token is set
npx runlintic release:dry        # Test release workflow
```

## 📖 Advanced Usage

### Programmatic API

```javascript
const { getConfig, configs } = require('@rdolcegroup/runlintic-app');

console.log('Available configs:', configs);
console.log('ESLint base config:', getConfig('eslint', 'base'));
console.log('TypeScript Next.js config:', getConfig('typescript', 'nextjs'));
```

### Command Execution Options

```bash
# Option 1: npx (recommended for testing)
npx runlintic health-check

# Option 2: npm scripts (team-friendly)
npm run health-check

# Option 3: Direct path (if needed)
./node_modules/.bin/runlintic health-check
```

### Environment Variables

```bash
# Suppress post-install messages
export RUNLINTIC_SUPPRESS_POSTINSTALL=true

# Set tier (free is default)
export RUNLINTIC_TIER=free

# Required for releases
export GH_TOKEN="your_github_token"
```

## 🆓 Free Tier vs Paid Tier

### Free Tier (Current)

- ✅ All code quality tools
- ✅ Self-managed GitHub tokens
- ✅ 5,000 GitHub API requests/hour
- ✅ Community support

### Paid Tier (Available)

- ✅ Everything in Free tier
- ✅ Managed GitHub tokens
- ✅ Higher rate limits
- ✅ Priority support
- ⬆️ Upgrade at: https://rdolcegroup.com/runlintic

## 🔗 Resources

- **Documentation**: https://github.com/R-Dolce-Group/runlintic-app
- **Issues**: https://github.com/R-Dolce-Group/runlintic-app/issues
- **Examples**: See `_workflows/user-testing/` in the repo
- **Upgrade Options**: https://rdolcegroup.com/runlintic

## 📞 Support

Need help? Here's how to get support:

1. **Check this guide first** - covers 90% of use cases
2. **Run `npx runlintic help`** - for command reference
3. **GitHub Issues** - for bugs and feature requests
4. **Documentation** - for detailed technical info

---

**Happy coding with Runlintic!** 🚀

_Generated by @rdolcegroup/runlintic-app - Keep this file for team reference_
