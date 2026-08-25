const fs = require('fs');
const path = require('path');

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf8'));
const realLeetcode = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/leetcode_real_problems.json'), 'utf8'));

// Build lookup maps for real LeetCode problems
const realBySlug = new Map();
const realByTitleNorm = new Map();

realLeetcode.forEach(p => {
  realBySlug.set(p.slug.toLowerCase(), p);
  const normTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  realByTitleNorm.set(normTitle, p);
});

console.log(`Loaded ${realLeetcode.length} real LeetCode problems.`);

let validSlugMatches = 0;
let titleMatchedWithDiffSlug = 0;
let invalidOrSynthetic = 0;
let searchUrls = 0;

const issues = [];

questions.forEach((q, idx) => {
  const url = q.canonicalUrl || q.leetcode_url || q.leetcodeUrl || q.url || '';
  let slug = '';
  
  if (url.includes('/problems/')) {
    const match = url.match(/\/problems\/([^\/]+)/);
    if (match) slug = match[1].toLowerCase();
  }

  const normTitle = q.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const realByExactSlug = slug ? realBySlug.get(slug) : null;
  const realByExactTitle = realByTitleNorm.get(normTitle);

  if (url.includes('/problemset/') || url.includes('/search/') || url.includes('?search=')) {
    searchUrls++;
    issues.push({ id: q.id, title: q.title, issue: 'SEARCH_URL', currentUrl: url, suggested: realByExactTitle });
  } else if (realByExactSlug) {
    validSlugMatches++;
    // Check if the title actually matches the slug's official title
    const normOfficialTitle = realByExactSlug.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normOfficialTitle !== normTitle && normTitle.length > 3) {
      issues.push({
        id: q.id,
        title: q.title,
        issue: 'TITLE_SLUG_MISMATCH',
        currentUrl: url,
        slugTitle: realByExactSlug.title,
        suggested: realByExactTitle
      });
    }
  } else if (realByExactTitle) {
    titleMatchedWithDiffSlug++;
    issues.push({
      id: q.id,
      title: q.title,
      issue: 'INVALID_SLUG_TITLE_MATCHED',
      currentUrl: url,
      suggestedUrl: realByExactTitle.url,
      suggestedSlug: realByExactTitle.slug
    });
  } else {
    invalidOrSynthetic++;
    issues.push({
      id: q.id,
      title: q.title,
      issue: 'UNKNOWN_OR_SYNTHETIC',
      currentUrl: url
    });
  }
});

console.log('\n--- SLUG & LINK AUDIT SUMMARY ---');
console.log(`Total questions in sheet: ${questions.length}`);
console.log(`Valid exact slug matches in official LeetCode database: ${validSlugMatches}`);
console.log(`Title matched official LC problem but URL slug was wrong/outdated: ${titleMatchedWithDiffSlug}`);
console.log(`Search URLs: ${searchUrls}`);
console.log(`Unknown/Synthetic or title not matched: ${invalidOrSynthetic}`);
console.log(`Total issue count: ${issues.length}`);

// Page 1 & 2 check (IDs 1-100)
const page1_2_issues = issues.filter(i => i.id <= 100);
console.log(`Issues in locked Page 1 & 2 (IDs 1-100): ${page1_2_issues.length}`);

fs.writeFileSync(path.join(__dirname, '../data/deep_url_audit.json'), JSON.stringify({
  summary: {
    total: questions.length,
    validSlugMatches,
    titleMatchedWithDiffSlug,
    searchUrls,
    invalidOrSynthetic,
    totalIssues: issues.length,
    page1_2_issuesCount: page1_2_issues.length
  },
  page1_2_issues,
  allIssues: issues
}, null, 2), 'utf8');
