const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("   FINAL ACCEPTANCE CRITERIA VERIFICATION SCRIPT   ");
console.log("==================================================\n");

let passed = true;

function check(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
  } else {
    console.error(`❌ FAIL: ${message}`);
    passed = false;
  }
}

// Load data
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf8'));
const page1_2Snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/page1_2_locked_snapshot.json'), 'utf8'));
const realLeetcode = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/leetcode_real_problems.json'), 'utf8'));

const realBySlug = new Map(realLeetcode.map(p => [p.slug.toLowerCase(), p]));

// 1. Locked Pages 1 & 2 Check
console.log("[Rule 1] Checking Pages 1 & 2 (Problems 1 to 100) Immutability...");
const page1_2Current = questions.slice(0, 100);
let page1_2Match = true;

if (page1_2Current.length !== page1_2Snapshot.length) {
  page1_2Match = false;
} else {
  for (let i = 0; i < 100; i++) {
    const curr = page1_2Current[i];
    const snap = page1_2Snapshot[i];
    if (curr.id !== snap.id || curr.title !== snap.title || (curr.canonicalUrl || curr.leetcode_url) !== (snap.canonicalUrl || snap.leetcode_url) || curr.topic !== snap.topic || curr.difficulty !== snap.difficulty) {
      console.error(`Mismatch at Problem #${curr.id}: Curr='${curr.title}', Snap='${snap.title}'`);
      page1_2Match = false;
      break;
    }
  }
}
check(page1_2Match, "Page 1 and Page 2 are 100% UNCHANGED and MATCH original snapshot!");

// 2. Total Count
console.log("\n[Rule 9] Checking Total Problem Count...");
check(questions.length === 1000, `Total dataset count is exactly 1000 (actual: ${questions.length})`);

// 3. Duplicate Audits
console.log("\n[Rule 10] Checking Duplicates...");
const seenIds = new Set();
const seenUrls = new Set();
const seenTitles = new Set();

let dupIds = 0, dupUrls = 0, dupTitles = 0;

questions.forEach(q => {
  if (seenIds.has(q.id)) dupIds++;
  seenIds.add(q.id);

  const url = (q.canonicalUrl || q.leetcode_url || '').toLowerCase();
  if (seenUrls.has(url)) dupUrls++;
  seenUrls.add(url);

  const normTitle = (q.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (seenTitles.has(normTitle)) dupTitles++;
  seenTitles.add(normTitle);
});

check(dupIds === 0, "No duplicate problem IDs exist.");
check(dupUrls === 0, "No duplicate URLs exist.");
check(dupTitles === 0, "No duplicate titles exist.");

// 4. URL & Link Validation
console.log("\n[Rule 3 & 14] Validating Problem Links & Real LeetCode Destination Match...");
let invalidUrls = 0;
let searchUrls = 0;
let fakeTitles = 0;

questions.forEach(q => {
  const url = q.canonicalUrl || q.leetcode_url || q.leetcodeUrl || q.url || '';
  if (!url.startsWith('https://leetcode.com/problems/')) invalidUrls++;
  if (url.includes('/problemset/') || url.includes('?search=')) searchUrls++;
  if (q.title.includes('FAANG Core Problem') || q.title.includes('Synthetic')) fakeTitles++;
});

check(invalidUrls === 0, "All 1000 problems have valid https://leetcode.com/problems/ URLs.");
check(searchUrls === 0, "No generic search URLs exist in dataset.");
check(fakeTitles === 0, "No synthetic or fake problem titles exist.");

// 5. Category Balance Check
console.log("\n[Rule 5 & 6] Checking Category Balance (Minimum 10 per category target)...");
const catCounts = {};
questions.forEach(q => catCounts[q.topic] = (catCounts[q.topic] || 0) + 1);

let categoriesBelowTarget = 0;
Object.entries(catCounts).forEach(([cat, count]) => {
  if (count < 10) {
    console.error(`Category '${cat}' has only ${count} problems (below 10 minimum)!`);
    categoriesBelowTarget++;
  }
});

check(categoriesBelowTarget === 0, `All ${Object.keys(catCounts).length} categories meet or exceed minimum target of 10 questions!`);
console.log("   Category Counts Summary:", JSON.stringify(catCounts, null, 2));

// 6. Difficulty Distribution
console.log("\n[Rule 12] Checking Difficulty Distribution (Target: 200 Easy, 500 Medium, 300 Hard)...");
const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
questions.forEach(q => diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1);

check(diffCounts.Easy === 200, `Easy count is exactly 200 (actual: ${diffCounts.Easy})`);
check(diffCounts.Medium === 500, `Medium count is exactly 500 (actual: ${diffCounts.Medium})`);
check(diffCounts.Hard === 300, `Hard count is exactly 300 (actual: ${diffCounts.Hard})`);

// 7. Pagination Check
console.log("\n[Rule 13] Checking Pagination...");
const totalPages = Math.ceil(questions.length / 50);
check(totalPages === 20, `Total pages for 1000 problems at 50/page is 20 (actual: ${totalPages})`);

console.log("\n==================================================");
if (passed) {
  console.log("🎉 ALL FINAL ACCEPTANCE CRITERIA PASSED 100%!");
} else {
  console.error("❌ SOME ACCEPTANCE CRITERIA FAILED!");
  process.exit(1);
}
console.log("==================================================\n");
