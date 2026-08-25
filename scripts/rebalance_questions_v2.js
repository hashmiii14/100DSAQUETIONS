const fs = require('fs');
const path = require('path');

console.log("=== REBALANCING & EXPANDING UNDERREPRESENTED TOPICS (Q101 - Q1000) ===");

// 1. Load locked Page 1 & 2
const lockedSnapshot = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/page1_2_locked_snapshot.json'), 'utf8'));

// 2. Load questions dataset
const questions = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/questions.json'), 'utf8'));

// 3. Load real LeetCode database (3,240 verified real LeetCode problems)
const realLeetcode = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/leetcode_real_problems.json'), 'utf8'));

// Map real LeetCode problems by slug & title
const realBySlug = new Map();
const realByTitleNorm = new Map();
realLeetcode.forEach(p => {
  realBySlug.set(p.slug.toLowerCase(), p);
  const normTitle = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  realByTitleNorm.set(normTitle, p);
});

// Category refinement rules for Arrays questions in Q101-Q1000
function getRefinedTopic(p) {
  const t = (p.title || '').toLowerCase();
  const pat = (p.pattern || '').toLowerCase();
  const currTopic = p.topic || '';

  if (currTopic !== 'Arrays') return currTopic;

  // Bit Manipulation
  if (t.includes('bit') || t.includes('xor') || t.includes('and') || pat.includes('bit') || t.includes('single number') || t.includes('counting bits')) return 'Bit Manipulation';
  
  // Queue
  if (t.includes('queue') || pat.includes('queue') || t.includes('recent') || t.includes('circular') || t.includes('senate') || t.includes('task')) return 'Queue';
  
  // BFS
  if (t.includes('bfs') || t.includes('level order') || t.includes('rotting') || t.includes('shortest path') || t.includes('word ladder') || t.includes('matrix') && pat.includes('bfs')) return 'BFS';
  
  // Simulation
  if (t.includes('spiral') || t.includes('robot') || t.includes('simulation') || t.includes('game of life') || t.includes('asteroid') || t.includes('parking') || t.includes('baseball')) return 'Simulation';
  
  // Segment Tree
  if (t.includes('segment tree') || t.includes('fenwick') || t.includes('range sum') || pat.includes('segment') || t.includes('mutable') || t.includes('range minimum')) return 'Segment Tree';
  
  // Trie
  if (t.includes('trie') || t.includes('prefix tree') || pat.includes('trie') || t.includes('replace words') || t.includes('autocomplete')) return 'Trie';
  
  // Geometry
  if (t.includes('rectangle') || t.includes('point') || t.includes('geometry') || t.includes('area') || t.includes('circle') || t.includes('triangle') || t.includes('convex')) return 'Geometry';
  
  // Linked List
  if (t.includes('list') || t.includes('node') || pat.includes('linked list')) return 'Linked List';
  
  // Math
  if (t.includes('math') || t.includes('prime') || t.includes('gcd') || t.includes('pow') || t.includes('sqrt') || t.includes('factorial') || t.includes('digit') || t.includes('roman')) return 'Math';
  
  // Sort
  if (t.includes('sort') || pat.includes('sort') || t.includes('interval') || t.includes('h-index')) return 'Sort';
  
  // Hashing
  if (t.includes('hash') || t.includes('anagram') || t.includes('frequency') || t.includes('map') || t.includes('set')) return 'Hashing';
  
  // Heap
  if (t.includes('heap') || t.includes('priority') || t.includes('kth largest') || t.includes('top k') || t.includes('median stream')) return 'Heap';
  
  // Sliding Window
  if (t.includes('sliding window') || pat.includes('sliding window') || t.includes('longest substring') || t.includes('at most')) return 'Sliding Window';
  
  // Prefix Sum
  if (t.includes('prefix sum') || pat.includes('prefix sum') || t.includes('subarray sum equals') || t.includes('continuous array')) return 'Prefix Sum';

  return currTopic;
}

// Perform refinement
questions.forEach((p, idx) => {
  if (idx >= 100) {
    p.topic = getRefinedTopic(p);
  }
});

// Calculate updated topic counts
const topicCounts = {};
questions.forEach(p => {
  const t = p.topic || 'Unknown';
  topicCounts[t] = (topicCounts[t] || 0) + 1;
});

console.log('Rebalanced Topic Counts:');
Object.entries(topicCounts).sort((a,b) => b[1] - a[1]).forEach(([t, c]) => {
  console.log('  ' + t.padEnd(25) + ': ' + c);
});

// Update data files
fs.writeFileSync(path.join(__dirname, '../data/questions.json'), JSON.stringify(questions, null, 2), 'utf8');

const jsContent = `const PROBLEMS = ${JSON.stringify(questions, null, 2)};\nif (typeof window !== 'undefined') window.PROBLEMS = PROBLEMS;\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n`;
fs.writeFileSync(path.join(__dirname, '../data/questions.js'), jsContent, 'utf8');

console.log("✓ Updated data/questions.json and data/questions.js with rebalanced topics.");
