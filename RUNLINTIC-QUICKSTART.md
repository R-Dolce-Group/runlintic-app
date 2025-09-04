# Runlintic Quick Reference

**Essential commands for daily development with @rdolcegroup/runlintic-app**

## ⚡ Daily Commands

```bash
# Initialize project (run once)
npx runlintic init

# Before starting work
npm run health-check

# While coding
npm run lint:fix
npm run format

# Before committing
npm run check-all

# Before releasing
npm run release:dry
```

## 🚀 Release Commands

```bash
# Setup (one-time)
export GH_TOKEN="your_github_token"

# Create releases
npm run release:patch    # 1.0.0 → 1.0.1 (bug fixes)
npm run release:minor    # 1.0.0 → 1.1.0 (new features)
npm run release:major    # 1.0.0 → 2.0.0 (breaking changes)
```

## 🔧 Troubleshooting

```bash
# Slow performance?
npm run maintenance

# Lint errors?
npm run lint:fix

# Release failing?
echo $GH_TOKEN && npm run release:dry
```

## 📋 Quality Checklist

- [ ] `npm run check-all` passes
- [ ] `npm run health-check` passes  
- [ ] `npm run release:dry` previews correctly
- [ ] GitHub token is set for releases

---
**Need more detail? Check `RUNLINTIC-GUIDE.md` and `RUNLINTIC-WORKFLOW.md`**