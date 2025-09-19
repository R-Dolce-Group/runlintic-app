/**
 * Dependency analysis wrapper
 * Provides unified interface to existing dependency analysis functionality
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export class DependencyAnalyzer {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.analysisScriptPath = path.join(dirname, '..', 'scripts', 'dependency-analysis.js');
  }

  /**
   * Run comprehensive dependency analysis
   * @param {Object} options Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeComprehensive(options = {}) {
    const args = ['--report=detailed', '--format=json'];
    if (options.focus) {
      args.push(`--focus=${options.focus}`);
    }

    return this.runAnalysis(args);
  }

  /**
   * Run security-focused analysis
   * @returns {Promise<Object>} Security analysis results
   */
  async analyzeSecurity() {
    return this.runAnalysis(['--focus=security', '--format=json']);
  }

  /**
   * Run updates analysis
   * @returns {Promise<Object>} Updates analysis results
   */
  async analyzeUpdates() {
    return this.runAnalysis(['--focus=updates', '--format=json']);
  }

  /**
   * Run health check analysis
   * @returns {Promise<Object>} Health analysis results
   */
  async analyzeHealth() {
    return this.runAnalysis(['--comprehensive', '--format=json']);
  }

  /**
   * Run dependency analysis script
   * @param {Array<string>} args Script arguments
   * @returns {Promise<Object>} Analysis results
   */
  async runAnalysis(args = []) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [this.analysisScriptPath, ...args], {
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
          try {
            // Try to parse JSON output
            const result = JSON.parse(stdout);
            resolve(result);
          } catch {
            // If not JSON, return raw output
            resolve({
              success: true,
              output: stdout,
              raw: true
            });
          }
        } else {
          reject(new Error(`Analysis failed with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start analysis: ${error.message}`));
      });
    });
  }

  /**
   * Get dependency statistics
   * @returns {Promise<Object>} Dependency stats
   */
  async getStats() {
    try {
      const result = await this.analyzeComprehensive();

      return {
        totalDependencies: result.totalPackages || 0,
        outdatedCount: result.outdatedPackages?.length || 0,
        vulnerabilityCount: result.vulnerabilities?.length || 0,
        unusedCount: result.unusedDependencies?.length || 0,
        lastAnalyzed: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: error.message,
        lastAnalyzed: new Date().toISOString()
      };
    }
  }
}