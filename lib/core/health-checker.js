/**
 * Health check operations
 * Provides unified interface to project health checking
 */

import { spawn } from 'child_process';

export class HealthChecker {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Run comprehensive health check
   * @returns {Promise<Object>} Health check results
   */
  async runHealthCheck() {
    try {
      const results = await Promise.allSettled([
        this.runLint(),
        this.runTypeCheck(),
        this.runDependencyCheck()
      ]);

      const [lintResult, typeCheckResult, depsResult] = results;

      const healthScore = this.calculateHealthScore(results);

      return {
        overall: {
          score: healthScore,
          status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical'
        },
        lint: this.getResultValue(lintResult),
        typecheck: this.getResultValue(typeCheckResult),
        dependencies: this.getResultValue(depsResult),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        overall: { score: 0, status: 'error' },
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Run ESLint check
   * @returns {Promise<Object>} Lint results
   */
  async runLint() {
    try {
      await this.runNpmScript('lint');
      return {
        success: true,
        message: 'No linting errors found'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Linting errors detected',
        details: error.message
      };
    }
  }

  /**
   * Run TypeScript type check
   * @returns {Promise<Object>} Type check results
   */
  async runTypeCheck() {
    try {
      await this.runNpmScript('typecheck');
      return {
        success: true,
        message: 'No type errors found'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Type errors detected',
        details: error.message
      };
    }
  }

  /**
   * Run dependency validation
   * @returns {Promise<Object>} Dependency check results
   */
  async runDependencyCheck() {
    try {
      await this.runNpmScript('deps:validate');
      return {
        success: true,
        message: 'All dependencies are valid'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Dependency issues detected',
        details: error.message
      };
    }
  }

  /**
   * Run npm script
   * @param {string} scriptName Script name
   * @returns {Promise<string>} Script output
   */
  async runNpmScript(scriptName) {
    return new Promise((resolve, reject) => {
      const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      const child = spawn(command, ['run', scriptName], {
        cwd: this.projectRoot,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Script ${scriptName} failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run script ${scriptName}: ${error.message}`));
      });
    });
  }

  /**
   * Calculate overall health score
   * @param {Array} results Promise.allSettled results
   * @returns {number} Health score (0-100)
   */
  calculateHealthScore(results) {
    let totalScore = 0;
    let totalWeight = 0;

    // Weights for different checks
    const weights = {
      lint: 30,
      typecheck: 25,
      dependencies: 45
    };

    results.forEach((result, index) => {
      const checkNames = ['lint', 'typecheck', 'dependencies'];
      const checkName = checkNames[index];
      const weight = weights[checkName];

      if (result.status === 'fulfilled' && result.value.success) {
        totalScore += weight;
      }
      totalWeight += weight;
    });

    return Math.round((totalScore / totalWeight) * 100);
  }

  /**
   * Extract value from Promise.allSettled result
   * @param {Object} result Promise.allSettled result
   * @returns {Object} Result value
   */
  getResultValue(result) {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        message: 'Check failed to run',
        details: result.reason?.message || 'Unknown error'
      };
    }
  }
}