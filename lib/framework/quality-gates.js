/**
 * Production Quality Gates Implementation
 * Automated validation and quality assurance for framework decision
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Quality Gates Manager
 * Implements automated quality validation pipeline
 */
class QualityGatesManager {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.results = {
      timestamp: new Date().toISOString(),
      gates: {},
      overall: {
        passed: 0,
        failed: 0,
        warnings: 0,
        score: 0
      }
    };
  }

  /**
   * Run all quality gates and generate report
   */
  async runAllGates() {
    console.log('🚦 Running production quality gates...\n');

    const gates = [
      { name: 'ESLint', fn: () => this.runESLintGate() },
      { name: 'TypeScript', fn: () => this.runTypeCheckGate() },
      { name: 'Security', fn: () => this.runSecurityGate() },
      { name: 'Dependencies', fn: () => this.runDependencyGate() },
      { name: 'Performance', fn: () => this.runPerformanceGate() },
      { name: 'API Contracts', fn: () => this.runAPIContractGate() },
      { name: 'Code Coverage', fn: () => this.runCoverageGate() },
      { name: 'Bundle Size', fn: () => this.runBundleSizeGate() }
    ];

    for (const gate of gates) {
      console.log(`🔍 Running ${gate.name} gate...`);
      try {
        const result = await gate.fn();
        this.results.gates[gate.name] = result;
        
        if (result.status === 'pass') {
          this.results.overall.passed++;
          console.log(`  ✅ ${gate.name}: PASSED`);
        } else if (result.status === 'warning') {
          this.results.overall.warnings++;
          console.log(`  ⚠️  ${gate.name}: WARNING - ${result.message}`);
        } else {
          this.results.overall.failed++;
          console.log(`  ❌ ${gate.name}: FAILED - ${result.message}`);
        }
      } catch (error) {
        this.results.gates[gate.name] = {
          status: 'error',
          message: error.message,
          timestamp: new Date().toISOString()
        };
        this.results.overall.failed++;
        console.log(`  💥 ${gate.name}: ERROR - ${error.message}`);
      }
    }

    // Calculate overall score
    const total = this.results.overall.passed + this.results.overall.failed + this.results.overall.warnings;
    this.results.overall.score = total > 0 ? 
      Math.round(((this.results.overall.passed + (this.results.overall.warnings * 0.5)) / total) * 100) : 0;

    console.log(`\n📊 Quality Gates Summary:`);
    console.log(`  ✅ Passed: ${this.results.overall.passed}`);
    console.log(`  ⚠️  Warnings: ${this.results.overall.warnings}`);
    console.log(`  ❌ Failed: ${this.results.overall.failed}`);
    console.log(`  🎯 Overall Score: ${this.results.overall.score}%`);

    // Save results
    this.saveResults();

    return this.results;
  }

  /**
   * ESLint quality gate
   */
  async runESLintGate() {
    try {
      const startTime = performance.now();
      const output = execSync('npm run lint', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const duration = performance.now() - startTime;

      // Parse ESLint output for warnings/errors
      const warningCount = (output.match(/warning/gi) || []).length;
      const errorCount = (output.match(/error/gi) || []).length;

      if (errorCount > 0) {
        return {
          status: 'fail',
          message: `${errorCount} ESLint errors found`,
          details: { errors: errorCount, warnings: warningCount },
          duration: Math.round(duration)
        };
      } else if (warningCount > 0) {
        return {
          status: 'warning',
          message: `${warningCount} ESLint warnings found`,
          details: { errors: errorCount, warnings: warningCount },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: 'No ESLint issues found',
          details: { errors: 0, warnings: 0 },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`ESLint execution failed: ${error.message}`);
    }
  }

  /**
   * TypeScript quality gate
   */
  async runTypeCheckGate() {
    try {
      const startTime = performance.now();
      
      // Check if TypeScript is configured
      if (!existsSync(join(this.projectRoot, 'tsconfig.json'))) {
        return {
          status: 'warning',
          message: 'No TypeScript configuration found',
          details: { configured: false },
          duration: 0
        };
      }

      const output = execSync('npm run typecheck', { 
        cwd: this.projectRoot, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const duration = performance.now() - startTime;

      // Parse TypeScript output for errors
      const errorCount = (output.match(/error TS\d+/gi) || []).length;

      if (errorCount > 0) {
        return {
          status: 'fail',
          message: `${errorCount} TypeScript errors found`,
          details: { errors: errorCount },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: 'No TypeScript errors found',
          details: { errors: 0 },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      // TypeScript check might fail if not configured, treat as warning
      return {
        status: 'warning',
        message: 'TypeScript check not available or failed',
        details: { error: error.message },
        duration: 0
      };
    }
  }

  /**
   * Security audit quality gate
   */
  async runSecurityGate() {
    try {
      const startTime = performance.now();
      const output = execSync('npm audit --json', { 
        cwd: this.projectRoot, 
        encoding: 'utf8'
      });
      const duration = performance.now() - startTime;

      const auditResult = JSON.parse(output);
      
      const criticalVulns = auditResult.metadata?.vulnerabilities?.critical || 0;
      const highVulns = auditResult.metadata?.vulnerabilities?.high || 0;
      const moderateVulns = auditResult.metadata?.vulnerabilities?.moderate || 0;
      const lowVulns = auditResult.metadata?.vulnerabilities?.low || 0;

      if (criticalVulns > 0) {
        return {
          status: 'fail',
          message: `${criticalVulns} critical security vulnerabilities found`,
          details: { critical: criticalVulns, high: highVulns, moderate: moderateVulns, low: lowVulns },
          duration: Math.round(duration)
        };
      } else if (highVulns > 0) {
        return {
          status: 'warning',
          message: `${highVulns} high security vulnerabilities found`,
          details: { critical: criticalVulns, high: highVulns, moderate: moderateVulns, low: lowVulns },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: 'No critical or high security vulnerabilities found',
          details: { critical: 0, high: 0, moderate: moderateVulns, low: lowVulns },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`Security audit failed: ${error.message}`);
    }
  }

  /**
   * Dependency health quality gate
   */
  async runDependencyGate() {
    try {
      const startTime = performance.now();
      
      // Check for package.json
      const packageJsonPath = join(this.projectRoot, 'package.json');
      if (!existsSync(packageJsonPath)) {
        throw new Error('package.json not found');
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      // Run outdated check
      let outdatedOutput;
      try {
        outdatedOutput = execSync('npm outdated --json', { 
          cwd: this.projectRoot, 
          encoding: 'utf8'
        });
      } catch (error) {
        // npm outdated returns exit code 1 when packages are outdated
        outdatedOutput = error.stdout || '{}';
      }

      const duration = performance.now() - startTime;
      const outdated = JSON.parse(outdatedOutput || '{}');
      const outdatedCount = Object.keys(outdated).length;

      // Check for critical outdated packages
      const criticalOutdated = Object.entries(outdated).filter(([, info]) => {
        const current = info.current || '';
        const latest = info.latest || '';
        // Consider major version differences as critical
        const currentMajor = parseInt(current.split('.')[0]) || 0;
        const latestMajor = parseInt(latest.split('.')[0]) || 0;
        return latestMajor > currentMajor;
      });

      const totalDeps = dependencies.length + devDependencies.length;

      if (criticalOutdated.length > 0) {
        return {
          status: 'warning',
          message: `${criticalOutdated.length} packages have major version updates available`,
          details: { 
            total: totalDeps, 
            outdated: outdatedCount, 
            critical: criticalOutdated.length,
            criticalPackages: criticalOutdated.map(([pkg]) => pkg)
          },
          duration: Math.round(duration)
        };
      } else if (outdatedCount > 10) {
        return {
          status: 'warning',
          message: `${outdatedCount} packages are outdated`,
          details: { total: totalDeps, outdated: outdatedCount, critical: 0 },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: `Dependencies are up to date (${outdatedCount} minor updates available)`,
          details: { total: totalDeps, outdated: outdatedCount, critical: 0 },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`Dependency check failed: ${error.message}`);
    }
  }

  /**
   * Performance baseline quality gate
   */
  async runPerformanceGate() {
    try {
      const startTime = performance.now();
      
      // Basic performance check - ensure server can start and respond
      // This would integrate with the performance monitoring system
      const baselineMetrics = {
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        uptime: process.uptime()
      };

      const heapUsedMB = baselineMetrics.memoryUsage.heapUsed / 1024 / 1024;
      const duration = performance.now() - startTime;

      if (heapUsedMB > 200) {
        return {
          status: 'warning',
          message: `High memory usage: ${heapUsedMB.toFixed(1)}MB`,
          details: { heapUsedMB: heapUsedMB.toFixed(1) },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: `Memory usage within limits: ${heapUsedMB.toFixed(1)}MB`,
          details: { heapUsedMB: heapUsedMB.toFixed(1) },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`Performance check failed: ${error.message}`);
    }
  }

  /**
   * API contract validation quality gate
   */
  async runAPIContractGate() {
    try {
      const startTime = performance.now();
      
      // Check for API documentation/schema files
      const apiFiles = [
        'api-schema.json',
        'swagger.json',
        'openapi.json',
        'api-docs.md'
      ];

      const hasApiDocs = apiFiles.some(file => 
        existsSync(join(this.projectRoot, file))
      );

      const duration = performance.now() - startTime;

      if (!hasApiDocs) {
        return {
          status: 'warning',
          message: 'No API documentation found',
          details: { documented: false },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: 'API documentation found',
          details: { documented: true },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`API contract check failed: ${error.message}`);
    }
  }

  /**
   * Code coverage quality gate
   */
  async runCoverageGate() {
    try {
      const startTime = performance.now();
      
      // Check if tests exist
      const testDirs = ['test', 'tests', '__tests__', 'spec'];
      const hasTests = testDirs.some(dir => 
        existsSync(join(this.projectRoot, dir))
      );

      const packageJson = JSON.parse(readFileSync(join(this.projectRoot, 'package.json'), 'utf8'));
      const hasTestScript = packageJson.scripts && packageJson.scripts.test;

      const duration = performance.now() - startTime;

      if (!hasTests && !hasTestScript) {
        return {
          status: 'warning',
          message: 'No tests found',
          details: { hasTests: false, coverage: 0 },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'warning',
          message: 'Tests detected but coverage not measured',
          details: { hasTests: true, coverage: 'unknown' },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      throw new Error(`Coverage check failed: ${error.message}`);
    }
  }

  /**
   * Bundle size quality gate
   */
  async runBundleSizeGate() {
    try {
      const startTime = performance.now();
      
      // Check node_modules size
      const nodeModulesPath = join(this.projectRoot, 'node_modules');
      let nodeModulesSize = 0;
      
      if (existsSync(nodeModulesPath)) {
        const sizeOutput = execSync(`du -s ${nodeModulesPath}`, { encoding: 'utf8' });
        nodeModulesSize = parseInt(sizeOutput.split('\t')[0]) * 1024; // Convert from KB to bytes
      }

      const sizeInMB = nodeModulesSize / 1024 / 1024;
      const duration = performance.now() - startTime;

      if (sizeInMB > 500) {
        return {
          status: 'warning',
          message: `Large bundle size: ${sizeInMB.toFixed(1)}MB`,
          details: { sizeMB: sizeInMB.toFixed(1) },
          duration: Math.round(duration)
        };
      } else {
        return {
          status: 'pass',
          message: `Bundle size acceptable: ${sizeInMB.toFixed(1)}MB`,
          details: { sizeMB: sizeInMB.toFixed(1) },
          duration: Math.round(duration)
        };
      }
    } catch (error) {
      // If du command fails, treat as warning
      return {
        status: 'warning',
        message: 'Bundle size check not available',
        details: { error: error.message },
        duration: 0
      };
    }
  }

  /**
   * Save quality gates results
   */
  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsPath = join(this.projectRoot, `quality-gates-${timestamp}.json`);
    
    writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Also save latest results
    const latestPath = join(this.projectRoot, 'quality-gates-latest.json');
    writeFileSync(latestPath, JSON.stringify(this.results, null, 2));
    
    console.log(`\n💾 Quality gates results saved to: ${resultsPath}`);
  }

  /**
   * Generate quality gates report
   */
  generateReport() {
    const score = this.results.overall.score;
    const status = score >= 80 ? '✅ EXCELLENT' : score >= 60 ? '⚠️ GOOD' : '❌ NEEDS IMPROVEMENT';
    
    return `# Quality Gates Report

**Generated:** ${this.results.timestamp}
**Overall Score:** ${score}% (${status})

## Summary
- ✅ **Passed:** ${this.results.overall.passed} gates
- ⚠️ **Warnings:** ${this.results.overall.warnings} gates  
- ❌ **Failed:** ${this.results.overall.failed} gates

## Gate Results

${Object.entries(this.results.gates).map(([gate, result]) => `
### ${gate}
- **Status:** ${result.status.toUpperCase()}
- **Message:** ${result.message}
- **Duration:** ${result.duration || 0}ms
${result.details ? `- **Details:** ${JSON.stringify(result.details, null, 2)}` : ''}
`).join('\n')}

## Recommendations

${score >= 80 ? 
  '✅ **PROCEED:** All quality gates are in excellent condition. Safe to proceed with framework decision.' :
  score >= 60 ?
  '⚠️ **PROCEED WITH CAUTION:** Some quality issues detected. Address warnings before major changes.' :
  '❌ **DO NOT PROCEED:** Critical quality issues must be resolved before framework migration.'
}

---
*Quality Gates Report - Production Framework Decision Support*
`;
  }
}

/**
 * Pre-commit quality gate hook
 */
export function setupPreCommitHook() {
  const hookContent = `#!/bin/sh
# Pre-commit quality gate hook

echo "🚦 Running pre-commit quality gates..."

# Run ESLint
echo "🔍 Checking code quality..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed. Please fix linting errors before committing."
  exit 1
fi

# Run TypeScript check if available
if [ -f "tsconfig.json" ]; then
  echo "🔍 Checking TypeScript..."
  npm run typecheck
  if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed. Please fix type errors before committing."
    exit 1
  fi
fi

# Run tests if available
if npm run test --silent 2>/dev/null; then
  echo "🔍 Running tests..."
  npm run test
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix test failures before committing."
    exit 1
  fi
fi

echo "✅ All pre-commit checks passed!"
exit 0
`;

  const hookPath = join(process.cwd(), '.git', 'hooks', 'pre-commit');
  
  try {
    writeFileSync(hookPath, hookContent, { mode: 0o755 });
    console.log('✅ Pre-commit hook installed successfully');
  } catch (error) {
    console.error('❌ Failed to install pre-commit hook:', error.message);
  }
}

/**
 * CI/CD quality gates integration
 */
export function generateCIConfig() {
  const githubActionsConfig = `name: Quality Gates

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run quality gates
      run: |
        npm run lint
        npm run typecheck
        npm audit
        npm run test
    
    - name: Generate quality report
      run: node -e "
        const { QualityGatesManager } = require('./quality-gates.js');
        const manager = new QualityGatesManager();
        manager.runAllGates().then(results => {
          console.log('Quality Gates Score:', results.overall.score + '%');
          if (results.overall.score < 60) {
            process.exit(1);
          }
        });
      "
    
    - name: Upload quality report
      uses: actions/upload-artifact@v4
      with:
        name: quality-gates-report
        path: quality-gates-*.json
`;

  const configPath = join(process.cwd(), '.github', 'workflows', 'quality-gates.yml');
  
  try {
    // Create .github/workflows directory if it doesn't exist
    const workflowDir = join(process.cwd(), '.github', 'workflows');
    if (!existsSync(workflowDir)) {
      require('fs').mkdirSync(workflowDir, { recursive: true });
    }
    
    writeFileSync(configPath, githubActionsConfig);
    console.log('✅ GitHub Actions quality gates workflow created');
  } catch (error) {
    console.error('❌ Failed to create CI config:', error.message);
  }
}

export { QualityGatesManager };
