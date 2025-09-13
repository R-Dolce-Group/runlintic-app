import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

/**
 * Runlintic - Code quality and release automation toolkit
 */

// Export configuration paths
const configs = {
  eslint: {
    base: path.join(__dirname, 'configs', 'base.js'),
    next: path.join(__dirname, 'configs', 'next.js'),
    react: path.join(__dirname, 'configs', 'react-internal.js')
  },
  typescript: {
    base: path.join(__dirname, 'configs', 'base.json'),
    nextjs: path.join(__dirname, 'configs', 'nextjs.json'),
    reactLibrary: path.join(__dirname, 'configs', 'react-library.json')
  },
  releaseIt: path.join(__dirname, '..', '.release-it.json'),
  commitlint: path.join(__dirname, '..', 'commitlint.config.js'),
  turbo: path.join(__dirname, '..', 'turbo.json')
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

export {
  configs,
  getConfig,
  copyConfig
};

export const version = require('../package.json').version;