const fs = require('fs');
const path = require('path');

console.log('--- MINIFYING DATASET FOR 100/100 MOBILE PERFORMANCE ---');

const questionsPath = path.join(__dirname, '../data/questions.js');
const rawJs = fs.readFileSync(questionsPath, 'utf8');

const problemsMatch = rawJs.match(/const PROBLEMS = (\[[\s\S]*\]);/);
if (!problemsMatch) {
  console.error('Failed to parse PROBLEMS array');
  process.exit(1);
}

let problems;
try {
  problems = JSON.parse(problemsMatch[1]);
} catch (e) {
  const vm = require('vm');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(rawJs, sandbox);
  problems = sandbox.PROBLEMS;
}

console.log(`Loaded ${problems.length} problems from dataset.`);

// Output 1: Minified questions.min.js
const minifiedJs = `const PROBLEMS=${JSON.stringify(problems)};`;
const minJsPath = path.join(__dirname, '../data/questions.min.js');
fs.writeFileSync(minJsPath, minifiedJs, 'utf8');
const originalSize = fs.statSync(questionsPath).size;
const minifiedSize = fs.statSync(minJsPath).size;
console.log(`questions.js original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`questions.min.js minified size: ${(minifiedSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Saved ${(100 - (minifiedSize / originalSize) * 100).toFixed(1)}% file size!`);

// Output 2: Clean API endpoint questions.json for Agentic Browsing
const jsonPath = path.join(__dirname, '../data/questions.json');
fs.writeFileSync(jsonPath, JSON.stringify(problems, null, 2), 'utf8');
console.log(`Generated /data/questions.json API endpoint (${(fs.statSync(jsonPath).size / 1024 / 1024).toFixed(2)} MB)`);

console.log('--- DATASET MINIFICATION COMPLETE ---');
