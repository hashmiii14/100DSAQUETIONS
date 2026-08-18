const fs = require('fs');
const path = require('path');

console.log('--- RUNNING FULL PROJECT VALIDATION ---');

// 1. Validate manifest.json
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../manifest.json'), 'utf8'));
  console.log('✓ manifest.json is valid JSON');
} catch (e) {
  console.error('✗ manifest.json error:', e.message);
}

// 2. Validate vercel.json
try {
  const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, '../vercel.json'), 'utf8'));
  console.log('✓ vercel.json is valid JSON');
} catch (e) {
  console.error('✗ vercel.json error:', e.message);
}

// 3. Validate .well-known/ai-plugin.json
try {
  const aiPlugin = JSON.parse(fs.readFileSync(path.join(__dirname, '../.well-known/ai-plugin.json'), 'utf8'));
  console.log('✓ .well-known/ai-plugin.json is valid JSON');
} catch (e) {
  console.error('✗ ai-plugin.json error:', e.message);
}

// 4. Verify llms.txt & llms-full.txt
if (fs.existsSync(path.join(__dirname, '../llms.txt'))) {
  console.log('✓ llms.txt exists (' + fs.statSync(path.join(__dirname, '../llms.txt')).size + ' bytes)');
} else {
  console.error('✗ llms.txt missing!');
}

if (fs.existsSync(path.join(__dirname, '../llms-full.txt'))) {
  console.log('✓ llms-full.txt exists (' + fs.statSync(path.join(__dirname, '../llms-full.txt')).size + ' bytes)');
} else {
  console.error('✗ llms-full.txt missing!');
}

// 5. Verify index.html existence and basic structure
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
if (html.includes('defer src="app.js"') && html.includes('role="main"') && html.includes('llms.txt')) {
  console.log('✓ index.html has defer scripts, ARIA landmarks, and Agentic Browsing links');
} else {
  console.warn('! index.html structure check incomplete');
}

console.log('--- ALL BUILD & SYNTAX CHECKS COMPLETED ---');
