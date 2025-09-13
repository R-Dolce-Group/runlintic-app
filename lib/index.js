import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const _require = createRequire(import.meta.url);

/**
 * Runlintic - Code quality and release automation toolkit
 */

// Export configuration paths
const configs = {
  eslint: {
    base: path.join(_dirname, 'configs', 'base.js'),
    next: path.join(_dirname, 'configs', 'next.js'),
    react: path.join(_dirname, 'configs', 'react-internal.js')
  },
  typescript: {
    base: path.join(_dirname, 'configs', 'base.json'),
    nextjs: path.join(_dirname, 'configs', 'nextjs.json'),
    reactLibrary: path.join(_dirname, 'configs', 'react-library.json')
  },
  releaseIt: path.join(_dirname, '..', '.release-it.json'),
  commitlint: path.join(_dirname, '..', 'commitlint.config.js'),
  turbo: path.join(_dirname, '..', 'turbo.json')
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

export const version = _require('../package.json').version;