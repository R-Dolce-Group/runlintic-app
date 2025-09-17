#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(_dirname, '../..');

const RISK_LEVELS = {
  SAFE: {
    level: 'SAFE',
    description: 'patch versions (x.x.X)',
    color: '\x1b[32m', // green
    priority: 1
  },
  MODERATE: {
    level: 'MODERATE',
    description: 'minor versions (x.X.x)',
    color: '\x1b[33m', // yellow
    priority: 2
  },
  HIGH: {
    level: 'HIGH',
    description: 'major versions (X.x.x)',
    color: '\x1b[35m', // magenta
    priority: 3
  },
  CRITICAL: {
    level: 'CRITICAL',
    description: 'security vulnerabilities',
    color: '\x1b[31m', // red
    priority: 4
  }
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class DependencyAnalyzer {
  constructor(options = {}) {
    this.options = {
      comprehensive: false,
      format: 'console', // console, json, markdown
      includeDevDeps: true,
      ...options
    };
    this.packageJson = null;
    this.loadPackageJson();
  }

  loadPackageJson() {
    const packagePath = join(PROJECT_ROOT, 'package.json');
    if (!existsSync(packagePath)) {
      throw new Error('package.json not found in project root');
    }

    try {
      this.packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to parse package.json: ${error.message}`);
    }
  }

  async analyzeOutdatedPackages() {
    try {
      const result = execSync('npm outdated --json --long', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return JSON.parse(result);
    } catch (error) {
      if (error.stdout) {
        try {
          return JSON.parse(error.stdout);
        } catch {
          console.warn(`${COLORS.yellow}Warning: Could not parse npm outdated output${COLORS.reset}`);
          return {};
        }
      }
      return {};
    }
  }

  async analyzeUnusedDependencies() {
    try {
      const result = execSync('npx depcheck --json', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return JSON.parse(result);
    } catch (error) {
      if (error.stdout) {
        try {
          return JSON.parse(error.stdout);
        } catch {
          console.warn(`${COLORS.yellow}Warning: Could not parse depcheck output${COLORS.reset}`);
          return { dependencies: [], devDependencies: [] };
        }
      }
      return { dependencies: [], devDependencies: [] };
    }
  }

  async analyzeSecurityVulnerabilities() {
    try {
      const result = execSync('npm audit --json', {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      const auditData = JSON.parse(result);
      return auditData;
    } catch (error) {
      if (error.stdout) {
        try {
          const auditData = JSON.parse(error.stdout);
          return auditData;
        } catch {
          console.warn(`${COLORS.yellow}Warning: Could not parse npm audit output${COLORS.reset}`);
          return { vulnerabilities: {} };
        }
      }
      return { vulnerabilities: {} };
    }
  }

  classifyUpdateRisk(current, _wanted, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    if (currentParts[0] !== latestParts[0]) {
      return RISK_LEVELS.HIGH;
    } else if (currentParts[1] !== latestParts[1]) {
      return RISK_LEVELS.MODERATE;
    } else if (currentParts[2] !== latestParts[2]) {
      return RISK_LEVELS.SAFE;
    }

    return RISK_LEVELS.SAFE;
  }

  generateUpdateRecommendations(outdatedPackages, securityData) {
    const recommendations = [];
    const vulnerablePackages = new Set(
      Object.keys(securityData.vulnerabilities || {})
    );

    for (const [packageName, info] of Object.entries(outdatedPackages)) {
      const risk = this.classifyUpdateRisk(info.current, info.wanted, info.latest);

      if (vulnerablePackages.has(packageName)) {
        risk.level = 'CRITICAL';
        risk.description = 'security vulnerabilities';
        risk.color = COLORS.red;
        risk.priority = 4;
      }

      const recommendation = {
        package: packageName,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        type: info.type || 'dependencies',
        risk,
        action: this.getRecommendedAction(risk, info),
        homepage: info.homepage,
        description: info.description
      };

      recommendations.push(recommendation);
    }

    return recommendations.sort((a, b) => b.risk.priority - a.risk.priority);
  }

  getRecommendedAction(risk) {
    switch (risk.level) {
      case 'CRITICAL':
        return 'UPDATE IMMEDIATELY - Security vulnerability detected';
      case 'HIGH':
        return 'Review before updating - Major version change';
      case 'MODERATE':
        return 'Safe to update - Minor version change';
      case 'SAFE':
        return 'Safe to update - Patch version only';
      default:
        return 'Review package details';
    }
  }

  async assessCompatibilityRisks(recommendations) {
    const compatibilityReport = {
      totalPackages: recommendations.length,
      riskDistribution: {
        CRITICAL: 0,
        HIGH: 0,
        MODERATE: 0,
        SAFE: 0
      },
      highRiskPackages: [],
      suggestedUpdateOrder: []
    };

    recommendations.forEach(rec => {
      compatibilityReport.riskDistribution[rec.risk.level]++;

      if (rec.risk.level === 'CRITICAL' || rec.risk.level === 'HIGH') {
        compatibilityReport.highRiskPackages.push(rec);
      }
    });

    compatibilityReport.suggestedUpdateOrder = [
      ...recommendations.filter(r => r.risk.level === 'CRITICAL'),
      ...recommendations.filter(r => r.risk.level === 'SAFE'),
      ...recommendations.filter(r => r.risk.level === 'MODERATE'),
      ...recommendations.filter(r => r.risk.level === 'HIGH')
    ];

    return compatibilityReport;
  }

  formatConsoleReport(analysisResults) {
    const { outdated, unused, security, recommendations, compatibility } = analysisResults;

    console.log(`\n${COLORS.bright}${COLORS.cyan}🔍 Dependency Analysis Report${COLORS.reset}`);
    console.log(`${COLORS.dim}Generated for: ${this.packageJson.name}@${this.packageJson.version}${COLORS.reset}\n`);

    if (recommendations.length > 0) {
      console.log(`${COLORS.bright}📦 Package Updates Available (${recommendations.length})${COLORS.reset}`);
      console.log('━'.repeat(80));

      const grouped = this.groupRecommendationsByRisk(recommendations);

      Object.entries(grouped).forEach(([riskLevel, packages]) => {
        if (packages.length > 0) {
          const risk = RISK_LEVELS[riskLevel];
          console.log(`\n${risk.color}${COLORS.bright}${risk.level} (${packages.length}) - ${risk.description}${COLORS.reset}`);

          packages.forEach(rec => {
            console.log(`  ${rec.package}`);
            console.log(`    ${COLORS.dim}Current: ${rec.current} → Latest: ${rec.latest}${COLORS.reset}`);
            console.log(`    ${COLORS.dim}${rec.action}${COLORS.reset}`);
          });
        }
      });
    }

    if (unused.dependencies.length > 0 || unused.devDependencies.length > 0) {
      console.log(`\n${COLORS.bright}🧹 Unused Dependencies${COLORS.reset}`);
      console.log('━'.repeat(80));

      if (unused.dependencies.length > 0) {
        console.log(`\n${COLORS.red}Production Dependencies (${unused.dependencies.length}):${COLORS.reset}`);
        unused.dependencies.forEach(dep => console.log(`  - ${dep}`));
      }

      if (unused.devDependencies.length > 0) {
        console.log(`\n${COLORS.yellow}Development Dependencies (${unused.devDependencies.length}):${COLORS.reset}`);
        unused.devDependencies.forEach(dep => console.log(`  - ${dep}`));
      }
    }

    if (Object.keys(security.vulnerabilities || {}).length > 0) {
      console.log(`\n${COLORS.bright}🚨 Security Vulnerabilities${COLORS.reset}`);
      console.log('━'.repeat(80));

      const vulnCount = Object.keys(security.vulnerabilities).length;
      console.log(`${COLORS.red}Found ${vulnCount} packages with security issues${COLORS.reset}`);
      console.log(`${COLORS.dim}Run 'npm audit' for detailed vulnerability information${COLORS.reset}`);
    }

    console.log(`\n${COLORS.bright}📊 Summary${COLORS.reset}`);
    console.log('━'.repeat(80));
    console.log(`Total packages analyzed: ${Object.keys(outdated).length + Object.keys(this.packageJson.dependencies || {}).length + Object.keys(this.packageJson.devDependencies || {}).length}`);
    console.log(`Packages with updates available: ${recommendations.length}`);
    console.log(`Unused dependencies: ${unused.dependencies.length + unused.devDependencies.length}`);
    console.log(`Security vulnerabilities: ${Object.keys(security.vulnerabilities || {}).length}`);

    if (compatibility.riskDistribution.CRITICAL > 0) {
      console.log(`\n${COLORS.red}⚠️  Action Required: ${compatibility.riskDistribution.CRITICAL} critical security updates needed${COLORS.reset}`);
    } else if (compatibility.riskDistribution.HIGH > 0) {
      console.log(`\n${COLORS.yellow}💡 Consider: ${compatibility.riskDistribution.HIGH} major version updates available${COLORS.reset}`);
    } else {
      console.log(`\n${COLORS.green}✅ No critical issues detected${COLORS.reset}`);
    }

    console.log('\n');
  }

  groupRecommendationsByRisk(recommendations) {
    return recommendations.reduce((groups, rec) => {
      const riskLevel = rec.risk.level;
      if (!groups[riskLevel]) {
        groups[riskLevel] = [];
      }
      groups[riskLevel].push(rec);
      return groups;
    }, {});
  }

  formatJSONReport(analysisResults) {
    return JSON.stringify(analysisResults, null, 2);
  }

  formatMarkdownReport(analysisResults) {
    const { recommendations, unused, security, compatibility } = analysisResults;

    let markdown = `# Dependency Analysis Report\n\n`;
    markdown += `**Project:** ${this.packageJson.name}@${this.packageJson.version}\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;

    if (recommendations.length > 0) {
      markdown += `## 📦 Package Updates (${recommendations.length})\n\n`;

      const grouped = this.groupRecommendationsByRisk(recommendations);

      Object.entries(grouped).forEach(([riskLevel, packages]) => {
        if (packages.length > 0) {
          const risk = RISK_LEVELS[riskLevel];
          markdown += `### ${risk.level} Risk (${packages.length})\n\n`;

          markdown += `| Package | Current | Latest | Action |\n`;
          markdown += `|---------|---------|--------|---------|\n`;

          packages.forEach(rec => {
            markdown += `| ${rec.package} | ${rec.current} | ${rec.latest} | ${rec.action} |\n`;
          });
          markdown += '\n';
        }
      });
    }

    if (unused.dependencies.length > 0 || unused.devDependencies.length > 0) {
      markdown += `## 🧹 Unused Dependencies\n\n`;

      if (unused.dependencies.length > 0) {
        markdown += `**Production Dependencies (${unused.dependencies.length}):**\n`;
        unused.dependencies.forEach(dep => markdown += `- ${dep}\n`);
        markdown += '\n';
      }

      if (unused.devDependencies.length > 0) {
        markdown += `**Development Dependencies (${unused.devDependencies.length}):**\n`;
        unused.devDependencies.forEach(dep => markdown += `- ${dep}\n`);
        markdown += '\n';
      }
    }

    markdown += `## 📊 Summary\n\n`;
    markdown += `- **Updates Available:** ${recommendations.length}\n`;
    markdown += `- **Unused Dependencies:** ${unused.dependencies.length + unused.devDependencies.length}\n`;
    markdown += `- **Security Issues:** ${Object.keys(security.vulnerabilities || {}).length}\n`;
    markdown += `- **Critical Updates:** ${compatibility.riskDistribution.CRITICAL}\n`;
    markdown += `- **High Risk Updates:** ${compatibility.riskDistribution.HIGH}\n\n`;

    return markdown;
  }

  async runComprehensiveAnalysis() {
    console.log(`${COLORS.cyan}Running comprehensive dependency analysis...${COLORS.reset}`);

    const [outdated, unused, security] = await Promise.all([
      this.analyzeOutdatedPackages(),
      this.analyzeUnusedDependencies(),
      this.analyzeSecurityVulnerabilities()
    ]);

    const recommendations = this.generateUpdateRecommendations(outdated, security);
    const compatibility = await this.assessCompatibilityRisks(recommendations);

    const analysisResults = {
      timestamp: new Date().toISOString(),
      project: {
        name: this.packageJson.name,
        version: this.packageJson.version
      },
      outdated,
      unused,
      security,
      recommendations,
      compatibility
    };

    return analysisResults;
  }

  async run() {
    try {
      const analysisResults = await this.runComprehensiveAnalysis();

      switch (this.options.format) {
        case 'json':
          console.log(this.formatJSONReport(analysisResults));
          break;
        case 'markdown':
          console.log(this.formatMarkdownReport(analysisResults));
          break;
        case 'console':
        default:
          this.formatConsoleReport(analysisResults);
          break;
      }

      return analysisResults;
    } catch (error) {
      console.error(`${COLORS.red}Error during dependency analysis: ${error.message}${COLORS.reset}`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};

  args.forEach(arg => {
    if (arg === '--comprehensive') {
      options.comprehensive = true;
    } else if (arg.startsWith('--format=')) {
      options.format = arg.split('=')[1];
    } else if (arg.startsWith('--report=')) {
      options.format = arg.split('=')[1] === 'detailed' ? 'markdown' : 'console';
    }
  });

  const analyzer = new DependencyAnalyzer(options);
  analyzer.run().catch(error => {
    console.error(`${COLORS.red}Fatal error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  });
}

export default DependencyAnalyzer;