#!/usr/bin/env node

import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
    const diff = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return { status: status.trim(), staged: diff.trim() };
  } catch (error) {
    console.error('Error getting git status:', error.message);
    process.exit(1);
  }
}

function analyzeChanges(staged) {
  if (!staged) {
    console.log('\n❌ No staged changes found. Stage your changes first with: git add <files>');
    process.exit(1);
  }

  const files = staged.split('\n').filter(f => f.trim());
  const analysis = {
    files,
    hasTests: files.some(f => f.includes('test') || f.includes('spec')),
    hasDocs: files.some(f => f.includes('.md') || f.includes('docs/')),
    hasConfig: files.some(f => f.includes('.json') || f.includes('.yml') || f.includes('.yaml')),
    hasSource: files.some(f => f.includes('.js') || f.includes('.ts') || f.includes('.jsx') || f.includes('.tsx')),
    hasTemplates: files.some(f => f.includes('ISSUE_TEMPLATE') || f.includes('.github')),
    hasScripts: files.some(f => f.includes('scripts/') || f.includes('bin/'))
  };

  return analysis;
}

function suggestCommitType(analysis) {
  if (analysis.hasTemplates) return ['feat', 'docs'];
  if (analysis.hasTests && !analysis.hasSource) return ['test'];
  if (analysis.hasDocs && !analysis.hasSource) return ['docs'];
  if (analysis.hasConfig && !analysis.hasSource) return ['build', 'ci'];
  if (analysis.hasScripts) return ['feat', 'build'];
  if (analysis.hasSource) return ['feat', 'fix', 'refactor'];
  return ['chore'];
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateCommitMessage() {
  console.log('🔍 Analyzing staged changes...\n');
  
  const { staged } = getGitStatus();
  const analysis = analyzeChanges(staged);
  
  console.log('📁 Files to be committed:');
  analysis.files.forEach(file => console.log(`  • ${file}`));
  console.log();

  const suggested = suggestCommitType(analysis);
  console.log('💡 Suggested commit types:');
  suggested.forEach(type => console.log(`  • ${type}: ${COMMIT_TYPES[type]}`));
  console.log();

  // Get commit type
  const type = await question(`Enter commit type (${suggested.join('|')}): `);
  if (!COMMIT_TYPES[type]) {
    console.log('❌ Invalid commit type');
    process.exit(1);
  }

  // Get scope (optional)
  const scope = await question('Enter scope (optional, e.g., cli, templates, docs): ');
  
  // Get description
  const description = await question('Enter brief description: ');
  if (!description.trim()) {
    console.log('❌ Description is required');
    process.exit(1);
  }

  // Get breaking change info
  const isBreaking = await question('Is this a breaking change? (y/N): ');
  
  // Get detailed description
  const body = await question('Enter detailed description (optional): ');
  
  // Generate commit message
  let commitMsg = type;
  if (scope) commitMsg += `(${scope})`;
  if (isBreaking.toLowerCase() === 'y') commitMsg += '!';
  commitMsg += `: ${description}`;
  
  if (body) {
    commitMsg += `\n\n${body}`;
  }
  
  if (isBreaking.toLowerCase() === 'y') {
    const breakingDesc = await question('Describe the breaking change: ');
    commitMsg += `\n\nBREAKING CHANGE: ${breakingDesc}`;
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
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
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

export { generateCommitMessage, analyzeChanges, suggestCommitType };