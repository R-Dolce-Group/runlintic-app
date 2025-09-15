#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process';
import prompts from 'prompts';

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

function analyzeChanges(staged, status) {
  if (!staged) {
    // Check if there are unstaged changes we can stage
    if (status) {
      console.log('\n🔍 No staged changes found, but detected unstaged changes.');
      console.log('💡 Would you like to stage all changes and continue?');
      return null; // Signal that we need to prompt for staging
    } else {
      console.log('\n❌ No changes found to commit.');
      process.exit(1);
    }
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
      } else if (currentFile.includes('codeql') || addedLine.includes('CodeQL')) {
        changes.push('Added CodeQL security analysis for automated vulnerability scanning');
      } else if (currentFile.includes('workflow') && addedLine.includes('security-events: write')) {
        changes.push('Configured security scanning workflow with proper permissions');
      } else if (currentFile.includes('workflow') && addedLine.includes('schedule:')) {
        changes.push('Added scheduled workflow execution for automated monitoring');
      } else if (currentFile.includes('workflow') && addedLine.includes('javascript-typescript')) {
        changes.push('Configured JavaScript/TypeScript code analysis');
      } else if (addedLine.includes('security-extended') || addedLine.includes('security-and-quality')) {
        changes.push('Enhanced security scanning with extended query suites');
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

async function question(message, initial = '') {
  const response = await prompts({
    type: 'text',
    name: 'value',
    message,
    initial
  });
  return response.value || '';
}

async function stageAllChanges() {
  try {
    console.log('📦 Staging all changes...');
    const result = spawnSync('git', ['add', '.'], { stdio: 'inherit' });
    if (result.status !== 0) {
      console.error('❌ Failed to stage changes');
      process.exit(result.status || 1);
    }
    console.log('✅ All changes staged successfully\n');
    return true;
  } catch (error) {
    console.error('❌ Error staging changes:', error.message);
    process.exit(1);
  }
}

async function generateCommitMessage() {
  console.log('🔍 Analyzing staged changes...\n');

  let { status, staged, diff } = getGitStatus();
  let analysis = analyzeChanges(staged, status);

  // If no staged changes but unstaged changes exist, prompt to stage them
  if (analysis === null && status) {
    const stageResponse = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Stage all changes and continue?',
      initial: true
    });

    if (stageResponse.value) {
      await stageAllChanges();
      // Re-analyze after staging
      const newStatus = getGitStatus();
      staged = newStatus.staged;
      diff = newStatus.diff;
      analysis = analyzeChanges(staged, status);
    } else {
      console.log('❌ Cannot create commit without staged changes');
      process.exit(0);
    }
  }

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
  const type = await question(`Enter commit type (${suggested.join('|')}, press Enter for ${suggested[0]})`, suggested[0]);
  const finalType = type || suggested[0];
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
  
  const scope = await question(`Enter scope (optional${scopeHint ? `, suggested: ${scopeHint}` : ', e.g., cli, templates, docs'})`, scopeHint);
  const finalScope = scope || scopeHint;
  
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
  
  const description = await question(`Enter brief description${descriptionHint ? ` (suggested)` : ''}`, descriptionHint);
  const finalDescription = description || descriptionHint;
  if (!finalDescription) {
    console.log('❌ Description is required');
    process.exit(1);
  }

  // Get breaking change info
  const breakingResponse = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Is this a breaking change?',
    initial: false
  });
  const isBreaking = breakingResponse.value;
  
  // Get detailed description with auto-suggestion from detected changes
  let suggestedBody = '';
  if (detectedChanges.length > 0) {
    suggestedBody = formatChangesList(detectedChanges);
  }
  
  const body = await question(`Enter detailed description (optional)${suggestedBody ? ` - press Enter for detected changes` : ''}`, suggestedBody);
  
  // Generate commit message
  let commitMsg = finalType;
  if (finalScope) commitMsg += `(${finalScope})`;
  if (isBreaking) commitMsg += '!';
  commitMsg += `: ${finalDescription}`;
  
  // Use suggested body if user pressed Enter without typing anything
  const finalBody = body || suggestedBody;
  if (finalBody) {
    commitMsg += `\n\n${finalBody}`;
  }
  
  if (isBreaking) {
    const breakingDesc = await question('Describe the breaking change');
    commitMsg += `\n\nBREAKING CHANGE: ${breakingDesc}`;
  }


  console.log('\n📝 Generated commit message:');
  console.log('─'.repeat(50));
  console.log(commitMsg);
  console.log('─'.repeat(50));

  const confirmResponse = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Commit with this message?',
    initial: true
  });
  
  if (!confirmResponse.value) {
    console.log('❌ Commit cancelled');
    process.exit(0);
  }

  try {
    const result = spawnSync('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
    if (result.status === 0) {
      console.log('✅ Commit created successfully!');
    } else {
      console.error('❌ Commit failed');
      process.exit(result.status || 1);
    }
  } catch (error) {
    console.error('❌ Commit failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateCommitMessage().catch(console.error);
}

export { generateCommitMessage, analyzeChanges, suggestCommitType };