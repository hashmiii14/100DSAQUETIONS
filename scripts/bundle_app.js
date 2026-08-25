const fs = require('fs');
const path = require('path');

console.log('--- BUNDLING & MINIFYING CLIENT JS MODULES ---');

const filesToBundle = [
  path.join(__dirname, '../js/state.js'),
  path.join(__dirname, '../js/recommendation.js'),
  path.join(__dirname, '../js/duplicate_prevention.js'),
  path.join(__dirname, '../data/patterns.js'),
  path.join(__dirname, '../data/ds_algo_library.js'),
  path.join(__dirname, '../data/tracks.js'),
  path.join(__dirname, '../app.js')
];

let rawJs = '';

for (const filePath of filesToBundle) {
  if (fs.existsSync(filePath)) {
    rawJs += fs.readFileSync(filePath, 'utf8') + '\n;';
  } else {
    console.error(`Warning: ${filePath} not found`);
  }
}

// Deep Minification Regex Pass
let minJs = rawJs
  .replace(/\/\*[\s\S]*?\*\//g, '') // Strip block comments
  .replace(/^\s*\/\/.*$/gm, '')      // Strip single-line comments
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .join('\n');

const outputBundlePath = path.join(__dirname, '../js/app.bundle.min.js');
fs.writeFileSync(outputBundlePath, minJs, 'utf8');

console.log(`✓ js/app.bundle.min.js generated (${(fs.statSync(outputBundlePath).size / 1024).toFixed(1)} KB)`);
