const fs = require('fs');
const path = require('path');

const questionsJsPath = path.join(__dirname, '../data/questions.js');
const backupPath = path.join(__dirname, '../data/questions_snapshot_backup.json');

console.log('Reading data/questions.js...');
const rawJs = fs.readFileSync(questionsJsPath, 'utf8');

let problems;
const questionsJsonPath = path.join(__dirname, '../data/questions.json');
if (fs.existsSync(questionsJsonPath)) {
  problems = JSON.parse(fs.readFileSync(questionsJsonPath, 'utf8'));
} else {
  const match = rawJs.match(/const PROBLEMS = (\[[\s\S]*\]);/);
  if (match) {
    problems = JSON.parse(match[1]);
  } else {
    const vm = require('vm');
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(rawJs, sandbox);
    problems = sandbox.PROBLEMS || sandbox.window.PROBLEMS;
  }
}

console.log(`Total problems loaded: ${problems.length}`);

// Save snapshot backup
fs.writeFileSync(backupPath, JSON.stringify(problems, null, 2), 'utf8');
console.log(`Snapshot backup saved to ${backupPath}`);

// Inspect Pages 1 & 2 (Problems 1 - 100)
const page1_2 = problems.slice(0, 100);
const page1_2_snapshot_path = path.join(__dirname, '../data/page1_2_locked_snapshot.json');
fs.writeFileSync(page1_2_snapshot_path, JSON.stringify(page1_2, null, 2), 'utf8');
console.log(`Locked Page 1 & 2 snapshot saved (${page1_2.length} problems)`);

// Category distribution
const categoryCounts = {};
const difficultyCounts = {};
const urlTypes = {
  valid_leetcode: 0,
  search_url: 0,
  synthetic_or_invalid: 0,
  empty: 0
};
const duplicates = {
  ids: new Set(),
  urls: new Set(),
  titles: new Set()
};

const seenIds = new Set();
const seenUrls = new Map();
const seenTitles = new Map();

const dupUrlList = [];
const dupTitleList = [];
const searchUrlList = [];

problems.forEach((p, idx) => {
  // Category
  categoryCounts[p.topic] = (categoryCounts[p.topic] || 0) + 1;
  // Difficulty
  difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] || 0) + 1;

  // Duplicates
  if (seenIds.has(p.id)) {
    duplicates.ids.add(p.id);
  }
  seenIds.add(p.id);

  const url = p.canonicalUrl || p.leetcode_url || p.leetcodeUrl || p.url || '';
  if (!url) {
    urlTypes.empty++;
  } else if (url.includes('/problemset/') || url.includes('/search') || url.includes('?search=')) {
    urlTypes.search_url++;
    searchUrlList.push({ id: p.id, title: p.title, topic: p.topic, url });
  } else if (url.startsWith('https://leetcode.com/problems/') || url.startsWith('http://leetcode.com/problems/')) {
    urlTypes.valid_leetcode++;
  } else {
    urlTypes.synthetic_or_invalid++;
  }

  if (url) {
    if (seenUrls.has(url)) {
      dupUrlList.push({ id: p.id, title: p.title, topic: p.topic, url, firstSeenId: seenUrls.get(url) });
    } else {
      seenUrls.set(url, p.id);
    }
  }

  const normTitle = (p.title || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  if (seenTitles.has(normTitle)) {
    dupTitleList.push({ id: p.id, title: p.title, topic: p.topic, firstSeenId: seenTitles.get(normTitle) });
  } else {
    seenTitles.set(normTitle, p.id);
  }
});

console.log('\n--- DATASET AUDIT RESULTS ---');
console.log('Total problems:', problems.length);
console.log('Category distribution:', JSON.stringify(categoryCounts, null, 2));
console.log('Difficulty distribution:', JSON.stringify(difficultyCounts, null, 2));
console.log('URL breakdown:', urlTypes);
console.log('Duplicate IDs count:', duplicates.ids.size);
console.log('Duplicate URLs count:', dupUrlList.length);
console.log('Duplicate Titles count:', dupTitleList.length);
console.log('Search URLs count:', searchUrlList.length);

fs.writeFileSync(path.join(__dirname, '../data/audit_report_initial.json'), JSON.stringify({
  totalProblems: problems.length,
  categoryCounts,
  difficultyCounts,
  urlTypes,
  dupUrlList,
  dupTitleList,
  searchUrlList
}, null, 2), 'utf8');
