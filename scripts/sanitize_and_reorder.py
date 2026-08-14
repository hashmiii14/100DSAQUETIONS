import json
import re

TOPIC_MAP = {
    "Arrays & Subarrays": "Arrays",
    "Arrays": "Arrays",
    "Strings & Pattern Matching": "Strings",
    "Strings": "Strings",
    "Hashing & Frequency Maps": "Hashing",
    "Hashing": "Hashing",
    "Two Pointers": "Two Pointers",
    "Sliding Window": "Sliding Window",
    "Prefix Sum & Difference Array": "Prefix Sum",
    "Prefix Sum": "Prefix Sum",
    "Binary Search & Search Space": "Binary Search",
    "Binary Search": "Binary Search",
    "Recursion & Backtracking": "Backtracking",
    "Backtracking": "Backtracking",
    "Linked Lists": "Linked List",
    "Linked List": "Linked List",
    "Stack & Monotonic Stack": "Stack",
    "Stack": "Stack",
    "Queue & Deque": "Queue",
    "Queue": "Queue",
    "Binary Trees": "Trees",
    "Trees": "Trees",
    "Binary Search Trees (BST)": "BST",
    "BST": "BST",
    "Heap & Priority Queue": "Heap",
    "Heap": "Heap",
    "Trie (Prefix Tree)": "Trie",
    "Trie": "Trie",
    "Graphs, BFS & DFS": "Graphs",
    "Graphs": "Graphs",
    "Topological Sort & Shortest Path": "Graphs",
    "Disjoint Set Union (Union Find / DSU)": "Union Find",
    "Union Find": "Union Find",
    "Greedy Algorithms": "Greedy",
    "Greedy": "Greedy",
    "Dynamic Programming (1D & 2D)": "Dynamic Programming",
    "Dynamic Programming": "Dynamic Programming",
    "Bit Manipulation": "Bit Manipulation"
}

def sanitize_and_reorder():
    print("Sanitizing topic taxonomy and reordering dataset...")
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    seen_urls = set()
    seen_titles = set()
    
    clean_problems = []
    for q in problems:
        # Standardize topic
        t = q.get('topic', 'Arrays')
        q['topic'] = TOPIC_MAP.get(t, t)
        
        # Verify URL
        url = (q.get('leetcode_url') or q.get('leetcodeUrl') or '').strip()
        assert url.startswith("https://leetcode.com/problems/"), f"Invalid URL: {url}"
        assert not url.endswith("/problems//"), f"Malformed URL: {url}"
        assert "-var-" not in url, f"Synthetic URL detected: {url}"
        
        url_lower = url.lower()
        title_lower = q['title'].strip().lower()
        
        assert url_lower not in seen_urls, f"Duplicate URL: {url}"
        assert title_lower not in seen_titles, f"Duplicate Title: {q['title']}"
        
        seen_urls.add(url_lower)
        seen_titles.add(title_lower)
        clean_problems.append(q)
        
    print(f"Verified {len(clean_problems)} clean unique problems.")
    
    # 2. Re-arrange difficulty progression: Easy -> Easy -> Easy -> Medium -> Easy -> Medium -> Hard -> Easy -> Medium -> Hard
    easy_list = [q for q in clean_problems if q['difficulty'] == 'Easy']
    med_list = [q for q in clean_problems if q['difficulty'] == 'Medium']
    hard_list = [q for q in clean_problems if q['difficulty'] == 'Hard']
    
    print(f"Difficulty counts: Easy={len(easy_list)}, Medium={len(med_list)}, Hard={len(hard_list)}")
    
    # Easy foundation (first 35)
    easy_start = easy_list[:35]
    easy_rem = easy_list[35:]
    med_rem = list(med_list)
    hard_rem = list(hard_list)
    
    pattern = ['Easy', 'Easy', 'Easy', 'Medium', 'Easy', 'Medium', 'Hard', 'Easy', 'Medium', 'Hard']
    interleaved = []
    p_idx = 0
    
    non_hard = easy_rem + med_rem
    step = len(non_hard) / len(hard_rem) if hard_rem else 1
    
    for i, h in enumerate(hard_rem):
        target_idx = int(i * step)
        while len(interleaved) - i < target_idx and non_hard:
            interleaved.append(non_hard.pop(0))
        interleaved.append(h)
        
    while non_hard:
        interleaved.append(non_hard.pop(0))
        
    curriculum = easy_start + interleaved
    curriculum = curriculum[:1000]
    
    # Check max consecutive hard
    max_hard = 0
    cur_hard = 0
    for q in curriculum:
        if q['difficulty'] == 'Hard':
            cur_hard += 1
            max_hard = max(max_hard, cur_hard)
        else:
            cur_hard = 0
            
    print(f"Curriculum length: {len(curriculum)}")
    print(f"Max consecutive Hard problems: {max_hard}")
    
    # Re-assign sequential integer IDs 1 to 1000
    for idx, q in enumerate(curriculum, start=1):
        q['id'] = idx
        
    js_output = f"// Canonical 1000 DSA Problems Dataset — Standard Taxonomy & Verified LeetCode Connections\nconst PROBLEMS = {json.dumps(curriculum, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open("data/questions.js", "w", encoding="utf-8") as f:
        f.write(js_output)
    print("Successfully updated data/questions.js!")

if __name__ == "__main__":
    sanitize_and_reorder()
