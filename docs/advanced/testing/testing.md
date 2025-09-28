# 🧪 Testing Guide

Comprehensive testing strategy for validating Runlintic App functionality.

## Testing Philosophy

This guide provides a systematic approach to validate that Runlintic App works correctly in real-world scenarios, particularly Next.js Turbo monorepos.

## Testing Environment Setup

### Create Isolated Test Environment

```bash
# Create isolated test directory
mkdir ~/runlintic-testing
cd ~/runlintic-testing

# Create realistic Next.js Turbo monorepo
npx create-turbo@latest test-monorepo --package-manager npm
cd test-monorepo
ls -al list directory

# NOTE (remove .DS_Store files)
find . -name ".DS_Store" -delete
```

### Test Environment Structure

```text
test-monorepo/
├── apps/
│   ├── web/                            # Next.js app
│   └── docs/                           # Documentation site
├── packages/
│   ├── ui/                             # Shared UI components
│   └── eslint-config/                  # Shared configs
│   └── typescript-config/              # Shared configs
├── package.json                        # Root package.json
└── turbo.json                          # Turbo configuration
```

## Phase 1: Installation Testing

### 1.1 Local Installation (Primary Method)

```bash
# Test local dev dependency installation
npm install -D @rdolcegroup/runlintic-app

# Verify package is installed
npm list @rdolcegroup/runlintic-app

# Test CLI access via npx
npx runlintic help
npx runlintic --version
```

**Expected Results:**

- ✅ Package installs without errors
- ✅ CLI accessible via `npx runlintic`
- ✅ Version matches published version

### 1.2 Package.json Scripts Integration

```bash
# Add to package.json scripts
{
  "scripts": {
    "lint": "runlintic lint",
    "health-check": "runlintic health-check",
    "release:dry": "runlintic release:dry"
  }
}

# Test via npm scripts
npm run health-check
npm run lint
```

**Expected Results:**

- ✅ npm scripts execute without errors
- ✅ Commands work identically to direct npx calls

### 1.3 Global Installation (Optional)

```bash
# Test global installation
npm install -g @rdolcegroup/runlintic-app

# Verify global CLI
which runlintic
runlintic help
```

**Expected Results:**

- ✅ Global installation succeeds
- ✅ `runlintic` command available in PATH

## Phase 2: Core Functionality Testing

### 2.1 Project Initialization

```bash
# Test initialization in monorepo root
npx runlintic init

# Verify created files
ls -la | grep -E "(eslint|tsconfig|release-it|commitlint)"

# Test file contents are valid
node -c eslint.config.js  # Should not error
cat tsconfig.json | jq .  # Should be valid JSON
```

**Expected Files:**

- ✅ `eslint.config.js` - Valid JavaScript config
- ✅ `tsconfig.json` - Valid TypeScript config
- ✅ `.release-it.json` - Valid release config
- ✅ `commitlint.config.cjs` - Valid commitlint config
- ✅ `RUNLINTIC-*.md` - Documentation files

### 2.2 CLI Commands Validation

```bash
# Test help and basic commands
npx runlintic help        # Should show command list
npx runlintic --version   # Should show version number
npx runlintic health-check # Should run without errors
npx runlintic check-all    # Should run parallel checks
npx runlintic lint         # Should validate code
npx runlintic typecheck    # Should check types
npx runlintic format       # Should format code
npx runlintic maintenance  # Should run cleanup
```

**Expected Results:**

- ✅ All commands execute without fatal errors
- ✅ Help shows all available commands
- ✅ Commands produce expected output

### 2.3 Error Handling

```bash
# Test with no staged changes
npx runlintic commit  # Should show "no staged changes" error

# Test with missing token
npx runlintic release:dry  # Should show token requirement

# Test invalid command
npx runlintic invalid-command  # Should show error + help
```

**Expected Results:**

- ✅ Clear, helpful error messages
- ✅ Proper exit codes (non-zero for errors)
- ✅ Suggestions for fixing issues

## Phase 3: Release Workflow Testing

### 3.1 GitHub Token Validation

```bash
# Test without token
unset GH_TOKEN
npx runlintic release:dry  # Should show token requirement

# Test with invalid token
export GH_TOKEN="invalid-token"
npx runlintic release:dry  # Should show authentication error

# Test with valid token
export GH_TOKEN="your_valid_token"
npx runlintic release:dry  # Should show release preview
```

**Expected Results:**

- ✅ Clear messaging about token requirements
- ✅ Proper authentication error handling
- ✅ Release preview with valid token

### 3.2 Release Commands

```bash
# Test dry run variants
npx runlintic release:dry
npx runlintic release:patch --dry-run
npx runlintic release:minor --dry-run
npx runlintic release:major --dry-run
```

**Expected Results:**

- ✅ Dry runs show preview without making changes
- ✅ Version bumps are calculated correctly
- ✅ Changelog preview is generated

## Phase 4: Integration Testing

### 4.1 Programmatic API Testing

Create `test-api.js`:

```javascript
const { getConfig, configs } = require('@rdolcegroup/runlintic-app');

console.log('Testing programmatic API...');

// Test available configs
console.log('Available configs:', configs);

// Test specific config retrieval
try {
  const eslintConfig = getConfig('eslint', 'base');
  console.log('✅ ESLint base config:', eslintConfig);
} catch (error) {
  console.log('❌ ESLint config error:', error.message);
}

try {
  const tsConfig = getConfig('typescript', 'nextjs');
  console.log('✅ TypeScript Next.js config:', tsConfig);
} catch (error) {
  console.log('❌ TypeScript config error:', error.message);
}
```

Run test:

```bash
node test-api.js
```

**Expected Results:**

- ✅ API functions are accessible
- ✅ Config paths are returned correctly
- ✅ No runtime errors

### 4.2 Workspace Context Testing

```bash
# Test from different workspace locations
cd apps/web
npx runlintic health-check  # Should work from subdirectory
npx runlintic lint         # Should lint current directory

cd ../../packages/ui
npx runlintic typecheck    # Should check types in current context

cd ../..  # Back to root
npx runlintic health-check  # Should work from root
```

**Expected Results:**

- ✅ Commands work from any directory
- ✅ Context-appropriate behavior (lint current vs all)
- ✅ No path resolution errors

## Phase 5: Performance Testing

### 5.1 Execution Time Validation

```bash
# Time parallel execution
echo "Testing parallel execution performance..."
time npx runlintic check-all

# Compare to sequential (for reference)
echo "Testing sequential execution (reference)..."
time (npx runlintic lint && npx runlintic typecheck && npx runlintic deps:validate)
```

**Expected Results:**

- ✅ `check-all` is faster than sequential execution
- ✅ Performance improvement is noticeable
- ✅ No significant overhead from parallelization

### 5.2 Memory Usage

```bash
# Monitor memory usage during execution
echo "Monitoring memory usage..."
/usr/bin/time -v npx runlintic health-check 2>&1 | grep "Maximum resident set size"
```

**Expected Results:**

- ✅ Memory usage is reasonable for project size
- ✅ No memory leaks or excessive consumption

## Phase 6: Edge Case Testing

### 6.1 Empty Project Testing

```bash
# Test with minimal project
mkdir empty-project && cd empty-project
npm init -y
npx runlintic init  # Should work with just package.json
```

### 6.2 Existing Config Conflicts

```bash
# Create conflicting config
echo "module.exports = {};" > eslint.config.js
npx runlintic init  # Should show "already exists" messages
```

### 6.3 Large Project Testing

```bash
# Test with large number of files
find . -name "*.js" | wc -l  # Count JS files
time npx runlintic lint      # Should handle large projects
```

## Comprehensive Testing Checklist

### Installation ✅

- [ ] Local installation (`npm install -D`)
- [ ] Global installation (`npm install -g`)
- [ ] CLI accessible via `npx`
- [ ] Version displays correctly
- [ ] Package.json scripts work

### Core Commands ✅

- [ ] `npx runlintic help` - Shows all commands
- [ ] `npx runlintic init` - Creates config files
- [ ] `npx runlintic health-check` - Runs successfully
- [ ] `npx runlintic check-all` - Parallel execution
- [ ] `npx runlintic lint` - Linting works
- [ ] `npx runlintic lint:fix` - Auto-fixing works
- [ ] `npx runlintic typecheck` - TypeScript validation
- [ ] `npx runlintic format` - Code formatting
- [ ] `npx runlintic maintenance` - Cleanup tasks

### Release Workflow ✅

- [ ] Token validation messaging
- [ ] `npx runlintic release:dry` - Preview works
- [ ] Error handling for missing token
- [ ] Free tier messaging appears
- [ ] Authentication with GitHub works

### Integration ✅

- [ ] Works from monorepo root
- [ ] Works from individual packages
- [ ] Programmatic API accessible
- [ ] Config files copied correctly
- [ ] Workspace context respected

### Error Handling ✅

- [ ] Clear error messages
- [ ] Graceful failure handling
- [ ] Proper exit codes
- [ ] Helpful suggestions provided

### Performance ✅

- [ ] Parallel execution is faster
- [ ] Memory usage is reasonable
- [ ] Large projects handled well
- [ ] No performance regressions

## Automated Test Script

Create `test-suite.sh`:

```bash
#!/bin/bash
set -e

echo "🧪 Running Runlintic App Test Suite"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0

run_test() {
  local test_name=$1
  local test_command=$2

  echo -e "${YELLOW}Testing: ${test_name}${NC}"
  TESTS_RUN=$((TESTS_RUN + 1))

  if eval $test_command > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS: ${test_name}${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "${RED}❌ FAIL: ${test_name}${NC}"
  fi
}

# Run tests
run_test "Package installed" "npm list @rdolcegroup/runlintic-app"
run_test "CLI help" "npx runlintic help"
run_test "Version display" "npx runlintic --version"
run_test "Health check" "npx runlintic health-check"
run_test "Linting" "npx runlintic lint"
run_test "Type checking" "npx runlintic typecheck"

echo "=================================="
echo -e "Tests run: ${TESTS_RUN}"
echo -e "Tests passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests failed: ${RED}$((TESTS_RUN - TESTS_PASSED))${NC}"

if [ $TESTS_PASSED -eq $TESTS_RUN ]; then
  echo -e "${GREEN}🎉 All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}💥 Some tests failed!${NC}"
  exit 1
fi
```

Run the test suite:

```bash
chmod +x test-suite.sh
./test-suite.sh
```

## Continuous Integration Testing

### GitHub Actions Example

```yaml
name: End-to-End Testing
on: [push, pull_request]

jobs:
  e2e-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'

      # Test installation
      - name: Test package installation
        run: npm install -D @rdolcegroup/runlintic-app

      # Test CLI commands
      - name: Test CLI functionality
        run: |
          npx runlintic help
          npx runlintic init
          npx runlintic health-check

      # Test with different contexts
      - name: Test monorepo context
        run: |
          mkdir -p apps/test
          cd apps/test
          npx runlintic lint
```

## Success Metrics

### Must Pass (Critical):

- ✅ Package installs without errors
- ✅ All CLI commands execute successfully
- ✅ Configuration files are created correctly
- ✅ Help documentation is accurate

### Should Pass (Important):

- ✅ Performance improvements are measurable
- ✅ Error messages are helpful and clear
- ✅ Token setup process works smoothly
- ✅ Monorepo integration is seamless

### Nice to Have (Enhancement):

- ✅ Programmatic API works as expected
- ✅ Edge cases are handled gracefully
- ✅ Performance metrics match documentation

## Reporting Issues

When tests fail, collect this diagnostic information:

```bash
# System information
node --version
npm --version
uname -a

# Package information
npm list @rdolcegroup/runlintic-app
npx runlintic --version

# Error reproduction
DEBUG=runlintic* npx runlintic health-check > debug.log 2>&1
```

Report issues with:

- Complete error messages
- Steps to reproduce
- System information
- Debug logs (if available)

## Next Steps

- 📋 **[Commands Reference](../commands.md)** - Complete command documentation
- 🚀 **[Quick Start](../../quick-start.md)** - Get up and running fast
- 🆘 **[Troubleshooting](../../troubleshooting/troubleshooting.md)** - Solve common issues
- 📦 **[Monorepo Setup](../../examples/monorepo-setup.md)** - Specific monorepo guidance

This testing strategy ensures Runlintic App works reliably across different environments and use cases. 🧪✅
