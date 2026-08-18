const fs = require('fs');
const path = require('path');

console.log('--- GENERATING HIGH-PERFORMANCE DATASETS (100/100 SCORE) ---');

const questionsPath = path.join(__dirname, '../data/questions.js');
const rawJs = fs.readFileSync(questionsPath, 'utf8');

const problemsMatch = rawJs.match(/const PROBLEMS = (\[[\s\S]*\]);/);
let problems;
if (problemsMatch) {
  try {
    problems = JSON.parse(problemsMatch[1]);
  } catch (e) {
    const vm = require('vm');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(rawJs, sandbox);
    problems = sandbox.PROBLEMS;
  }
}

if (problems) {
  // 1. Full minified dataset questions.min.js
  const minifiedJs = `const PROBLEMS=${JSON.stringify(problems)};`;
  const minJsPath = path.join(__dirname, '../data/questions.min.js');
  fs.writeFileSync(minJsPath, minifiedJs, 'utf8');
  console.log(`✓ questions.min.js generated (${(fs.statSync(minJsPath).size / 1024 / 1024).toFixed(2)} MB)`);

  // 2. High-speed Index dataset questions_index.min.js (~120 KB for fast mobile parse time)
  const indexArray = problems.map(p => ({
    i: p.id,
    t: p.title,
    d: p.difficulty,
    tp: p.topic,
    p: p.pattern,
    u: p.canonicalUrl || p.leetcode_url || p.leetcodeUrl || '',
    s: p.stageName || p.stage || ''
  }));

  const indexJs = `const PROBLEMS_INDEX=${JSON.stringify(indexArray)};if(typeof window!=='undefined'&&!window.PROBLEMS)window.PROBLEMS=PROBLEMS_INDEX;`;
  const indexJsPath = path.join(__dirname, '../data/questions_index.min.js');
  fs.writeFileSync(indexJsPath, indexJs, 'utf8');
  console.log(`✓ questions_index.min.js generated (${(fs.statSync(indexJsPath).size / 1024).toFixed(1)} KB)`);

  // 3. API endpoint questions.json for Agentic Browsing
  const jsonPath = path.join(__dirname, '../data/questions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(problems, null, 2), 'utf8');
  console.log(`✓ questions.json API generated (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

// 4. Minify guide_data.js
const guidePath = path.join(__dirname, '../data/guide_data.js');
const rawGuide = fs.readFileSync(guidePath, 'utf8');
const guideMatch = rawGuide.match(/const GUIDE_TOPICS = (\[[\s\S]*\]);/);
let guideTopics;
if (guideMatch) {
  try {
    guideTopics = JSON.parse(guideMatch[1]);
  } catch (e) {
    const vm = require('vm');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(rawGuide, sandbox);
    guideTopics = sandbox.GUIDE_TOPICS;
  }
}

if (guideTopics) {
  const minifiedGuideJs = `const GUIDE_TOPICS=${JSON.stringify(guideTopics)};`;
  const minGuideJsPath = path.join(__dirname, '../data/guide_data.min.js');
  fs.writeFileSync(minGuideJsPath, minifiedGuideJs, 'utf8');
  console.log(`✓ guide_data.min.js generated (${(fs.statSync(minGuideJsPath).size / 1024).toFixed(1)} KB)`);
}

console.log('--- ALL DATASETS GENERATED SUCCESSFULLY ---');
