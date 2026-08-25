// ─────────────────────────────────────────────────────────────────────────────
// data.js  —  Single source of truth for all 100 DSA questions
// Matches the PDF exactly: order, topic, difficulty, question names
// ─────────────────────────────────────────────────────────────────────────────

const TOPIC_ORDER = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack / Queue",
  "Trees",
  "Graphs",
  "Dynamic Programming"
];

const TOPIC_IDS = {
  "Arrays":               "arrays",
  "Strings":              "strings",
  "Linked List":          "linked-list",
  "Stack / Queue":        "stack-queue",
  "Trees":                "trees",
  "Graphs":               "graphs",
  "Dynamic Programming":  "dp"
};

const TOPIC_ICONS = {
  "Arrays":               "⟦⟧",
  "Strings":              "\"\"",
  "Linked List":          "◉→",
  "Stack / Queue":        "⧠",
  "Trees":                "⑂",
  "Graphs":               "◌",
  "Dynamic Programming":  "◈"
};

// 100 problems — exact from PDF
// Difficulty labels match the PDF (source of truth)
// LeetCode URLs verified against official leetcode.com/problems/*
const PROBLEMS = [

  // ── ARRAYS ── 15 Easy · 6 Medium · 4 Hard = 25 ──────────────────────────
  { id:  1, topic: "Arrays", title: "Two Sum",                            difficulty: "Easy",   url: "https://leetcode.com/problems/two-sum/" },
  { id:  2, topic: "Arrays", title: "Best Time to Buy and Sell Stock",    difficulty: "Easy",   url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id:  3, topic: "Arrays", title: "Contains Duplicate",                 difficulty: "Easy",   url: "https://leetcode.com/problems/contains-duplicate/" },
  { id:  4, topic: "Arrays", title: "Maximum Subarray",                   difficulty: "Easy",   url: "https://leetcode.com/problems/maximum-subarray/" },
  { id:  5, topic: "Arrays", title: "Plus One",                           difficulty: "Easy",   url: "https://leetcode.com/problems/plus-one/" },
  { id:  6, topic: "Arrays", title: "Remove Duplicates from Sorted Array",difficulty: "Easy",   url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
  { id:  7, topic: "Arrays", title: "Remove Element",                     difficulty: "Easy",   url: "https://leetcode.com/problems/remove-element/" },
  { id:  8, topic: "Arrays", title: "Merge Sorted Array",                 difficulty: "Easy",   url: "https://leetcode.com/problems/merge-sorted-array/" },
  { id:  9, topic: "Arrays", title: "Intersection of Two Arrays",         difficulty: "Easy",   url: "https://leetcode.com/problems/intersection-of-two-arrays/" },
  { id: 10, topic: "Arrays", title: "Move Zeroes",                        difficulty: "Easy",   url: "https://leetcode.com/problems/move-zeroes/" },
  { id: 11, topic: "Arrays", title: "Majority Element",                   difficulty: "Easy",   url: "https://leetcode.com/problems/majority-element/" },
  { id: 12, topic: "Arrays", title: "Missing Number",                     difficulty: "Easy",   url: "https://leetcode.com/problems/missing-number/" },
  { id: 13, topic: "Arrays", title: "Single Number",                      difficulty: "Easy",   url: "https://leetcode.com/problems/single-number/" },
  { id: 14, topic: "Arrays", title: "Find Pivot Index",                   difficulty: "Easy",   url: "https://leetcode.com/problems/find-pivot-index/" },
  { id: 15, topic: "Arrays", title: "Running Sum of 1d Array",            difficulty: "Easy",   url: "https://leetcode.com/problems/running-sum-of-1d-array/" },
  { id: 16, topic: "Arrays", title: "Merge Intervals",                    difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
  { id: 17, topic: "Arrays", title: "3Sum",                               difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
  { id: 18, topic: "Arrays", title: "Product of Array Except Self",       difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: 19, topic: "Arrays", title: "Maximum Product Subarray",           difficulty: "Medium", url: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: 20, topic: "Arrays", title: "Subarray Sum Equals K",              difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
  { id: 21, topic: "Arrays", title: "Container With Most Water",          difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 22, topic: "Arrays", title: "Sliding Window Median",              difficulty: "Hard",   url: "https://leetcode.com/problems/sliding-window-median/" },
  { id: 23, topic: "Arrays", title: "Trapping Rain Water",                difficulty: "Hard",   url: "https://leetcode.com/problems/trapping-rain-water/" },
  { id: 24, topic: "Arrays", title: "First Missing Positive",             difficulty: "Hard",   url: "https://leetcode.com/problems/first-missing-positive/" },
  { id: 25, topic: "Arrays", title: "Median of Two Sorted Arrays",        difficulty: "Hard",   url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // ── STRINGS ── 8 Easy · 4 Medium · 3 Hard = 15 ──────────────────────────
  { id: 26, topic: "Strings", title: "Valid Anagram",                              difficulty: "Easy",   url: "https://leetcode.com/problems/valid-anagram/" },
  { id: 27, topic: "Strings", title: "Valid Palindrome",                           difficulty: "Easy",   url: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 28, topic: "Strings", title: "Longest Common Prefix",                      difficulty: "Easy",   url: "https://leetcode.com/problems/longest-common-prefix/" },
  { id: 29, topic: "Strings", title: "Roman to Integer",                           difficulty: "Easy",   url: "https://leetcode.com/problems/roman-to-integer/" },
  { id: 30, topic: "Strings", title: "Length of Last Word",                        difficulty: "Easy",   url: "https://leetcode.com/problems/length-of-last-word/" },
  { id: 31, topic: "Strings", title: "Reverse String",                             difficulty: "Easy",   url: "https://leetcode.com/problems/reverse-string/" },
  { id: 32, topic: "Strings", title: "Is Subsequence",                             difficulty: "Easy",   url: "https://leetcode.com/problems/is-subsequence/" },
  { id: 33, topic: "Strings", title: "First Unique Character in a String",         difficulty: "Easy",   url: "https://leetcode.com/problems/first-unique-character-in-a-string/" },
  { id: 34, topic: "Strings", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 35, topic: "Strings", title: "Group Anagrams",                             difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
  { id: 36, topic: "Strings", title: "Longest Palindromic Substring",              difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: 37, topic: "Strings", title: "String to Integer (atoi)",                   difficulty: "Medium", url: "https://leetcode.com/problems/string-to-integer-atoi/" },
  { id: 38, topic: "Strings", title: "Minimum Window Substring",                   difficulty: "Hard",   url: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: 39, topic: "Strings", title: "Regular Expression Matching",                difficulty: "Hard",   url: "https://leetcode.com/problems/regular-expression-matching/" },
  { id: 40, topic: "Strings", title: "Wildcard Matching",                          difficulty: "Hard",   url: "https://leetcode.com/problems/wildcard-matching/" },

  // ── LINKED LIST ── 8 Easy · 4 Medium · 3 Hard = 15 ──────────────────────
  { id: 41, topic: "Linked List", title: "Reverse Linked List",                  difficulty: "Easy",   url: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 42, topic: "Linked List", title: "Merge Two Sorted Lists",               difficulty: "Easy",   url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 43, topic: "Linked List", title: "Linked List Cycle",                    difficulty: "Easy",   url: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: 44, topic: "Linked List", title: "Middle of the Linked List",            difficulty: "Easy",   url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
  { id: 45, topic: "Linked List", title: "Remove Linked List Elements",          difficulty: "Easy",   url: "https://leetcode.com/problems/remove-linked-list-elements/" },
  { id: 46, topic: "Linked List", title: "Palindrome Linked List",               difficulty: "Easy",   url: "https://leetcode.com/problems/palindrome-linked-list/" },
  { id: 47, topic: "Linked List", title: "Intersection of Two Linked Lists",     difficulty: "Easy",   url: "https://leetcode.com/problems/intersection-of-two-linked-lists/" },
  { id: 48, topic: "Linked List", title: "Remove Duplicates from Sorted List",   difficulty: "Easy",   url: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/" },
  { id: 49, topic: "Linked List", title: "Remove Nth Node From End of List",     difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: 50, topic: "Linked List", title: "Add Two Numbers",                      difficulty: "Medium", url: "https://leetcode.com/problems/add-two-numbers/" },
  { id: 51, topic: "Linked List", title: "Reorder List",                         difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
  { id: 52, topic: "Linked List", title: "Copy List with Random Pointer",        difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: 53, topic: "Linked List", title: "Reverse Nodes in k-Group",             difficulty: "Hard",   url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { id: 54, topic: "Linked List", title: "Merge k Sorted Lists",                 difficulty: "Hard",   url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: 55, topic: "Linked List", title: "LRU Cache",                            difficulty: "Hard",   url: "https://leetcode.com/problems/lru-cache/" },

  // ── STACK / QUEUE ── 6 Easy · 4 Medium · 3 Hard = 13 ────────────────────
  { id: 56, topic: "Stack / Queue", title: "Implement Queue using Stacks",       difficulty: "Easy",   url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
  { id: 57, topic: "Stack / Queue", title: "Implement Stack using Queues",       difficulty: "Easy",   url: "https://leetcode.com/problems/implement-stack-using-queues/" },
  { id: 58, topic: "Stack / Queue", title: "Next Greater Element I",             difficulty: "Easy",   url: "https://leetcode.com/problems/next-greater-element-i/" },
  { id: 59, topic: "Stack / Queue", title: "Baseball Game",                      difficulty: "Easy",   url: "https://leetcode.com/problems/baseball-game/" },
  { id: 60, topic: "Stack / Queue", title: "Backspace String Compare",           difficulty: "Easy",   url: "https://leetcode.com/problems/backspace-string-compare/" },
  { id: 61, topic: "Stack / Queue", title: "Valid Parentheses",                  difficulty: "Easy",   url: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 62, topic: "Stack / Queue", title: "Min Stack",                          difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
  { id: 63, topic: "Stack / Queue", title: "Evaluate Reverse Polish Notation",   difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: 64, topic: "Stack / Queue", title: "Daily Temperatures",                 difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
  { id: 65, topic: "Stack / Queue", title: "Simplify Path",                      difficulty: "Medium", url: "https://leetcode.com/problems/simplify-path/" },
  { id: 66, topic: "Stack / Queue", title: "Asteroid Collision",                 difficulty: "Hard",   url: "https://leetcode.com/problems/asteroid-collision/" },
  { id: 67, topic: "Stack / Queue", title: "Largest Rectangle in Histogram",     difficulty: "Hard",   url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id: 68, topic: "Stack / Queue", title: "Sliding Window Maximum",             difficulty: "Hard",   url: "https://leetcode.com/problems/sliding-window-maximum/" },

  // ── TREES ── 8 Easy · 4 Medium · 2 Hard = 14 ────────────────────────────
  { id: 69, topic: "Trees", title: "Maximum Depth of Binary Tree",          difficulty: "Easy",   url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 70, topic: "Trees", title: "Same Tree",                             difficulty: "Easy",   url: "https://leetcode.com/problems/same-tree/" },
  { id: 71, topic: "Trees", title: "Invert Binary Tree",                    difficulty: "Easy",   url: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 72, topic: "Trees", title: "Symmetric Tree",                        difficulty: "Easy",   url: "https://leetcode.com/problems/symmetric-tree/" },
  { id: 73, topic: "Trees", title: "Binary Tree Inorder Traversal",         difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
  { id: 74, topic: "Trees", title: "Binary Tree Preorder Traversal",        difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-preorder-traversal/" },
  { id: 75, topic: "Trees", title: "Binary Tree Postorder Traversal",       difficulty: "Easy",   url: "https://leetcode.com/problems/binary-tree-postorder-traversal/" },
  { id: 76, topic: "Trees", title: "Search in a Binary Search Tree",        difficulty: "Easy",   url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
  { id: 77, topic: "Trees", title: "Binary Tree Level Order Traversal",     difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 78, topic: "Trees", title: "Validate Binary Search Tree",           difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: 79, topic: "Trees", title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
  { id: 80, topic: "Trees", title: "Kth Smallest Element in a BST",         difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: 81, topic: "Trees", title: "Binary Tree Maximum Path Sum",          difficulty: "Hard",   url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: 82, topic: "Trees", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard",   url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },

  // ── GRAPHS ── 2 Easy · 5 Medium · 3 Hard = 10 ───────────────────────────
  { id: 83, topic: "Graphs", title: "Find if Path Exists in Graph",   difficulty: "Easy",   url: "https://leetcode.com/problems/find-if-path-exists-in-graph/" },
  { id: 84, topic: "Graphs", title: "Flood Fill",                     difficulty: "Easy",   url: "https://leetcode.com/problems/flood-fill/" },
  { id: 85, topic: "Graphs", title: "Number of Islands",              difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
  { id: 86, topic: "Graphs", title: "Clone Graph",                    difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
  { id: 87, topic: "Graphs", title: "Rotting Oranges",                difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
  { id: 88, topic: "Graphs", title: "Course Schedule",                difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
  { id: 89, topic: "Graphs", title: "Pacific Atlantic Water Flow",    difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: 90, topic: "Graphs", title: "Word Ladder",                    difficulty: "Hard",   url: "https://leetcode.com/problems/word-ladder/" },
  { id: 91, topic: "Graphs", title: "Alien Dictionary",               difficulty: "Hard",   url: "https://leetcode.com/problems/alien-dictionary/" },
  { id: 92, topic: "Graphs", title: "Reconstruct Itinerary",          difficulty: "Hard",   url: "https://leetcode.com/problems/reconstruct-itinerary/" },

  // ── DYNAMIC PROGRAMMING ── 3 Easy · 3 Medium · 2 Hard = 8 ───────────────
  { id:  93, topic: "Dynamic Programming", title: "Climbing Stairs",               difficulty: "Easy",   url: "https://leetcode.com/problems/climbing-stairs/" },
  { id:  94, topic: "Dynamic Programming", title: "Min Cost Climbing Stairs",      difficulty: "Easy",   url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id:  95, topic: "Dynamic Programming", title: "House Robber",                  difficulty: "Easy",   url: "https://leetcode.com/problems/house-robber/" },
  { id:  96, topic: "Dynamic Programming", title: "Coin Change",                   difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
  { id:  97, topic: "Dynamic Programming", title: "Longest Increasing Subsequence",difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id:  98, topic: "Dynamic Programming", title: "Partition Equal Subset Sum",    difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id:  99, topic: "Dynamic Programming", title: "Edit Distance",                 difficulty: "Hard",   url: "https://leetcode.com/problems/edit-distance/" },
  { id: 100, topic: "Dynamic Programming", title: "Burst Balloons",                difficulty: "Hard",   url: "https://leetcode.com/problems/burst-balloons/" },
];

// Sanity check (runs once on load)
(function() {
  const total = PROBLEMS.length;
  const easy   = PROBLEMS.filter(p => p.difficulty === "Easy").length;
  const medium = PROBLEMS.filter(p => p.difficulty === "Medium").length;
  const hard   = PROBLEMS.filter(p => p.difficulty === "Hard").length;
  if (total !== 100 || easy !== 50 || medium !== 30 || hard !== 20) {
    console.error(`Data integrity check FAILED: ${total} total, ${easy}E ${medium}M ${hard}H`);
  }
})();
