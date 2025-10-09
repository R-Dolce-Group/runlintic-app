import fs from 'fs';
import path from 'path';
import { ProjectDetector } from '../core/project-detector.js';

const COMMON_SCRIPTS = {
  'health-check': 'runlintic health-check',
  'format': 'runlintic format',
  'typecheck': 'runlintic typecheck',
  'check-all': 'runlintic check-all',
  'maintenance': 'runlintic maintenance',
  'release:dry': 'runlintic release:dry',
  'release:patch': 'runlintic release:patch',
  'release:minor': 'runlintic release:minor',
  'release:major': 'runlintic release:major'
};

const ESLINT_SCRIPTS = {
  'lint': 'runlintic lint',
  'lint:fix': 'runlintic lint:fix'
};

const BIOME_SCRIPTS = {
  'lint': 'runlintic lint',
  'lint:fix': 'runlintic lint:fix'
};

/**
 * Get recommended scripts based on detected linter
 * @param {string} projectRoot - Project root directory
 * @returns {Object} Recommended scripts for the project
 */
function getRecommendedScripts(projectRoot = process.cwd()) {
  const detector = new ProjectDetector(projectRoot);
  const linterInfo = detector.detectLinter();

  let linterScripts = {};

  // Add appropriate linter scripts based on detection
  if (linterInfo.type === 'biome') {
    linterScripts = BIOME_SCRIPTS;
  } else if (linterInfo.type === 'eslint') {
    linterScripts = ESLINT_SCRIPTS;
  } else if (linterInfo.type === 'both') {
    // If both are present, prefer Biome for performance but keep both available
    linterScripts = BIOME_SCRIPTS;
  }
  // If none detected, default to ESLint (existing behavior)
  else {
    linterScripts = ESLINT_SCRIPTS;
  }

  return {
    ...COMMON_SCRIPTS,
    ...linterScripts
  };
}

// Maintain backward compatibility
const RECOMMENDED_SCRIPTS = {
  ...COMMON_SCRIPTS,
  ...ESLINT_SCRIPTS
};

function injectPackageJsonScripts(packageJsonPath = './package.json') {
  // Use single atomic read operation to avoid race conditions
  let packageJson;
  let originalContent;
  try {
    originalContent = fs.readFileSync(packageJsonPath, 'utf8');
    packageJson = JSON.parse(originalContent);
  } catch (error) {
    // Handle both file not found and invalid JSON in one place
    if (error.code === 'ENOENT') {
      return { success: false, reason: 'package.json not found' };
    }
    return { success: false, reason: 'Invalid package.json format' };
  }

  // Initialize scripts if not present
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  // Get project root from package.json path
  const projectRoot = path.dirname(path.resolve(packageJsonPath));

  // Detect linter and get appropriate scripts
  const recommendedScripts = getRecommendedScripts(projectRoot);

  const addedScripts = [];
  const skippedScripts = [];

  // Add recommended scripts if they don't exist
  Object.entries(recommendedScripts).forEach(([scriptName, scriptCommand]) => {
    if (!packageJson.scripts[scriptName]) {
      packageJson.scripts[scriptName] = scriptCommand;
      addedScripts.push(scriptName);
    } else {
      skippedScripts.push(scriptName);
    }
  });

  // Only write if we added scripts
  if (addedScripts.length > 0) {
    try {
      // Use secure atomic write operation
      const newContent = JSON.stringify(packageJson, null, 2) + '\n';
      const absolutePath = path.resolve(packageJsonPath);
      const tempPath = absolutePath + '.tmp';

      // Create temporary file in same directory as target (prevents cross-device issues)
      // Use exclusive flag to prevent race conditions
      fs.writeFileSync(tempPath, newContent, { encoding: 'utf8', mode: 0o600, flag: 'wx' });

      // Atomic move to final location
      fs.renameSync(tempPath, absolutePath);

      return {
        success: true,
        added: addedScripts,
        skipped: skippedScripts,
        addedCount: addedScripts.length,
        skippedCount: skippedScripts.length
      };
    } catch (error) {
      // Clean up temporary file if it exists
      const tempPath = path.resolve(packageJsonPath) + '.tmp';
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // Ignore cleanup errors
      }
      return { success: false, reason: `Failed to write package.json: ${error.message}` };
    }
  }

  return {
    success: true,
    added: [],
    skipped: skippedScripts,
    addedCount: 0,
    skippedCount: skippedScripts.length,
    message: 'All recommended scripts already exist'
  };
}

export {
  injectPackageJsonScripts,
  RECOMMENDED_SCRIPTS
};