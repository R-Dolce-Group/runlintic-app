# ⚡ ◯ ➤ Runlintic App

> **A production-ready toolkit for automating code quality, cleanup, and releases.**  
> **Now available as an installable NPM package!** Built with TypeScript and npm.  
> Created by [The R. Dolce Organization](https://rdolcegroup.com).

## 📑 Table of Contents

- [✨ Features](#-features)
- [📋 Requirements](#-requirements)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [🎉 Postinstall Guide](#-postinstall-guide)
- [📖 CLI Commands](#-cli-commands)
- [🔍 Usage Examples](#-usage-examples)
- [🔧 Version Management](#-version-management)
- [🏗️ Project Integration](#-project-integration)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [📁 Package Structure](#-package-structure)
- [📚 Documentation & Resources](#-documentation--resources)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## ✨ Features

- 🔧 **Lint & Format** – ESLint with zero warnings + Prettier formatting
- 🧹 **Clean Dependencies** – Remove unused deps with Knip and depcheck
- 📦 **Package Management** – Keep `package.json` clean and consistent
- 🚀 **Release Automation** – Semantic versioning with changelog generation
- ⚡ **Parallel Execution** – Quality checks run concurrently (40% faster)
- 🛡️ **Robust Error Handling** – Fail-fast scripts with comprehensive cleanup
- 🎯 **TypeScript Ready** – ES2022 targets with strict type checking
- 📊 **Smart Caching** – Turbo-powered incremental builds
- 🎨 **CLI Interface** – Simple `runlintic <command>` interface
- 🔌 **Zero Config** – Works out of the box with sensible defaults

## 📋 Requirements

- **Node.js**: >= 22
- **Package Manager**: npm (primary), yarn and pnpm also supported
- **Git**: For version control and releases (optional)
- **GitHub Personal Access Token**: Required for release features ([Setup Guide](#environment-setup-for-releases))

## 📦 Installation

Add Runlintic App to any project with a single command:

```bash
# Install globally for CLI access
npm install -g @rdolcegroup/runlintic-app

# Or install in your project
npm install -D @rdolcegroup/runlintic-app
# yarn add -D @rdolcegroup/runlintic-app

# To see the helpful postinstall guide during installation:
npm install -D @rdolcegroup/runlintic-app --foreground-scripts

# View help anytime after installation:
npx runlintic help
```

## 🚀 Quick Start

```bash
# Initialize runlintic in your project
runlintic init

# Run comprehensive health check
runlintic health-check

# Run all quality checks (parallel execution)
runlintic check-all

# For releases, set up GitHub token first
export GH_TOKEN="your_github_token_here"

# Create a release
runlintic release:dry    # Preview changes first
runlintic release:patch  # Create patch release
```

**⚠️ Important**: Release commands require a GitHub Personal Access Token. See [Environment Setup](#environment-setup-for-releases) for details.

## 🎉 Postinstall Guide

When you install `@rdolcegroup/runlintic-app`, you get a helpful setup guide. To see this guide during installation, use the `--foreground-scripts` flag, or view it anytime with `npx runlintic help`.

### Quick Start Guide:

```
┌─────────────────────────────────────────────────────────────────┐
│                     GETTING STARTED                            │
├─────────────────────────────────────────────────────────────────┤
│ 1. Initialize your project (creates RUNLINTIC-GUIDE.md):       │
│    npx runlintic init                                          │
│                                                                 │
│ 2. Run health check:                                           │
│    npx runlintic health-check                                  │
│                                                                 │
│ 3. Test release workflow (safe):                               │
│    npx runlintic release:dry                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Essential Commands:

```bash
npx runlintic help                # Show all available commands
npx runlintic init                # Initialize runlintic configs
npx runlintic health-check        # Comprehensive project health check
npx runlintic check-all           # Run lint + typecheck + deps (parallel)
npx runlintic lint                # Run ESLint with zero warnings
npx runlintic format              # Format code with Prettier
npx runlintic maintenance         # Run cleanup tasks
```

### Package.json Integration (Recommended):

```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "lint:fix": "runlintic lint:fix",
    "format": "runlintic format",
    "release:dry": "runlintic release:dry"
  }
}
```

### Release Workflow (Next.js Turbo Monorepo Ready):

**⚠️ Prerequisite**: Release commands require a GitHub Personal Access Token. [Get setup instructions](#environment-setup-for-releases).

```bash
# Set up GitHub token (required for releases)
export GH_TOKEN="your_token"

# Test release
npx runlintic release:dry

# Create releases
npx runlintic release:patch        # 1.0.0 → 1.0.1
npx runlintic release:minor        # 1.0.0 → 1.1.0
npx runlintic release:major        # 1.0.0 → 2.0.0
```

### Pro Tips:

- Use `npx runlintic` for one-time commands
- Add npm scripts for team consistency
- Run `health-check` before releases
- Use `init` command in monorepo root

## 📖 CLI Commands

```bash
runlintic <command>
```

### Quality & Development

```bash
runlintic health-check         # Run comprehensive health check
runlintic check-all            # Run all quality checks (lint + typecheck + deps)
runlintic lint                 # Run ESLint
runlintic lint:fix             # Run ESLint and auto-fix issues
runlintic typecheck            # Run TypeScript type checking
runlintic format               # Run Prettier formatting
runlintic maintenance          # Run maintenance tasks (knip + depcheck + fixes)
```

### Build & Clean

```bash
runlintic clean                # Clean build artifacts
runlintic clean:all            # Complete clean (removes node_modules)
```

### Release Management

```bash
runlintic release:dry          # Preview release changes (recommended first)
runlintic release:patch        # Create patch release (1.0.0 → 1.0.1)
runlintic release:minor        # Create minor release (1.0.0 → 1.1.0)
runlintic release:major        # Create major release (1.0.0 → 2.0.0)
runlintic release              # Create release (default: patch)
```

### Setup

```bash
runlintic init                 # Initialize runlintic in current project
runlintic help                 # Show all available commands
```

## 🔍 Usage Examples

### Daily Development Workflow

```bash
# Make changes to your code
git add .

# Run quality checks before commit
runlintic check-all

# Auto-fix issues if needed
runlintic lint:fix
runlintic format

# Commit changes (triggers pre-commit hooks)
git commit -m "feat: add new feature"
```

### Release Workflow

```bash
# Ensure everything is clean
runlintic health-check

# Preview what will be released
runlintic release:dry

# Create the release
runlintic release:patch

# Or for major changes
runlintic release:major
```

### Maintenance Tasks

```bash
# Clean up dependencies
runlintic maintenance

# Full cleanup and reinstall
runlintic clean:all
npm install  # or yarn install, pnpm install (if using alternative package managers)
```

## 🔧 Version Management

```bash
# Check your current version
npm list @rdolcegroup/runlintic-app

# Check latest available version
npm view @rdolcegroup/runlintic-app version

# Check if your version is outdated
npm outdated @rdolcegroup/runlintic-app

# Update to latest version
npm update @rdolcegroup/runlintic-app
```

## 🏗️ Project Integration

### Initialize in Existing Project

```bash
# Navigate to your project
cd my-awesome-project

# Initialize runlintic (copies configs)
runlintic init

# Run your first health check
runlintic health-check
```

### Manual Integration

If you prefer manual setup, runlintic-app provides programmatic access:

```javascript
const { getConfig, configs } = require('@rdolcegroup/runlintic-app');

// Get ESLint config path
const eslintConfig = getConfig('eslint', 'base');

// Get TypeScript config path
const tsConfig = getConfig('typescript', 'nextjs');

// All available configs
console.log(configs);
```

### Environment Setup (for releases)

**🆓 Free Tier - Self-Managed Tokens**

Runlintic App's free tier requires you to provide your own GitHub Personal Access Token:

1. **Create a GitHub Personal Access Token**:
   - Visit: https://github.com/settings/tokens
   - Create token (classic) with scopes: `repo`, `write:packages`, `read:org`
   - Set expiration (recommend 90 days minimum)

2. **Set the token in your environment**:

   ```bash
   # Method 1: Add to shell profile (recommended)
   echo 'export GH_TOKEN="your_github_token_here"' >> ~/.zshrc
   source ~/.zshrc

   # Method 2: Set for current session only (more secure)
   export GH_TOKEN="your_github_token_here"

   # Verify token is set
   echo $GH_TOKEN
   ```

3. **Test the token setup**:
   ```bash
   # Test that your token works
   runlintic release:dry
   ```

**📊 Free Tier Limitations:**

- Personal GitHub API rate limits apply (5,000 requests/hour)
- Self-managed token rotation required
- Community support only
- Basic features and documentation

**🔒 Security Best Practices:**

- Never commit tokens to version control
- Use environment variables only
- Set reasonable expiration dates
- Rotate tokens regularly
- Consider `.env` files with `.gitignore` for team projects

**Note**: The `env.mjs` file validates that your `GH_TOKEN` is properly configured. Only `GH_TOKEN` is required - all other environment variables are optional with sensible defaults.

## ⚡ Performance Optimizations

This toolkit is optimized for speed and reliability:

- **40% faster builds** through parallel task execution
- **Turbo caching** for incremental builds and task memoization
- **CPU utilization: 221%** showing true concurrent processing
- **Smart dependency management** with automated conflict resolution

### Performance Comparison

```bash
# Before optimization: Sequential execution
npm run lint && npm run typecheck && npm run deps:check
# Time: ~5.8s

# After optimization: Parallel execution
runlintic check-all
# Time: ~3.2s (40% improvement)
```

### What Runlintic App Does

#### ✅ **Automated Release Pipeline**

- **One-command releases**: Handle version bumping, changelog generation, GitHub releases, and Git tagging
- **Conventional commits**: Automatic semantic versioning based on commit messages
- **Fail-safe execution**: Robust error handling with automatic cleanup

#### ✅ **Quality Assurance Automation**

- **Parallel execution**: Run lint, typecheck, and dependency checks simultaneously (40% faster)
- **Zero-tolerance quality gates**: ESLint with zero warnings, strict TypeScript checking
- **Dependency hygiene**: Automated detection and removal of unused dependencies
- **Consistent formatting**: Prettier integration with package.json sorting

#### ✅ **Developer Experience**

- **CLI commands**: Simple `runlintic <command>` interface
- **Project initialization**: `runlintic init` sets up configs in any project
- **Incremental builds**: Only rebuild what changed with intelligent caching
- **Clear feedback**: Detailed output showing exactly what passed/failed and why

## 📁 Package Structure

When you install `@rdolcegroup/runlintic-app`, you get:

```text
@rdolcegroup/runlintic-app/
├─ bin/
│  └─ runlintic-app.js              # CLI entry point
├─ lib/
│  ├─ configs/                  # Bundled configurations
│  │  ├─ base.js                # Base ESLint config
│  │  ├─ next.js                # Next.js ESLint rules
│  │  ├─ react-internal.js      # React internal rules
│  │  ├─ base.json              # Base TypeScript config
│  │  ├─ nextjs.json            # Next.js TypeScript config
│  │  └─ react-library.json     # React library TypeScript config
│  ├─ scripts/                  # Release automation scripts
│  └─ index.js                  # Package entry point
├─ .release-it.json             # Release configuration
├─ commitlint.config.js         # Conventional commits
├─ turbo.json                   # Parallel task execution + caching
└─ package.json
```

### Architecture & Configuration

#### ✅ **Bundled Configurations**

- **ESLint configs**: Base, Next.js, and React configurations with Node.js support
- **TypeScript configs**: ES2022 targets for base, Next.js, and React library projects
- **Release automation**: Conventional commits with changelog generation
- **Quality gates**: Parallel execution with zero-warning enforcement

#### ✅ **Smart Defaults**

- **Zero configuration**: Works out of the box for most projects
- **Extensible**: Override any configuration as needed
- **Environment aware**: Proper Node.js globals and CommonJS support
- **Performance optimized**: Turbo caching and parallel execution

## 📚 Documentation & Resources

### Quick Reference

- **Complete Guide**: Run `npx runlintic init` to get RUNLINTIC-GUIDE.md
- **Documentation**: https://github.com/R-Dolce-Group/runlintic-app
- **Issues**: https://github.com/R-Dolce-Group/runlintic-app/issues
- **Examples**: See `_workflows/user-testing/` for usage patterns

### What's Included

- ✅ **Configuration guides** for ESLint, TypeScript, and different project types
- ✅ **Programmatic API** documentation for integrating configs into your build
- ✅ **Release workflow** setup and token management
- ✅ **Troubleshooting** common issues and solutions
- ✅ **Project-specific** guidance for Node.js, React, Next.js applications

### Monitoring & Insights

- **Build performance**: ~3.2s for full quality pipeline
- **Parallel efficiency**: 221% CPU utilization during quality checks
- **Cache effectiveness**: Turbo cache dramatically speeds up subsequent runs
- **Zero-config operation**: Smart defaults with extensibility when needed

### Before & After

#### Before Runlintic App

```bash
# Manual, error-prone workflow
npm run lint
npm run typecheck
npm run test
npm run build
npm run deps:check
# Manual version bumping
# Manual changelog updates
# Manual GitHub releases
```

#### After Runlintic App

```bash
# One command does it all
runlintic health-check

# One command for releases
runlintic release:patch
```

## 🤝 Contributing

This package is part of The R. Dolce Organization's toolkit. For contributions:

1. Fork the repository
2. Create a feature branch
3. Run `runlintic health-check` before committing
4. Submit a pull request

## 📝 License

ISC

---

**Ready to supercharge your development workflow?**

```bash
npm install -g @rdolcegroup/runlintic-app
runlintic init
runlintic health-check
```

## Contributors

mj163@github.com
mrsdo@github.com

---

Built with ❤️ by [The R. Dolce Organization](https://rdolcegroup.com)
