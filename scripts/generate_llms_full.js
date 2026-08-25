const fs = require('fs');
const path = require('path');

const questionsFile = fs.readFileSync(path.join(__dirname, '../data/questions.js'), 'utf8');
const problemsMatch = questionsFile.match(/const PROBLEMS = (\[[\s\S]*\]);/);

if (!problemsMatch) {
  console.error('Failed to parse PROBLEMS array');
  process.exit(1);
}

let problems;
try {
  problems = JSON.parse(problemsMatch[1]);
} catch (e) {
  // If JSON.parse fails due to single quotes or js objects, evaluate safely in sandbox
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(questionsFile, sandbox);
  problems = sandbox.PROBLEMS;
}

let output = `# DSA Problems — 1000 Verified LeetCode Problems & DSA Roadmap (Full Dataset)

https://www.dsaproblems.site/

Total Problems: ${problems.length}
Difficulty Breakdown:
- Easy: ${problems.filter(p => p.difficulty === 'Easy').length}
- Medium: ${problems.filter(p => p.difficulty === 'Medium').length}
- Hard: ${problems.filter(p => p.difficulty === 'Hard').length}

================================================================================
PROBLEMS LIST
================================================================================

`;

problems.forEach((p) => {
  const practiceUrl = p.leetcode_url || `https://leetcode.com/problems/${p.slug || ''}/`;
  output += `#${p.id} | ${p.title} | ${p.difficulty} | ${p.topic} | ${p.pattern} | ${practiceUrl}\n`;
});

fs.writeFileSync(path.join(__dirname, '../llms-full.txt'), output, 'utf8');
console.log(`Successfully generated llms-full.txt with ${problems.length} problems.`);
