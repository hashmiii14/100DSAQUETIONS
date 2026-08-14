// ─────────────────────────────────────────────────────────────────────────────
// js/roadmaps_data.js — Structured FAANG Learning Roadmaps & Weekly Modules
// ─────────────────────────────────────────────────────────────────────────────

const ROADMAPS_DATA = [
  {
    id: "beginner-to-ready",
    title: "Beginner → FAANG Interview Ready",
    subtitle: "A progressive, topic-by-topic roadmap designed to build bulletproof foundational and advanced problem-solving skills.",
    duration: "Self-Paced (Recommended ~12 Weeks)",
    targetAudience: "Engineers building or strengthening core DSA fundamentals from scratch.",
    modules: [
      {
        step: 1,
        title: "Stage 1 — Array & String Fundamentals",
        topics: ["Arrays", "Strings"],
        patterns: ["Two Pointers", "Prefix Sum", "Hashing & Array Optimization"],
        pids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        goal: "Master linear iteration, hash map lookups, in-place swaps, and range sum precomputations."
      },
      {
        step: 2,
        title: "Stage 2 — Two Pointers & Sliding Window",
        topics: ["Arrays", "Strings"],
        patterns: ["Two Pointers", "Sliding Window", "Fast & Slow Pointers"],
        pids: [16, 17, 18, 19, 20, 21, 26, 27, 28, 30, 31, 32, 34, 35],
        goal: "Reduce quadratic search spaces to O(N) by maintaining sliding bounds and pointer convergence."
      },
      {
        step: 3,
        title: "Stage 3 — Binary Search & Monotonic Stack",
        topics: ["Binary Search", "Stack"],
        patterns: ["Binary Search", "Monotonic Stack"],
        pids: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
        goal: "Logarithmic search on monotonic spaces and Next Greater / Next Smaller Element logic via stacks."
      },
      {
        step: 4,
        title: "Stage 4 — Linked Lists & Recursion",
        topics: ["Linked List"],
        patterns: ["Fast & Slow Pointers", "In-place Reversal", "Dummy Head Technique"],
        pids: [81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95],
        goal: "Pointer manipulation, cycle detection, reordering, and recursive linked list operations."
      },
      {
        step: 5,
        title: "Stage 5 — Binary Trees & BST",
        topics: ["Trees", "BST"],
        patterns: ["BFS Traversal", "DFS Traversal", "Tree Recursion"],
        pids: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120],
        goal: "Master tree traversals (Inorder, Preorder, Postorder, Level Order) and BST search/insert invariants."
      },
      {
        step: 6,
        title: "Stage 6 — Heap & Priority Queue",
        topics: ["Heap / Priority Queue"],
        patterns: ["Top K Elements", "Two Heaps", "K-way Merge"],
        pids: [141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155],
        goal: "Dynamic tracking of min/max elements, stream medians, and top frequency element extraction."
      },
      {
        step: 7,
        title: "Stage 7 — Graphs & Backtracking",
        topics: ["Graphs", "Backtracking"],
        patterns: ["BFS / DFS Traversal", "Topological Sort", "Union Find", "Backtracking"],
        pids: [171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185],
        goal: "Connected components, island counts, dependency resolution, cycle detection, and combinatorial search space pruning."
      },
      {
        step: 8,
        title: "Stage 8 — Dynamic Programming & Mastery",
        topics: ["Dynamic Programming", "Greedy", "Trie"],
        patterns: ["1D / 2D Dynamic Programming", "Knapsack DP", "Greedy Choice", "Prefix Tree"],
        pids: [201, 202, 203, 204, 205, 210, 215, 220, 225, 230, 240, 250, 260, 270, 300],
        goal: "Identify overlapping subproblems, memoization vs bottom-up tabulation state transitions."
      }
    ]
  },
  {
    id: "12-week-master",
    title: "12-Week FAANG Master Curriculum",
    subtitle: "Week-by-week structured execution path with specific target sets, revision checkpoints, and mock practice.",
    duration: "12 Weeks (10-15 hrs/week)",
    targetAudience: "Serious candidates with an upcoming interview loop in 3 months.",
    modules: [
      { week: 1, title: "Week 1: Array Foundations & Hash Maps", pids: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 15] },
      { week: 2, title: "Week 2: Two Pointers & Prefix Sum", pids: [16, 17, 18, 19, 20, 21, 26, 27, 28, 30] },
      { week: 3, title: "Week 3: Sliding Window & Fast/Slow Pointers", pids: [31, 32, 34, 35, 38, 40, 42, 45, 50] },
      { week: 4, title: "Week 4: Binary Search & Monotonic Stack", pids: [61, 62, 63, 64, 65, 66, 67, 68, 70, 72] },
      { week: 5, title: "Week 5: Linked Lists & Matrix Operations", pids: [81, 82, 83, 84, 85, 86, 88, 90, 92, 95] },
      { week: 6, title: "Week 6: Trees & Level Order Traversals", pids: [101, 102, 103, 104, 105, 106, 108, 110, 112, 115] },
      { week: 7, title: "Week 7: Binary Search Trees & Recursion", pids: [116, 117, 118, 119, 120, 122, 125, 128, 130, 135] },
      { week: 8, title: "Week 8: Heaps, Priority Queues & Top-K", pids: [141, 142, 143, 145, 148, 150, 152, 155, 160, 165] },
      { week: 9, title: "Week 9: Graphs BFS/DFS & Islands", pids: [171, 172, 173, 175, 178, 180, 182, 185, 190, 195] },
      { week: 10, title: "Week 10: Topological Sort & Union Find", pids: [200, 205, 210, 215, 220, 225, 230, 240, 250, 260] },
      { week: 11, title: "Week 11: 1D/2D Dynamic Programming", pids: [270, 280, 290, 300, 320, 340, 360, 400, 450, 500] },
      { week: 12, title: "Week 12: Final Review, System Design & Timed Mocks", pids: [1, 17, 21, 34, 50, 63, 105, 140, 180, 300] }
    ]
  },
  {
    id: "6-week-sprint",
    title: "6-Week High-Yield Sprint",
    subtitle: "Accelerated preparation focused strictly on high-frequency interview patterns and pattern definition problems.",
    duration: "6 Weeks (15-20 hrs/week)",
    targetAudience: "Candidates with solid background needing a fast-paced refresher.",
    modules: [
      { week: 1, title: "Sprint Week 1: Arrays, Strings, Two Pointers & Window", pids: [1, 2, 17, 18, 21, 34, 38, 50] },
      { week: 2, title: "Sprint Week 2: Binary Search & Monotonic Stack", pids: [61, 63, 65, 70, 72, 78, 85, 92] },
      { week: 3, title: "Sprint Week 3: Trees, BST & Level Order", pids: [101, 105, 110, 112, 115, 120, 125, 130] },
      { week: 4, title: "Sprint Week 4: Heaps & Graphs (BFS/DFS)", pids: [141, 145, 150, 171, 175, 180, 185, 190] },
      { week: 5, title: "Sprint Week 5: Topological Sort, Union Find & Backtracking", pids: [205, 210, 220, 230, 240, 250, 260, 270] },
      { week: 6, title: "Sprint Week 6: Dynamic Programming & Mock Interview Loop", pids: [300, 320, 350, 400, 450, 500, 550, 600] }
    ]
  },
  {
    id: "2-week-revision",
    title: "2-Week Emergency Revision",
    subtitle: "Ultra-concentrated set of 30 pattern-defining problems for last-minute review before a big interview.",
    duration: "2 Weeks (10 hrs/week)",
    targetAudience: "Interview scheduled in 14 days.",
    modules: [
      { week: 1, title: "Week 1: Core Fundamentals & Data Structures (15 Problems)", pids: [1, 3, 17, 21, 34, 50, 63, 70, 81, 101, 105, 112, 141, 150, 171] },
      { week: 2, title: "Week 2: Advanced Graphs, DP & Mock Simulations (15 Problems)", pids: [175, 180, 205, 210, 220, 230, 240, 300, 340, 400, 450, 500, 600, 740, 1000] }
    ]
  }
];

if (typeof module !== 'undefined') module.exports = ROADMAPS_DATA;
