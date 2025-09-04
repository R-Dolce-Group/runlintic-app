---
name: Bug report
about: Create a report to help us improve @rdolcegroup/runlintic-app
title: '[BUG] '
labels: bug
assignees: ''
---

## 🐛 Bug Description

**A clear and concise description of what the bug is.**

## 🔧 Runlintic Environment

**Please run `npm run health-check` and paste the output:**

```
# Paste health-check output here
```

**Runlintic version:**

```bash
npx runlintic --version
# Paste version here
```

**Project type:**

- [ ] Next.js Turbo monorepo
- [ ] Standard Node.js project
- [ ] Other (please describe):

## 📋 Steps to Reproduce

**Steps to reproduce the behavior:**

1. Run `npm run ...`
2. Execute `npx runlintic ...`
3. See error

**Command that failed:**

```bash
# Paste the exact command that failed
```

## ❌ Expected vs Actual Behavior

**Expected behavior:**
A clear description of what you expected to happen.

**Actual behavior:**
A clear description of what actually happened.

**Error output:**

```
# Paste any error messages or logs here
```

## 🔍 Additional Context

**Package.json scripts (relevant sections):**

```json
{
  "scripts": {
    // Paste relevant scripts here
  }
}
```

**Project structure:**

```
# Brief description of your project structure
my-project/
├── apps/
├── packages/
└── package.json
```

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 22.0.0]
- Package manager: [e.g. npm, yarn, pnpm]
- Monorepo: [yes/no]

## 🧪 Troubleshooting Attempted

**Have you tried these troubleshooting steps?**

- [ ] `npm run maintenance` (cleanup dependencies)
- [ ] `npm run health-check` (verify setup)
- [ ] `npx runlintic clean:all && npm install` (fresh install)
- [ ] Checked that GitHub token is set (`echo $GH_TOKEN`)
- [ ] Reviewed `RUNLINTIC-GUIDE.md` and `RUNLINTIC-WORKFLOW.md`
- [ ] Searched existing issues

**Other troubleshooting steps attempted:**

<!-- Describe any other steps you tried -->

## 📸 Screenshots

**If applicable, add screenshots to help explain your problem.**

## 🎯 Impact

**How is this affecting your workflow?**

- [ ] Blocking releases
- [ ] Preventing quality checks
- [ ] Slowing down development
- [ ] Minor inconvenience

## 💡 Possible Solution

**If you have an idea for how to fix this, please describe:**

---

**For Maintainers:**

- [ ] Bug confirmed
- [ ] Environment details verified
- [ ] Reproduction steps clear
- [ ] Impact assessed
- [ ] Fix priority assigned
