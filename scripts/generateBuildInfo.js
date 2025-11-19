/**
 * Build Info Generator
 * Generates a build info file with version and timestamp
 * Auto-increments patch version on every build
 */

/* eslint-disable no-console */

import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

// Auto-increment patch version
const currentVersion = packageJson.version || '0.0.0';
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update package.json with new version
packageJson.version = newVersion;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf-8');

const buildInfo = {
  version: newVersion,
  buildDate: new Date().toISOString(),
  buildTimestamp: Date.now(),
};

const outputPath = join(__dirname, '..', 'public', 'build-info.json');
writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2), 'utf-8');

console.log('✅ Build info generated:');
console.log(`   Version: ${currentVersion} → ${newVersion}`);
console.log(`   Build Date: ${buildInfo.buildDate}`);
console.log(`   Output: ${outputPath}`);
