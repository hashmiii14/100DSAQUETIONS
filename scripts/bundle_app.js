const fs = require('fs');
const path = require('path');

console.log('--- BUNDLING CLIENT JS MODULES ---');

const filesToBundle = [
  path.join(__dirname, '../js/state.js'),
  path.join(__dirname, '../js/recommendation.js'),
  path.join(__dirname, '../js/duplicate_prevention.js'),
  path.join(__dirname, '../data/patterns.js'),
  path.join(__dirname, '../data/ds_algo_library.js'),
  path.join(__dirname, '../data/tracks.js'),
  path.join(__dirname, '../app.js')
];

let bundledJs = '/* DSAProblems.site Production App Bundle */\n';

for (const filePath of filesToBundle) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    bundledJs += `\n/* File: ${path.basename(filePath)} */\n` + content + '\n';
  } else {
    console.error(`Warning: ${filePath} not found`);
  }
}

// Clean comments
const cleanLines = bundledJs.split('\n').filter(line => {
  const t = line.trim();
  return !t.startsWith('//') && !t.startsWith('/*');
});

const outputBundlePath = path.join(__dirname, '../js/app.bundle.min.js');
fs.writeFileSync(outputBundlePath, cleanLines.join('\n'), 'utf8');

console.log(`✓ js/app.bundle.min.js generated (${(fs.statSync(outputBundlePath).size / 1024).toFixed(1)} KB)`);
