// Curated Interview Tracks for DSAProblems.site
const INTERVIEW_TRACKS = [
  {
    id: "beginner-interview",
    name: "Beginner Interview Prep",
    targetRole: "Intern / SDE-1 Fundamentals",
    description: "10 essential easy problems focusing on basic loops, string manipulation, and two-pointer basics.",
    problemIds: [1, 2, 3, 4, 26, 27, 41, 42, 69, 93],
    badge: "Beginner",
    estimatedHours: 5
  },
  {
    id: "junior-sde",
    name: "Junior SDE Screening",
    targetRole: "Junior Software Engineer",
    description: "Balanced mix of 2 Easy, 5 Medium, and 1 Hard problem testing array, tree, and stack mastery.",
    problemIds: [1, 16, 17, 34, 49, 61, 77, 81],
    badge: "Junior SDE",
    estimatedHours: 10
  },
  {
    id: "product-company",
    name: "Product Company Track",
    targetRole: "Product-based Companies (Uber, Stripe, Atlassian)",
    description: "Medium-heavy track emphasizing sliding window, prefix sums, tree DFS/BFS, and graph traversal.",
    problemIds: [16, 18, 20, 21, 34, 35, 62, 64, 78, 85, 87, 88, 96, 97],
    badge: "Product Co.",
    estimatedHours: 20
  },
  {
    id: "faang-style",
    name: "FAANG / High-Bar Track",
    targetRole: "Big Tech / High-Frequency Tech Interviews (Google, Meta, Amazon)",
    description: "Challenging Medium & Hard problems testing multi-pattern optimization, dynamic programming, and advanced graphs.",
    problemIds: [22, 23, 24, 25, 38, 39, 53, 54, 55, 67, 68, 81, 82, 90, 91, 99, 100],
    badge: "FAANG",
    estimatedHours: 35
  },
  {
    id: "graph-intensive",
    name: "Graph Algorithms Master Track",
    targetRole: "Backend & Systems Engineers",
    description: "Dedicated graph track covering BFS, DFS, Topological Sort, Dijkstra, DSU, and Shortest Paths.",
    problemIds: [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 801, 841, 850],
    badge: "Graphs",
    estimatedHours: 18
  },
  {
    id: "dp-intensive",
    name: "Dynamic Programming Master Track",
    targetRole: "Competitive Programmer & Senior SDE",
    description: "Comprehensive DP track from 1D Memoization to Knapsack, LCS, Grid DP, and Interval DP.",
    problemIds: [93, 94, 95, 96, 97, 98, 99, 100, 886, 896, 936],
    badge: "DP Master",
    estimatedHours: 25
  },
  {
    id: "30-day-challenge",
    name: "30-Day Interview Readiness Sprint",
    targetRole: "Active Job Seekers",
    description: "Solve 1 targeted problem per day across all 20 phases for 30 consecutive days.",
    problemIds: [1, 4, 16, 17, 21, 26, 34, 35, 41, 43, 49, 55, 61, 62, 67, 69, 77, 78, 81, 85, 88, 90, 93, 96, 97, 99, 221, 281, 341, 996],
    badge: "30-Day Sprint",
    estimatedHours: 30
  }
];

if (typeof module !== 'undefined') module.exports = INTERVIEW_TRACKS;
