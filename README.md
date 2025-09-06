# ⚡ ◯ ➤ Runlintic App

[![NPM Version](https://img.shields.io/npm/v/@rdolcegroup/runlintic-app)](https://www.npmjs.com/package/@rdolcegroup/runlintic-app)
[![NPM Downloads](https://img.shields.io/npm/dw/@rdolcegroup/runlintic-app)](https://www.npmjs.com/package/@rdolcegroup/runlintic-app)
[![GitHub Issues](https://img.shields.io/github/issues/R-Dolce-Group/runlintic-app)](https://github.com/R-Dolce-Group/runlintic-app/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/R-Dolce-Group/runlintic-app)](https://github.com/R-Dolce-Group/runlintic-app/pulls)
[![Build Status](https://github.com/R-Dolce-Group/runlintic-app/actions/workflows/runlintic-ci.yml/badge.svg)](https://github.com/R-Dolce-Group/runlintic-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.16.0-brightgreen)](https://nodejs.org/)

**A production-ready toolkit for automating code quality, cleanup, and releases.**

Stop wrestling with ESLint configs, dependency management, and release workflows. Runlintic App provides everything you need in one simple CLI tool.

```bash
# Global installation (recommended)
npm install -g @rdolcegroup/runlintic-app
runlintic init && runlintic health-check

# Or local installation
npm install --save-dev @rdolcegroup/runlintic-app
npx runlintic init && npx runlintic health-check
```

## ✨ What It Does

- 🔧 **Lint & Format** – ESLint + Prettier with zero warnings
- 🧹 **Clean Dependencies** – Remove unused deps automatically
- 🚀 **Smart Releases** – Semantic versioning with changelogs
- 📝 **Intelligent Commits** – Generate conventional commit messages
- ⚡ **40% Faster** – Parallel execution for all quality checks
- 🎯 **Zero Config** – Works immediately, customize later

## 🚀 Quick Start

### 1. Install

Choose between **global** or **local** installation:

#### Global Installation (Recommended)

```bash
npm install -g @rdolcegroup/runlintic-app
runlintic init
```

<!-- Test commit to trigger CI workflow -->

#### Local Installation (Project-specific)

```bash
npm install --save-dev @rdolcegroup/runlintic-app
npx runlintic init
```

**What's the difference?**

- **Global**: Install once, use everywhere. Commands work from any directory with `runlintic`
- **Local**: Install per project. Use with `npx runlintic` or add to package.json scripts

### 2. Initialize Your Project

```bash
cd your-project
runlintic init
```

### 3. Run Health Check

```bash
runlintic health-check
```

**That's it!** Your project now has automated code quality and release workflows.

## 📖 Documentation

### Getting Started

- 🚀 **[Quick Start Guide](docs/quick-start.md)** - Get running in 5 minutes
- 📦 **[Installation Guide](docs/installation.md)** - All installation scenarios
- ⚙️ **[Configuration](docs/configuration.md)** - Customize for your project

### Core Features

- 📋 **[CLI Commands](docs/commands.md)** - Complete command reference
- 📝 **[Commit Generator](docs/COMMIT-GENERATOR.md)** - Intelligent commit messages
- 🚀 **[Release Workflow](docs/release-workflow.md)** - Automated releases
- 🔧 **[API Reference](docs/api-reference.md)** - Programmatic usage

### Examples & Guides

- 📱 **[Next.js Setup](docs/examples/nextjs-setup.md)** - Perfect for Next.js projects
- 📦 **[Monorepo Setup](docs/examples/monorepo-setup.md)** - Turborepo integration
- 🔄 **[CI/CD Integration](docs/examples/ci-cd-integration.md)** - GitHub Actions

### Help & Support

- 🆘 **[Troubleshooting](docs/troubleshooting.md)** - Common issues & solutions
- ⚡ **[Performance Guide](docs/advanced/performance.md)** - Optimization tips
- 🔧 **[Custom Configs](docs/advanced/custom-configs.md)** - Advanced customization

## 🛠️ Daily Workflow

```bash
# Make changes to your code
git add .

# Generate smart commit message
runlintic commit

# Run quality checks
runlintic check-all

# Create a release
runlintic release:dry    # Preview first
runlintic release:patch  # Then release
```

## 🎯 Perfect For

- ✅ **Next.js applications** - Optimized configs included
- ✅ **Monorepos** - Turbo integration for performance
- ✅ **TypeScript projects** - Strict type checking
- ✅ **React libraries** - Component-focused linting
- ✅ **Node.js apps** - Server-side optimizations

## 🔧 Requirements

- **Node.js** ≥ 22.16.0
- **Git** (for releases)
- **GitHub token** (for releases) - [Setup Guide](docs/release-workflow.md#github-token)

## 📦 What's Included

When you run `runlintic init`, you get:

```
your-project/
├── eslint.config.js      # Zero-warning ESLint setup
├── tsconfig.json         # Strict TypeScript config
├── .release-it.json      # Automated release config
├── commitlint.config.cjs # Conventional commits
└── RUNLINTIC-*.md        # Complete guides
```

## 🤝 Contributing

This package is part of [The R. Dolce Organization](https://rdolcegroup.com).

1. Fork the repository
2. Create a feature branch
3. Run `runlintic health-check`
4. Submit a pull request

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/R-Dolce-Group/runlintic-app/issues)
- 💬 **Questions**: [Discussions](https://github.com/R-Dolce-Group/runlintic-app/discussions)
- 📖 **Documentation**: [Full Docs](docs/)
- 🚀 **Feature Requests**: [GitHub Issues](https://github.com/R-Dolce-Group/runlintic-app/issues)

## 📄 License

MIT - See [LICENSE](LICENSE) file for details.

---

**Ready to supercharge your development workflow?**

```bash
# Global installation (recommended)
npm install -g @rdolcegroup/runlintic-app
runlintic init && runlintic health-check

# Or add to your project
npm install --save-dev @rdolcegroup/runlintic-app
npx runlintic init && npx runlintic health-check
```

Built with ❤️ by [The R. Dolce Organization](https://rdolcegroup.com)
