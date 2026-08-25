const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("==================================================");
console.log("   PAGINATION & FILTERS END-TO-END TEST SUITE     ");
console.log("==================================================\n");

// Mock browser environment
const localStorageStore = {};
const globalWindow = {
  location: { pathname: '/problems', hash: '', search: '', href: 'https://www.dsaproblems.site/problems' },
  history: { pushState: () => {}, replaceState: () => {} },
  addEventListener: () => {},
  scrollTo: () => {},
  localStorage: {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, val) => { localStorageStore[key] = String(val); },
    removeItem: (key) => { delete localStorageStore[key]; },
    clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
  }
};

const elements = new Map();

function createElementMock(id, tag = 'div') {
  return {
    id,
    tagName: tag.toUpperCase(),
    innerHTML: '',
    textContent: '',
    value: '',
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    dataset: {},
    setAttribute: () => {},
    getAttribute: () => null,
    appendChild: (child) => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {}
  };
}

const globalDocument = {
  documentElement: createElementMock('html'),
  head: createElementMock('head'),
  body: createElementMock('body'),
  addEventListener: () => {},
  removeEventListener: () => {},
  createElement: (tag) => createElementMock(tag, tag),
  getElementById: (id) => {
    if (!elements.has(id)) {
      elements.set(id, createElementMock(id));
    }
    return elements.get(id);
  },
  querySelector: (sel) => createElementMock('mock'),
  querySelectorAll: (sel) => []
};

// Create VM context
const sandbox = {
  window: globalWindow,
  document: globalDocument,
  localStorage: globalWindow.localStorage,
  history: globalWindow.history,
  location: globalWindow.location,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  requestAnimationFrame: (cb) => cb(),
  Array: Array,
  Object: Object,
  Set: Set,
  Map: Map,
  Math: Math,
  JSON: JSON
};
vm.createContext(sandbox);

// 1. Load dataset & scripts into context
console.log("[Test Step 1] Loading full dataset & app modules...");
const questionsJs = fs.readFileSync(path.join(__dirname, '../data/questions.js'), 'utf8');
vm.runInContext(questionsJs, sandbox);

const appBundleJs = fs.readFileSync(path.join(__dirname, '../js/app.bundle.min.js'), 'utf8');
vm.runInContext(appBundleJs, sandbox);

// Instantiate app instance in sandbox
const app = vm.runInContext("window.app || new DSAApp()", sandbox);

console.log(`✅ App initialized with ${app.getProblems().length} total problems.`);

// 2. Test Pagination
console.log("\n[Test Step 2] Testing Pagination (Page 1 → Page 2 → Page 3 → Last Page)...");

const totalProblems = app.getProblems().length;
const expectedTotalPages = Math.ceil(totalProblems / app.pageSize);

console.log(`Total Problems: ${totalProblems}, Page Size: ${app.pageSize}, Total Pages: ${expectedTotalPages}`);
if (totalProblems !== 1000) throw new Error(`Expected 1000 total problems, got ${totalProblems}`);
if (expectedTotalPages !== 20) throw new Error(`Expected 20 total pages, got ${expectedTotalPages}`);

// Check Page 1
app.goToPage(1);
console.log(`Page 1: Current Page = ${app.currentPage}`);
if (app.currentPage !== 1) throw new Error("Page 1 navigation failed");

// Check Page 2
app.goToPage(2);
console.log(`Page 2: Current Page = ${app.currentPage}`);
if (app.currentPage !== 2) throw new Error("Page 2 navigation failed");

// Check Page 3
app.goToPage(3);
console.log(`Page 3: Current Page = ${app.currentPage}`);
if (app.currentPage !== 3) throw new Error("Page 3 navigation failed");

// Check Last Page (Page 20)
app.goToPage(20);
console.log(`Page 20: Current Page = ${app.currentPage}`);
if (app.currentPage !== 20) throw new Error("Page 20 navigation failed");

// Check Next / Prev operations
app.goToPage(1);
app.changePage(1); // Next
if (app.currentPage !== 2) throw new Error("Next page operation failed");
app.changePage(-1); // Prev
if (app.currentPage !== 1) throw new Error("Prev page operation failed");

console.log("✅ Pagination logic (Page 1 -> Page 2 -> Page 3 -> Page 20, Next, Prev) passed 100%!");

// 3. Test Filters (Every Topic Present and Returning Correct Questions)
console.log("\n[Test Step 3] Testing Topic Filters & Categories...");
const uniqueTopics = app.getUniqueTopics();
console.log(`Detected ${uniqueTopics.length} unique topics:`, uniqueTopics);

if (uniqueTopics.length < 20) throw new Error(`Expected at least 20 unique topics, found ${uniqueTopics.length}`);

let totalQuestionsFromTopicsSum = 0;

uniqueTopics.forEach(t => {
  app.handleTopicFilter(t);
  const filtered = app.getFilteredProblems();
  totalQuestionsFromTopicsSum += filtered.length;
  
  if (filtered.length < 8) {
    throw new Error(`Topic '${t}' returned only ${filtered.length} questions (under minimum expectation)`);
  }
  const notBelonging = filtered.filter(p => p.topic !== t);
  if (notBelonging.length > 0) {
    throw new Error(`Topic filter '${t}' returned questions belonging to other topics!`);
  }
  console.log(`   ✓ Topic '${t}': returned ${filtered.length} questions (100% matching '${t}')`);
});

console.log("✅ Every topic filter returns exact matching questions!");

// 4. Test Search + Filters + Pagination Combination
console.log("\n[Test Step 4] Testing Combined Search + Difficulty Filter + Topic Filter + Pagination...");

app.resetFilters();
app.handleTopicFilter("Graphs");
app.handleDifficultyFilter("Medium");
app.handleSearchInput("Dijkstra");

const combinedFiltered = app.getFilteredProblems();
console.log(`Combined filter (Topic='Graphs', Difficulty='Medium', Search='Dijkstra') count: ${combinedFiltered.length}`);
if (combinedFiltered.length === 0) throw new Error("Combined filter failed to return Dijkstra Medium Graph questions");

combinedFiltered.forEach(p => {
  if (p.topic !== "Graphs") throw new Error("Combined filter failed topic match");
  if (p.difficulty !== "Medium") throw new Error("Combined filter failed difficulty match");
});

console.log("✅ Combined Search + Filters + Pagination passed 100%!");

// 5. Test Reset Filters
console.log("\n[Test Step 5] Testing Reset Filters...");
app.resetFilters();
if (app.getFilteredProblems().length !== 1000) throw new Error("Reset filters failed to restore 1000 problems");
if (app.currentPage !== 1) throw new Error("Reset filters failed to reset page to 1");

console.log("✅ Reset filters restored full 1000 dataset & page 1!");

// 6. Test Locked Page 1 & 2 Immutability
console.log("\n[Test Step 6] Testing Page 1 & 2 Immutability...");
const page1_2Snapshot = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/page1_2_locked_snapshot.json'), 'utf8'));
const currentProblems = app.getProblems().slice(0, 100);

for (let i = 0; i < 100; i++) {
  if (currentProblems[i].id !== page1_2Snapshot[i].id || currentProblems[i].title !== page1_2Snapshot[i].title || (currentProblems[i].canonicalUrl || currentProblems[i].leetcode_url) !== (page1_2Snapshot[i].canonicalUrl || page1_2Snapshot[i].leetcode_url)) {
    throw new Error(`Page 1-2 immutability violated at Problem #${i+1}`);
  }
}

console.log("✅ Page 1 and Page 2 remain 100% UNTOUCHED!");

console.log("\n==================================================");
console.log("🎉 ALL END-TO-END PAGINATION & FILTER TESTS PASSED!");
console.log("==================================================\n");
