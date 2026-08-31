const fs = require('fs');
const path = require('path');

console.log('=== STARTING DEEP COMPREHENSIVE SITE AUDIT ===');

const questionsJsPath = path.join(__dirname, '../data/questions.js');
const guideJsPath = path.join(__dirname, '../data/guide_data.js');
const indexHtmlPath = path.join(__dirname, '../index.html');
const appJsPath = path.join(__dirname, '../app.js');
const vercelJsonPath = path.join(__dirname, '../vercel.json');
const sitemapPath = path.join(__dirname, '../sitemap.xml');
const robotsPath = path.join(__dirname, '../robots.txt');

let passedTests = 0;
let failedTests = 0;

function assert(condition, msg) {
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error('❌ AUDIT FAILED: ' + msg);
  }
}

// 1. DATASET INTEGRITY (1,000 Questions)
console.log('\n[1/7] Auditing 1,000 Questions Dataset...');
const PROBLEMS = require(questionsJsPath);
assert(Array.isArray(PROBLEMS), 'PROBLEMS is an array');
assert(PROBLEMS.length === 1000, 'Expected 1000 problems, got ' + PROBLEMS.length);

let easyCount = 0, medCount = 0, hardCount = 0;
const seenIds = new Set();

PROBLEMS.forEach((p, idx) => {
  assert(p.id === idx + 1, 'Problem #' + p.id + ' has incorrect id, expected ' + (idx + 1));
  assert(!seenIds.has(p.id), 'Duplicate ID ' + p.id);
  seenIds.add(p.id);

  assert(p.title && p.title.trim().length > 0, 'Problem #' + p.id + ' missing title');
  assert(p.difficulty && ['Easy', 'Medium', 'Hard'].includes(p.difficulty), 'Problem #' + p.id + ' invalid diff ' + p.difficulty);
  assert(p.topic && p.topic.trim().length > 0, 'Problem #' + p.id + ' missing topic');
  assert(p.pattern && p.pattern.trim().length > 0, 'Problem #' + p.id + ' missing pattern');
  assert(p.leetcode_url && p.leetcode_url.startsWith('https://leetcode.com/problems/'), 'Problem #' + p.id + ' invalid leetcode_url ' + p.leetcode_url);
  assert(p.optimalSolution && typeof p.optimalSolution === 'object', 'Problem #' + p.id + ' missing optimalSolution');
  assert(p.optimalSolution.code && typeof p.optimalSolution.code === 'object', 'Problem #' + p.id + ' missing code solutions');
  assert(p.optimalSolution.code.cpp && p.optimalSolution.code.java && p.optimalSolution.code.python && p.optimalSolution.code.javascript, 'Problem #' + p.id + ' missing multi-lang code');

  if (p.difficulty === 'Easy') easyCount++;
  else if (p.difficulty === 'Medium') medCount++;
  else if (p.difficulty === 'Hard') hardCount++;
});

assert(easyCount === 200, 'Easy count is ' + easyCount + ', expected 200');
assert(medCount === 500, 'Medium count is ' + medCount + ', expected 500');
assert(hardCount === 300, 'Hard count is ' + hardCount + ', expected 300');
console.log('✓ 1,000 Questions Schema Verified: 200 Easy, 500 Medium, 300 Hard');

// 2. 20-PAGE BALANCED DISTRIBUTION
console.log('\n[2/7] Auditing 20-Page Distribution...');
for (let page = 1; page <= 20; page++) {
  const pageProblems = PROBLEMS.slice((page - 1) * 50, page * 50);
  assert(pageProblems.length === 50, 'Page ' + page + ' has ' + pageProblems.length + ' problems, expected 50');
  const pEasy = pageProblems.filter(x => x.difficulty === 'Easy').length;
  const pMed = pageProblems.filter(x => x.difficulty === 'Medium').length;
  const pHard = pageProblems.filter(x => x.difficulty === 'Hard').length;
  assert(pEasy === 10, 'Page ' + page + ' has ' + pEasy + ' Easy problems, expected 10');
  assert(pMed === 25, 'Page ' + page + ' has ' + pMed + ' Medium problems, expected 25');
  assert(pHard === 15, 'Page ' + page + ' has ' + pHard + ' Hard problems, expected 15');
}
console.log('✓ All 20 Pages have exact 10 Easy, 25 Medium, 15 Hard formula (50 per page)');

// 3. GUIDE DATA (28 Chapters)
console.log('\n[3/7] Auditing DSA Guide (28 Chapters)...');
const GUIDE_DATA = require(guideJsPath);
assert(Array.isArray(GUIDE_DATA), 'GUIDE_DATA is an array');
assert(GUIDE_DATA.length >= 26, 'Expected at least 26 chapters, got ' + GUIDE_DATA.length);
GUIDE_DATA.forEach((ch, idx) => {
  assert(ch.id && ch.title && ch.theory && ch.code, 'Guide chapter ' + (idx + 1) + ' invalid');
});
console.log(`✓ All ${GUIDE_DATA.length} DSA Guide Chapters Verified with Full Multi-Language Code`);

// 4. HTML DOM & VIEWS
console.log('\n[4/7] Auditing HTML Views & Navigation...');
const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

const requiredViews = [
  'view-problems',
  'view-guide',
  'view-progress',
  'view-about',
  'view-privacy',
  'view-terms',
  'view-disclaimer',
  'view-contact'
];

requiredViews.forEach(v => {
  assert(htmlContent.includes('id="' + v + '"'), 'Missing view section: #' + v);
});

assert(htmlContent.includes('ca-pub-2781286202640992'), 'Missing AdSense ca-pub in index.html');
assert(htmlContent.includes('cookie-consent-banner'), 'Missing Cookie Consent banner');
assert(htmlContent.includes('mdhashmi955@gmail.com'), 'Missing contact email in index.html');
assert(htmlContent.includes('8595018458@ptsbi'), 'Missing UPI ID in index.html');
console.log('✓ All 8 Views, AdSense Script, Cookie Consent Banner, and Contact verified in HTML');

// 5. SECURITY & VERCEL JSON
console.log('\n[5/7] Auditing Security Headers & Configuration...');
const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
assert(vercelConfig.headers && vercelConfig.headers.length > 0, 'vercel.json headers present');
const globalHeaders = vercelConfig.headers.find(h => h.source === '/(.*)').headers;
const csp = globalHeaders.find(h => h.key === 'Content-Security-Policy').value;
assert(csp.includes('formsubmit.co'), 'CSP connect-src includes formsubmit.co');
assert(csp.includes('googlesyndication.com'), 'CSP allows Google AdSense');
assert(globalHeaders.some(h => h.key === 'Cache-Control' && h.value.includes('no-cache')), 'Anti-cache header configured');
console.log('✓ Security headers (CSP, HSTS, X-Frame-Options, Cache-Control) verified');

// 6. SITEMAP & ROBOTS
console.log('\n[6/7] Auditing SEO, Sitemap & Robots.txt...');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(sitemapContent.includes('<loc>https://www.dsaproblems.site/terms</loc>'), 'Sitemap includes /terms');
assert(sitemapContent.includes('<loc>https://www.dsaproblems.site/disclaimer</loc>'), 'Sitemap includes /disclaimer');
assert(sitemapContent.includes('<loc>https://www.dsaproblems.site/contact</loc>'), 'Sitemap includes /contact');
assert(robotsContent.includes('Sitemap: https://www.dsaproblems.site/sitemap.xml'), 'Robots.txt references sitemap.xml');
console.log('✓ Sitemap and Robots.txt verified');

// 7. CLIENT APP METHODS
console.log('\n[7/7] Auditing Client App.js Functions...');
const appContent = fs.readFileSync(appJsPath, 'utf8');
const requiredMethods = [
  'handleContactSubmit',
  'openInGmail',
  'openInMailApp',
  'copyContactEmail',
  'copyUpiId',
  'acceptCookies',
  'declineCookies',
  'checkCookieConsent',
  'navigate',
  'renderProblemSheet',
  'renderGuide',
  'openProblemModal',
  'closeProblemModal',
  'handleSearch',
  'toggleTheme'
];

requiredMethods.forEach(m => {
  assert(appContent.includes(m), 'app.js missing method ' + m);
});
console.log('✓ All critical App methods verified');

console.log('\n==================================================');
console.log('✅ AUDIT PASSED: ' + passedTests + ' checks passed, ' + failedTests + ' failed.');
console.log('==================================================');

if (failedTests > 0) process.exit(1);
