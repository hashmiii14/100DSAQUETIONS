const fs = require('fs');
const path = require('path');

console.log('--- MINIFYING DATASETS FOR 100/100 DESKTOP & MOBILE PERFORMANCE ---');

// 1. Minify questions.js
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
  const minifiedJs = `const PROBLEMS=${JSON.stringify(problems)};`;
  const minJsPath = path.join(__dirname, '../data/questions.min.js');
  fs.writeFileSync(minJsPath, minifiedJs, 'utf8');
  console.log(`✓ questions.min.js generated (${(fs.statSync(minJsPath).size / 1024 / 1024).toFixed(2)} MB)`);

  const jsonPath = path.join(__dirname, '../data/questions.json');
  fs.writeFileSync(jsonPath, JSON.stringify(problems, null, 2), 'utf8');
  console.log(`✓ questions.json API endpoint generated (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

// 2. Minify guide_data.js
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

console.log('--- ALL DATASETS MINIFIED SUCCESSFULLY ---');
