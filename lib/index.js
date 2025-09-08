import path from 'path';
import fs from 'fs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

/**
 * Runlintic - Code quality and release automation toolkit
 */

// Export configuration paths
const configs = {
  eslint: {
    base: path.join(currentDirname, 'configs', 'base.js'),
    next: path.join(currentDirname, 'configs', 'next.js'),
    react: path.join(currentDirname, 'configs', 'react-internal.js')
  },
  typescript: {
    base: path.join(currentDirname, 'configs', 'base.json'),
    nextjs: path.join(currentDirname, 'configs', 'nextjs.json'),
    reactLibrary: path.join(currentDirname, 'configs', 'react-library.json')
  },
  releaseIt: path.join(currentDirname, '..', '.release-it.json'),
  commitlint: path.join(currentDirname, '..', 'commitlint.config.js'),
  turbo: path.join(currentDirname, '..', 'turbo.json')
};

// Export utility functions
function getConfig(type, variant = 'base') {
  if (!configs[type] || !configs[type][variant]) {
    throw new Error(`Unknown config type: ${type}.${variant}`);
  }
  
  const configPath = configs[type][variant];
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  
  return configPath;
}

function copyConfig(type, variant, destination) {
  const sourcePath = getConfig(type, variant);
  fs.copyFileSync(sourcePath, destination);
  return destination;
}

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

export {
  configs,
  getConfig,
  copyConfig
};

export const version = packageJson.version;

export default {
  configs,
  getConfig,
  copyConfig,
  version
};