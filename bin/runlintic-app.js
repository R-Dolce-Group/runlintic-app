#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const commands = {
  'health-check': 'Run comprehensive health check',
  'check-all': 'Run all quality checks (lint + typecheck + deps)',
  'lint': 'Run ESLint',
  'lint:fix': 'Run ESLint and auto-fix issues',
  'typecheck': 'Run TypeScript type checking',
  'format': 'Run Prettier formatting',
  'maintenance': 'Run maintenance tasks (knip + depcheck + workspace fixes)',
  'deps:validate': 'Validate dependencies (unused + audit + lock sync)',
  'deps:lockfile-check': 'Check package-lock.json sync with package.json',
  'deps:sync': 'Sync package-lock.json without installing',
  'deps:outdated': 'Check for outdated dependencies',
  'commit': 'Generate intelligent conventional commit messages',
  'release': 'Create a release',
  'release:dry': 'Dry run release (preview changes)',
  'release:patch': 'Create patch release',
  'release:minor': 'Create minor release',
  'release:major': 'Create major release',
  'clean': 'Clean build artifacts',
  'clean:all': 'Complete clean (removes node_modules)',
  'init': 'Initialize runlintic in current project'
};

function validateTokenTier() {
  const token = process.env.GH_TOKEN;
  const tier = process.env.RUNLINTIC_TIER || 'free';
  
  // Only validate for release commands
  const releaseCommands = ['release', 'release:dry', 'release:patch', 'release:minor', 'release:major'];
  const command = process.argv[2];
  
  if (releaseCommands.includes(command)) {
    if (tier === 'free' && !token) {
      console.log('🆓 Free tier requires your own GitHub token');
      console.log('💡 Set up your token: export GH_TOKEN="your_github_token"');
      console.log('📖 See README for detailed setup instructions');
      console.log('⬆️  Upgrade to paid tier for managed tokens');
      process.exit(1);
    }
    
    if (tier === 'free' && token) {
      console.log('🆓 Using free tier with your GitHub token');
      console.log('ℹ️  Rate limits: 5,000 GitHub API requests/hour');
    }
  }
}

function showHelp() {
  console.log('🚀 Runlintic - Code quality and release automation toolkit\n');
  
  // Quick Start section
  console.log('🏁 Quick Start (Next.js Turbo Monorepo Ready):');
  console.log('  1. runlintic init                Initialize project configs');
  console.log('  2. runlintic health-check        Run comprehensive health check');
  console.log('  3. runlintic release:dry          Test release workflow (safe)\n');
  
  console.log('Usage: runlintic <command>\n');
  console.log('📋 Available Commands:');
  
  // Group commands by category
  const categories = {
    'Setup & Health': ['init', 'health-check'],
    'Code Quality': ['check-all', 'lint', 'lint:fix', 'typecheck', 'format'],
    'Git & Commits': ['commit'],
    'Dependencies': ['deps:validate', 'deps:lockfile-check', 'deps:sync', 'deps:outdated'],
    'Maintenance': ['maintenance', 'clean', 'clean:all'],
    'Release Management': ['release', 'release:dry', 'release:patch', 'release:minor', 'release:major']
  };
  
  Object.entries(categories).forEach(([category, cmds]) => {
    console.log(`\n  ${category}:`);
    cmds.forEach(cmd => {
      if (commands[cmd]) {
        console.log(`    ${cmd.padEnd(18)} ${commands[cmd]}`);
      }
    });
  });
  
  console.log('\n💡 Package.json Integration:');
  console.log('  Add scripts for team consistency:');
  console.log('  {');
  console.log('    "scripts": {');
  console.log('      "health-check": "runlintic health-check",');
  console.log('      "lint": "runlintic lint",');
  console.log('      "commit": "runlintic commit",');
  console.log('      "release:dry": "runlintic release:dry"');
  console.log('    }');
  console.log('  }');
  
  console.log('\n🔧 Release Setup:');
  console.log('  export GH_TOKEN="your_github_token"    # Required for releases');
  console.log('  runlintic release:dry                   # Test release workflow');
  
  console.log('\n🆓 Free Tier - Self-managed GitHub tokens required for releases');
  console.log('⬆️  Upgrade options: https://rdolcegroup.com/runlintic');
  console.log('📖 Documentation: https://github.com/R-Dolce-Group/runlintic-app');
  
  // Context-aware tips
  const cwd = process.cwd();
  const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
  const hasTurboJson = fs.existsSync(path.join(cwd, 'turbo.json'));
  
  if (hasPackageJson) {
    console.log('\n🔍 Current Directory Analysis:');
    if (hasTurboJson) {
      console.log('  ✅ Turbo monorepo detected - Perfect for runlintic!');
      console.log('  💡 Try: runlintic init (in monorepo root)');
    } else {
      console.log('  ✅ Node.js project detected');
      console.log('  💡 Try: runlintic health-check');
    }
  }
}

function runCommand(scriptName, args = []) {
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const fullArgs = ['run', scriptName, ...args];
  
  const child = spawn(command, fullArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('close', (code) => {
    process.exit(code);
  });

  child.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.error('❌ npm not found. Please install Node.js which includes npm');
    } else {
      console.error('❌ Error running command:', err.message);
    }
    process.exit(1);
  });
}

async function promptOptionalEnhancements(isMonorepo, hasTurboJson, templatesDir) {
  const { createInterface } = await import('readline');
  const readline = { createInterface };
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n📋 Optional Enhancements Available:');
  console.log('   (These will NOT overwrite existing files)');
  
  const enhancements = [];
  
  // Turbo configuration for monorepos
  if (isMonorepo && !hasTurboJson) {
    enhancements.push({
      name: 'turbo.json',
      description: 'Turbo build system configuration (optimizes monorepo builds)',
      file: path.join(templatesDir, 'turbo.json'),
      target: './turbo.json',
      recommended: true
    });
  }
  
  // Future enhancements can be added here
  // Examples:
  // - Docker configuration
  // - Additional CI workflows
  // - Database migration scripts
  // - etc.
  
  if (enhancements.length === 0) {
    rl.close();
    console.log('\n✨ Setup complete! No additional enhancements available for your project type.');
    return;
  }
  
  console.log('\n🤔 Would you like to add any of these optional files?');
  enhancements.forEach((enhancement, index) => {
    const recommended = enhancement.recommended ? ' (recommended)' : '';
    console.log(`   ${index + 1}. ${enhancement.name}${recommended} - ${enhancement.description}`);
  });
  
  console.log('\n💡 You can always add these later manually if needed.');
  
  rl.question('\n❓ Add optional enhancements? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n🔧 Adding optional enhancements...');
      
      enhancements.forEach(enhancement => {
        if (!fs.existsSync(enhancement.target) && fs.existsSync(enhancement.file)) {
          fs.copyFileSync(enhancement.file, enhancement.target);
          console.log(`✅ Created ${enhancement.target}`);
        }
      });
      
      console.log('\n🎉 Optional enhancements added successfully!');
      if (isMonorepo && !hasTurboJson) {
        console.log('💡 Run `npm run build` to test Turbo build caching');
      }
    } else {
      console.log('\n👍 Skipped optional enhancements - you can add them manually later');
    }
    
    console.log('\n🚀 Runlintic setup complete! Run `npm run health-check` to get started.');
    rl.close();
  });
}

async function initProject() {
  const configDir = path.join(_dirname, '..', 'lib', 'configs');
  const templatesDir = path.join(_dirname, '..', 'lib', 'templates');
  const { injectPackageJsonScripts } = await import(path.join('file://', _dirname, '..', 'lib', 'utils', 'packageJsonHelper.js'));
  
  console.log('🔧 Initializing runlintic in current project...\n');
  
  const cwd = process.cwd();
  const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
  const hasTurboJson = fs.existsSync(path.join(cwd, 'turbo.json'));
  
  // Enhanced file list with all templates
  const filesToCopy = [
    // Core configurations
    { from: path.join(configDir, 'base.json'), to: './tsconfig.json', type: 'config', description: 'TypeScript configuration' },
    { from: path.join(configDir, 'base.js'), to: './eslint.config.js', type: 'config', description: 'ESLint configuration' },
    { from: path.join(_dirname, '..', '.release-it.json'), to: './.release-it.json', type: 'config', description: 'Release configuration' },
    { from: path.join(_dirname, '..', 'commitlint.config.js'), to: './commitlint.config.js', type: 'config', description: 'Commit lint configuration' },
    
    // Documentation and guides
    { from: path.join(templatesDir, 'RUNLINTIC-GUIDE.md'), to: './RUNLINTIC-GUIDE.md', type: 'guide', description: 'Complete user guide' },
    { from: path.join(templatesDir, 'RUNLINTIC-QUICKSTART.md'), to: './RUNLINTIC-QUICKSTART.md', type: 'guide', description: 'Quick reference guide' },
    { from: path.join(templatesDir, 'RUNLINTIC-WORKFLOW.md'), to: './RUNLINTIC-WORKFLOW.md', type: 'guide', description: 'Team workflow guide' },
    
    // Environment and setup
    { from: path.join(templatesDir, '.env.template'), to: './.env.template', type: 'template', description: 'Environment variables template' },
    { from: path.join(templatesDir, '.nvmrc'), to: './.nvmrc', type: 'config', description: 'Node version specification' },
    { from: path.join(templatesDir, 'setup.sh'), to: './setup.sh', type: 'script', description: 'Developer setup script' },
    
    // GitHub integration  
    { from: path.join(templatesDir, 'runlintic-ci.yml'), to: './.github/workflows/runlintic-ci.yml', type: 'github', description: 'GitHub Actions workflow' },
    { from: path.join(templatesDir, 'issue-management.yml'), to: './.github/workflows/issue-management.yml', type: 'github', description: 'Issue management automation' },
    { from: path.join(templatesDir, 'pull_request_template.md'), to: './.github/pull_request_template.md', type: 'github', description: 'Pull request template' },
    { from: path.join(templatesDir, 'bug_report.md'), to: './.github/ISSUE_TEMPLATE/bug_report.md', type: 'github', description: 'Bug report template' },
    { from: path.join(templatesDir, 'feature_request.md'), to: './.github/ISSUE_TEMPLATE/feature_request.md', type: 'github', description: 'Feature request template' },
    { from: path.join(templatesDir, 'config.yml'), to: './.github/ISSUE_TEMPLATE/config.yml', type: 'github', description: 'Issue template configuration' },
    
    // VSCode integration
    { from: path.join(templatesDir, 'vscode-settings.json'), to: './.vscode/settings.json', type: 'vscode', description: 'VSCode settings' },
    { from: path.join(templatesDir, 'vscode-extensions.json'), to: './.vscode/extensions.json', type: 'vscode', description: 'VSCode extensions' },
    
    // Git hooks
    { from: path.join(templatesDir, 'pre-commit'), to: './.husky/pre-commit', type: 'husky', description: 'Pre-commit hook', condition: () => hasPackageJson }
  ];
  
  // Detect project characteristics for optional enhancements
  const isMonorepo = hasPackageJson && (() => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
      return (
        packageJson.workspaces || 
        packageJson.private === true && (
          fs.existsSync(path.join(cwd, 'apps')) || 
          fs.existsSync(path.join(cwd, 'packages'))
        )
      );
    } catch {
      return false;
    }
  })();
  
  // NOTE: turbo.json is no longer created automatically
  // Users will be prompted for optional enhancements after core files are created
  
  let stats = {
    configs: 0,
    guides: 0,
    github: 0,
    vscode: 0,
    other: 0
  };
  
  // Create directories first
  const dirsToCreate = ['.github/workflows', '.github/ISSUE_TEMPLATE', '.vscode', '.husky'];
  dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Copy files
  filesToCopy.forEach(({ from, to, type, condition }) => {
    // Check condition if provided
    if (condition && !condition()) {
      return;
    }
    
    if (fs.existsSync(from)) {
      if (!fs.existsSync(to)) {
        fs.copyFileSync(from, to);
        
        // Make setup.sh executable
        if (to === './setup.sh') {
          try {
            fs.chmodSync(to, '755');
          } catch {
            // Ignore chmod errors on Windows
          }
        }
        
        // Make Husky hook executable  
        if (type === 'husky') {
          try {
            fs.chmodSync(to, '755');
          } catch {
            // Ignore chmod errors on Windows
          }
        }
        
        console.log(`✅ Created ${to}`);
        stats[type === 'config' ? 'configs' : type === 'guide' ? 'guides' : type === 'github' ? 'github' : type === 'vscode' ? 'vscode' : 'other']++;
      } else {
        console.log(`⚠️  ${to} already exists, skipping`);
      }
    }
  });
  
  // Inject package.json scripts if package.json exists
  let packageJsonResult = null;
  if (hasPackageJson) {
    packageJsonResult = injectPackageJsonScripts();
    if (packageJsonResult.success && packageJsonResult.addedCount > 0) {
      console.log(`✅ Added ${packageJsonResult.addedCount} npm scripts to package.json`);
      stats.other++;
    } else if (packageJsonResult.success && packageJsonResult.addedCount === 0) {
      console.log(`ℹ️  All recommended npm scripts already exist in package.json`);
    }
  }
  
  // Summary
  console.log('\n🎉 Runlintic initialization complete!');
  console.log(`✅ Created ${stats.configs} configuration files`);
  console.log(`📖 Created ${stats.guides} documentation guides`);  
  console.log(`🔧 Created ${stats.github} GitHub workflow files`);
  console.log(`🎨 Created ${stats.vscode} VSCode settings`);
  console.log(`⚙️  Created ${stats.other} additional files`);
  
  console.log('\n📚 Key Files Created:');
  console.log('  📖 RUNLINTIC-GUIDE.md           # Complete documentation');
  console.log('  ⚡ RUNLINTIC-QUICKSTART.md       # Quick reference');
  console.log('  👥 RUNLINTIC-WORKFLOW.md         # Team workflows');
  console.log('  🔑 .env.template                 # Environment setup');
  console.log('  🚀 .github/workflows/runlintic-ci.yml # CI/CD automation');
  
  console.log('\n🚀 Next Steps:');
  console.log('  1. Review RUNLINTIC-QUICKSTART.md for immediate commands');
  console.log('  2. Copy .env.template to .env and add your GitHub token');
  console.log('  3. Run: chmod +x setup.sh && ./setup.sh (for new developers)');
  console.log('  4. npm run health-check          # Test your setup');
  console.log('  5. npm run release:dry           # Test release workflow');
  
  // Context-aware suggestions
  if (hasTurboJson || isMonorepo) {
    console.log('\n💡 Monorepo detected:');
    console.log('  • Run commands from monorepo root for best results');
    console.log('  • Check RUNLINTIC-WORKFLOW.md for monorepo workflows');
    if (!hasTurboJson) {
      console.log('  • Consider adding Turbo for build optimization (prompted below)');
    }
  } else if (hasPackageJson) {
    console.log('\n💡 Standard Node.js project detected:');
    console.log('  • VSCode settings optimized for runlintic workflow');
    console.log('  • Perfect for single app development');
  }
  
  if (packageJsonResult && packageJsonResult.addedCount > 0) {
    console.log('\n📦 Package.json enhanced with runlintic scripts:');
    console.log('  • Now use: npm run health-check, npm run lint, etc.');
    console.log('  • Team members get consistent command interface');
  }
  
  console.log('\n🔗 Resources:');
  console.log('  • Documentation: All guides created in your project root');
  console.log('  • GitHub Issues: Use .github/ISSUE_TEMPLATE/bug_report.md');
  console.log('  • Team Setup: Share setup.sh with new team members');
  
  // Interactive prompts for optional enhancements
  await promptOptionalEnhancements(isMonorepo, hasTurboJson, templatesDir);
}

(async () => {
  const [,, command, ...args] = process.argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  if (command === 'init') {
    await initProject();
    process.exit(0);
  }

  if (command === 'commit') {
    // Run the commit generator directly
    const commitScriptPath = path.join(_dirname, '..', 'scripts', 'generate-commit.js');
    const child = spawn('node', [commitScriptPath], {
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    
    child.on('close', (code) => {
      process.exit(code);
    });
    
    child.on('error', (err) => {
      console.error('❌ Error running commit generator:', err.message);
      process.exit(1);
    });
  } else if (commands[command]) {
    // Validate token requirements for tiers
    validateTokenTier();
    
    runCommand(command, args);
  } else {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "runlintic help" to see available commands.');
    process.exit(1);
  }
})().catch(console.error);
