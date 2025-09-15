import fs from 'fs';
import path from 'path';

const RECOMMENDED_SCRIPTS = {
  'health-check': 'runlintic health-check',
  'lint': 'runlintic lint', 
  'lint:fix': 'runlintic lint:fix',
  'format': 'runlintic format',
  'typecheck': 'runlintic typecheck',
  'check-all': 'runlintic check-all',
  'maintenance': 'runlintic maintenance',
  'release:dry': 'runlintic release:dry',
  'release:patch': 'runlintic release:patch',
  'release:minor': 'runlintic release:minor',
  'release:major': 'runlintic release:major'
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

  const addedScripts = [];
  const skippedScripts = [];

  // Add recommended scripts if they don't exist
  Object.entries(RECOMMENDED_SCRIPTS).forEach(([scriptName, scriptCommand]) => {
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
      // Use atomic write operation to prevent race conditions
      const newContent = JSON.stringify(packageJson, null, 2) + '\n';
      const absolutePath = path.resolve(packageJsonPath);
      const tempPath = path.join(tmpdir(), `package.json.tmp.${Date.now()}.${Math.random().toString(36).substr(2, 9)}`);

      // Write to temporary file first
      fs.writeFileSync(tempPath, newContent, 'utf8');

      // Atomic move - this is the critical security improvement
      fs.renameSync(tempPath, absolutePath);

      return {
        success: true,
        added: addedScripts,
        skipped: skippedScripts,
        addedCount: addedScripts.length,
        skippedCount: skippedScripts.length
      };
    } catch {
      return { success: false, reason: 'Failed to write package.json' };
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