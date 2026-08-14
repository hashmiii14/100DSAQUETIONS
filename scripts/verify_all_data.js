const PROBLEMS = require('../data/questions.js');

console.log("=== VERIFYING DATASET INTEGRITY FOR ALL 1000 PROBLEMS ===");

let errors = 0;
const validDifficulties = ['Easy', 'Medium', 'Hard'];

PROBLEMS.forEach((p, idx) => {
  if (p.id !== idx + 1) {
    console.error(`ID Mismatch at index ${idx}: expected ${idx + 1}, got ${p.id}`);
    errors++;
  }
  if (!p.title || typeof p.title !== 'string') {
    console.error(`Missing title for #${p.id}`);
    errors++;
  }
  if (!validDifficulties.includes(p.difficulty)) {
    console.error(`Invalid difficulty '${p.difficulty}' for #${p.id}`);
    errors++;
  }
  if (!['verified', 'related', 'no_direct_match'].includes(p.leetcode_match_status)) {
    console.error(`Invalid leetcode_match_status '${p.leetcode_match_status}' for #${p.id}`);
    errors++;
  }
  if (p.leetcode_match_status !== 'no_direct_match') {
    if (!p.leetcode_url || !p.leetcode_url.startsWith('https://leetcode.com/problems/')) {
      console.error(`Invalid LeetCode URL for #${p.id}: ${p.leetcode_url}`);
      errors++;
    }
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
  console.log(`✅ ALL ${PROBLEMS.length} CANONICAL PROBLEMS VERIFIED PERFECTLY WITH ZERO ERRORS!`);
} else {
  console.error(`❌ FOUND ${errors} ERRORS IN DATASET!`);
  process.exit(1);
}
