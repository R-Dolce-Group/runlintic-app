const fs = require('fs');
const path = require('path');

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
  if (!fs.existsSync(packageJsonPath)) {
    return { success: false, reason: 'package.json not found' };
  }

  let packageJson;
  try {
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    packageJson = JSON.parse(packageJsonContent);
  } catch (error) {
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
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      return {
        success: true,
        added: addedScripts,
        skipped: skippedScripts,
        addedCount: addedScripts.length,
        skippedCount: skippedScripts.length
      };
    } catch (error) {
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

module.exports = {
  injectPackageJsonScripts,
  RECOMMENDED_SCRIPTS
};