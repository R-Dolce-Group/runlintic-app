# 🆘 Troubleshooting Guide

Common issues and their solutions when using Runlintic App.

## Installation Issues

### "Cannot find module" Error

```bash
# Error: Cannot find module '@rdolcegroup/runlintic-app'

# Solution 1: Install globally
npm install -g @rdolcegroup/runlintic-app

# Solution 2: Use npx
npx @rdolcegroup/runlintic-app help

# Solution 3: Install locally
npm install -D @rdolcegroup/runlintic-app
```

### Permission Denied (macOS/Linux)

```bash
# Error: EACCES permission denied

# Solution: Use npm prefix or nvm
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Or use nvm (recommended)
nvm use node
npm install -g @rdolcegroup/runlintic-app
```

### Node Version Error

```bash
# Error: This package requires Node.js >= 22.16.0

# Solution: Update Node.js
nvm install 22
nvm use 22
# Or download from https://nodejs.org
```

## CLI Issues

### Command Not Found

```bash
# Error: runlintic: command not found

# Check if installed globally
npm list -g @rdolcegroup/runlintic-app

# If not found, reinstall
npm install -g @rdolcegroup/runlintic-app

# Or check PATH
echo $PATH
```

### Help Command Shows Error

```bash
# If 'runlintic help' fails

# Try direct execution
node ./node_modules/.bin/runlintic help

# Or use npx
npx runlintic help
```

## Linting Issues

### "Zero Warnings" Policy Failures

```bash
# Error: ESLint found warnings (maximum: 0)

# View warnings
runlintic lint

# Auto-fix what's possible
runlintic lint:fix

# Check specific files
npx eslint problematic-file.js --fix
```

### TypeScript Errors

```bash
# Error: TypeScript type checking failed

# View detailed errors
runlintic typecheck

# Skip type checking temporarily
npm run typecheck || echo "TypeScript errors found"

# Fix common issues
# 1. Add type annotations
# 2. Update tsconfig.json
# 3. Install missing @types packages
```

### Missing ESLint Config

```bash
# Error: No ESLint configuration found

# Reinitialize
runlintic init

# Or copy manually
cp ./node_modules/@rdolcegroup/runlintic-app/lib/configs/base.js ./eslint.config.js
```

## Release Issues

### GitHub Token Problems

```bash
# Error: GitHub API authentication failed

# Check token is set
echo $GH_TOKEN

# Verify token permissions
curl -H "Authorization: token $GH_TOKEN" https://api.github.com/user

# Required scopes: repo, write:packages, read:org
# Generate new token: https://github.com/settings/tokens
```

### Release Dry Run Fails

```bash
# Error: Pre-release validation failed

# Run individual checks
runlintic lint
runlintic typecheck
runlintic maintenance
runlintic deps:validate

# Fix issues one by one
runlintic lint:fix
npm audit fix
```

### Git Working Directory Not Clean

```bash
# Error: Working directory is not clean

# Check status
git status

# Stash changes
git stash

# Or commit changes
git add .
runlintic commit
```

## Dependency Issues

### Unused Dependencies Warning

```bash
# Warning: Found unused dependencies

# View details
runlintic maintenance

# Auto-remove (be careful!)
npm uninstall $(npx knip --reporter=compact | grep "unused dependencies" | cut -d: -f2)

# Or remove manually after review
```

### Peer Dependency Warnings

```bash
# Warning: Missing peer dependencies

# Install missing peers
npm install --save-peer [package-name]

# Or ignore if not needed
npm install --legacy-peer-deps
```

### Package-lock.json Sync Issues

```bash
# Error: package-lock.json out of sync

# Regenerate lock file
rm package-lock.json
npm install

# Or use npm ci for exact match
npm ci
```

## Performance Issues

### Slow Health Checks

```bash
# If 'runlintic health-check' is slow

# Run checks individually
runlintic lint      # Should be < 5s
runlintic typecheck # Should be < 10s
runlintic deps:validate # Should be < 15s

# Check for large files in node_modules
du -sh node_modules/*

# Clear npm cache
npm cache clean --force
```

### Out of Memory Errors

```bash
# Error: JavaScript heap out of memory

# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Or run with more memory
node --max-old-space-size=4096 ./node_modules/.bin/runlintic health-check
```

## Configuration Issues

### ESLint Config Conflicts

```bash
# Error: Configuration conflicts

# Remove old configs
rm .eslintrc.js .eslintrc.json eslint.config.json

# Use only eslint.config.js (new format)
runlintic init --force
```

### TypeScript Config Issues

```bash
# Error: TypeScript configuration problems

# Reset to base config
cp ./node_modules/@rdolcegroup/runlintic-app/lib/configs/base.json ./tsconfig.json

# Or extend properly
{
  "extends": "./node_modules/@rdolcegroup/runlintic-app/lib/configs/base.json",
  "compilerOptions": {
    // Your overrides
  }
}
```

## Commit Generator Issues

### No Staged Changes

```bash
# Error: No staged changes found

# Stage your changes first
git add .
git add -A  # Include deletions

# Then generate commit
runlintic commit
```

### Commitlint Validation Fails

```bash
# Error: Commit message validation failed

# Check commitlint rules
cat commitlint.config.cjs

# Use proper format
# feat: add new feature
# fix: resolve bug
# docs: update documentation
```

### Interactive Prompts Not Working

```bash
# If prompts freeze or don't work

# Check terminal compatibility
echo $TERM

# Use different terminal
# Or run with direct input
echo -e "\n\n\nn\n" | runlintic commit
```

## Getting Help

### Enable Debug Mode

```bash
# Set debug environment
export DEBUG=runlintic*
runlintic health-check

# Or verbose npm logs
npm config set loglevel verbose
```

### Check System Info

```bash
# Node version
node --version

# npm version
npm --version

# Operating system
uname -a  # macOS/Linux
systeminfo | findstr /B /C:"OS Name"  # Windows

# Runlintic version
runlintic --version
npm list @rdolcegroup/runlintic-app
```

### Report Issues

```bash
# Collect diagnostic info
runlintic health-check > debug.log 2>&1

# Report at: https://github.com/R-Dolce-Group/runlintic-app/issues
# Include:
# - Node.js version
# - Operating system
# - Complete error messages
# - Steps to reproduce
```

## Still Need Help?

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/R-Dolce-Group/runlintic-app/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/R-Dolce-Group/runlintic-app/discussions)
- 📖 **Documentation**: [Full Guide](../README.md)
- 🚀 **Feature Requests**: [GitHub Issues](https://github.com/R-Dolce-Group/runlintic-app/issues)

Remember: Most issues are solved by ensuring you have Node.js ≥ 22.16.0 and following the [Quick Start Guide](quick-start.md) exactly. 🔧
