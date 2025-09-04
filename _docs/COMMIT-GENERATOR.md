# Commit Generator

An intelligent tool that analyzes your staged changes and generates perfect conventional commit messages automatically.

## Quick Start

```bash
# Stage your changes
git add .

# Generate and commit with guided prompts
npm run commit
```

Press **Enter** at any prompt to use the intelligent suggestions!

## Features

### 🔍 **Intelligent Change Detection**
- Analyzes `git diff` to understand what actually changed
- Detects patterns like ES module conversions, YAML fixes, new features
- Automatically suggests commit descriptions based on detected changes

### 🎯 **Smart Commit Type Suggestions** 
- **Workflows** → `fix|ci` (critical CI issues)
- **Templates** → `feat|docs` (new features)  
- **Scripts** → `feat|build` (tooling improvements)
- **Configs** → `build|style` (linting/formatting)
- **Source Code** → `feat|fix|refactor|perf|style` (code changes)

### 📝 **Automatic Descriptions**
- **ES Module conversions** → "convert to ES modules and fix Node.js warnings"
- **YAML fixes** → "resolve YAML syntax error causing validation failure"
- **New templates** → "add comprehensive GitHub issue templates" 
- **Enhanced scripts** → "enhance commit generator with intelligent analysis"

### 🚀 **Zero-Effort Experience**
All prompts support pressing **Enter** for smart defaults:
- Commit type uses first suggestion
- Scope uses intelligent suggestion
- Description uses auto-generated text  
- Details use detected changes list

## How It Works

### 1. File Analysis
The tool analyzes your staged files to understand the context:

```javascript
// Detects different file types
hasScripts: files.some(f => f.includes('scripts/'))
hasTemplates: files.some(f => f.includes('ISSUE_TEMPLATE'))
hasWorkflows: files.some(f => f.includes('.github/workflows'))
```

### 2. Diff Analysis
Examines the actual changes to detect specific patterns:

```javascript
// Examples of pattern detection
if (addedLine.includes('"type": "module"')) {
  changes.push('Added ES module type to package.json');
}
if (addedLine.includes('import ') && addedLine.includes(' from ')) {
  changes.push('Converted to ES module imports');
}
```

### 3. Smart Suggestions
Combines file analysis and diff patterns to suggest the most appropriate:
- Commit type (feat, fix, docs, etc.)
- Scope (scripts, workflows, templates, etc.)
- Description (auto-generated from detected changes)

## Example Output

```
🔍 Analyzing staged changes...

📁 Files to be committed:
  • package.json
  • scripts/generate-commit.js
  • eslint.config.js

💡 Suggested commit types:
  • feat: A new feature
  • build: Changes that affect the build system

🔍 Detected changes:
  1. Added ES module type to package.json
  2. Converted to ES module imports
  3. Enhanced commit generation logic
  4. Enhanced file detection for better commit suggestions

Enter commit type (feat|build, press Enter for feat): [ENTER]
Enter scope (optional, suggested: scripts, press Enter to use): [ENTER]
Enter brief description (suggested: convert to ES modules and fix Node.js warnings, press Enter to use): [ENTER]
Is this a breaking change? (y/N): N
Enter detailed description (optional, press Enter to use detected changes): [ENTER]

📝 Generated commit message:
──────────────────────────────────────────────────
feat(scripts): convert to ES modules and fix Node.js warnings

1. Added ES module type to package.json
2. Converted to ES module imports
3. Enhanced commit generation logic
4. Enhanced file detection for better commit suggestions
──────────────────────────────────────────────────
```

## Conventional Commit Types

The tool supports all standard conventional commit types:

| Type | Description | When Suggested |
|------|-------------|----------------|
| `feat` | New feature | Scripts, templates, source code |
| `fix` | Bug fix | Workflows, source code |
| `docs` | Documentation | Markdown files, templates |
| `style` | Code style changes | Lint configs, source code |
| `refactor` | Code refactoring | Source code |
| `perf` | Performance improvements | Source code |
| `test` | Test changes | Test files only |
| `build` | Build system changes | Package.json, configs |
| `ci` | CI configuration | Workflows, CI configs |
| `chore` | Other changes | Miscellaneous files |
| `revert` | Revert changes | Manual selection only |

## Advanced Usage

### Manual Override
You can override any suggestion by typing your preferred value:

```
Enter commit type (feat|build, press Enter for feat): fix
Enter scope (optional, suggested: scripts, press Enter to use): api
Enter brief description: resolve authentication timeout issue
```

### Breaking Changes
The tool prompts for breaking changes and formats them properly:

```
Is this a breaking change? (y/N): y
Describe the breaking change: removed deprecated login method

# Results in:
feat!: remove deprecated login method

BREAKING CHANGE: removed deprecated login method
```

### Custom Descriptions
You can provide custom detailed descriptions instead of using detected changes:

```
Enter detailed description: 
Refactored the authentication system to use JWT tokens instead of sessions.
This improves security and enables stateless authentication.
```

## Integration

### Pre-commit Hooks
The generated commits automatically trigger:
- ESLint validation (zero warnings policy)
- TypeScript type checking
- Commitlint validation
- All must pass before commit is created

### Release Automation
Conventional commits generated by this tool integrate with:
- Semantic versioning (`feat` → minor, `fix` → patch)
- Changelog generation (groups by type)
- Release automation (via `release-it`)

## Troubleshooting

### No Suggestions Appearing
- Ensure you have staged changes: `git add .`
- Check that files match expected patterns
- The tool falls back to `chore` if no patterns match

### Commit Validation Failures
- Check ESLint warnings: `npm run lint`
- Verify TypeScript types: `npm run typecheck`
- Review commitlint rules in `commitlint.config.js`

### ES Module Errors
The tool requires Node.js 22+ and ES modules. Ensure:
- `"type": "module"` in package.json
- All config files use `export default` syntax
- Imports use `import/from` syntax

## API Reference

### Functions

#### `generateCommitMessage()`
Main function that orchestrates the commit generation process.

#### `analyzeChanges(staged)`
Analyzes staged files to determine project context.
- **Parameters**: `staged` - String of staged file names
- **Returns**: Analysis object with file type flags

#### `analyzeDiffChanges(diff, analysis)` 
Examines git diff to detect specific change patterns.
- **Parameters**: `diff` - Git diff output, `analysis` - File analysis
- **Returns**: Array of detected changes

#### `suggestCommitType(analysis)`
Suggests appropriate commit types based on file analysis.
- **Parameters**: `analysis` - File analysis object  
- **Returns**: Array of suggested commit types

## Contributing

To enhance the commit generator:

1. **Add new patterns** in `analyzeDiffChanges()`
2. **Add file type detection** in `analyzeChanges()`  
3. **Update suggestions** in `suggestCommitType()`
4. **Test with various change types** to ensure accuracy

The tool is designed to be extensible and learn from common development patterns.