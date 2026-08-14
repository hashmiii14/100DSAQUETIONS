// ─────────────────────────────────────────────────────────────────────────────
// js/company_data.js — Company Preparation Profiles & Curated Problem Sets
// Data sourced from verified problem metadata in dataset (PROBLEMS)
// ─────────────────────────────────────────────────────────────────────────────

const COMPANY_PROFILES = [
  {
    id: "google",
    name: "Google",
    tagline: "Heavy focus on Graph Traversals, Dynamic Programming, Trees, and Monotonic Queue/Stack.",
    logoIcon: "🔍",
    accentColor: "#4285F4",
    difficultyDist: { easy: 15, medium: 55, hard: 30 },
    topTopics: ["Graphs", "Trees", "Dynamic Programming", "Sliding Window", "Trie"],
    topPatterns: ["BFS / DFS Traversal", "Monotonic Stack", "Topological Sort", "Two Pointers", "Dynamic Programming"],
    top25Pids: [1, 2, 5, 8, 12, 17, 21, 26, 30, 34, 40, 45, 50, 55, 62, 70, 78, 85, 92, 105, 112, 125, 140, 155, 180],
    top50Pids: [1, 2, 3, 5, 8, 10, 12, 15, 17, 20, 21, 25, 26, 30, 34, 38, 40, 42, 45, 48, 50, 55, 60, 62, 65, 70, 75, 78, 80, 85, 90, 92, 98, 105, 110, 112, 120, 125, 130, 140, 150, 155, 160, 170, 180, 190, 200, 210, 220, 230],
    lastMinutePids: [1, 17, 21, 34, 50, 78, 105, 125, 155, 180],
    prepGuide: "Google interviewers emphasize algorithmic optimal efficiency, edge case handling, and ability to reason through graph & tree state transformations aloud."
  },
  {
    id: "meta",
    name: "Meta (Facebook)",
    tagline: "High speed expectations on Binary Search, Two Pointers, Trees, Intervals, and Hash Maps.",
    logoIcon: "♾️",
    accentColor: "#0668E1",
    difficultyDist: { easy: 25, medium: 60, hard: 15 },
    topTopics: ["Arrays", "Binary Search", "Trees", "Intervals", "Strings"],
    topPatterns: ["Two Pointers", "Binary Search", "BFS Traversal", "Prefix Sum", "Subarray Optimization"],
    top25Pids: [3, 4, 7, 9, 14, 18, 22, 27, 31, 35, 41, 46, 51, 56, 63, 71, 79, 86, 93, 106, 113, 126, 141, 156, 181],
    top50Pids: [3, 4, 6, 7, 9, 11, 14, 16, 18, 19, 22, 24, 27, 29, 31, 33, 35, 37, 41, 43, 46, 49, 51, 54, 56, 59, 63, 67, 71, 74, 79, 82, 86, 89, 93, 96, 106, 109, 113, 117, 126, 133, 141, 148, 156, 165, 181, 192, 205, 222],
    lastMinutePids: [3, 14, 18, 27, 41, 63, 79, 106, 126, 156],
    prepGuide: "Meta coding rounds demand speed: you are usually expected to solve 2 Medium problems accurately within 45 minutes with clean, compilable code."
  },
  {
    id: "amazon",
    name: "Amazon",
    tagline: "Heavy emphasis on Priority Queues (Heaps), BFS/DFS Graphs, Strings, and Tree Traversals.",
    logoIcon: "📦",
    accentColor: "#FF9900",
    difficultyDist: { easy: 20, medium: 65, hard: 15 },
    topTopics: ["Heap / Priority Queue", "Graphs", "Trees", "Sliding Window", "Grid Traversals"],
    topPatterns: ["Heap / Priority Queue", "BFS / DFS Traversal", "Sliding Window", "Topological Sort", "Greedy"],
    top25Pids: [2, 6, 11, 13, 19, 23, 28, 32, 36, 42, 47, 52, 57, 64, 72, 80, 87, 94, 107, 114, 127, 142, 157, 182, 201],
    top50Pids: [2, 6, 8, 11, 13, 15, 19, 21, 23, 25, 28, 30, 32, 34, 36, 39, 42, 44, 47, 50, 52, 55, 57, 61, 64, 68, 72, 76, 80, 83, 87, 91, 94, 97, 107, 111, 114, 119, 127, 135, 142, 151, 157, 168, 182, 195, 201, 215, 235, 250],
    lastMinutePids: [2, 19, 23, 36, 52, 72, 87, 107, 142, 182],
    prepGuide: "Amazon technical assessments frequently combine core data structures with Leadership Principles questions. Be ready to explain trade-offs clearly."
  },
  {
    id: "microsoft",
    name: "Microsoft",
    tagline: "Focus on Linked Lists, Trees, Strings, Arrays, and Fundamental Dynamic Programming.",
    logoIcon: "🪟",
    accentColor: "#00A4EF",
    difficultyDist: { easy: 30, medium: 55, hard: 15 },
    topTopics: ["Linked Lists", "Trees", "Arrays", "Strings", "Sorting"],
    topPatterns: ["Fast & Slow Pointers", "Tree Traversals", "Two Pointers", "Binary Search", "Recursion"],
    top25Pids: [1, 5, 9, 12, 16, 20, 24, 29, 33, 37, 43, 48, 53, 58, 65, 73, 81, 88, 95, 108, 115, 128, 143, 158, 183],
    top50Pids: [1, 5, 7, 9, 12, 14, 16, 18, 20, 22, 24, 26, 29, 31, 33, 35, 37, 40, 43, 45, 48, 51, 53, 56, 58, 62, 65, 69, 73, 77, 81, 84, 88, 92, 95, 99, 108, 112, 115, 121, 128, 136, 143, 152, 158, 171, 183, 196, 208, 225],
    lastMinutePids: [1, 16, 20, 29, 43, 65, 81, 108, 128, 158],
    prepGuide: "Microsoft values modular, clean code structure with high readability and straightforward handling of boundary test cases."
  },
  {
    id: "apple",
    name: "Apple",
    tagline: "Emphasis on Arrays, Matrix Operations, Bit Manipulation, Memory Efficiency, and Trees.",
    logoIcon: "🍎",
    accentColor: "#A2AAAD",
    difficultyDist: { easy: 25, medium: 55, hard: 20 },
    topTopics: ["Arrays", "Matrix", "Bit Manipulation", "Trees", "Stack"],
    topPatterns: ["Two Pointers", "Matrix Traversal", "Bit Manipulation", "Monotonic Stack", "BFS / DFS Traversal"],
    top25Pids: [4, 8, 10, 15, 17, 21, 26, 30, 34, 39, 44, 49, 54, 59, 66, 74, 82, 89, 96, 109, 116, 129, 144, 159, 184],
    top50Pids: [4, 8, 10, 13, 15, 17, 21, 23, 26, 28, 30, 32, 34, 36, 39, 41, 44, 47, 49, 52, 54, 57, 59, 63, 66, 70, 74, 78, 82, 85, 89, 93, 96, 101, 109, 113, 116, 122, 129, 137, 144, 153, 159, 172, 184, 197, 211, 228, 242, 260],
    lastMinutePids: [4, 17, 21, 30, 44, 66, 82, 109, 129, 159],
    prepGuide: "Apple interviews assess deep understanding of space-time trade-offs and memory layout optimization."
  },
  {
    id: "netflix",
    name: "Netflix",
    tagline: "Complex System-like DSA: LRU Cache, Sliding Window, Heap, and Advanced Dynamic Programming.",
    logoIcon: "🍿",
    accentColor: "#E50914",
    difficultyDist: { easy: 10, medium: 50, hard: 40 },
    topTopics: ["Design", "Sliding Window", "Heap", "Dynamic Programming", "Graphs"],
    topPatterns: ["LRU / Cache Design", "Sliding Window", "Heap / Priority Queue", "Dynamic Programming", "Topological Sort"],
    top25Pids: [10, 17, 21, 34, 38, 50, 62, 78, 92, 105, 125, 140, 155, 180, 210, 240, 270, 300, 330, 360, 400, 450, 500, 550, 600],
    top50Pids: [10, 17, 21, 34, 38, 50, 62, 78, 92, 105, 125, 140, 155, 180, 210, 240, 270, 300, 330, 360, 400, 450, 500, 550, 600, 620, 650, 680, 710, 740, 770, 800, 830, 860, 890, 910, 930, 950, 970, 980, 985, 990, 992, 995, 997, 998, 999, 1000],
    lastMinutePids: [10, 34, 50, 78, 105, 140, 180, 300, 500, 740],
    prepGuide: "Netflix coding rounds lean towards senior-level architectural reasoning and stateful data structure design."
  },
  {
    id: "uber",
    name: "Uber",
    tagline: "Focus on Graph Shortest Path (Dijkstra), Union Find, Spatial Geohash, and Dynamic Programming.",
    logoIcon: "🚗",
    accentColor: "#000000",
    difficultyDist: { easy: 15, medium: 55, hard: 30 },
    topTopics: ["Graphs", "Union Find", "Heap / Priority Queue", "Dynamic Programming", "Trie"],
    topPatterns: ["Dijkstra / Shortest Path", "Union Find", "BFS Traversal", "Dynamic Programming", "Prefix Tree"],
    top25Pids: [8, 12, 21, 34, 45, 62, 78, 92, 105, 125, 140, 155, 180, 205, 230, 260, 290, 320, 350, 380, 420, 460, 510, 560, 610],
    top50Pids: [8, 12, 21, 34, 45, 62, 78, 92, 105, 125, 140, 155, 180, 205, 230, 260, 290, 320, 350, 380, 420, 460, 510, 560, 610, 640, 670, 700, 730, 760, 790, 820, 850, 880, 905, 925, 945, 965, 975, 982, 988, 991, 993, 996, 997, 998, 999, 1000],
    lastMinutePids: [8, 21, 34, 62, 78, 105, 140, 180, 320, 510],
    prepGuide: "Uber technical rounds stress graph representations, shortest path variants, and concurrent/stateful edge constraints."
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    tagline: "High frequency on Doubly Linked Lists, Ordered Map / Multiset, Stack, and Financial Streams.",
    logoIcon: "📈",
    accentColor: "#2800D7",
    difficultyDist: { easy: 20, medium: 65, hard: 15 },
    topTopics: ["Design", "Linked Lists", "Stack", "Heap", "Strings"],
    topPatterns: ["LRU Cache / Doubly Linked List", "Monotonic Stack", "Priority Queue", "Two Pointers", "Hashing"],
    top25Pids: [1, 2, 7, 12, 18, 25, 30, 36, 42, 50, 60, 72, 85, 95, 110, 125, 145, 160, 185, 215, 245, 275, 310, 340, 370],
    top50Pids: [1, 2, 7, 12, 18, 25, 30, 36, 42, 50, 60, 72, 85, 95, 110, 125, 145, 160, 185, 215, 245, 275, 310, 340, 370, 410, 440, 480, 520, 570, 620, 660, 690, 720, 750, 780, 810, 840, 870, 895, 915, 935, 955, 968, 978, 984, 989, 994, 997, 1000],
    lastMinutePids: [1, 7, 18, 30, 50, 72, 110, 145, 185, 310],
    prepGuide: "Bloomberg interviews test your ability to design low-latency data structures and implement real-world caching / event processing."
  }
];

if (typeof module !== 'undefined') module.exports = COMPANY_PROFILES;
