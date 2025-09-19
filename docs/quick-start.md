# 🚀 Quick Start Guide

Get up and running with Runlintic App in under 5 minutes.

## Prerequisites

- Node.js ≥ 22.16.0
- npm, yarn, or pnpm
- Git (recommended)

## Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g @rdolcegroup/runlintic-app
```

### Option 2: Project Installation

```bash
npm install -D @rdolcegroup/runlintic-app
# Then use: npx runlintic <command>
```

## Initialize Your Project

```bash
cd your-project
runlintic init
```

This creates essential config files:

- `eslint.config.js` - Zero-warning ESLint setup
- `tsconfig.json` - Strict TypeScript config
- `.release-it.json` - Release automation
- `commitlint.config.cjs` - Conventional commits
- `RUNLINTIC-*.md` - Documentation guides

## First Health Check

```bash
runlintic health-check
```

This runs:

- ✅ ESLint with zero warnings
- ✅ TypeScript type checking
- ✅ Dependency validation
- ✅ Package.json cleanup

## Daily Workflow

### 1. Make Changes

```bash
# Edit your code
git add .
```

### 2. Generate Smart Commit

```bash
runlintic commit
# Press Enter at prompts for intelligent defaults
```

### 3. Quality Checks

```bash
runlintic check-all  # Parallel execution - 40% faster
```

### 4. Auto-fix Issues

```bash
runlintic lint:fix   # Fix ESLint issues
runlintic format     # Format with Prettier
```

## Create Your First Release

### Setup GitHub Token (One-time)

```bash
# Get token from: https://github.com/settings/tokens
export GH_TOKEN="your_github_token_here"
```

### Preview Release

```bash
runlintic release:dry
```

### Create Release

```bash
runlintic release:patch  # 1.0.0 → 1.0.1
```

## Next Steps

- 📋 **[Complete Command Reference](commands.md)**
- 🔧 **[Configuration Guide](configuration.md)**
- 🚀 **[Release Workflow](release-workflow.md)**
- 🆘 **[Troubleshooting](troubleshooting/troubleshooting.md)**

## Package.json Integration

Add to your `package.json` for team consistency:

```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "commit": "runlintic commit",
    "release:dry": "runlintic release:dry"
  }
}
```

## Project Types

Runlintic App works perfectly with:

- ✅ **Next.js** - [Next.js Setup Guide](examples/nextjs-setup.md)
- ✅ **Monorepos** - [Monorepo Setup Guide](examples/monorepo-setup.md)
- ✅ **React Libraries** - Built-in React configs
- ✅ **Node.js Apps** - Server-side optimizations
- ✅ **TypeScript** - Strict type checking included

That's it! You're ready to supercharge your development workflow. 🚀
