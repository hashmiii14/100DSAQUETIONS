// Data Structures & Algorithms Reference Library for DSAProblems.site
const DS_ALGO_LIBRARY = {
  dataStructures: [
    {
      name: "Array",
      description: "Contiguous block of memory storing elements of the same type.",
      operations: "Access: O(1), Search: O(N), Insertion: O(N), Deletion: O(N)",
      whenToUse: "When elements need fast random access by index.",
      whenNotToUse: "When frequent insertions or deletions occur at the beginning/middle."
    },
    {
      name: "HashMap / HashSet",
      description: "Key-value pair data structure built using hash functions for instant lookup.",
      operations: "Search: O(1) avg, Insert: O(1) avg, Delete: O(1) avg",
      whenToUse: "When fast lookup, frequency counting, or uniqueness verification is needed.",
      whenNotToUse: "When elements must remain strictly sorted without sorting overhead."
    },
    {
      name: "Linked List",
      description: "Linear collection of data nodes linked via pointers.",
      operations: "Access: O(N), Search: O(N), Head Insert/Delete: O(1)",
      whenToUse: "When dynamic memory allocation and O(1) prepend/insertion are required.",
      whenNotToUse: "When frequent random index access is needed."
    },
    {
      name: "Stack / Monotonic Stack",
      description: "Last-In-First-Out (LIFO) structure.",
      operations: "Push: O(1), Pop: O(1), Peek: O(1)",
      whenToUse: "Expression evaluation, recursion simulation, next greater/smaller element queries.",
      whenNotToUse: "When arbitrary element access is needed."
    },
    {
      name: "Queue / Monotonic Deque",
      description: "First-In-First-Out (FIFO) or Double-Ended queue.",
      operations: "Enqueue: O(1), Dequeue: O(1)",
      whenToUse: "Breadth-First Search (BFS) traversals and sliding window maximum queries.",
      whenNotToUse: "When priority ordering is required (use Heap instead)."
    },
    {
      name: "Heap / Priority Queue",
      description: "Complete binary tree satisfying heap property (Min-Heap or Max-Heap).",
      operations: "Insert: O(log N), Extract Min/Max: O(log N), Peek: O(1)",
      whenToUse: "Top K elements, dynamic priority scheduling, Dijkstra's shortest path.",
      whenNotToUse: "When searching for an arbitrary element is required (takes O(N))."
    },
    {
      name: "Binary Search Tree (BST) & AVL",
      description: "Node-based binary tree structure where left sub-tree < root < right sub-tree.",
      operations: "Search: O(log N) avg, Insert: O(log N) avg, Delete: O(log N) avg",
      whenToUse: "Dynamic sorted dataset queries, range queries, Kth smallest element.",
      whenNotToUse: "Unbalanced trees degenerate to O(N) linked lists unless balanced (AVL/Red-Black)."
    },
    {
      name: "Trie (Prefix Tree)",
      description: "Tree-like data structure used to store a dynamic set of strings.",
      operations: "Insert: O(L), Search: O(L), Prefix Search: O(L) where L is string length.",
      whenToUse: "Autocomplete, spell check, dictionary lookup, maximum XOR pair queries.",
      whenNotToUse: "When string length L is very large or memory budget is tightly limited."
    },
    {
      name: "Disjoint Set Union (DSU / Union-Find)",
      description: "Tracks a set of elements partitioned into disjoint connected subsets.",
      operations: "Find: O(α(N)), Union: O(α(N)) (Inverse Ackermann function ~ O(1))",
      whenToUse: "Connected components, Kruskal's MST, dynamic graph connectivity.",
      whenNotToUse: "When edges are removed dynamically (DSU doesn't support deletion efficiently)."
    },
    {
      name: "Segment Tree & Fenwick Tree (BIT)",
      description: "Tree structure for answering point/range updates and range queries in O(log N) time.",
      operations: "Point Update: O(log N), Range Query: O(log N)",
      whenToUse: "Dynamic range sum, min, max, GCD queries with frequent array updates.",
      whenNotToUse: "When array is static (use simple Prefix Sum array in O(1) query time)."
    }
  ],
  algorithms: [
    { name: "Binary Search", complexity: "Time: O(log N), Space: O(1)", category: "Searching" },
    { name: "Merge Sort", complexity: "Time: O(N log N), Space: O(N)", category: "Sorting" },
    { name: "Quick Sort", complexity: "Time: O(N log N) avg / O(N^2) worst, Space: O(log N)", category: "Sorting" },
    { name: "BFS (Breadth-First Search)", complexity: "Time: O(V + E), Space: O(V)", category: "Graph" },
    { name: "DFS (Depth-First Search)", complexity: "Time: O(V + E), Space: O(V)", category: "Graph" },
    { name: "Dijkstra's Algorithm", complexity: "Time: O((V + E) log V), Space: O(V)", category: "Shortest Path" },
    { name: "Bellman-Ford Algorithm", complexity: "Time: O(V * E), Space: O(V)", category: "Shortest Path" },
    { name: "Floyd-Warshall Algorithm", complexity: "Time: O(V^3), Space: O(V^2)", category: "All-Pairs Shortest Path" },
    { name: "Kruskal's Algorithm (MST)", complexity: "Time: O(E log E), Space: O(V)", category: "Minimum Spanning Tree" },
    { name: "Prim's Algorithm (MST)", complexity: "Time: O(E log V), Space: O(V)", category: "Minimum Spanning Tree" },
    { name: "Kahn's Algorithm (Topological Sort)", complexity: "Time: O(V + E), Space: O(V)", category: "Graph DAG" },
    { name: "Kadane's Algorithm", complexity: "Time: O(N), Space: O(1)", category: "Dynamic Programming / Subarray" },
    { name: "0/1 Knapsack & Subset Sum", complexity: "Time: O(N * W), Space: O(W)", category: "Dynamic Programming" },
    { name: "Longest Common Subsequence (LCS)", complexity: "Time: O(M * N), Space: O(M * N)", category: "Dynamic Programming" }
  ]
};

if (typeof module !== 'undefined') module.exports = DS_ALGO_LIBRARY;
