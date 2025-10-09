/**
 * Project context detection and configuration
 * Provides project structure analysis for dashboard
 */

import fs from 'fs';
import path from 'path';

export class ProjectDetector {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Detect project context and configuration
   * @returns {Object} Project context information
   */
  detectProjectContext() {
    const context = {
      projectRoot: this.projectRoot,
      hasPackageJson: this.hasFile('package.json'),
      isMonorepo: this.detectMonorepo(),
      hasGit: this.hasFile('.git'),
      hasRunlinticConfig: this.detectRunlinticConfig(),
      projectType: this.detectProjectType(),
      frameworks: this.detectFrameworks(),
      timestamp: new Date().toISOString()
    };

    return context;
  }

  /**
   * Check if file exists in project root
   * @param {string} filename
   * @returns {boolean}
   */
  hasFile(filename) {
    try {
      return fs.existsSync(path.join(this.projectRoot, filename));
    } catch {
      return false;
    }
  }

  /**
   * Detect if project is a monorepo
   * @returns {boolean}
   */
  detectMonorepo() {
    try {
      if (this.hasFile('package.json')) {
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
        );

        return Boolean(
          packageJson.workspaces ||
          (packageJson.private === true && (
            fs.existsSync(path.join(this.projectRoot, 'apps')) ||
            fs.existsSync(path.join(this.projectRoot, 'packages'))
          ))
        );
      }
    } catch {
      // Ignore errors
    }
    return false;
  }

  /**
   * Detect which linter is configured in the project
   * @returns {Object} Linter detection result with { type: 'eslint'|'biome'|'both'|'none' }
   */
  detectLinter() {
    const hasEslintConfig = this.hasFile('eslint.config.js') || this.hasFile('.eslintrc.js') || this.hasFile('.eslintrc.json');
    const hasBiomeConfig = this.hasFile('biome.json') || this.hasFile('biome.jsonc');

    // Check package.json for linter dependencies
    let hasEslintDep = false;
    let hasBiomeDep = false;

    try {
      if (this.hasFile('package.json')) {
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
        );

        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies
        };

        hasEslintDep = Boolean(allDeps.eslint);
        hasBiomeDep = Boolean(allDeps['@biomejs/biome']);
      }
    } catch {
      // Ignore errors, rely on config files
    }

    const hasEslint = hasEslintConfig || hasEslintDep;
    const hasBiome = hasBiomeConfig || hasBiomeDep;

    let type = 'none';
    if (hasEslint && hasBiome) {
      type = 'both';
    } else if (hasBiome) {
      type = 'biome';
    } else if (hasEslint) {
      type = 'eslint';
    }

    return {
      type,
      hasEslint,
      hasBiome,
      hasEslintConfig,
      hasBiomeConfig,
      hasEslintDep,
      hasBiomeDep
    };
  }

  /**
   * Detect runlintic configuration
   * @returns {Object}
   */
  detectRunlinticConfig() {
    const configFiles = [
      'eslint.config.js',
      'tsconfig.json',
      '.release-it.json',
      'commitlint.config.js'
    ];

    return {
      hasEslint: this.hasFile('eslint.config.js'),
      hasTypeScript: this.hasFile('tsconfig.json'),
      hasReleaseIt: this.hasFile('.release-it.json'),
      hasCommitlint: this.hasFile('commitlint.config.js'),
      configFiles: configFiles.filter(file => this.hasFile(file)),
      linter: this.detectLinter()
    };
  }

  /**
   * Detect project type
   * @returns {string}
   */
  detectProjectType() {
    if (this.hasFile('next.config.js') || this.hasFile('next.config.mjs')) {
      return 'next.js';
    }
    if (this.hasFile('turbo.json')) {
      return 'turborepo';
    }
    if (this.hasFile('package.json')) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8')
        );
        if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
          return 'react';
        }
        if (packageJson.type === 'module') {
          return 'esm-node';
        }
        return 'node.js';
      } catch {
        // Ignore errors
      }
    }
    return 'unknown';
  }

  /**
   * Detect frameworks and tools
   * @returns {Array<string>}
   */
  detectFrameworks() {
    const frameworks = [];

    if (this.hasFile('turbo.json')) frameworks.push('turborepo');
    if (this.hasFile('next.config.js') || this.hasFile('next.config.mjs')) frameworks.push('next.js');
    if (this.hasFile('vite.config.js') || this.hasFile('vite.config.ts')) frameworks.push('vite');
    if (this.hasFile('tailwind.config.js')) frameworks.push('tailwind');
    if (this.hasFile('vitest.config.js') || this.hasFile('vitest.config.ts')) frameworks.push('vitest');
    if (this.hasFile('.husky')) frameworks.push('husky');

    return frameworks;
  }
}