#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Security: Input sanitization functions
function sanitizeInput(input, maxLength = 100) {
  if (!input || typeof input !== 'string') return '';
  // Remove dangerous shell metacharacters and limit length
  return input.trim()
    .slice(0, maxLength)
    .replace(/[`$\\;|&<>(){}[\]]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x00/g, ''); // Remove null bytes
}

function validateCommitType(type) {
  const allowedTypes = Object.keys(COMMIT_TYPES);
  if (!allowedTypes.includes(type)) {
    throw new Error(`Invalid commit type: ${type}. Allowed types: ${allowedTypes.join(', ')}`);
  }
  return type;
}

// Conventional commit types
const COMMIT_TYPES = {
  feat: 'A new feature',
  fix: 'A bug fix', 
  docs: 'Documentation only changes',
  style: 'Changes that do not affect the meaning of the code (white-space, formatting, etc)',
  refactor: 'A code change that neither fixes a bug nor adds a feature',
  perf: 'A code change that improves performance',
  test: 'Adding missing tests or correcting existing tests',
  build: 'Changes that affect the build system or external dependencies',
  ci: 'Changes to our CI configuration files and scripts',
  chore: 'Other changes that don\'t modify src or test files',
  revert: 'Reverts a previous commit'
};

// Git staging function
function gitAddAll() {
  try {
    console.log('📦 Staging all changes...');
    execSync('git add .', { stdio: 'inherit', shell: true });
    console.log('✅ All changes staged successfully\n');
    return true;
  } catch (error) {
    console.error('❌ Error staging changes:', error.message);
    return false;
  }
}

function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const diff = execSync('git diff --cached', { encoding: 'utf8' });
    return { 
      status: status.trim(), 
      staged: staged.trim(),
      diff: diff.trim()
    };
  } catch (error) {
    console.error('Error getting git status:', error.message);
    process.exit(1);
  }
}

function analyzeChanges(staged) {
  if (!staged) {
    return {
      files: [],
      hasTests: false,
      hasComponents: false,
      hasTypes: false,
      hasConfig: false,
      hasScripts: false,
      hasPackageJson: false,
      hasDocs: false,
      hasStyles: false
    };
  }

  const files = staged.split('\n').filter(f => f.trim());
  const analysis = {
    files,
    hasTests: files.some(f => f.includes('test') || f.includes('spec')),
    hasDocs: files.some(f => f.includes('.md') || f.includes('docs/')),
    hasConfig: files.some(f => f.includes('.json') || f.includes('.yml') || f.includes('.yaml')),
    hasSource: files.some(f => f.includes('.js') || f.includes('.ts') || f.includes('.jsx') || f.includes('.tsx')),
    hasTemplates: files.some(f => f.includes('ISSUE_TEMPLATE')),
    hasWorkflows: files.some(f => f.includes('.github/workflows')),
    hasScripts: files.some(f => f.includes('scripts/') || f.includes('bin/')),
    hasPackageJson: files.some(f => f.includes('package.json')),
    hasLintConfig: files.some(f => f.includes('eslint') || f.includes('prettier') || f.includes('.editorconfig')),
    hasDependencies: files.some(f => f.includes('package-lock.json') || f.includes('yarn.lock') || f.includes('pnpm-lock.yaml'))
  };

  return analysis;
}

function suggestCommitType(analysis) {
  // Workflow fixes are usually critical CI issues
  if (analysis.hasWorkflows) return ['fix', 'ci'];
  
  // New features or templates
  if (analysis.hasTemplates) return ['feat', 'docs'];
  
  // Script changes (new tools, build improvements)
  if (analysis.hasScripts) return ['feat', 'build'];
  
  // Package.json changes (dependencies, config)
  if (analysis.hasPackageJson && !analysis.hasSource) return ['build', 'chore'];
  
  // Lint/format config changes (could be style or build)
  if (analysis.hasLintConfig) return ['build', 'style'];
  
  // Lock file changes (dependency updates)
  if (analysis.hasDependencies && !analysis.hasSource) return ['build', 'chore'];
  
  // Test-only changes
  if (analysis.hasTests && !analysis.hasSource) return ['test'];
  
  // Documentation-only changes
  if (analysis.hasDocs && !analysis.hasSource) return ['docs'];
  
  // Config files without source
  if (analysis.hasConfig && !analysis.hasSource) return ['build', 'ci'];
  
  // Source code changes (could be feat, fix, refactor, perf, or style)
  if (analysis.hasSource) return ['feat', 'fix', 'refactor', 'perf', 'style'];
  
  return ['chore'];
}

function analyzeDiffChanges(diff, analysis) {
  if (!diff) return [];
  
  const changes = [];
  const lines = diff.split('\n');
  
  // Track file-specific changes
  let currentFile = '';
  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      currentFile = line.split(' ')[2].replace('a/', '');
    }
    
    // Common patterns in diffs
    if (line.startsWith('+') && !line.startsWith('+++')) {
      const addedLine = line.substring(1).trim();
      
      // Detect specific patterns
      if (addedLine.includes('"type": "module"')) {
        changes.push('Added ES module type to package.json');
      } else if (addedLine.includes('import ') && addedLine.includes(' from ')) {
        changes.push('Converted to ES module imports');
      } else if (addedLine.includes('await ') && currentFile.includes('workflow')) {
        changes.push('Added proper async/await to GitHub Actions');
      } else if (addedLine.includes('types:') && addedLine.includes('- ')) {
        changes.push('Fixed YAML array syntax for proper parsing');
      } else if (addedLine.includes('hasWorkflows') || addedLine.includes('hasTemplates')) {
        changes.push('Enhanced file detection for better commit suggestions');
      } else if (addedLine.includes('scopeHint') || addedLine.includes('suggested:')) {
        changes.push('Added intelligent scope suggestions based on changed files');
      } else if (currentFile.includes('ISSUE_TEMPLATE') && addedLine.length > 10) {
        changes.push(`Added ${currentFile.includes('task') ? 'task' : currentFile.includes('resolution') ? 'resolution' : 'issue'} template`);
      } else if (currentFile.includes('workflow') && addedLine.includes('script:')) {
        changes.push('Added GitHub issue auto-close workflow');
      } else if (addedLine.includes('function ') || addedLine.includes('const ') || addedLine.includes('let ')) {
        if (currentFile.includes('script')) {
          changes.push('Enhanced commit generation logic');
        }
      }
    }
    
    if (line.startsWith('-') && !line.startsWith('---')) {
      const removedLine = line.substring(1).trim();
      
      if (removedLine.includes('require(') && !removedLine.includes('//')) {
        changes.push('Removed CommonJS require statements');
      } else if (removedLine.includes('Claude Code') && removedLine.includes('Generated')) {
        changes.push('Removed automatic attribution from commit messages');
      }
    }
  }
  
  // Fallback analysis based on file types
  if (changes.length === 0) {
    if (analysis.hasWorkflows) {
      changes.push('Updated GitHub workflow configuration');
    }
    if (analysis.hasTemplates) {
      changes.push('Added or updated issue templates');  
    }
    if (analysis.hasScripts) {
      changes.push('Enhanced development scripts');
    }
    if (analysis.hasPackageJson) {
      changes.push('Updated package configuration');
    }
  }
  
  return changes.slice(0, 5); // Limit to 5 most relevant changes
}

function formatChangesList(changes) {
  if (changes.length === 0) return '';
  
  return changes.map((change, i) => `${i + 1}. ${change}`).join('\n');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateCommitMessage() {
  // Check for unstaged changes and offer to stage them
  const initialStatus = getGitStatus();
  const unstagedFiles = initialStatus.status.split('\n')
    .filter(line => line.trim() && (line.startsWith(' M') || line.startsWith('??')))
    .map(line => line.trim().substring(2).trim());
  
  // If no staged files and we have unstaged files, offer to stage them
  if (!initialStatus.staged && unstagedFiles.length > 0) {
    console.log('⚠️  No staged changes found, but unstaged changes detected:');
    unstagedFiles.forEach(file => console.log(`  • ${file}`));
    console.log();
    
    const shouldStage = await question('Stage all changes before committing? (Y/n): ');
    if (shouldStage.toLowerCase() !== 'n') {
      if (!gitAddAll()) {
        console.log('❌ Failed to stage changes. Exiting.');
        process.exit(1);
      }
    } else {
      console.log('❌ No staged changes to commit. Exiting.');
      process.exit(0);
    }
  } else if (unstagedFiles.length > 0) {
    console.log('⚠️  Additional unstaged changes detected:');
    unstagedFiles.forEach(file => console.log(`  • ${file}`));
    console.log();
    
    const shouldStage = await question('Stage additional changes before committing? (y/N): ');
    if (shouldStage.toLowerCase() === 'y') {
      if (!gitAddAll()) {
        console.log('❌ Failed to stage changes. Exiting.');
        process.exit(1);
      }
    }
  }
  
  console.log('🔍 Analyzing staged changes...\n');
  
  const { staged, diff } = getGitStatus();
  if (!staged) {
    console.log('❌ No staged changes found after staging attempt. Exiting.');
    process.exit(1);
  }
  
  const analysis = analyzeChanges(staged);
  const detectedChanges = analyzeDiffChanges(diff, analysis);
  
  console.log('📁 Files to be committed:');
  analysis.files.forEach(file => console.log(`  • ${file}`));
  console.log();

  const suggested = suggestCommitType(analysis);
  console.log('💡 Suggested commit types:');
  suggested.forEach(type => console.log(`  • ${type}: ${COMMIT_TYPES[type]}`));
  console.log();

  // Show detected changes if any
  if (detectedChanges.length > 0) {
    console.log('🔍 Detected changes:');
    detectedChanges.forEach((change, i) => console.log(`  ${i + 1}. ${change}`));
    console.log();
  }

  // Get commit type
  const type = await question(`Enter commit type (${suggested.join('|')}, press Enter for ${suggested[0]}): `);
  const sanitizedType = sanitizeInput(type.trim() || suggested[0], 20);
  const finalType = validateCommitType(sanitizedType);
  if (!COMMIT_TYPES[finalType]) {
    console.log('❌ Invalid commit type');
    process.exit(1);
  }

  // Get scope (optional) - suggest based on file analysis
  let scopeHint = '';
  if (analysis.hasWorkflows) scopeHint = 'workflows';
  else if (analysis.hasTemplates) scopeHint = 'templates';  
  else if (analysis.hasScripts) scopeHint = 'scripts';
  else if (analysis.hasPackageJson) scopeHint = 'deps';
  else if (analysis.hasDocs) scopeHint = 'docs';
  
  const scope = await question(`Enter scope (optional${scopeHint ? `, suggested: ${scopeHint}, press Enter to use` : ', e.g., cli, templates, docs'}): `);
  const finalScope = sanitizeInput(scope.trim() || scopeHint, 50);
  
  // Get description with smart suggestion
  let descriptionHint = '';
  if (detectedChanges.length > 0) {
    // Create a smart summary from detected changes
    if (detectedChanges.some(c => c.includes('Enhanced') || c.includes('Added intelligent'))) {
      descriptionHint = 'enhance commit generator with intelligent analysis';
    } else if (detectedChanges.some(c => c.includes('Fixed') || c.includes('YAML'))) {
      descriptionHint = 'resolve YAML syntax error causing validation failure';  
    } else if (detectedChanges.some(c => c.includes('ES module') || c.includes('import'))) {
      descriptionHint = 'convert to ES modules and fix Node.js warnings';
    } else if (detectedChanges.some(c => c.includes('template'))) {
      descriptionHint = 'add comprehensive GitHub issue templates';
    } else if (detectedChanges.some(c => c.includes('workflow'))) {
      descriptionHint = 'add GitHub issue auto-close automation';
    } else {
      descriptionHint = detectedChanges[0].toLowerCase();
    }
  }
  
  const description = await question(`Enter brief description${descriptionHint ? ` (suggested: ${descriptionHint}, press Enter to use)` : ''}: `);
  const finalDescription = sanitizeInput(description.trim() || descriptionHint, 72);
  if (!finalDescription) {
    console.log('❌ Description is required');
    process.exit(1);
  }

  // Get breaking change info
  const isBreaking = await question('Is this a breaking change? (y/N): ');
  
  // Get detailed description with auto-suggestion from detected changes
  let suggestedBody = '';
  if (detectedChanges.length > 0) {
    suggestedBody = formatChangesList(detectedChanges);
  }
  
  const body = await question(`Enter detailed description${suggestedBody ? ` (optional, press Enter to use detected changes):\n\n${suggestedBody}\n\n` : ' (optional): '}`);
  
  // Sanitize body input
  const sanitizedBody = sanitizeInput(body.trim() || suggestedBody, 500);
  
  // Generate commit message
  let commitMsg = finalType;
  if (finalScope) commitMsg += `(${finalScope})`;
  if (isBreaking.toLowerCase() === 'y') commitMsg += '!';
  commitMsg += `: ${finalDescription}`;
  
  // Use sanitized body
  const finalBody = sanitizedBody;
  if (finalBody) {
    commitMsg += `\n\n${finalBody}`;
  }
  
  if (isBreaking.toLowerCase() === 'y') {
    const breakingDesc = await question('Describe the breaking change: ');
    const sanitizedBreakingDesc = sanitizeInput(breakingDesc.trim(), 200);
    if (sanitizedBreakingDesc) {
      commitMsg += `\n\nBREAKING CHANGE: ${sanitizedBreakingDesc}`;
    }
  }


  console.log('\n📝 Generated commit message:');
  console.log('─'.repeat(50));
  console.log(commitMsg);
  console.log('─'.repeat(50));

  const confirm = await question('\nCommit with this message? (Y/n): ');
  if (confirm.toLowerCase() === 'n') {
    console.log('❌ Commit cancelled');
    process.exit(0);
  }

  try {
    // Use spawn for secure command execution with proper argument separation
    const result = spawnSync('git', ['commit', '-m', commitMsg], { 
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`Git commit failed with status ${result.status}`);
    }
    
    console.log('✅ Commit created successfully!');
  } catch (error) {
    console.error('❌ Commit failed:', error.message);
    process.exit(1);
  }

  rl.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateCommitMessage().catch(console.error);
}

export { analyzeChanges, generateCommitMessage, suggestCommitType };
