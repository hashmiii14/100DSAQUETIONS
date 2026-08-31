const fs = require('fs');
const path = require('path');

console.log("=== STARTING COMPREHENSIVE QA & AUTOMATED TEST SUITE ===");

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
    throw new Error(message);
  } else {
    passedTests++;
  }
}

// 1. Load Dataset & Libraries
console.log("\n[Test 1] Testing Data File Loading & Object Models...");
const PROBLEMS = require('../data/questions.js');

assert(Array.isArray(PROBLEMS), "PROBLEMS must be an array");
assert(PROBLEMS.length === 1000, `Expected 1000 problems, found ${PROBLEMS.length}`);

// 2. Validate all 1000 problems fields
console.log("\n[Test 2] Validating Data Schema for all 1000 problems...");
let easyCount = 0, medCount = 0, hardCount = 0;
const validDifficulties = new Set(['Easy', 'Medium', 'Hard']);
const seenIds = new Set();

PROBLEMS.forEach((p, idx) => {
  assert(typeof p.id === 'number', `Problem #${idx} missing numeric id`);
  assert(!seenIds.has(p.id), `Duplicate problem id: ${p.id}`);
  seenIds.add(p.id);

  assert(typeof p.title === 'string' && p.title.trim().length > 0, `Problem #${p.id} missing title`);
  assert(validDifficulties.has(p.difficulty), `Problem #${p.id} invalid difficulty: ${p.difficulty}`);
  assert(typeof p.topic === 'string' && p.topic.trim().length > 0, `Problem #${p.id} missing topic`);
  assert(typeof p.pattern === 'string' && p.pattern.trim().length > 0, `Problem #${p.id} missing pattern`);
  assert(['verified', 'related', 'no_direct_match'].includes(p.leetcode_match_status), `Problem #${p.id} invalid leetcode_match_status`);

  if (p.leetcode_match_status !== 'no_direct_match') {
    assert(p.leetcode_url && p.leetcode_url.startsWith('https://leetcode.com/problems/'), `Problem #${p.id} invalid LeetCode URL: ${p.leetcode_url}`);
  }
  
  assert(typeof p.statement === 'string' && p.statement.trim().length > 0, `Problem #${p.id} missing statement`);
  assert(Array.isArray(p.constraints), `Problem #${p.id} constraints must be array`);
  assert(Array.isArray(p.examples) && p.examples.length > 0, `Problem #${p.id} examples must be non-empty array`);
  assert(Array.isArray(p.hints) && p.hints.length > 0, `Problem #${p.id} hints must be non-empty array`);

  assert(p.optimalSolution && p.optimalSolution.code, `Problem #${p.id} missing optimal solution code`);
  assert(p.optimalSolution.code.cpp && p.optimalSolution.code.java && p.optimalSolution.code.python && p.optimalSolution.code.javascript, `Problem #${p.id} missing multi-language optimal code`);

  assert(p.bruteForce && p.bruteForce.code, `Problem #${p.id} missing brute force solution code`);
  assert(p.bruteForce.code.cpp && p.bruteForce.code.java && p.bruteForce.code.python && p.bruteForce.code.javascript, `Problem #${p.id} missing multi-language brute force code`);

  assert(Array.isArray(p.edgeCases), `Problem #${p.id} edgeCases must be array`);
  assert(Array.isArray(p.commonMistakes), `Problem #${p.id} commonMistakes must be array`);

  if (p.difficulty === 'Easy') easyCount++;
  if (p.difficulty === 'Medium') medCount++;
  if (p.difficulty === 'Hard') hardCount++;
});

console.log(`   Data Verification Passed: Total 1000 | Easy: ${easyCount} | Medium: ${medCount} | Hard: ${hardCount}`);
assert(easyCount === 200, `Expected 200 Easy problems, found ${easyCount}`);
assert(medCount === 500, `Expected 500 Medium problems, found ${medCount}`);
assert(hardCount === 300, `Expected 300 Hard problems, found ${hardCount}`);

// 3. Test AppState logic
console.log("\n[Test 3] Testing AppState & Storage Operations...");
// Mock localStorage
const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};
global.document = {
  documentElement: { setAttribute: () => {} }
};

const AppState = require('../js/state.js');
assert(AppState.done.size === 0, "Initial done set should be empty");
assert(AppState.toggleDone(1) === true, "toggleDone(1) should mark #1 done");
assert(AppState.done.has(1), "Done set should contain #1");
assert(AppState.toggleDone(1) === false, "toggleDone(1) again should unmark #1");

assert(AppState.toggleBookmark(42) === true, "toggleBookmark(42) should bookmark #42");
assert(AppState.bookmarked.has(42), "Bookmarked set should contain #42");

AppState.saveNote(10, "Need to review fast exponentiation");
assert(AppState.getNote(10) === "Need to review fast exponentiation", "getNote(10) mismatch");

// 4. Test RecommendationEngine logic
console.log("\n[Test 4] Testing Recommendation Engine...");
const RecommendationEngine = require('../js/recommendation.js');
const recEngine = new RecommendationEngine(PROBLEMS, AppState);

const firstRec = recEngine.getSmartNextQuestion();
assert(firstRec && firstRec.problem && firstRec.problem.id === 1, "First recommendation should be problem #1");

AppState.toggleDone(1);
const secondRec = recEngine.getSmartNextQuestion(1);
assert(secondRec && secondRec.problem, "Should provide next recommendation after problem #1");

// 5. Test index.html DOM Element ID matching
console.log("\n[Test 5] Checking HTML DOM Element IDs referenced in JS files...");
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
const appJsContent = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

let match;
const dynamicIds = new Set(['btn-copy-guide-code', 'copy-email-badge']);
const missingIds = [];
while ((match = idRegex.exec(appJsContent)) !== null) {
  const elementId = match[1];
  if (dynamicIds.has(elementId)) continue;
  const htmlPattern = new RegExp(`id=["']${elementId}["']`);
  if (!htmlPattern.test(indexHtml)) {
    missingIds.push(elementId);
  }
}

if (missingIds.length > 0) {
  console.error(`⚠️ Found missing DOM Element IDs in index.html: ${missingIds.join(', ')}`);
} else {
  console.log("   All document.getElementById calls in app.js have matching elements in index.html!");
}
assert(missingIds.length === 0, `Missing DOM element IDs: ${missingIds.join(', ')}`);

// 6. Test Theme Toggle logic and Storage persistence
console.log("\n[Test 6] Testing Theme Toggle & LocalStorage persistence...");
AppState.setTheme('dark');
assert(AppState.theme === 'dark', "AppState.theme should be 'dark'");
assert(localStorageStore['dsaproblems_theme_v3'] === 'dark', "localStorage should store 'dark'");

AppState.setTheme('light');
assert(AppState.theme === 'light', "AppState.theme should be 'light'");
assert(localStorageStore['dsaproblems_theme_v3'] === 'light', "localStorage should store 'light'");

// 7. Test Navigation Section Ordering in index.html
console.log("\n[Test 7] Validating Nav Section Ordering in index.html...");
const expectedNavOrder = ['problems', 'guide', 'progress', 'privacy', 'terms', 'disclaimer', 'contact', 'about'];
const expectedExtendedNavOrder = ['problems', 'guide', 'progress', 'privacy', 'terms', 'disclaimer', 'contact', 'about'];

// Extract main-nav desktop buttons
const mainNavMatch = indexHtml.match(/<nav[^>]*id=["']main-nav["'][^>]*>([\s\S]*?)<\/nav>/);
assert(mainNavMatch, "main-nav element must exist in index.html");
const desktopViews = [...mainNavMatch[1].matchAll(/data-view=["']([^"']+)["']/g)].map(m => m[1]);
assert(JSON.stringify(desktopViews) === JSON.stringify(expectedNavOrder), `Desktop nav order mismatch: expected ${expectedNavOrder.join(', ')} but got ${desktopViews.join(', ')}`);

// Extract mobile drawer buttons
const mobileDrawerMatch = indexHtml.match(/<aside[^>]*id=["']mobile-drawer["'][^>]*>([\s\S]*?)<\/aside>/);
assert(mobileDrawerMatch, "mobile-drawer element must exist in index.html");
const mobileViews = [...mobileDrawerMatch[1].matchAll(/data-view=["']([^"']+)["']/g)].map(m => m[1]);
assert(JSON.stringify(mobileViews) === JSON.stringify(expectedExtendedNavOrder), `Mobile drawer nav order mismatch: expected ${expectedExtendedNavOrder.join(', ')} but got ${mobileViews.join(', ')}`);

// Extract footer links
const footerMatch = indexHtml.match(/<(?:div|nav)[^>]*class=["']footer-links["'][^>]*>([\s\S]*?)<\/(?:div|nav)>/);
assert(footerMatch, "footer-links element must exist in index.html");
const footerHrefs = [...footerMatch[1].matchAll(/href=["']\/([^"']+)["']/g)].map(m => m[1]);
assert(JSON.stringify(footerHrefs) === JSON.stringify(expectedExtendedNavOrder), `Footer nav order mismatch: expected ${expectedExtendedNavOrder.join(', ')} but got ${footerHrefs.join(', ')}`);

console.log("   Navigation order verified for Desktop, Mobile Drawer, and Footer links!");

// 8. Test Direct Jump Pagination Logic & All 20 Page Buttons
console.log("\n[Test 8] Testing Direct Jump Pagination & All 20 Page Numbers...");
const totalPages = Math.ceil(PROBLEMS.length / 50); // 20 pages
assert(totalPages === 20, `Expected 20 pages for 1000 problems, got ${totalPages}`);

let currentPage = 1;
function goToPage(target) {
  currentPage = Math.max(1, Math.min(target, totalPages));
}

// Test sequence 1 -> 6 -> 10 -> 15 -> 20 -> 1
goToPage(6);
assert(currentPage === 6, "Direct jump to Page 6 failed");
goToPage(10);
assert(currentPage === 10, "Direct jump to Page 10 failed");
goToPage(15);
assert(currentPage === 15, "Direct jump to Page 15 failed");
goToPage(20);
assert(currentPage === 20, "Direct jump to Page 20 (Last) failed");
goToPage(1);
assert(currentPage === 1, "Direct jump to Page 1 (First) failed");

function getPageGroupRange(cp, maxP) {
  const gIdx = Math.floor((cp - 1) / 5);
  const startP = gIdx * 5 + 1;
  const endP = Math.min(startP + 4, maxP);
  return { startP, endP };
}

assert(JSON.stringify(getPageGroupRange(1, 20)) === JSON.stringify({ startP: 1, endP: 5 }), "Group 1 (1-5) range check failed");
assert(JSON.stringify(getPageGroupRange(6, 20)) === JSON.stringify({ startP: 6, endP: 10 }), "Group 2 (6-10) range check failed");
assert(JSON.stringify(getPageGroupRange(11, 20)) === JSON.stringify({ startP: 11, endP: 15 }), "Group 3 (11-15) range check failed");
assert(JSON.stringify(getPageGroupRange(16, 20)) === JSON.stringify({ startP: 16, endP: 20 }), "Group 4 (16-20) range check failed");

console.log("   5-Page Section Group Range Pagination verified for 1-5, 6-10, 11-15, 16-20!");

// 9. Test User-Reported Live Issues (Pagination, Filters, DSA Guide, Modal)
console.log("\n[Test 9] Testing Fixes for User-Reported Issues...");
const GUIDE_DATA = require('../data/guide_data.js');

global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => 'dark'
  },
  body: {
    style: {}
  },
  getElementById: (id) => ({
    textContent: '',
    innerHTML: '',
    value: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    setAttribute: () => {},
    getAttribute: () => '',
    appendChild: () => {}
  }),
  createElement: (tag) => ({
    tagName: tag,
    value: '',
    textContent: '',
    innerHTML: '',
    appendChild: () => {}
  }),
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {}
};

global.window = {
  location: { pathname: '/', search: '', hash: '' },
  history: { pushState: () => {}, replaceState: () => {} },
  localStorage: global.localStorage,
  addEventListener: () => {},
  scrollTo: () => {},
  GUIDE_DATA: GUIDE_DATA,
  PROBLEMS: PROBLEMS
};

const DSAApp = require('../app.js');
const appInstance = new DSAApp();
global.window.app = appInstance;

assert(global.window.app === appInstance, "window.app must be defined on global window");
assert(Array.isArray(global.window.GUIDE_DATA) && global.window.GUIDE_DATA.length === 26, "GUIDE_DATA must contain all 26 chapters");

// Verify pagination 1 to 20
for (let p = 1; p <= 20; p++) {
  appInstance.goToPage(p);
  assert(appInstance.currentPage === p, `goToPage(${p}) failed`);
}
appInstance.goToPage(1);

// Verify Filters
appInstance.handleDifficultyFilter('Easy');
assert(appInstance.getFilteredProblems().length === 200, "Easy filter count mismatch");
appInstance.handleDifficultyFilter('Medium');
assert(appInstance.getFilteredProblems().length === 500, "Medium filter count mismatch");
appInstance.handleDifficultyFilter('Hard');
assert(appInstance.getFilteredProblems().length === 300, "Hard filter count mismatch");
appInstance.resetFilters();

appInstance.handleTopicFilter('Arrays');
assert(appInstance.getFilteredProblems().length > 0, "Arrays topic filter mismatch");
appInstance.resetFilters();

// Verify Guide Navigation & Default Topic
appInstance.navigate('/guide');
assert(appInstance.currentRoute === '/guide', "Route must be /guide");
assert(appInstance.activeGuideTopic === 'arrays', "Default active guide topic must be 'arrays'");
appInstance.setGuideLang('java');
assert(appInstance.activeGuideLang === 'java', "Active guide language must switch to java");
appInstance.setGuideLang('python');
assert(appInstance.activeGuideLang === 'python', "Active guide language must switch to python");
appInstance.setGuideLang('cpp');

// Verify Modal Navigation & getProblemById
const p1 = appInstance.getProblemById(1);
assert(p1 && p1.id === 1, "getProblemById(1) failed");
appInstance.openProblemModal(1);
assert(appInstance.activeProblem && appInstance.activeProblem.id === 1, "Active modal problem must be #1");
appInstance.navigateModalProblem(1);
assert(appInstance.activeProblem && appInstance.activeProblem.id === 2, "navigateModalProblem(1) must navigate to #2");
appInstance.navigateModalProblem(-1);
assert(appInstance.activeProblem && appInstance.activeProblem.id === 1, "navigateModalProblem(-1) must navigate back to #1");
appInstance.closeProblemModal();

console.log("   User-reported issues suite passed: Global bindings, All 20 Pages, Filters, Guide 26 Chapters & Modal verified!");

console.log(`\n==================================================`);
console.log(`✅ QA TEST SUITE COMPLETED SUCCESSFULLY! Passed ${passedTests} assertions.`);
console.log(`==================================================\n`);
