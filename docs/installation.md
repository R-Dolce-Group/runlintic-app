# 📦 Installation Guide

Complete installation guide for all scenarios.

## Prerequisites

- **Node.js** ≥ 22.16.0 ([Download](https://nodejs.org/))
- **npm** (comes with Node.js), **yarn**, or **pnpm**
- **Git** (recommended for version control)

### Check Prerequisites

```bash
node --version    # Should be >= 22.16.0
npm --version     # Any recent version
git --version     # Any recent version
```

## Installation Methods

### Method 1: Global Installation (Recommended)

**Best for:** Daily development across multiple projects.

```bash
npm install -g @rdolcegroup/runlintic-app
```

**Verify installation:**
```bash
runlintic --version
runlintic help
```

**Pros:**
- ✅ Use `runlintic` command anywhere
- ✅ No `npx` prefix needed
- ✅ Faster execution

**Cons:**
- ❌ Requires admin/sudo permissions on some systems
- ❌ Version locked globally

### Method 2: Project Installation

**Best for:** Team projects with version control.

```bash
cd your-project
npm install -D @rdolcegroup/runlintic-app
```

**Usage:**
```bash
npx runlintic help
npx runlintic init
```

**Package.json integration:**
```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "commit": "runlintic commit"
  }
}
```

**Then use:**
```bash
npm run health-check
npm run lint
npm run commit
```

### Method 3: One-time Usage

**Best for:** Trying out or occasional use.

```bash
npx @rdolcegroup/runlintic-app help
npx @rdolcegroup/runlintic-app init
```

## Alternative Package Managers

### Yarn
```bash
# Global
yarn global add @rdolcegroup/runlintic-app

# Project
yarn add -D @rdolcegroup/runlintic-app

# One-time
yarn dlx @rdolcegroup/runlintic-app help
```

### pnpm
```bash
# Global
pnpm add -g @rdolcegroup/runlintic-app

# Project  
pnpm add -D @rdolcegroup/runlintic-app

# One-time
pnpx @rdolcegroup/runlintic-app help
```

## Installation Troubleshooting

### Permission Issues (macOS/Linux)

**Error:** `EACCES: permission denied`

**Solution 1: Use npm prefix**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to shell profile
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
# or for zsh
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

**Solution 2: Use nvm (recommended)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest Node.js
nvm install node
nvm use node

# Install runlintic
npm install -g @rdolcegroup/runlintic-app
```

**Solution 3: Use sudo (not recommended)**
```bash
sudo npm install -g @rdolcegroup/runlintic-app
```

### Node Version Issues

**Error:** `This package requires Node.js >= 22.16.0`

**Check current version:**
```bash
node --version
```

**Update Node.js:**

**Option 1: Using nvm**
```bash
nvm install 22
nvm use 22
nvm alias default 22
```

**Option 2: Direct download**
- Visit [nodejs.org](https://nodejs.org/)
- Download Node.js 22+ LTS version
- Run installer

**Option 3: Using package manager**
```bash
# macOS with Homebrew
brew install node@22

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows with Chocolatey
choco install nodejs --version 22.16.0
```

### Network Issues

**Error:** `ETIMEDOUT` or `ENOTFOUND`

**Solution 1: Configure npm registry**
```bash
npm config set registry https://registry.npmjs.org/
npm config set timeout 60000
```

**Solution 2: Use corporate proxy**
```bash
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port
```

**Solution 3: Clear npm cache**
```bash
npm cache clean --force
npm install -g @rdolcegroup/runlintic-app
```

### Module Resolution Issues

**Error:** `Cannot find module '@rdolcegroup/runlintic-app'`

**Solution 1: Clear cache and reinstall**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2: Check installation location**
```bash
npm list -g @rdolcegroup/runlintic-app
npm config get prefix
```

**Solution 3: Reinstall with verbose logging**
```bash
npm install -g @rdolcegroup/runlintic-app --verbose
```

## Post-Installation Setup

### 1. Verify Installation
```bash
runlintic --version
runlintic help
```

### 2. Initialize Your First Project
```bash
cd your-project
runlintic init
```

### 3. Run Health Check
```bash
runlintic health-check
```

### 4. Setup GitHub Token (for releases)
```bash
# Get token from: https://github.com/settings/tokens
export GH_TOKEN="your_github_token_here"

# Add to shell profile for persistence
echo 'export GH_TOKEN="your_github_token_here"' >> ~/.bashrc
```

## Team Installation

### For New Team Members

**Create `setup.sh` script:**
```bash
#!/bin/bash
# Team setup script

echo "🚀 Setting up development environment..."

# Check Node.js version
node_version=$(node --version | cut -d'v' -f2)
required_version="22.16.0"

if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Node.js >= 22.16.0 required. Current: $node_version"
    exit 1
fi

# Install runlintic
npm install -g @rdolcegroup/runlintic-app

# Initialize project
runlintic init

# Install dependencies
npm install

# Run health check
runlintic health-check

echo "✅ Setup complete!"
```

**Make executable and run:**
```bash
chmod +x setup.sh
./setup.sh
```

### For CI/CD Environments

**GitHub Actions example:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '22'
    
- name: Install Runlintic
  run: npm install -g @rdolcegroup/runlintic-app
  
- name: Run health check
  run: runlintic health-check
```

## Updating Runlintic

### Check for Updates
```bash
npm outdated -g @rdolcegroup/runlintic-app
```

### Update to Latest
```bash
# Global installation
npm update -g @rdolcegroup/runlintic-app

# Project installation
npm update @rdolcegroup/runlintic-app
```

### Version Management
```bash
# Install specific version
npm install -g @rdolcegroup/runlintic-app@6.3.0

# View available versions
npm view @rdolcegroup/runlintic-app versions --json
```

## Uninstalling

### Remove Global Installation
```bash
npm uninstall -g @rdolcegroup/runlintic-app
```

### Remove Project Installation
```bash
npm uninstall @rdolcegroup/runlintic-app
```

### Clean Up Config Files
```bash
# Remove generated configs (optional)
rm eslint.config.js tsconfig.json .release-it.json commitlint.config.cjs
rm RUNLINTIC-*.md
```

## Next Steps

Once installed:

1. 📋 **[Quick Start Guide](quick-start.md)** - Get running in 5 minutes
2. 🔧 **[Configuration Guide](configuration.md)** - Customize for your project  
3. 📝 **[Commands Reference](commands.md)** - Learn all available commands
4. 🆘 **[Troubleshooting](troubleshooting.md)** - Solve common issues

Need help? Check the [Troubleshooting Guide](troubleshooting.md) or [open an issue](https://github.com/R-Dolce-Group/runlintic-app/issues).