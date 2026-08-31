const fs = require('fs');
const path = require('path');

console.log("=== REORDERING 1,000 PROBLEMS INTO 20 PROGRESSIVE & BALANCED MODULES ===");

const questionsJsPath = path.join(__dirname, '../data/questions.js');
const PROBLEMS = require(questionsJsPath);

console.log("Original problem count: " + PROBLEMS.length);

const easyPool = PROBLEMS.filter(p => p.difficulty === "Easy");
const medPool = PROBLEMS.filter(p => p.difficulty === "Medium");
const hardPool = PROBLEMS.filter(p => p.difficulty === "Hard");

console.log("Easy: " + easyPool.length + " | Medium: " + medPool.length + " | Hard: " + hardPool.length);

const STAGES_CONFIG = [
  { page: 1, name: "Arrays & Hashing Foundations", topics: ["Arrays", "Hashing", "Prefix Sum"], fallbackEasy: ["Arrays", "Strings"] },
  { page: 2, name: "Two Pointers & Sliding Window", topics: ["Two Pointers", "Sliding Window"], fallbackEasy: ["Two Pointers", "Arrays", "Strings"] },
  { page: 3, name: "Strings & Character Manipulation", topics: ["Strings", "Simulation"], fallbackEasy: ["Strings", "Arrays"] },
  { page: 4, name: "Prefix Sum & Sorting Techniques", topics: ["Prefix Sum", "Sort"], fallbackEasy: ["Sort", "Prefix Sum", "Arrays"] },
  { page: 5, name: "Stack & Queue Systems", topics: ["Stack", "Queue"], fallbackEasy: ["Stack", "Queue", "Strings"] },
  { page: 6, name: "Linked Lists & Fast-Slow Pointers", topics: ["Linked List", "Two Pointers"], fallbackEasy: ["Two Pointers", "Arrays", "Strings"] },
  { page: 7, name: "Binary Search & Search on Answer", topics: ["Binary Search"], fallbackEasy: ["Binary Search", "Arrays", "Math"] },
  { page: 8, name: "Binary Trees & Tree Traversals", topics: ["Trees"], fallbackEasy: ["Trees"] },
  { page: 9, name: "Binary Search Trees (BST) & Trie", topics: ["BST", "Trie"], fallbackEasy: ["BST", "Trees", "Trie"] },
  { page: 10, name: "Heaps & Priority Queues", topics: ["Heap", "Sort"], fallbackEasy: ["Heap", "Sort", "Arrays"] },
  { page: 11, name: "Recursion & Backtracking", topics: ["Backtracking"], fallbackEasy: ["Trees", "Math", "Arrays"] },
  { page: 12, name: "Graph Traversal (BFS & DFS)", topics: ["BFS", "Graphs"], fallbackEasy: ["Trees", "Geometry", "Arrays"] },
  { page: 13, name: "Advanced Graphs & Topological Sort", topics: ["Graphs"], fallbackEasy: ["Trees", "Geometry", "Arrays"] },
  { page: 14, name: "Disjoint Set Union (DSU)", topics: ["Union Find", "Graphs"], fallbackEasy: ["Trees", "Geometry", "Arrays"] },
  { page: 15, name: "Greedy Algorithms & Intervals", topics: ["Greedy", "Arrays", "Sort"], fallbackEasy: ["Greedy", "Sort", "Arrays"] },
  { page: 16, name: "1D Dynamic Programming Foundations", topics: ["Dynamic Programming", "Math"], fallbackEasy: ["Dynamic Programming", "Math", "Arrays"] },
  { page: 17, name: "2D & Grid Dynamic Programming", topics: ["Dynamic Programming", "Arrays"], fallbackEasy: ["Geometry", "Arrays", "Strings"] },
  { page: 18, name: "Advanced DP & State Compression", topics: ["Dynamic Programming", "Bit Manipulation"], fallbackEasy: ["Bit Manipulation", "Strings", "Math"] },
  { page: 19, name: "Bit Manipulation, Math & Geometry", topics: ["Bit Manipulation", "Math", "Geometry"], fallbackEasy: ["Bit Manipulation", "Math", "Geometry"] },
  { page: 20, name: "Segment Trees & Advanced Structures", topics: ["Segment Tree", "Simulation"], fallbackEasy: ["Simulation", "Geometry", "Strings"] }
];

function pickFromPool(pool, targetTopics, fallbackTopics, neededCount) {
  const picked = [];
  for (let i = 0; i < pool.length && picked.length < neededCount; i++) {
    if (pool[i] && targetTopics.includes(pool[i].topic)) {
      picked.push(pool[i]);
      pool[i] = null;
    }
  }
  if (picked.length < neededCount && fallbackTopics && fallbackTopics.length) {
    for (let i = 0; i < pool.length && picked.length < neededCount; i++) {
      if (pool[i] && fallbackTopics.includes(pool[i].topic)) {
        picked.push(pool[i]);
        pool[i] = null;
      }
    }
  }
  if (picked.length < neededCount) {
    for (let i = 0; i < pool.length && picked.length < neededCount; i++) {
      if (pool[i]) {
        picked.push(pool[i]);
        pool[i] = null;
      }
    }
  }
  const remaining = pool.filter(Boolean);
  pool.length = 0;
  pool.push(...remaining);
  return picked;
}

const reorderedList = [];
let globalSequenceId = 1;

for (let p = 0; p < 20; p++) {
  const stage = STAGES_CONFIG[p];
  const pageNum = p + 1;
  const easyItems = pickFromPool(easyPool, stage.topics, stage.fallbackEasy, 10);
  const medItems = pickFromPool(medPool, stage.topics, stage.topics, 25);
  const hardItems = pickFromPool(hardPool, stage.topics, stage.topics, 15);
  const stageProblems = [...easyItems, ...medItems, ...hardItems];

  stageProblems.forEach((prob) => {
    const newId = globalSequenceId++;
    prob.id = newId;
    prob.number = newId;
    prob.sequence_number = newId;
    prob.curriculumStage = "Stage " + pageNum + " — " + stage.name;
    prob.stage = stage.name;
    prob.roadmapPhase = "Stage " + pageNum + " — " + stage.name;
    prob.phase = "Stage " + pageNum + " — " + stage.name;
    reorderedList.push(prob);
  });
}

console.log("Reordered count: " + reorderedList.length);

if (reorderedList.length !== 1000) {
  console.error("Expected 1000, got " + reorderedList.length);
  process.exit(1);
}

for (let p = 0; p < 20; p++) {
  const slice = reorderedList.slice(p * 50, (p + 1) * 50);
  const easyCount = slice.filter(x => x.difficulty === "Easy").length;
  const medCount = slice.filter(x => x.difficulty === "Medium").length;
  const hardCount = slice.filter(x => x.difficulty === "Hard").length;
  console.log("✓ Page " + (p + 1) + " (" + STAGES_CONFIG[p].name + "): 50 Problems [Easy: " + easyCount + ", Medium: " + medCount + ", Hard: " + hardCount + "]");
}

const fileContent = "const PROBLEMS = " + JSON.stringify(reorderedList, null, 2) + ";\n\nif (typeof module !== \"undefined\" && module.exports) {\n  module.exports = PROBLEMS;\n}\n\nif (typeof window !== \"undefined\") {\n  window.PROBLEMS = PROBLEMS;\n}\n";
fs.writeFileSync(questionsJsPath, fileContent, "utf8");

console.log("✓ Successfully wrote reordered dataset to data/questions.js!");
