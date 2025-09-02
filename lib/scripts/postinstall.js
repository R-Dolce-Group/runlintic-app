#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

function showPostInstallHelp() {
  console.log('\n🎉 @rdolcegroup/runlintic-app installed successfully!\n');
  
  console.log('🚀 Quick Start Guide:');
  console.log('┌─────────────────────────────────────────────────────────────────┐');
  console.log('│                     GETTING STARTED                            │');
  console.log('├─────────────────────────────────────────────────────────────────┤');
  console.log('│ 1. Initialize your project (creates RUNLINTIC-GUIDE.md):       │');
  console.log('│    npx runlintic init                                          │');
  console.log('│                                                                 │');
  console.log('│ 2. Run health check:                                           │');
  console.log('│    npx runlintic health-check                                  │');
  console.log('│                                                                 │');
  console.log('│ 3. Test release workflow (safe):                               │');
  console.log('│    npx runlintic release:dry                                   │');
  console.log('└─────────────────────────────────────────────────────────────────┘\n');

  console.log('📋 Essential Commands:');
  console.log('  npx runlintic help                Show all available commands');
  console.log('  npx runlintic init                Initialize runlintic configs');
  console.log('  npx runlintic health-check        Comprehensive project health check');
  console.log('  npx runlintic check-all           Run lint + typecheck + deps (parallel)');
  console.log('  npx runlintic lint                Run ESLint with zero warnings');
  console.log('  npx runlintic format              Format code with Prettier');
  console.log('  npx runlintic maintenance         Run cleanup tasks\n');

  console.log('🔧 Package.json Integration (Recommended):');
  console.log('  Add these scripts to your package.json:');
  console.log('  {');
  console.log('    "scripts": {');
  console.log('      "health-check": "runlintic health-check",');
  console.log('      "lint": "runlintic lint",');
  console.log('      "lint:fix": "runlintic lint:fix",');
  console.log('      "format": "runlintic format",');
  console.log('      "release:dry": "runlintic release:dry"');
  console.log('    }');
  console.log('  }\n');

  console.log('🚀 Release Workflow (Next.js Turbo Monorepo Ready):');
  console.log('  • Set up GitHub token: export GH_TOKEN="your_token"');
  console.log('  • Test release: npx runlintic release:dry');
  console.log('  • Create patch: npx runlintic release:patch');
  console.log('  • Create minor: npx runlintic release:minor');
  console.log('  • Create major: npx runlintic release:major\n');

  console.log('💡 Pro Tips:');
  console.log('  • Use npx runlintic for one-time commands');
  console.log('  • Add npm scripts for team consistency');
  console.log('  • Run health-check before releases');
  console.log('  • Use init command in monorepo root\n');

  console.log('📖 Resources:');
  console.log('  • Complete Guide: Run "npx runlintic init" to get RUNLINTIC-GUIDE.md');
  console.log('  • Documentation: https://github.com/R-Dolce-Group/runlintic-app');
  console.log('  • Issues: https://github.com/R-Dolce-Group/runlintic-app/issues');
  console.log('  • Examples: See _workflows/user-testing/ for usage patterns\n');

  // Check if we're in a potential project directory
  const cwd = process.cwd();
  const hasPackageJson = fs.existsSync(path.join(cwd, 'package.json'));
  const hasTurboJson = fs.existsSync(path.join(cwd, 'turbo.json'));
  
  if (hasPackageJson) {
    console.log('🔍 Detected project directory!');
    if (hasTurboJson) {
      console.log('  ✅ Turbo monorepo detected - Perfect for runlintic!');
    } else {
      console.log('  ✅ Node.js project detected');
    }
    console.log('  💡 Consider running: npx runlintic init\n');
  }

  console.log('🆓 Free Tier: Self-managed GitHub tokens required for releases');
  console.log('⬆️  Upgrade options: https://rdolcegroup.com/runlintic\n');
}

// Only show help if this is being run as the main script (postinstall)
if (require.main === module) {
  // Check if we should suppress the post-install message
  const suppressPostInstall = process.env.RUNLINTIC_SUPPRESS_POSTINSTALL === 'true' || 
                               process.env.CI === 'true' ||
                               process.env.npm_config_silent === 'true';
  
  if (!suppressPostInstall) {
    showPostInstallHelp();
  }
}

module.exports = { showPostInstallHelp };