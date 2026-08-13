// Patterns Library for DSAProblems.site
const PATTERNS_LIBRARY = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Use two pointers iterating over a data structure (in opposite directions or same direction) to reduce quadratic search to linear time.",
    clues: ["Sorted array or string input", "Find pairs or triplets that sum to a target", "Reversing arrays or removing duplicates in-place"],
    template: `function twoPointers(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    beginnerExample: "Two Sum II (Sorted Array)",
    mediumExample: "3Sum",
    advancedExample: "Trapping Rain Water",
    commonMistakes: ["Forgetting to sort the array first if requirement demands sorted order", "Not incrementing/decrementing pointers inside the loop causing infinite loops"]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a contiguous window over an array or string that grows or shrinks based on criteria.",
    clues: ["Contiguous subarray or substring problem", "Find longest/shortest/max/min contiguous segment meeting a condition", "Input constraints N <= 10^5 requiring O(N) solution"],
    template: `function slidingWindow(arr, k) {
  let left = 0, currentSum = 0, maxVal = 0;
  for (let right = 0; right < arr.length; right++) {
    currentSum += arr[right];
    while (/* condition violated */ false) {
      currentSum -= arr[left];
      left++;
    }
    maxVal = Math.max(maxVal, right - left + 1);
  }
  return maxVal;
}`,
    beginnerExample: "Maximum Average Subarray I",
    mediumExample: "Longest Substring Without Repeating Characters",
    advancedExample: "Minimum Window Substring",
    commonMistakes: ["Shrinking window before updating answer", "Incorrectly indexing window bounds (right - left + 1)"]
  },
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    description: "Precompute cumulative sums so range sum queries [L, R] can be answered in O(1) time.",
    clues: ["Multiple range sum queries", "Find contiguous subarray with sum equal to K", "2D matrix range queries"],
    template: `function prefixSum(arr) {
  const prefix = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
  }
  // Range sum [L, R] = prefix[R + 1] - prefix[L]
  return prefix;
}`,
    beginnerExample: "Range Sum Query Immutable",
    mediumExample: "Subarray Sum Equals K",
    advancedExample: "Matrix Block Sum",
    commonMistakes: ["1-based vs 0-based indexing mismatch", "Integer overflow for large cumulative sums"]
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Divide search space in half repeatedly on sorted data or monotonic decision functions.",
    clues: ["Sorted array input", "Search space has monotonic property (T, T, T, F, F)", "Constraints N <= 10^5 and required time O(log N)"],
    template: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    beginnerExample: "Binary Search",
    mediumExample: "Koko Eating Bananas",
    advancedExample: "Median of Two Sorted Arrays",
    commonMistakes: ["Integer overflow on (low + high) / 2 (use low + (high-low)/2)", "Infinite loop due to wrong high/low updating logic"]
  },
  {
    id: "fast-slow-pointers",
    name: "Fast & Slow Pointers (Floyd's Cycle)",
    description: "Use two pointers moving at different speeds (1 step vs 2 steps) to detect cycles or middle node.",
    clues: ["Linked list cycle detection", "Find middle of linked list", "Happy Number (sequence loop detection)"],
    template: `function detectCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true; // Cycle detected
  }
  return false;
}`,
    beginnerExample: "Linked List Cycle",
    mediumExample: "Find the Duplicate Number",
    advancedExample: "Circular Array Loop",
    commonMistakes: ["Null pointer dereference checking fast.next before fast", "Conflating cycle detection with cycle start node discovery"]
  },
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    description: "Maintain elements in strictly increasing or decreasing order in a stack to quickly find next/previous greater or smaller elements.",
    clues: ["Find next greater/smaller element for every item", "Histogram or boundary area calculations", "Subarray minimum/maximum range contribution"],
    template: `function monotonicStack(arr) {
  const stack = [];
  const result = new Array(arr.length).fill(-1);
  for (let i = 0; i < arr.length; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]] < arr[i]) {
      let idx = stack.pop();
      result[idx] = arr[i];
    }
    stack.push(i);
  }
  return result;
}`,
    beginnerExample: "Next Greater Element I",
    mediumExample: "Daily Temperatures",
    advancedExample: "Largest Rectangle in Histogram",
    commonMistakes: ["Storing values instead of indices in the stack", "Wrong strictness operator (< vs <=) causing duplicate value issues"]
  },
  {
    id: "bfs-dfs",
    name: "Graph BFS & DFS",
    description: "Breadth-First Search (queue for shortest path in unweighted graphs) and Depth-First Search (stack/recursion for exhaustively exploring paths).",
    clues: ["Grid navigation (islands, mazes)", "Shortest path in unweighted graph", "Connected components / Cycle detection"],
    template: `function bfsGrid(grid) {
  const queue = [[0, 0]];
  const visited = new Set(['0,0']);
  const dirs = [[0,1], [1,0], [0,-1], [-1,0]];
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (isValid(nr, nc) && !visited.has(\`\${nr},\${nc}\`)) {
        visited.add(\`\${nr},\${nc}\`);
        queue.push([nr, nc]);
      }
    }
  }
}`,
    beginnerExample: "Flood Fill",
    mediumExample: "Number of Islands",
    advancedExample: "Word Ladder",
    commonMistakes: ["Not marking nodes as visited upon enqueueing in BFS (causes duplicate processing)", "Recursion limit exceeded in deep DFS without memoization"]
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "Build solution incrementally and abandon a path (backtrack) as soon as it is determined it cannot lead to a valid solution.",
    clues: ["Generate all subsets, permutations, or combinations", "Constraint satisfaction problems (Sudoku, N-Queens)", "Explicit search space exploration"],
    template: `function backtrack(candidates, path, result) {
  if (isSolution(path)) {
    result.push([...path]);
    return;
  }
  for (let i = 0; i < candidates.length; i++) {
    if (isValid(candidates[i])) {
      path.push(candidates[i]);
      backtrack(candidates, path, result);
      path.pop(); // Backtrack
    }
  }
}`,
    beginnerExample: "Subsets",
    mediumExample: "Permutations",
    advancedExample: "N-Queens",
    commonMistakes: ["Pushing path reference instead of shallow copy ([...path])", "Forgetting to undo choice (path.pop()) when backtracking"]
  },
  {
    id: "top-k-heap",
    name: "Heap / Top K Elements",
    description: "Use Min-Heap or Max-Heap to maintain K largest or K smallest elements efficiently in O(N log K) time.",
    clues: ["Find Kth largest/smallest element", "Top K frequent items", "Stream processing where input size N is dynamic"],
    template: `// Min-Heap maintains top K largest elements
class MinHeap {
  constructor() { this.heap = []; }
  push(val) { /* insert and bubble up */ }
  pop() { /* extract min and bubble down */ }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}`,
    beginnerExample: "Kth Largest Element in a Stream",
    mediumExample: "Top K Frequent Elements",
    advancedExample: "Find Median from Data Stream (Two Heaps)",
    commonMistakes: ["Using Max-Heap for Top K Largest (uses O(N log N) space instead of O(K) with Min-Heap)", "Incorrect comparator logic"]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Break complex problem into overlapping subproblems, store intermediate solutions (memoization or DP table) to avoid redundant computation.",
    clues: ["Optimal substructure & overlapping subproblems", "Counting ways, min/max cost, boolean feasibility", "Choices at each step depend on previous states"],
    template: `function fibDP(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    beginnerExample: "Climbing Stairs",
    mediumExample: "Coin Change",
    advancedExample: "Edit Distance",
    commonMistakes: ["Incorrect base case initialization", "Wrong state transition relation", "Unnecessary 2D DP space when 1D array suffices"]
  }
];

if (typeof module !== 'undefined') module.exports = PATTERNS_LIBRARY;
