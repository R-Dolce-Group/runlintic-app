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
  console.log('Usage: runlintic <command>\n');
  console.log('Available commands:');
  Object.entries(commands).forEach(([cmd, desc]) => {
    console.log(`  ${cmd.padEnd(20)} ${desc}`);
  });
  console.log('\n🆓 Free Tier - Self-managed GitHub tokens required for releases');
  console.log('⬆️  Upgrade options available at: https://rdolcegroup.com/runlintic');
  console.log('\nFor more information, visit: https://github.com/R-Dolce-Group/runlintic-app');
}

function runCommand(scriptName, args = []) {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
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
      console.error('❌ pnpm not found. Please install pnpm first: npm install -g pnpm');
    } else {
      console.error('❌ Error running command:', err.message);
    }
    process.exit(1);
  });
}

function initProject() {
  const configDir = path.join(__dirname, '..', 'lib', 'configs');
  
  console.log('🔧 Initializing runlintic in current project...\n');
  
  // Copy essential configs
  const filesToCopy = [
    { from: path.join(configDir, 'base.json'), to: './tsconfig.json' },
    { from: path.join(configDir, 'base.js'), to: './eslint.config.js' },
    { from: path.join(__dirname, '..', '.release-it.json'), to: './.release-it.json' },
    { from: path.join(__dirname, '..', 'commitlint.config.js'), to: './commitlint.config.js' }
  ];
  
  filesToCopy.forEach(({ from, to }) => {
    if (fs.existsSync(from)) {
      if (!fs.existsSync(to)) {
        fs.copyFileSync(from, to);
        console.log(`✅ Created ${to}`);
      } else {
        console.log(`⚠️  ${to} already exists, skipping`);
      }
    }
  });
  
  console.log('\n🎉 Runlintic initialized! You can now run commands like:');
  console.log('  runlintic health-check');
  console.log('  runlintic release:dry');
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
