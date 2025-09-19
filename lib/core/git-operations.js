/**
 * Git operations wrapper
 * Provides unified interface to git functionality for dashboard
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export class GitOperations {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.commitScriptPath = path.join(dirname, '..', '..', 'scripts', 'generate-commit.js');
  }

  /**
   * Get git status
   * @returns {Promise<Object>} Git status information
   */
  async getStatus() {
    try {
      const [status, branch, changes] = await Promise.all([
        this.runGitCommand(['status', '--porcelain']),
        this.runGitCommand(['branch', '--show-current']),
        this.runGitCommand(['diff', '--name-only'])
      ]);

      return {
        currentBranch: branch.trim(),
        hasChanges: status.length > 0,
        stagedFiles: this.parseStatusOutput(status, 'staged'),
        unstagedFiles: this.parseStatusOutput(status, 'unstaged'),
        changedFiles: changes.split('\n').filter(Boolean),
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      return {
        error: error.message,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Generate conventional commit message
   * @returns {Promise<Object>} Generated commit data
   */
  async generateCommit() {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [this.commitScriptPath, '--json'], {
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
            const result = JSON.parse(stdout);
            resolve(result);
          } catch {
            resolve({
              message: stdout.trim(),
              raw: true
            });
          }
        } else {
          reject(new Error(`Commit generation failed: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to generate commit: ${error.message}`));
      });
    });
  }

  /**
   * Create commit with message
   * @param {string} message Commit message
   * @returns {Promise<Object>} Commit result
   */
  async createCommit(message) {
    try {
      const result = await this.runGitCommand(['commit', '-m', message]);
      return {
        success: true,
        output: result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get recent commits
   * @param {number} limit Number of commits to retrieve
   * @returns {Promise<Array>} Recent commits
   */
  async getRecentCommits(limit = 10) {
    try {
      const output = await this.runGitCommand([
        'log',
        `--max-count=${limit}`,
        '--pretty=format:%H|%an|%ad|%s',
        '--date=iso'
      ]);

      return output.split('\n').filter(Boolean).map(line => {
        const [hash, author, date, subject] = line.split('|');
        return { hash, author, date, subject };
      });
    } catch {
      return [];
    }
  }

  /**
   * Run git command
   * @param {Array<string>} args Git command arguments
   * @returns {Promise<string>} Command output
   */
  async runGitCommand(args) {
    return new Promise((resolve, reject) => {
      const child = spawn('git', args, {
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
          reject(new Error(stderr || `Git command failed with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to run git command: ${error.message}`));
      });
    });
  }

  /**
   * Parse git status output
   * @param {string} status Git status output
   * @param {string} type 'staged' or 'unstaged'
   * @returns {Array<Object>} Parsed file status
   */
  parseStatusOutput(status, type) {
    return status.split('\n').filter(Boolean).map(line => {
      const statusCode = line.substring(0, 2);
      const filename = line.substring(3);

      const staged = statusCode[0] !== ' ';
      const unstaged = statusCode[1] !== ' ';

      if ((type === 'staged' && staged) || (type === 'unstaged' && unstaged)) {
        return {
          filename,
          status: this.getFileStatus(statusCode, type === 'staged' ? 0 : 1)
        };
      }
    }).filter(Boolean);
  }

  /**
   * Get human-readable file status
   * @param {string} statusCode Git status code
   * @param {number} index Status index (0 for staged, 1 for unstaged)
   * @returns {string} Human-readable status
   */
  getFileStatus(statusCode, index) {
    const code = statusCode[index];
    switch (code) {
      case 'A': return 'added';
      case 'M': return 'modified';
      case 'D': return 'deleted';
      case 'R': return 'renamed';
      case 'C': return 'copied';
      case '?': return 'untracked';
      default: return 'unknown';
    }
  }
}