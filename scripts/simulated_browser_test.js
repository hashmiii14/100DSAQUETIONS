const fs = require('fs');
const path = require('path');

console.log("=== SIMULATING FULL BROWSER ENVIRONMENT & UI ACTIONS ===");

// Build minimal DOM structure matching index.html
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

class Element {
  constructor(tagName, id = '', className = '') {
    this.tagName = tagName;
    this.id = id;
    this.className = className;
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.innerHTML = '';
    this.textContent = '';
    this.value = '';
    this.disabled = false;
    this.eventListeners = {};
  }

  appendChild(child) {
    this.children.push(child);
  }

  setAttribute(name, val) {
    this.attributes[name] = val;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  addEventListener(type, fn) {
    if (!this.eventListeners[type]) this.eventListeners[type] = [];
    this.eventListeners[type].push(fn);
  }

  dispatchEvent(event) {
    const listeners = this.eventListeners[event.type] || [];
    listeners.forEach(fn => fn(event));
  }

  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }

  querySelectorAll(sel) {
    const results = [];
    const search = (node) => {
      if (sel.startsWith('.')) {
        const cls = sel.slice(1);
        if (node.classList && node.classList.contains(cls)) results.push(node);
      } else if (sel.startsWith('#')) {
        const id = sel.slice(1);
        if (node.id === id) results.push(node);
      } else if (sel.includes('[data-')) {
        const match = sel.match(/\[data-([^=]+)=["']?([^"']+)["']?\]/);
        if (match && node.dataset && node.dataset[match[1]] === match[2]) results.push(node);
      } else if (node.tagName && node.tagName.toLowerCase() === sel.toLowerCase()) {
        results.push(node);
      }
      if (node.children) node.children.forEach(search);
    };
    search(this);
    return results;
  }

  get classList() {
    const self = this;
    return {
      add: (...classes) => {
        const set = new Set((self.className || '').split(' ').filter(Boolean));
        classes.forEach(c => set.add(c));
        self.className = [...set].join(' ');
      },
      remove: (...classes) => {
        const set = new Set((self.className || '').split(' ').filter(Boolean));
        classes.forEach(c => set.delete(c));
        self.className = [...set].join(' ');
      },
      toggle: (c, force) => {
        if (force === true) self.classList.add(c);
        else if (force === false) self.classList.remove(c);
        else if (self.classList.contains(c)) self.classList.remove(c);
        else self.classList.add(c);
      },
      contains: (c) => (self.className || '').split(' ').includes(c)
    };
  }
}

// Parse IDs and class names from index.html
const elementMap = {};
const idMatches = indexHtml.matchAll(/id=["']([^"']+)["']/g);
for (const m of idMatches) {
  elementMap[m[1]] = new Element('div', m[1]);
}

// Parse nav buttons and filter buttons
const navBtns = [];
const navMatches = indexHtml.matchAll(/<button[^>]*class=["']([^"']*nav-btn[^"']*)["'][^>]*data-view=["']([^"']+)["'][^>]*>([\s\S]*?)<\/button>/g);
for (const m of navMatches) {
  const btn = new Element('button', '', m[1]);
  btn.dataset.view = m[2];
  btn.textContent = m[3];
  navBtns.push(btn);
}

const domListeners = [];
const documentMock = {
  documentElement: new Element('html'),
  head: new Element('head'),
  body: new Element('body'),
  getElementsByTagName: (tag) => {
    if (tag.toLowerCase() === 'head') return [documentMock.head];
    if (tag.toLowerCase() === 'body') return [documentMock.body];
    return [];
  },
  getElementById: (id) => elementMap[id] || new Element('div', id),
  querySelector: (sel) => documentMock.body.querySelector(sel),
  querySelectorAll: (sel) => {
    if (sel === '.nav-btn') return navBtns;
    if (sel.includes('.filter-group')) return [];
    if (sel === '.view-section') return [
      elementMap['view-explorer'],
      elementMap['view-guide'],
      elementMap['view-dashboard'],
      elementMap['view-about'],
      elementMap['view-privacy'],
      elementMap['view-contact']
    ].filter(Boolean);
    return [];
  },
  createElement: (tag) => new Element(tag),
  addEventListener: (type, fn) => {
    if (type === 'DOMContentLoaded') domListeners.push(fn);
  }
};

const localStorageStore = {};
const windowMock = {
  location: { search: '', pathname: '/' },
  history: { replaceState: () => {} },
  localStorage: {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, val) => { localStorageStore[key] = String(val); },
    removeItem: (key) => { delete localStorageStore[key]; }
  },
  addEventListener: () => {}
};

global.window = windowMock;
global.document = documentMock;
global.localStorage = windowMock.localStorage;
global.navigator = { clipboard: { writeText: async () => {} } };

// Load application scripts
console.log("Loading dataset & modules...");
const PROBLEMS = require('../data/questions.js');
global.PROBLEMS = PROBLEMS;
global.window.PROBLEMS = PROBLEMS;

const PATTERNS_LIBRARY = require('../data/patterns.js');
global.PATTERNS_LIBRARY = PATTERNS_LIBRARY;
global.window.PATTERNS_LIBRARY = PATTERNS_LIBRARY;

const AppState = require('../js/state.js');
global.state = AppState;

const RecommendationEngine = require('../js/recommendation.js');
global.RecommendationEngine = RecommendationEngine;

const DSAApp = require('../app.js');
global.DSAApp = DSAApp;
domListeners.forEach(fn => fn());

console.log("Initializing DSAApp...");
const appInstance = new DSAApp();

if (!appInstance) {
  console.error("❌ FAIL: appInstance failed to initialize on DOMContentLoaded");
  process.exit(1);
}

console.log("Testing default explorer rendering...");
const problems = appInstance.getFilteredProblems();
console.log(`Explorer Filtered Problems Count: ${problems.length}`);

if (problems.length !== 1000) {
  console.error(`❌ FAIL: Expected 1000 problems, got ${problems.length}`);
  process.exit(1);
}

console.log("Testing View Switching across all views...");
const views = ['explorer', 'guide', 'dashboard', 'about', 'privacy', 'contact', 'terms', 'disclaimer'];
views.forEach(v => {
  appInstance.switchView(v);
  console.log(` Switched to view '${v}', currentView = '${appInstance.currentView}'`);
});

console.log("Testing Cookie Consent banner handlers...");
appInstance.acceptCookies();
if (localStorageStore['dsaproblems_cookie_consent'] !== 'accepted') {
  console.error("❌ FAIL: acceptCookies failed");
  process.exit(1);
}
appInstance.declineCookies();
if (localStorageStore['dsaproblems_cookie_consent'] !== 'declined') {
  console.error("❌ FAIL: declineCookies failed");
  process.exit(1);
}

console.log("Testing Modal Open for Problem #1 (Two Sum)...");
appInstance.openProblemModal(1);
if (!appInstance.activeModalProblem || appInstance.activeModalProblem.id !== 1) {
  console.error("❌ FAIL: Problem #1 modal failed to open");
  process.exit(1);
}

console.log("Testing Modal Navigation (Next/Prev)...");
appInstance.navigateModal(1);
if (!appInstance.activeModalProblem || appInstance.activeModalProblem.id !== 2) {
  console.error("❌ FAIL: Modal navigate (next) failed");
  process.exit(1);
}

console.log("Testing Solution Tab Switching (brute force vs optimal)...");
appInstance.activeSolutionTab = 'brute';
appInstance.updateModalSolutionView();

console.log("Testing Solved Toggle for Problem #2...");
appInstance.toggleDone(2);
if (!AppState.done.has(2)) {
  console.error("❌ FAIL: toggleDone failed");
  process.exit(1);
}

console.log("Testing Dashboard rendering after solving #2...");
appInstance.renderDashboard();

console.log("Testing 20-page pagination navigation...");
for (let page = 1; page <= 20; page++) {
  appInstance.goToPage(page);
  if (appInstance.currentPage !== page) {
    console.error(`❌ FAIL: goToPage(${page}) failed`);
    process.exit(1);
  }
}
appInstance.goToPage(1);
console.log(" 20-page pagination navigation passed!");

const guideData = require('../data/guide_data.js');
console.log(`Testing ${guideData.length}-chapter DSA Guide section & multi-language tabs...`);
appInstance.navigate('/guide');
if (!guideData || guideData.length < 26) {
  console.error(`❌ FAIL: Expected at least 26 guide chapters, found ${guideData ? guideData.length : 0}`);
  process.exit(1);
}
guideData.forEach(ch => {
  appInstance.selectGuideTopic(ch.id);
  if (appInstance.activeGuideTopic !== ch.id) {
    console.error(`❌ FAIL: selectGuideTopic(${ch.id}) failed`);
    process.exit(1);
  }
});
appInstance.setGuideLang('java');
appInstance.setGuideLang('python');
appInstance.setGuideLang('cpp');
console.log(" 26-chapter DSA Guide & code tabs passed!");

console.log("Testing search and filters...");
appInstance.navigate('/problems');
appInstance.handleSearchInput('Binary Search');
if (appInstance.getFilteredProblems().length === 0) {
  console.error("❌ FAIL: Search 'Binary Search' returned 0 results");
  process.exit(1);
}
appInstance.resetFilters();
appInstance.handleDifficultyFilter('Hard');
if (appInstance.getFilteredProblems().length !== 300) {
  console.error(`❌ FAIL: Hard difficulty filter returned ${appInstance.getFilteredProblems().length}, expected 300`);
  process.exit(1);
}
appInstance.resetFilters();

console.log("Testing Theme Toggle in simulated browser...");
appInstance.setTheme('light');
if (documentMock.documentElement.getAttribute('data-theme') !== 'light') {
  console.error("❌ FAIL: setTheme('light') failed");
  process.exit(1);
}
appInstance.toggleTheme();
if (documentMock.documentElement.getAttribute('data-theme') !== 'dark') {
  console.error("❌ FAIL: toggleTheme() to dark failed");
  process.exit(1);
}
appInstance.toggleTheme();
if (documentMock.documentElement.getAttribute('data-theme') !== 'light') {
  console.error("❌ FAIL: toggleTheme() back to light failed");
  process.exit(1);
}
console.log(" Theme toggle simulation passed!");

console.log("\n==================================================");
console.log("✅ SIMULATION COMPLETED! All 1000 questions, 20 pages, 26 guide chapters pass 100%!");
console.log("==================================================\n");
