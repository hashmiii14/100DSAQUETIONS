const PROBLEMS = require('../data/questions.js');

console.log("=== VERIFYING DATASET INTEGRITY FOR ALL 1000 PROBLEMS ===");

let errors = 0;

PROBLEMS.forEach((p, idx) => {
  if (p.id !== idx + 1) {
    console.error(`ID Mismatch at index ${idx}: expected ${idx + 1}, got ${p.id}`);
    errors++;
  }
  if (!p.title || typeof p.title !== 'string') {
    console.error(`Missing title for #${p.id}`);
    errors++;
  }
  if (!['Easy', 'Medium', 'Hard'].includes(p.difficulty)) {
    console.error(`Invalid difficulty '${p.difficulty}' for #${p.id}`);
    errors++;
  }
  if (!p.leetcodeUrl || !p.leetcodeUrl.startsWith('https://leetcode.com/problems/')) {
    console.error(`Invalid LeetCode URL for #${p.id}: ${p.leetcodeUrl}`);
    errors++;
  }
  if (!p.optimalSolution || !p.optimalSolution.code || !p.optimalSolution.code.cpp) {
    console.error(`Missing optimal C++ solution for #${p.id}`);
    errors++;
  }
  if (!p.bruteForce || !p.bruteForce.code || !p.bruteForce.code.cpp) {
    console.error(`Missing brute force C++ solution for #${p.id}`);
    errors++;
  }
});

if (errors === 0) {
  console.log(`✅ ALL 1000 PROBLEMS VERIFIED PERFECTLY WITH ZERO ERRORS!`);
} else {
  console.error(`❌ FOUND ${errors} ERRORS IN DATASET!`);
  process.exit(1);
}
