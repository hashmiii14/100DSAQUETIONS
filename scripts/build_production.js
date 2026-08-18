const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== STARTING MASTER PRODUCTION BUILD FOR 100/100 PAGESPEED ===');

// Step 1: Run Dataset Minification
console.log('\n[1/4] Generating Dataset Indices...');
execSync('node scripts/minify_dataset.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

// Step 2: Run JS App Module Bundling
console.log('\n[2/4] Bundling & Minifying Client JS...');
execSync('node scripts/bundle_app.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

// Step 3: Minify & Inline Critical Styles into index.html
console.log('\n[3/4] Minifying & Inlining Critical Styles into index.html...');
const styleSrcPath = path.join(__dirname, '../style.css');
const styleMinPath = path.join(__dirname, '../style.min.css');
const indexHtmlPath = path.join(__dirname, '../index.html');

if (fs.existsSync(styleSrcPath)) {
  const rawCss = fs.readFileSync(styleSrcPath, 'utf8');
  const minCss = rawCss
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;\}/g, '}')
    .trim();
  fs.writeFileSync(styleMinPath, minCss, 'utf8');
  console.log(`✓ style.min.css compiled (${(fs.statSync(styleMinPath).size / 1024).toFixed(1)} KB)`);
}

const minifiedCss = fs.readFileSync(styleMinPath, 'utf8');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace stylesheet links or existing style tag with updated inlined CSS
const existingStyleRegex = /<style id="app-main-styles">[\s\S]*?<\/style>/;
const inlineCssReplacement = `<style id="app-main-styles">\n${minifiedCss}\n</style>`;

if (existingStyleRegex.test(html)) {
  html = html.replace(existingStyleRegex, inlineCssReplacement);
} else if (html.includes('style.min.css')) {
  html = html.replace(/<link rel="stylesheet" href="style\.min\.css"[^>]*\/>/, inlineCssReplacement);
}

fs.writeFileSync(indexHtmlPath, html, 'utf8');
console.log('✓ Inlined style.min.css into index.html successfully!');

// Step 4: Run Automated Verification Tests
console.log('\n[4/4] Running Comprehensive QA & Verification Test Suite...');
execSync('node scripts/test_app_suite.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
execSync('node scripts/simulated_browser_test.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

console.log('\n==================================================');
console.log('✅ MASTER PRODUCTION BUILD COMPLETED SUCCESSFULLY (100/100 TARGET)!');
console.log('==================================================\n');
