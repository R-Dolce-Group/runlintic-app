# Runlintic Team Workflow Guide

Complete workflow guide for teams using **@rdolcegroup/runlintic-app** in Next.js Turbo monorepos.

## 🎯 Daily Development Workflow

### 1. Morning Setup
```bash
# Pull latest changes
git pull origin main

# Check project health
npm run health-check

# Install any new dependencies
npm install
```

### 2. Before Starting Work
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Verify everything works
npm run lint
npm run typecheck
```

### 3. During Development
```bash
# Auto-fix issues while coding
npm run lint:fix

# Format code regularly
npm run format

# Run maintenance occasionally
npm run maintenance
```

### 4. Before Committing
```bash
# Run all quality checks (40% faster parallel execution)
npm run check-all

# If checks pass, commit your changes
git add .
git commit -m "feat: your feature description"
```

### 5. Before Pull Request
```bash
# Final health check
npm run health-check

# Test release process (safe)
npm run release:dry

# Push to remote
git push origin feature/your-feature-name
```

## 🚀 Release Workflow (Maintainers)

### Preparation Phase
```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run comprehensive health check
npm run health-check

# 3. Verify all quality checks pass
npm run check-all

# 4. Clean up dependencies
npm run maintenance
```

### GitHub Token Setup (One-time)
```bash
# Create GitHub Personal Access Token
# Go to: GitHub → Settings → Developer settings → Personal access tokens
# Generate token with 'repo' permissions

# Set environment variable
export GH_TOKEN="your_github_token_here"

# Verify token is set
echo $GH_TOKEN
```

### Release Testing
```bash
# Always test release first (safe - no actual release)
npm run release:dry

# Test specific release types
npx runlintic release:patch --dry-run
npx runlintic release:minor --dry-run
npx runlintic release:major --dry-run
```

### Creating Releases
```bash
# Patch release (bug fixes: 1.0.0 → 1.0.1)
npm run release:patch

# Minor release (new features: 1.0.0 → 1.1.0) 
npm run release:minor

# Major release (breaking changes: 1.0.0 → 2.0.0)
npm run release:major
```

## 👥 Team Onboarding Checklist

### New Team Member Setup
- [ ] Clone repository
- [ ] Install Node.js (version >=22)
- [ ] Run `npm install`
- [ ] Run `npx runlintic init` (if not already done)
- [ ] Run `npm run health-check`
- [ ] Set up GitHub token (for release maintainers)
- [ ] Review workflow guides (RUNLINTIC-GUIDE.md, RUNLINTIC-WORKFLOW.md)

### Recommended Package.json Scripts
```json
{
  "scripts": {
    "health-check": "runlintic health-check",
    "lint": "runlintic lint",
    "lint:fix": "runlintic lint:fix",
    "format": "runlintic format",
    "typecheck": "runlintic typecheck",
    "check-all": "runlintic check-all",
    "maintenance": "runlintic maintenance",
    "release:dry": "runlintic release:dry",
    "release:patch": "runlintic release:patch",
    "release:minor": "runlintic release:minor",
    "release:major": "runlintic release:major"
  }
}
```

## 🏢 Monorepo Specific Workflows

### Working in Monorepo Root
```bash
# Initialize runlintic (run once per monorepo)
npx runlintic init

# Health check entire monorepo
npm run health-check

# Release entire monorepo
npm run release:dry
```

### Working in Individual Packages
```bash
# Navigate to specific package
cd apps/web  # or packages/ui, etc.

# Run package-specific commands
npx runlintic lint
npx runlintic typecheck
npx runlintic format

# Return to root for release operations
cd ../..
npm run release:dry
```

### Turbo Integration
If you have `turbo.json`, runlintic works seamlessly:
```bash
# Turbo handles workspace coordination automatically
npm run check-all  # Runs across all workspaces efficiently
```

## 🔧 Troubleshooting Common Issues

### Slow Performance
```bash
# Clean up unused dependencies
npm run maintenance

# Complete clean and reinstall
npx runlintic clean:all
npm install
```

### Linting Failures
```bash
# Auto-fix common ESLint issues
npm run lint:fix

# If still failing, check individual files
npx runlintic lint --help
```

### TypeScript Errors
```bash
# Run TypeScript compiler directly
npm run typecheck

# Check individual files
npx tsc --noEmit
```

### Release Issues
```bash
# Verify GitHub token
echo $GH_TOKEN

# Test release workflow
npm run release:dry

# Check git status
git status
git log --oneline -5
```

### Dependency Issues
```bash
# Check for unused dependencies
npx runlintic maintenance

# Verify lockfile sync
npx runlintic deps:lockfile-check

# Check for outdated packages
npx runlintic deps:outdated
```

## 📊 Performance Metrics

### Expected Execution Times
- `npm run lint`: ~10-30 seconds
- `npm run typecheck`: ~5-15 seconds
- `npm run check-all`: ~15-45 seconds (40% faster than sequential)
- `npm run health-check`: ~30-60 seconds
- `npm run maintenance`: ~20-40 seconds

### Optimization Tips
- Use `check-all` instead of running lint/typecheck separately
- Run `maintenance` weekly to keep dependencies clean
- Use `health-check` before important commits/releases

## 🎯 Quality Gates

### Pre-Commit Requirements
- [ ] `npm run check-all` passes
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code is formatted (Prettier)

### Pre-Release Requirements
- [ ] `npm run health-check` passes
- [ ] `npm run release:dry` previews correctly
- [ ] All tests pass (if applicable)
- [ ] Documentation is updated
- [ ] GitHub token is configured

### Team Standards
- [ ] Follow conventional commit messages
- [ ] Use feature branches for new work
- [ ] Require code review for main branch
- [ ] Run quality checks in CI/CD

## 🔗 Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run Runlintic Quality Checks
  run: |
    npm install
    npm run check-all
    npm run health-check
```

### Pre-commit Hook Example
```bash
#!/bin/sh
npm run check-all
```

## 📞 Getting Help

### Self-Help Resources
1. Run `npx runlintic help` for command reference
2. Check `RUNLINTIC-GUIDE.md` for detailed documentation
3. Review error messages carefully - they're designed to be helpful

### Team Support
1. Ask teammates about workflow questions
2. Check team-specific documentation
3. Review project-specific configurations

### Community Support
1. GitHub Issues: https://github.com/R-Dolce-Group/runlintic-app/issues
2. Documentation: https://github.com/R-Dolce-Group/runlintic-app
3. Examples: See `_workflows/` directory in repo

---

**Keep this workflow guide updated as your team processes evolve!**

_Generated by @rdolcegroup/runlintic-app - Team workflow reference_