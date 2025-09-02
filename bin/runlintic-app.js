#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const commands = {
  'health-check': 'Run comprehensive health check',
  'check-all': 'Run all quality checks (lint + typecheck + deps)',
  'lint': 'Run ESLint',
  'lint:fix': 'Run ESLint and auto-fix issues',
  'typecheck': 'Run TypeScript type checking',
  'format': 'Run Prettier formatting',
  'maintenance': 'Run maintenance tasks (knip + depcheck + workspace fixes)',
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

function initProject() {
  const configDir = path.join(__dirname, '..', 'lib', 'configs');
  const templatesDir = path.join(__dirname, '..', 'lib', 'templates');
  
  console.log('🔧 Initializing runlintic in current project...\n');
  
  // Copy essential configs and user guide
  const filesToCopy = [
    { from: path.join(configDir, 'base.json'), to: './tsconfig.json', type: 'config' },
    { from: path.join(configDir, 'base.js'), to: './eslint.config.js', type: 'config' },
    { from: path.join(__dirname, '..', '.release-it.json'), to: './.release-it.json', type: 'config' },
    { from: path.join(__dirname, '..', 'commitlint.config.js'), to: './commitlint.config.js', type: 'config' },
    { from: path.join(templatesDir, 'RUNLINTIC-GUIDE.md'), to: './RUNLINTIC-GUIDE.md', type: 'guide' }
  ];
  
  let configsCreated = 0;
  let guideCreated = false;
  
  filesToCopy.forEach(({ from, to, type }) => {
    if (fs.existsSync(from)) {
      if (!fs.existsSync(to)) {
        fs.copyFileSync(from, to);
        if (type === 'config') {
          console.log(`✅ Created ${to}`);
          configsCreated++;
        } else if (type === 'guide') {
          console.log(`📖 Created ${to} - Complete user guide and reference`);
          guideCreated = true;
        }
      } else {
        if (type === 'guide') {
          console.log(`⚠️  ${to} already exists, skipping (keeping your customizations)`);
        } else {
          console.log(`⚠️  ${to} already exists, skipping`);
        }
      }
    }
  });
  
  console.log('\n🎉 Runlintic initialized!');
  
  if (configsCreated > 0) {
    console.log(`✅ Created ${configsCreated} configuration files`);
  }
  
  if (guideCreated) {
    console.log('📖 User guide created - check RUNLINTIC-GUIDE.md for complete documentation');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('  1. Review RUNLINTIC-GUIDE.md for complete documentation');
  console.log('  2. runlintic health-check        # Test your setup');
  console.log('  3. runlintic release:dry          # Test release workflow');
  
  // Context-aware suggestions
  const cwd = process.cwd();
  const hasTurboJson = fs.existsSync(path.join(cwd, 'turbo.json'));
  const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
  
  if (hasTurboJson) {
    console.log('\n💡 Turbo monorepo detected:');
    console.log('  • Run commands from monorepo root for best results');
    console.log('  • Check RUNLINTIC-GUIDE.md for monorepo-specific workflows');
  } else if (hasPackageJson) {
    console.log('\n💡 Consider adding npm scripts to package.json:');
    console.log('  • See RUNLINTIC-GUIDE.md for recommended script setup');
  }
}

const [,, command, ...args] = process.argv;

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === 'init') {
  initProject();
  process.exit(0);
}

if (commands[command]) {
  // Validate token requirements for tiers
  validateTokenTier();
  
  runCommand(command, args);
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('Run "runlintic help" to see available commands.');
  process.exit(1);
}
