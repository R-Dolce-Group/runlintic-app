# 📋 CLI Commands Reference

Complete guide to all Runlintic App commands.

## Usage

```bash
runlintic <command> [options]
```

## Quick Reference

| Command        | Description        | Example                  |
| -------------- | ------------------ | ------------------------ |
| `init`         | Initialize project | `runlintic init`         |
| `dashboard`    | Launch web UI      | `runlintic dashboard`    |
| `help`         | Show help          | `runlintic help`         |
| `health-check` | Full health check  | `runlintic health-check` |
| `commit`       | Generate commit    | `runlintic commit`       |
| `lint`         | Run ESLint         | `runlintic lint`         |
| `release:dry`  | Preview release    | `runlintic release:dry`  |

## Setup Commands

### `runlintic init`

Initialize Runlintic in your project.

```bash
runlintic init
```

**What it does:**

- Creates `eslint.config.js` with zero-warning setup
- Creates `tsconfig.json` with strict TypeScript config
- Creates `.release-it.json` for automated releases
- Creates `commitlint.config.cjs` for conventional commits
- Adds documentation guides (`RUNLINTIC-*.md`)
- Optionally adds package.json scripts

**Options:**

- `--force` - Overwrite existing files
- `--skip-docs` - Skip documentation generation

### `runlintic help`

Show available commands and usage.

```bash
runlintic help
runlintic --help
runlintic -h
```

## Dashboard Commands

### `runlintic dashboard`

Launch the web-based admin dashboard for managing your project through a browser interface.

```bash
# Basic launch (auto-open browser on random port)
runlintic dashboard

# Specify port and don't open browser
runlintic dashboard --port 3000 --no-open

# Bind to all network interfaces (use with caution)
runlintic dashboard --host 0.0.0.0 --port 8080
```

**What it provides:**

- Web interface for all CLI functions
- Real-time project health monitoring
- Interactive dependency management
- Visual git operations and commit generation
- API endpoints for programmatic access
- Secure token-based authentication

**Options:**

- `--port <number>` - Specify port (default: random free port)
- `--host <address>` - Specify host address (default: 127.0.0.1)
- `--no-open` - Don't automatically open browser

**Security:**

- Binds to localhost (127.0.0.1) by default for security
- Generates unique token per session
- No persistent authentication or data storage

📖 **See also:** [`docs/DASHBOARD.md`](dashboard/DASHBOARD.md) for complete dashboard documentation.

## Quality Commands

### `runlintic health-check`

Run comprehensive project health check.

```bash
runlintic health-check
```

**What it does:**

1. ESLint validation (zero warnings)
2. TypeScript type checking
3. Dependency validation
4. Package.json cleanup
5. Post-install scripts

**Performance:** ~3-5 seconds with parallel execution

### `runlintic check-all`

Run all quality checks in parallel (40% faster).

```bash
runlintic check-all
```

**Includes:**

- `runlintic lint`
- `runlintic typecheck`
- `runlintic deps:validate`

### `runlintic lint`

Run ESLint with zero-warning policy.

```bash
runlintic lint
```

**Features:**

- Zero warnings allowed
- Node.js globals support
- React/Next.js rules included
- Modern ES2022 syntax

### `runlintic lint:fix`

Auto-fix ESLint issues and sort package.json.

```bash
runlintic lint:fix
```

**What it fixes:**

- Code formatting
- Import/export organization
- Package.json field ordering
- Basic style issues

### `runlintic typecheck`

Run TypeScript type checking.

```bash
runlintic typecheck
```

**Features:**

- Strict type checking
- ES2022 target
- Skip if no TypeScript files found
- Fast incremental checking

### `runlintic format`

Format code with Prettier and sort package.json.

```bash
runlintic format
```

**Formats:**

- TypeScript/JavaScript files
- Markdown files
- JSON files (package.json sorting)

## Git & Commit Commands

### `runlintic commit`

Generate intelligent conventional commit messages.

```bash
runlintic commit
```

**Features:**

- ✅ Analyzes staged files automatically
- ✅ Suggests commit type (feat, fix, docs, etc.)
- ✅ Generates smart scope based on files
- ✅ Auto-detects changes from git diff
- ✅ Press Enter for intelligent defaults
- ✅ Validates with commitlint before committing

**Interactive prompts:**

1. Commit type (feat, fix, docs, etc.)
2. Scope (optional - auto-suggested)
3. Description (auto-generated available)
4. Breaking changes (y/N)
5. Detailed description (auto-populated)

**Example output:**

```
feat(scripts): enhance commit generator with intelligent analysis

1. Added file type detection for better suggestions
2. Enhanced diff analysis for pattern recognition
3. Improved zero-effort user experience
```

## Release Commands

### `runlintic release:dry`

Preview release changes without creating actual release.

```bash
runlintic release:dry
```

**Shows:**

- Version bump preview
- Changelog entries
- Files to be committed
- GitHub release preview

**Requirements:** GitHub token (`GH_TOKEN`)

### `runlintic release:patch`

Create patch release (1.0.0 → 1.0.1).

```bash
runlintic release:patch
```

### `runlintic release:minor`

Create minor release (1.0.0 → 1.1.0).

```bash
runlintic release:minor
```

### `runlintic release:major`

Create major release (1.0.0 → 2.0.0).

```bash
runlintic release:major
```

### `runlintic release`

Create default release (patch).

```bash
runlintic release
```

**All release commands:**

- Run pre-release health check
- Update version in package.json
- Generate conventional changelog
- Create Git tag
- Push to GitHub
- Create GitHub release
- Clean up on completion

## Maintenance Commands

### `runlintic maintenance`

Run maintenance tasks.

```bash
runlintic maintenance
```

**Includes:**

- `knip` - Find unused dependencies and code
- `depcheck` - Check for missing/unused dependencies
- `manypkg:fix` - Sort package.json fields

### `runlintic clean`

Clean build artifacts.

```bash
runlintic clean
```

**Removes:**

- `.next` directory
- `dist` directory
- `build` directory
- `.turbo` cache

### `runlintic clean:all`

Complete clean including node_modules.

```bash
runlintic clean:all
```

**Warning:** Removes `node_modules` and lock files. Run `npm install` after.

## Dependency Commands

### `runlintic deps:validate`

Validate all dependencies.

```bash
runlintic deps:validate
```

**Includes:**

- `deps:check` - Check for unused/missing deps
- `deps:audit` - Security audit
- `deps:lockfile-check` - Verify lock file sync

### `runlintic deps:check`

Check for dependency issues.

```bash
runlintic deps:check
```

### `runlintic deps:audit`

Run security audit.

```bash
runlintic deps:audit
```

### `runlintic deps:lockfile-check`

Verify package-lock.json is in sync.

```bash
runlintic deps:lockfile-check
```

### `runlintic deps:sync`

Sync package-lock.json without installing.

```bash
runlintic deps:sync
```

### `runlintic deps:outdated`

Check for outdated dependencies.

```bash
runlintic deps:outdated
```

## Command Chaining

### Common Workflows

```bash
# Daily development
runlintic lint:fix && runlintic check-all

# Pre-commit check
git add . && runlintic commit

# Release workflow
runlintic health-check && runlintic release:dry && runlintic release:patch

# Full maintenance
runlintic maintenance && runlintic clean && npm install
```

### Package.json Integration

Add to your `package.json`:

```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "lint:fix": "runlintic lint:fix",
    "commit": "runlintic commit",
    "release:dry": "runlintic release:dry",
    "clean": "runlintic clean"
  }
}
```

Then use with npm:

```bash
npm run health-check
npm run lint:fix
npm run commit
```

## Environment Variables

### Required for Releases

```bash
export GH_TOKEN="your_github_token_here"  # Required for all release commands
```

### Optional Configuration

```bash
export RUNLINTIC_TIER="free"              # Defaults to "free"
export RUNLINTIC_SUPPRESS_POSTINSTALL="true"  # Skip post-install messages
export NODE_OPTIONS="--max-old-space-size=4096"  # For large projects
```

## Exit Codes

| Code | Meaning           |
| ---- | ----------------- |
| 0    | Success           |
| 1    | General error     |
| 2    | Linting failures  |
| 3    | TypeScript errors |
| 4    | Dependency issues |
| 5    | Release failures  |

## Performance Tips

- Use `check-all` instead of individual commands (40% faster)
- Enable Turbo caching for repeated runs
- Use `--max-old-space-size` for large projects
- Run `clean:all` occasionally to reset caches

## Need Help?

- 🆘 **[Troubleshooting Guide](troubleshooting/troubleshooting.md)**
- 🚀 **[Quick Start Guide](quick-start.md)**
- 🔧 **[Configuration Guide](configuration.md)**
- 📖 **[Full Documentation](../README.md)**
