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
  assert(p.leetcodeUrl && p.leetcodeUrl.startsWith('https://leetcode.com/problems/'), `Problem #${p.id} invalid LeetCode URL`);
  
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
assert(easyCount === 400, `Expected 400 Easy problems, found ${easyCount}`);
assert(medCount === 500, `Expected 500 Medium problems, found ${medCount}`);
assert(hardCount === 100, `Expected 100 Hard problems, found ${hardCount}`);

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
const missingIds = [];
while ((match = idRegex.exec(appJsContent)) !== null) {
  const elementId = match[1];
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

console.log(`\n==================================================`);
console.log(`✅ QA TEST SUITE COMPLETED SUCCESSFULLY! Passed ${passedTests} assertions.`);
console.log(`==================================================\n`);
