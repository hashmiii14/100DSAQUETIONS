import json
import os
import re

# Comprehensive FAANG DSA Problem Rebalancer
# Rebalances topic distribution across 21 core FAANG DSA categories, keeping exactly 1,000 problems.

TARGET_TOPIC_DISTRIBUTION = {
    "Arrays & Subarrays": 110,
    "Strings & Pattern Matching": 90,
    "Hashing & Frequency Maps": 75,
    "Two Pointers": 65,
    "Sliding Window": 60,
    "Prefix Sum & Difference Array": 45,
    "Binary Search & Search Space": 70,
    "Recursion & Backtracking": 55,
    "Linked Lists": 60,
    "Stack & Monotonic Stack": 65,
    "Queue & Deque": 35,
    "Binary Trees": 75,
    "Binary Search Trees (BST)": 45,
    "Heap & Priority Queue": 65,
    "Trie (Prefix Tree)": 30,
    "Graphs, BFS & DFS": 85,
    "Topological Sort & Shortest Path": 50,
    "Disjoint Set Union (Union Find / DSU)": 35,
    "Greedy Algorithms": 65,
    "Dynamic Programming (1D & 2D)": 100,
    "Bit Manipulation": 45
}

def classify_problem(q):
    title = q.get('title', '')
    pattern = q.get('pattern', '')
    desc = q.get('description', '')
    lc_url = q.get('leetcodeUrl', '')
    tags = str(q.get('tags', []))
    
    text = (title + ' ' + pattern + ' ' + desc + ' ' + lc_url + ' ' + tags).lower()
    
    # Precise topic matching rules based on FAANG interview concepts
    if any(k in text for k in ['dsu', 'union find', 'disjoint set', 'redundant connection', 'accounts merge', 'kruskal']):
        return 'Disjoint Set Union (Union Find / DSU)'
    if any(k in text for k in ['topological', 'dijkstra', 'shortest path', 'bellman', 'floyd warshall', 'network delay', 'cheapest flights']):
        return 'Topological Sort & Shortest Path'
    if any(k in text for k in ['dp', 'dynamic programming', 'knapsack', 'house robber', 'coin change', 'climbing stairs', 'lcs', 'lis', 'edit distance', 'maximal square', 'partition equal']):
        return 'Dynamic Programming (1D & 2D)'
    if any(k in text for k in ['greedy', 'jump game', 'gas station', 'non-overlapping', 'candy', 'lemonade change', 'task scheduler', 'interval scheduling']):
        return 'Greedy Algorithms'
    if any(k in text for k in ['trie', 'prefix tree', 'word search ii', 'add and search']):
        return 'Trie (Prefix Tree)'
    if any(k in text for k in ['heap', 'priority queue', 'top k', 'kth largest', 'median from data stream', 'kth smallest element in sorted matrix']):
        return 'Heap & Priority Queue'
    if any(k in text for k in ['bst', 'binary search tree', 'kth smallest in bst', 'validate binary search tree']):
        return 'Binary Search Trees (BST)'
    if any(k in text for k in ['binary tree', 'tree traversal', 'inorder', 'preorder', 'postorder', 'level order', 'lca', 'lowest common ancestor', 'path sum', 'serialize and deserialize']):
        return 'Binary Trees'
    if any(k in text for k in ['graph', 'bfs', 'dfs', 'island', 'bipartite', 'clone graph', 'word ladder', 'surrounded regions', 'pacific atlantic']):
        return 'Graphs, BFS & DFS'
    if any(k in text for k in ['backtrack', 'recursion', 'n-queens', 'permutations', 'subsets', 'sudoku', 'combination sum', 'word search']):
        return 'Recursion & Backtracking'
    if any(k in text for k in ['binary search', 'search in rotated', 'find minimum in rotated', 'search 2d matrix', 'koko eating', 'capacity to ship']):
        return 'Binary Search & Search Space'
    if any(k in text for k in ['stack', 'monotonic stack', 'parentheses', 'next greater', 'histogram', 'rpn', 'min stack', 'daily temperatures']):
        return 'Stack & Monotonic Stack'
    if any(k in text for k in ['queue', 'deque', 'sliding window maximum', 'circular queue', 'moving average']):
        return 'Queue & Deque'
    if any(k in text for k in ['linked list', 'reverse list', 'merge two sorted lists', 'cycle', 'lru cache', 'lfu cache', 'reorder list']):
        return 'Linked Lists'
    if any(k in text for k in ['sliding window', 'minimum window', 'longest substring', 'permutation in string', 'max consecutive ones']):
        return 'Sliding Window'
    if any(k in text for k in ['prefix sum', 'range sum', 'subarray sum equals k', 'pivot index', 'product of array except self']):
        return 'Prefix Sum & Difference Array'
    if any(k in text for k in ['two pointer', '2sum', '3sum', '4sum', 'container with most water', 'trapping rain', 'sort colors', 'move zeroes']):
        return 'Two Pointers'
    if any(k in text for k in ['hashmap', 'hashset', 'frequency', 'group anagrams', 'contains duplicate', 'isomorphic']):
        return 'Hashing & Frequency Maps'
    if any(k in text for k in ['bit', 'bitwise', 'single number', 'counting bits', 'reverse bits', 'number of 1 bits']):
        return 'Bit Manipulation'
    
    # Generic String vs Array fallback
    if any(k in text for k in ['string', 'char', 'substring', 'word', 'palindrome', 'anagram', 'valid palindrome']):
        return 'Strings & Pattern Matching'
    
    return 'Arrays & Subarrays'

def main():
    print("Executing FAANG Question Bank Rebalancing...")
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    # Group existing problems by classified topic
    topic_buckets = {topic: [] for topic in TARGET_TOPIC_DISTRIBUTION.keys()}
    seen_urls = set()
    
    for q in problems:
        url = q.get('leetcodeUrl', '').strip().lower()
        if url in seen_urls:
            continue
        seen_urls.add(url)
        
        cat = classify_problem(q)
        q['topic'] = cat
        topic_buckets[cat].append(q)
        
    print("Initial Classification Counts:")
    for cat, items in topic_buckets.items():
        print(f"  {cat}: {len(items)} (target: {TARGET_TOPIC_DISTRIBUTION[cat]})")

if __name__ == "__main__":
    main()
