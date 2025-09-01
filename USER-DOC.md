# USER GUIDE: @rdolcegroup/runlintic-app

A comprehensive toolkit for automating code quality, cleanup, and releases in JavaScript/TypeScript projects.

## 🚀 Quick Start

### Installation

```bash
# Install globally for CLI usage
npm install -g @rdolcegroup/runlintic-app

# Or install locally in your project
npm install --save-dev @rdolcegroup/runlintic-app
```

### Basic Usage

```bash
# Show available commands
runlintic help

# Run all quality checks
runlintic check-all

# Initialize in your project
runlintic init
```

## 📋 Available Commands

### Quality Assurance
```bash
runlintic health-check     # Comprehensive health check + maintenance
runlintic check-all        # Run lint + typecheck + deps in parallel
runlintic lint             # ESLint with zero warnings policy
runlintic lint:fix         # ESLint with auto-fix
runlintic typecheck        # TypeScript type checking
runlintic format           # Prettier formatting
```

### Maintenance
```bash
runlintic maintenance      # Run knip + depcheck + fixes
runlintic clean            # Clean build artifacts
runlintic clean:all        # Complete clean (removes node_modules)
```

### Release Management
```bash
runlintic release:dry      # Preview release changes (safe)
runlintic release:patch    # Create patch release (1.0.0 → 1.0.1)
runlintic release:minor    # Create minor release (1.0.0 → 1.1.0)
runlintic release:major    # Create major release (1.0.0 → 2.0.0)
```

## 🛠️ Configuration Setup

### ESLint Configuration

#### For Base TypeScript/Node.js Projects
```js
// eslint.config.js
import { getConfig } from '@rdolcegroup/runlintic-app';

const baseConfig = require(getConfig('eslint', 'base'));
export default baseConfig;
```

#### For React Projects
```js
// eslint.config.js
import { getConfig } from '@rdolcegroup/runlintic-app';

const reactConfig = require(getConfig('eslint', 'react'));
export default reactConfig;
```

#### For Next.js Projects  
```js
// eslint.config.js
import { getConfig } from '@rdolcegroup/runlintic-app';

const nextConfig = require(getConfig('eslint', 'next'));
export default nextConfig;
```

### TypeScript Configuration

```js
// Copy base TypeScript config
const { copyConfig } = require('@rdolcegroup/runlintic-app');

// Copy to your project
copyConfig('typescript', 'base', './tsconfig.json');
copyConfig('typescript', 'nextjs', './tsconfig.json');     // For Next.js
copyConfig('typescript', 'reactLibrary', './tsconfig.json'); // For React libs
```

### Package.json Integration

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "check-all": "runlintic check-all",
    "health-check": "runlintic health-check", 
    "lint": "runlintic lint",
    "lint:fix": "runlintic lint:fix",
    "typecheck": "runlintic typecheck",
    "format": "runlintic format",
    "clean": "runlintic clean",
    "release:dry": "runlintic release:dry",
    "release": "runlintic release:patch"
  }
}
```

## 🔧 Programmatic Usage

### Import Configurations
```js
const { configs, getConfig, copyConfig } = require('@rdolcegroup/runlintic-app');

// Get config paths
console.log(configs.eslint.base);        // ESLint base config path
console.log(configs.typescript.nextjs);  // TypeScript Next.js config path

// Get specific config
const eslintConfigPath = getConfig('eslint', 'react');
const typescriptConfigPath = getConfig('typescript', 'base');

// Copy configs to your project
copyConfig('eslint', 'base', './my-eslint.config.js');
copyConfig('typescript', 'nextjs', './my-tsconfig.json');
```

### Available Configurations

#### ESLint Configs
- `base` - Base TypeScript/Node.js projects
- `react` - React projects with hooks support
- `next` - Next.js projects with specific rules

#### TypeScript Configs  
- `base` - Base TypeScript configuration
- `nextjs` - Next.js optimized settings
- `reactLibrary` - React library configuration

## 🎯 Project Types & Recommendations

### Node.js/TypeScript Project
```bash
runlintic init
# Uses: eslint/base + typescript/base
```

### React Application
```bash  
runlintic init
# Configure: eslint/react + typescript/base
```

### Next.js Application
```bash
runlintic init  
# Configure: eslint/next + typescript/nextjs
```

### React Library
```bash
runlintic init
# Configure: eslint/react + typescript/reactLibrary
```

## 🚦 Release Workflow (Requires Tokens)

### Prerequisites for Releases
```bash
# Set up GitHub token for releases
export GH_TOKEN="your_github_token_here"

# Free tier usage
export RUNLINTIC_TIER="free"  # Default
```

### Token Requirements
- **GitHub Token:** `repo` and `write:packages` permissions
- **Rate Limits:** 5,000 GitHub API requests/hour (free tier)

### Release Process
```bash
# 1. Preview changes (always do this first)
runlintic release:dry

# 2. Create actual release  
runlintic release:patch    # Bug fixes
runlintic release:minor    # New features
runlintic release:major    # Breaking changes
```

**What releases do:**
- ✅ Version bump in package.json
- ✅ Generate conventional changelog  
- ✅ Create git tag and commit
- ✅ Create GitHub release
- ✅ Publish to npm (if configured)

## 📁 Project Structure

After `runlintic init`, your project will have:

```
your-project/
├── eslint.config.js      # ESLint configuration
├── tsconfig.json         # TypeScript configuration  
├── .release-it.json      # Release automation
├── commitlint.config.js  # Commit message linting
├── .gitignore           # Updated with common ignores
└── package.json         # Updated with runlintic scripts
```

## 🔍 Troubleshooting

### Common Issues

#### "Command not found: runlintic"
```bash
# If installed globally
npm list -g @rdolcegroup/runlintic-app

# If installed locally, use npx
npx runlintic help
```

#### ESLint configuration not found
```bash
# Re-initialize configuration
runlintic init

# Or manually copy configs
node -e "
const { copyConfig } = require('@rdolcegroup/runlintic-app');
copyConfig('eslint', 'base', './eslint.config.js');
"
```

#### Release commands fail
```bash
# Check token setup
echo $GH_TOKEN

# Test release without publishing
runlintic release:dry

# Verify GitHub permissions
curl -H "Authorization: Bearer $GH_TOKEN" https://api.github.com/user
```

### Support & Issues

- **GitHub Issues:** [Report bugs/feature requests](https://github.com/R-Dolce-Group/runlintic-app/issues)
- **Documentation:** Check README.md for latest updates
- **Version Info:** `runlintic --version`

## 🎉 Benefits

✅ **Zero Configuration** - Works out of the box with sensible defaults  
✅ **Consistent Quality** - Enforces code standards across projects  
✅ **Automated Releases** - Semantic versioning with changelogs  
✅ **Performance Optimized** - Parallel execution for 40% faster checks  
✅ **Framework Aware** - Specialized configs for React, Next.js, etc.  
✅ **Developer Friendly** - Clear error messages and helpful suggestions  

## 📊 Package Statistics

- **Size:** ~17KB (minimal footprint)
- **Dependencies:** Carefully curated, no bloat  
- **Node.js:** Requires >= 22.16.0
- **License:** ISC

---

**Ready to improve your code quality?** Start with `runlintic init` in your project! 🚀