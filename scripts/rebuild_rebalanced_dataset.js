const fs = require('fs');
const path = require('path');

// 1. Load original questions and locked Page 1 & 2 snapshot
const questionsPath = path.join(__dirname, '../data/questions.json');
const originalQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

const page1_2SnapshotPath = path.join(__dirname, '../data/page1_2_locked_snapshot.json');
const page1_2 = JSON.parse(fs.readFileSync(page1_2SnapshotPath, 'utf8'));

// 2. Load real LeetCode database (3240 real problems)
const realLeetcode = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/leetcode_real_problems.json'), 'utf8'));

// Build lookup index of real LeetCode problems
const realBySlug = new Map();
const realByTitleNorm = new Map();

realLeetcode.forEach(p => {
  realBySlug.set(p.slug.toLowerCase(), p);
  const normTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  realByTitleNorm.set(normTitle, p);
});

console.log(`Loaded ${originalQuestions.length} original questions, ${page1_2.length} locked page 1-2 questions, and ${realLeetcode.length} real LC problems.`);

// Keep track of used URLs / Titles to prevent duplicates
const usedUrls = new Set();
const usedTitlesNorm = new Set();

// Lock Page 1 & 2 into used set
page1_2.forEach(q => {
  const url = q.canonicalUrl || q.leetcode_url || q.leetcodeUrl || q.url || '';
  if (url) usedUrls.add(url.toLowerCase());
  const normTitle = q.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normTitle) usedTitlesNorm.add(normTitle);
});

// Helper to check if a problem is a valid real LeetCode problem
function getRealProblemMatch(q) {
  const url = q.canonicalUrl || q.leetcode_url || q.leetcodeUrl || q.url || '';
  let slug = '';
  if (url.includes('/problems/')) {
    const match = url.match(/\/problems\/([^\/]+)/);
    if (match) slug = match[1].toLowerCase();
  }
  const normTitle = (q.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (slug && realBySlug.has(slug)) {
    return realBySlug.get(slug);
  }
  if (normTitle && realByTitleNorm.has(normTitle)) {
    return realByTitleNorm.get(normTitle);
  }
  return null;
}

// Separate valid vs invalid questions in Pages 3-20 (IDs 101-1000)
const page3_20Original = originalQuestions.slice(100);
const validPage3_20 = [];

page3_20Original.forEach(q => {
  const realMatch = getRealProblemMatch(q);
  if (realMatch) {
    const realUrl = realMatch.url.toLowerCase();
    const realNormTitle = realMatch.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!usedUrls.has(realUrl) && !usedTitlesNorm.has(realNormTitle)) {
      usedUrls.add(realUrl);
      usedTitlesNorm.add(realNormTitle);
      // Clean up problem attributes to match official real LeetCode entry
      const cleaned = {
        ...q,
        title: realMatch.title,
        difficulty: realMatch.difficulty || q.difficulty || 'Medium',
        canonicalUrl: realMatch.url,
        leetcode_url: realMatch.url,
        leetcodeUrl: realMatch.url,
        url: realMatch.url,
        canonicalSlug: realMatch.slug,
        slug: realMatch.slug,
        leetcode_id: realMatch.id,
        leetcodeId: realMatch.id,
        leetcode_match_status: 'verified',
        status: 'VERIFIED',
        isVerified: true
      };
      validPage3_20.push(cleaned);
    }
  }
});

console.log(`Preserved ${validPage3_20.length} valid real LeetCode questions from original Pages 3-20.`);

// Count topics in preserved valid questions (including Page 1-2)
const currentTopicCounts = {};
page1_2.forEach(q => currentTopicCounts[q.topic] = (currentTopicCounts[q.topic] || 0) + 1);
validPage3_20.forEach(q => currentTopicCounts[q.topic] = (currentTopicCounts[q.topic] || 0) + 1);

console.log('Current topic distribution before balancing:', currentTopicCounts);
