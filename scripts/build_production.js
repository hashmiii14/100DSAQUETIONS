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

// Step 3: Read Minified CSS and Page 1 Dataset
console.log('\n[3/4] Inlining Critical Styles & Page 1 Data into index.html...');
const styleMinPath = path.join(__dirname, '../style.min.css');
const page1MinPath = path.join(__dirname, '../data/questions_page1.min.js');
const indexHtmlPath = path.join(__dirname, '../index.html');

const minifiedCss = fs.readFileSync(styleMinPath, 'utf8');
const minifiedPage1Js = fs.readFileSync(page1MinPath, 'utf8');
let html = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace stylesheet links with inlined style tag
const cssTagRegex = /<!-- Asynchronous Non-Blocking Stylesheet -->[\s\S]*?<noscript>[\s\S]*?<\/noscript>/;
const inlineCssReplacement = `<!-- Inlined Application Styles (Zero Network Latency FCP) -->\n<style id="app-main-styles">\n${minifiedCss}\n</style>`;

if (cssTagRegex.test(html)) {
  html = html.replace(cssTagRegex, inlineCssReplacement);
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
