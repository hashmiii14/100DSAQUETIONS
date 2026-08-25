// ── Data ─────────────────────────────────────────────────────────────────────

const TOPICS = [
  {
    id: "arrays",
    name: "1. Arrays",
    icon: "🔢",
    color: "#6c63ff",
    questions: [
      { num: 1,  name: "Two Sum",                              diff: "Easy",   url: "https://leetcode.com/problems/two-sum/" },
      { num: 2,  name: "Best Time to Buy and Sell Stock",      diff: "Easy",   url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { num: 3,  name: "Contains Duplicate",                   diff: "Easy",   url: "https://leetcode.com/problems/contains-duplicate/" },
      { num: 4,  name: "Maximum Subarray",                     diff: "Easy",   url: "https://leetcode.com/problems/maximum-subarray/" },
      { num: 5,  name: "Plus One",                             diff: "Easy",   url: "https://leetcode.com/problems/plus-one/" },
      { num: 6,  name: "Remove Duplicates from Sorted Array",  diff: "Easy",   url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
      { num: 7,  name: "Remove Element",                       diff: "Easy",   url: "https://leetcode.com/problems/remove-element/" },
      { num: 8,  name: "Merge Sorted Array",                   diff: "Easy",   url: "https://leetcode.com/problems/merge-sorted-array/" },
      { num: 9,  name: "Intersection of Two Arrays",           diff: "Easy",   url: "https://leetcode.com/problems/intersection-of-two-arrays/" },
      { num: 10, name: "Move Zeroes",                          diff: "Easy",   url: "https://leetcode.com/problems/move-zeroes/" },
      { num: 11, name: "Majority Element",                     diff: "Easy",   url: "https://leetcode.com/problems/majority-element/" },
      { num: 12, name: "Missing Number",                       diff: "Easy",   url: "https://leetcode.com/problems/missing-number/" },
      { num: 13, name: "Single Number",                        diff: "Easy",   url: "https://leetcode.com/problems/single-number/" },
      { num: 14, name: "Find Pivot Index",                     diff: "Easy",   url: "https://leetcode.com/problems/find-pivot-index/" },
      { num: 15, name: "Running Sum of 1d Array",              diff: "Easy",   url: "https://leetcode.com/problems/running-sum-of-1d-array/" },
      { num: 16, name: "Merge Intervals",                      diff: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
      { num: 17, name: "3Sum",                                 diff: "Medium", url: "https://leetcode.com/problems/3sum/" },
      { num: 18, name: "Product of Array Except Self",         diff: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
      { num: 19, name: "Maximum Product Subarray",             diff: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/" },
      { num: 20, name: "Subarray Sum Equals K",                diff: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { num: 21, name: "Container With Most Water",            diff: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
      { num: 22, name: "Sliding Window Median",                diff: "Hard",   url: "https://leetcode.com/problems/sliding-window-median/" },
      { num: 23, name: "Trapping Rain Water",                  diff: "Hard",   url: "https://leetcode.com/problems/trapping-rain-water/" },
      { num: 24, name: "First Missing Positive",               diff: "Hard",   url: "https://leetcode.com/problems/first-missing-positive/" },
      { num: 25, name: "Median of Two Sorted Arrays",          diff: "Hard",   url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    ],
  },
  {
    id: "strings",
    name: "2. Strings",
    icon: "📝",
    color: "#06b6d4",
    questions: [
      { num: 26, name: "Valid Anagram",                               diff: "Easy",   url: "https://leetcode.com/problems/valid-anagram/" },
      { num: 27, name: "Valid Palindrome",                            diff: "Easy",   url: "https://leetcode.com/problems/valid-palindrome/" },
      { num: 28, name: "Longest Common Prefix",                       diff: "Easy",   url: "https://leetcode.com/problems/longest-common-prefix/" },
      { num: 29, name: "Roman to Integer",                            diff: "Easy",   url: "https://leetcode.com/problems/roman-to-integer/" },
      { num: 30, name: "Length of Last Word",                         diff: "Easy",   url: "https://leetcode.com/problems/length-of-last-word/" },
      { num: 31, name: "Reverse String",                              diff: "Easy",   url: "https://leetcode.com/problems/reverse-string/" },
      { num: 32, name: "Is Subsequence",                              diff: "Easy",   url: "https://leetcode.com/problems/is-subsequence/" },
      { num: 33, name: "First Unique Character in a String",          diff: "Easy",   url: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
      { num: 34, name: "Longest Substring Without Repeating Characters", diff: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { num: 35, name: "Group Anagrams",                              diff: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
      { num: 36, name: "Longest Palindromic Substring",               diff: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { num: 37, name: "String to Integer (atoi)",                    diff: "Medium", url: "https://leetcode.com/problems/string-to-integer-atoi/" },
      { num: 38, name: "Minimum Window Substring",                    diff: "Hard",   url: "https://leetcode.com/problems/minimum-window-substring/" },
      { num: 39, name: "Regular Expression Matching",                 diff: "Hard",   url: "https://leetcode.com/problems/regular-expression-matching/" },
      { num: 40, name: "Wildcard Matching",                           diff: "Hard",   url: "https://leetcode.com/problems/wildcard-matching/" },
    ],
  },
  {
    id: "linked-list",
    name: "3. Linked List",
    icon: "🔗",
    color: "#10b981",
    questions: [
      { num: 41, name: "Reverse Linked List",                  diff: "Easy",   url: "https://leetcode.com/problems/reverse-linked-list/" },
      { num: 42, name: "Merge Two Sorted Lists",               diff: "Easy",   url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { num: 43, name: "Linked List Cycle",                    diff: "Easy",   url: "https://leetcode.com/problems/linked-list-cycle/" },
      { num: 44, name: "Middle of the Linked List",            diff: "Easy",   url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { num: 45, name: "Remove Linked List Elements",          diff: "Easy",   url: "https://leetcode.com/problems/remove-linked-list-elements/" },
      { num: 46, name: "Palindrome Linked List",               diff: "Easy",   url: "https://leetcode.com/problems/palindrome-linked-list/" },
      { num: 47, name: "Intersection of Two Linked Lists",     diff: "Easy",   url: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
      { num: 48, name: "Remove Duplicates from Sorted List",   diff: "Easy",   url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/" },
      { num: 49, name: "Remove Nth Node From End of List",     diff: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { num: 50, name: "Add Two Numbers",                      diff: "Medium", url: "https://leetcode.com/problems/add-two-numbers/" },
      { num: 51, name: "Reorder List",                         diff: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
      { num: 52, name: "Copy List with Random Pointer",        diff: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
      { num: 53, name: "Reverse Nodes in k-Group",             diff: "Hard",   url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
      { num: 54, name: "Merge k Sorted Lists",                 diff: "Hard",   url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { num: 55, name: "LRU Cache",                            diff: "Hard",   url: "https://leetcode.com/problems/lru-cache/" },
    ],
  },
  {
    id: "stack-queue",
    name: "4. Stack / Queue",
    icon: "📚",
    color: "#f59e0b",
    questions: [
      { num: 56, name: "Implement Queue using Stacks",          diff: "Easy",   url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
      { num: 57, name: "Implement Stack using Queues",          diff: "Easy",   url: "https://leetcode.com/problems/implement-stack-using-queues/" },
      { num: 58, name: "Next Greater Element I",                diff: "Easy",   url: "https://leetcode.com/problems/next-greater-element-i/" },
      { num: 59, name: "Baseball Game",                         diff: "Easy",   url: "https://leetcode.com/problems/baseball-game/" },
      { num: 60, name: "Backspace String Compare",              diff: "Easy",   url: "https://leetcode.com/problems/backspace-string-compare/" },
      { num: 61, name: "Valid Parentheses",                     diff: "Easy",   url: "https://leetcode.com/problems/valid-parentheses/" },
      { num: 62, name: "Min Stack",                             diff: "Medium", url: "https://leetcode.com/problems/min-stack/" },
      { num: 63, name: "Evaluate Reverse Polish Notation",      diff: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
      { num: 64, name: "Daily Temperatures",                    diff: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
      { num: 65, name: "Simplify Path",                         diff: "Medium", url: "https://leetcode.com/problems/simplify-path/" },
      { num: 66, name: "Asteroid Collision",                    diff: "Hard",   url: "https://leetcode.com/problems/asteroid-collision/" },
      { num: 67, name: "Largest Rectangle in Histogram",        diff: "Hard",   url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      { num: 68, name: "Sliding Window Maximum",                diff: "Hard",   url: "https://leetcode.com/problems/sliding-window-maximum/" },
    ],
  },
  {
    id: "trees",
    name: "5. Trees",
    icon: "🌳",
    color: "#22c55e",
    questions: [
      { num: 69, name: "Maximum Depth of Binary Tree",           diff: "Easy",   url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { num: 70, name: "Same Tree",                              diff: "Easy",   url: "https://leetcode.com/problems/same-tree/" },
      { num: 71, name: "Invert Binary Tree",                     diff: "Easy",   url: "https://leetcode.com/problems/invert-binary-tree/" },
      { num: 72, name: "Symmetric Tree",                         diff: "Easy",   url: "https://leetcode.com/problems/symmetric-tree/" },
      { num: 73, name: "Binary Tree Inorder Traversal",          diff: "Easy",   url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
      { num: 74, name: "Binary Tree Preorder Traversal",         diff: "Easy",   url: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
      { num: 75, name: "Binary Tree Postorder Traversal",        diff: "Easy",   url: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
      { num: 76, name: "Search in a Binary Search Tree",         diff: "Easy",   url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
      { num: 77, name: "Binary Tree Level Order Traversal",      diff: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { num: 78, name: "Validate Binary Search Tree",            diff: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { num: 79, name: "Lowest Common Ancestor of a Binary Tree",diff: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { num: 80, name: "Kth Smallest Element in a BST",          diff: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { num: 81, name: "Binary Tree Maximum Path Sum",           diff: "Hard",   url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { num: 82, name: "Serialize and Deserialize Binary Tree",  diff: "Hard",   url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    ],
  },
  {
    id: "graphs",
    name: "6. Graphs",
    icon: "🕸️",
    color: "#a78bfa",
    questions: [
      { num: 83, name: "Find if Path Exists in Graph",    diff: "Easy",   url: "https://leetcode.com/problems/find-if-path-exists-in-graph/" },
      { num: 84, name: "Flood Fill",                      diff: "Easy",   url: "https://leetcode.com/problems/flood-fill/" },
      { num: 85, name: "Number of Islands",               diff: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
      { num: 86, name: "Clone Graph",                     diff: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
      { num: 87, name: "Rotting Oranges",                 diff: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
      { num: 88, name: "Course Schedule",                 diff: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
      { num: 89, name: "Pacific Atlantic Water Flow",     diff: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
      { num: 90, name: "Word Ladder",                     diff: "Hard",   url: "https://leetcode.com/problems/word-ladder/" },
      { num: 91, name: "Alien Dictionary",                diff: "Hard",   url: "https://leetcode.com/problems/alien-dictionary/" },
      { num: 92, name: "Reconstruct Itinerary",           diff: "Hard",   url: "https://leetcode.com/problems/reconstruct-itinerary/" },
    ],
  },
  {
    id: "dp",
    name: "7. Dynamic Programming",
    icon: "⚡",
    color: "#f43f5e",
    questions: [
      { num: 93,  name: "Climbing Stairs",                diff: "Easy",   url: "https://leetcode.com/problems/climbing-stairs/" },
      { num: 94,  name: "Min Cost Climbing Stairs",       diff: "Easy",   url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
      { num: 95,  name: "House Robber",                   diff: "Easy",   url: "https://leetcode.com/problems/house-robber/" },
      { num: 96,  name: "Coin Change",                    diff: "Medium", url: "https://leetcode.com/problems/coin-change/" },
      { num: 97,  name: "Longest Increasing Subsequence", diff: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { num: 98,  name: "Partition Equal Subset Sum",     diff: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { num: 99,  name: "Edit Distance",                  diff: "Hard",   url: "https://leetcode.com/problems/edit-distance/" },
      { num: 100, name: "Burst Balloons",                 diff: "Hard",   url: "https://leetcode.com/problems/burst-balloons/" },
    ],
  },
];

// ── State ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "dsa100_done";

function loadDone() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch { return new Set(); }
}

function saveDone(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

let done = loadDone();

// ── Render ────────────────────────────────────────────────────────────────────

function externalIcon() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`;
}

function renderTopic(topic) {
  const solvedCount = topic.questions.filter(q => done.has(q.num)).length;

  const rows = topic.questions.map(q => {
    const isDone = done.has(q.num);
    return `
      <tr class="${isDone ? "done-row" : ""}" data-num="${q.num}">
        <td class="col-num">${q.num}</td>
        <td>
          <a class="q-link" href="${q.url}" target="_blank" rel="noopener noreferrer">
            ${q.name} ${externalIcon()}
          </a>
        </td>
        <td>
          <span class="diff-badge ${q.diff.toLowerCase()}">${q.diff}</span>
        </td>
        <td class="col-done">
          <input type="checkbox" class="done-checkbox" data-num="${q.num}" ${isDone ? "checked" : ""} title="Mark as done" />
        </td>
      </tr>`;
  }).join("");

  return `
    <section class="topic-section" id="${topic.id}">
      <div class="topic-header">
        <div class="topic-icon" style="background: ${topic.color}18;">${topic.icon}</div>
        <h2 class="topic-title">${topic.name}</h2>
        <span class="topic-count">${topic.questions.length} problems</span>
        <span class="topic-progress-mini" id="mini-${topic.id}">${solvedCount}/${topic.questions.length}</span>
      </div>
      <table class="q-table">
        <thead>
          <tr>
            <th>#</th>
            <th>LeetCode Problem</th>
            <th>Difficulty</th>
            <th>Done</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

function render() {
  const root = document.getElementById("questions-root");
  root.innerHTML = TOPICS.map(renderTopic).join("");
  updateProgress();
  attachListeners();
}

function updateProgress() {
  const total   = 100;
  const solved  = done.size;
  const pct     = (solved / total) * 100;

  document.getElementById("progress-text").textContent = `${solved} / ${total} solved`;
  document.getElementById("progress-bar").style.width  = pct + "%";

  // Update per-topic mini counters
  TOPICS.forEach(topic => {
    const el = document.getElementById(`mini-${topic.id}`);
    if (!el) return;
    const s = topic.questions.filter(q => done.has(q.num)).length;
    el.textContent = `${s}/${topic.questions.length}`;
  });
}

function attachListeners() {
  document.querySelectorAll(".done-checkbox").forEach(cb => {
    cb.addEventListener("change", e => {
      const num = parseInt(e.target.dataset.num, 10);
      const row = e.target.closest("tr");
      if (e.target.checked) {
        done.add(num);
        row.classList.add("done-row");
      } else {
        done.delete(num);
        row.classList.remove("done-row");
      }
      saveDone(done);
      updateProgress();
    });
  });
}

// Reset button
document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Reset all progress? This cannot be undone.")) return;
  done.clear();
  saveDone(done);
  render();
});

// ── Boot ──────────────────────────────────────────────────────────────────────
render();
