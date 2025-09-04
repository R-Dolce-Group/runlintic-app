## 📋 Pull Request Checklist

**Please confirm the following before submitting your PR:**

### ✅ Runlintic Quality Checks

- [ ] `npm run check-all` passes (lint + typecheck + deps)
- [ ] `npm run health-check` passes
- [ ] `npm run format` applied (code is properly formatted)
- [ ] No ESLint warnings or errors
- [ ] No TypeScript errors

### 🚀 Release Readiness (if applicable)

- [ ] `npm run release:dry` previews correctly
- [ ] No breaking changes (or clearly documented)
- [ ] Version bump is appropriate for changes
- [ ] Changelog entries are clear and accurate

### 📝 Code Quality

- [ ] Code follows project conventions and patterns
- [ ] New features have appropriate tests (if testing is configured)
- [ ] Documentation updated (if applicable)
- [ ] No hardcoded secrets or sensitive information
- [ ] Dependencies added are necessary and secure

### 🔍 Monorepo Considerations (if applicable)

- [ ] Changes tested in affected workspaces
- [ ] No breaking changes to shared packages
- [ ] Workspace dependencies properly configured
- [ ] Turbo cache considerations addressed

## 📖 Description

**What does this PR do?**

<!-- Provide a clear description of the changes -->

**What problem does it solve?**

<!-- Reference any issues this PR addresses -->

**How was it tested?**

<!-- Describe your testing approach -->

## 🎯 Type of Change

<!-- Mark the relevant option -->

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (change that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🔧 Chore (maintenance, dependencies, etc.)
- [ ] ♻️ Refactoring (no functional changes)

## 📸 Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## 🔗 Related Issues

<!-- Link any related issues -->

Closes #
Related to #

## 📚 Additional Notes

<!-- Any additional information for reviewers -->

---

**Runlintic Commands Used:**

```bash
# Quality checks run before submitting
npm run check-all
npm run health-check
npm run maintenance

# Release preview (if applicable)
npm run release:dry
```

**For Reviewers:**

- Review the Runlintic quality check results
- Ensure CI passes before approving
- Test release preview if this affects versioning
