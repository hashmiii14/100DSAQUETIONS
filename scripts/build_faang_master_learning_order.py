import json
import os
import re

# FAANG Master Learning Order Curriculum Engine

STAGE_DEFINITIONS = [
    (1, 15, "Stage 1: Absolute Beginner Foundations", "Gentle introduction to arrays, strings, loops, basic frequency counting, and core problem-solving intuition."),
    (16, 70, "Stage 2: Core Problem Solving", "Foundational patterns: prefix sum, two pointers, sliding window, basic linked list, stack, and tree traversals."),
    (71, 150, "Stage 3: Pattern Recognition", "Core pattern mastery: binary search variations, monotonic stack, priority queues, and grid BFS/DFS."),
    (151, 300, "Stage 4: Core Data Structures", "Advanced structures & graph basics: BST, Trie prefix trees, Union-Find (DSU), topological sort, and 1D/2D DP."),
    (301, 600, "Stage 5: Intermediate Algorithms", "Algorithmic depth: LRU/LFU design, Dijkstra shortest path, knapsack DP, interval scheduling, and tree LCA."),
    (601, 800, "Stage 6: Advanced Data Structures & Graphs", "High-level structures: Segment Trees, Fenwick Trees, Trie + DFS word search, and complex graph algorithms."),
    (801, 950, "Stage 7: Dynamic Programming & Advanced Problem Solving", "Deep DP & state modeling: tree DP, bitmask DP, sliding window median, and hard optimization techniques."),
    (951, 1000, "Stage 8: FAANG Interview Mastery", "Multi-pattern combination problems testing holistic interview readiness and trade-off analysis.")
]

# Concept tags and novelty mapping for smooth transitions
CONCEPT_MAP = {
    "Arrays": ("Array Indexing & Iteration", ["Loop Traversal", "In-Place Modification"]),
    "Strings": ("String Manipulation & ASCII Maps", ["Character Traversal", "Substring Extraction"]),
    "Hashing": ("Hash Map & Frequency Tracking", ["O(1) Complement Lookup", "Value Frequency Buckets"]),
    "Two Pointers": ("Two Pointers Convergence", ["Opposite Direction Pointers", "Fast & Slow Pointers"]),
    "Sliding Window": ("Sliding Window Bounds", ["Fixed Window Sum", "Variable Substring Window"]),
    "Prefix Sum": ("Prefix Sum Cumulative Query", ["O(1) Range Sum Query", "Difference Array Updates"]),
    "Binary Search": ("Binary Search & Search Space", ["Logarithmic Search", "Search on Answer Space"]),
    "Backtracking": ("Recursion & State Backtracking", ["Choose-Explore-Unchoose Template", "Pruning Search Tree"]),
    "Linked List": ("Linked List Pointer Manipulation", ["Node Pointer Reversal", "Fast & Slow Pointer Cycle"]),
    "Stack": ("LIFO Stack & Monotonic Stack", ["Valid Parentheses Verification", "Next Greater Element"]),
    "Queue": ("FIFO Queue & Monotonic Deque", ["Level-Order BFS Queue", "Sliding Window Maximum"]),
    "Trees": ("Tree Traversals & Structural Invariants", ["DFS Inorder/Preorder/Postorder", "Lowest Common Ancestor"]),
    "BST": ("BST Invariant & Binary Search", ["Inorder Sorted Property", "BST Insertion & Deletion"]),
    "Heap": ("Heap Priority Queue Management", ["Min-Heap Top K Elements", "Median Stream Processing"]),
    "Trie": ("Trie Prefix Tree Operations", ["Character Node Traversal", "Prefix Matching & Search"]),
    "Graphs": ("Graph Connectivity & Traversal", ["Grid BFS/DFS Islands", "Cycle Detection & Topological Sort"]),
    "Union Find": ("Disjoint Set Union (DSU)", ["Path Compression & Rank", "Connected Components"]),
    "Greedy": ("Greedy Choice Property", ["Locally Optimal Selection", "Interval Scheduling"]),
    "Dynamic Programming": ("DP State Recurrence & Memoization", ["Top-Down & Bottom-Up Tabulation", "0/1 Knapsack & Subsequence DP"]),
    "Bit Manipulation": ("Bitwise Arithmetic & Bitmasking", ["XOR Bit Cancellation", "Subsets via Bitmask"])
}

def get_stage_info(idx):
    for s_id, s_end, name, desc in STAGE_DEFINITIONS:
        if idx <= s_end:
            return s_id, name, desc
    return 8, STAGE_DEFINITIONS[-1][2], STAGE_DEFINITIONS[-1][3]

def main():
    print("Executing FAANG Master Learning Order Curriculum Engine...")
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    print(f"Loaded {len(problems)} problems for curriculum ordering...")
    
    # Store original order index if not already saved
    for i, p in enumerate(problems, start=1):
        if 'originalOrder' not in p:
            p['originalOrder'] = i
            
    # Separate by difficulty
    easy_probs = [p for p in problems if p['difficulty'] == 'Easy']
    med_probs = [p for p in problems if p['difficulty'] == 'Medium']
    hard_probs = [p for p in problems if p['difficulty'] == 'Hard']
    
    print(f"Pool Breakdown: Easy={len(easy_probs)}, Medium={len(med_probs)}, Hard={len(hard_probs)}")
    
    # Target Stage Allocation & Difficulty Constraints:
    # 1. Stage 1 (1-15): 15 Easy beginner problems
    # 2. Stage 2 (16-70): 55 problems (Mix of Easy & Medium ONLY. 0 Hard.)
    # 3. Stage 3 (71-150): 80 problems (Easy + Medium + limited Hard ~8)
    # 4. Stage 4 (151-300): 150 problems (Medium + Hard ~22 + Easy reinforcement)
    # 5. Stage 5 (301-600): 300 problems (Medium + Hard ~75)
    # 6. Stage 6 (601-800): 200 problems (Medium + Hard ~65)
    # 7. Stage 7 (801-950): 150 problems (Medium + Hard ~50)
    # 8. Stage 8 (951-1000): 50 problems (Medium + Hard ~30)
    
    # Helper to pull next problem balancing topic diversity
    def pull_next(source_pool, prev_topic=None):
        if not source_pool:
            return None
        if prev_topic:
            for idx, item in enumerate(source_pool):
                if item['topic'] != prev_topic:
                    return source_pool.pop(idx)
        return source_pool.pop(0)

    # Stage 1: Problems 1-15 (15 Easy)
    stage1_probs = []
    for _ in range(15):
        prev_t = stage1_probs[-1]['topic'] if stage1_probs else None
        p = pull_next(easy_probs, prev_t) or pull_next(easy_probs)
        stage1_probs.append(p)
        
    # Stage 2: Problems 16-70 (25 Easy + 30 Medium, 0 Hard)
    stage2_probs = []
    e_st2 = 25
    m_st2 = 30
    for i in range(55):
        prev_t = (stage2_probs[-1]['topic'] if stage2_probs else stage1_probs[-1]['topic'])
        if (i % 2 == 0 and e_st2 > 0 and easy_probs) or m_st2 == 0:
            p = pull_next(easy_probs, prev_t) or pull_next(easy_probs)
            if p:
                stage2_probs.append(p)
                e_st2 -= 1
        elif m_st2 > 0 and med_probs:
            p = pull_next(med_probs, prev_t) or pull_next(med_probs)
            if p:
                stage2_probs.append(p)
                m_st2 -= 1
                
    # Stage 3 to 8: Remaining 930 problems (Easy: 260, Medium: 420, Hard: 250)
    # Stage 3 (71-150, 80 probs): Easy=30, Medium=42, Hard=8
    # Stage 4 (151-300, 150 probs): Easy=60, Medium=68, Hard=22
    # Stage 5 (301-600, 300 probs): Easy=100, Medium=130, Hard=70
    # Stage 6 (601-800, 200 probs): Easy=50, Medium=90, Hard=60
    # Stage 7 (801-950, 150 probs): Easy=20, Medium=70, Hard=60
    # Stage 8 (951-1000, 50 probs): Easy=0, Medium=20, Hard=30
    
    stage_targets = [
        (30, 42, 8),     # Stage 3: 80 probs
        (60, 68, 22),    # Stage 4: 150 probs
        (100, 130, 70),  # Stage 5: 300 probs
        (50, 90, 60),    # Stage 6: 200 probs
        (20, 70, 60),    # Stage 7: 150 probs
        (0, 20, 30),     # Stage 8: 50 probs
    ]
    
    rem_stages_probs = []
    
    for e_target, m_target, h_target in stage_targets:
        stage_pool = []
        e_left, m_left, h_left = e_target, m_target, h_target
        stage_total = e_target + m_target + h_target
        
        for i in range(stage_total):
            prev_t = stage_pool[-1]['topic'] if stage_pool else (rem_stages_probs[-1]['topic'] if rem_stages_probs else stage2_probs[-1]['topic'])
            
            # Interleave Easy, Medium, Hard smoothly
            p = None
            if i % 7 == 6 and h_left > 0 and hard_probs:
                p = pull_next(hard_probs, prev_t) or pull_next(hard_probs)
                if p: h_left -= 1
            elif (i % 2 == 0 or m_left == 0) and e_left > 0 and easy_probs:
                p = pull_next(easy_probs, prev_t) or pull_next(easy_probs)
                if p: e_left -= 1
            elif m_left > 0 and med_probs:
                p = pull_next(med_probs, prev_t) or pull_next(med_probs)
                if p: m_left -= 1
            elif h_left > 0 and hard_probs:
                p = pull_next(hard_probs, prev_t) or pull_next(hard_probs)
                if p: h_left -= 1
                
            if not p:
                if easy_probs: p = pull_next(easy_probs)
                elif med_probs: p = pull_next(med_probs)
                elif hard_probs: p = pull_next(hard_probs)
                
            if p:
                stage_pool.append(p)
                
        rem_stages_probs.extend(stage_pool)
        
    ordered_list = stage1_probs + stage2_probs + rem_stages_probs
    ordered_list = ordered_list[:1000]
    
    print(f"Curriculum sequence assembled with {len(ordered_list)} problems.")
    
    # Enrich problems with FAANG Master Learning Order Metadata
    prev_topic = None
    prev_diff = None
    
    for idx, p in enumerate(ordered_list, start=1):
        s_id, s_name, s_desc = get_stage_info(idx)
        topic = p.get('topic', 'Arrays')
        diff = p.get('difficulty', 'Easy')
        
        concept_info = CONCEPT_MAP.get(topic, ("Data Structure & Algorithm Concept", ["Core Pattern Mastery"]))
        new_concept = f"{topic}: {concept_info[0]}"
        reinforced = concept_info[1]
        
        # Determine transition type
        if idx == 1:
            trans_type = "INTRODUCE"
        elif diff != prev_diff and diff == "Hard":
            trans_type = "ADVANCE_DIFFICULTY"
        elif topic != prev_topic:
            trans_type = "CHANGE_PATTERN"
        elif diff != prev_diff:
            trans_type = "EXTEND"
        else:
            trans_type = "REINFORCE"
            
        prev_topic = topic
        prev_diff = diff
        
        # Scoring metrics
        interview_score = 95 if topic in ["Arrays", "Strings", "Trees", "Dynamic Programming", "Graphs", "Two Pointers", "Sliding Window"] else 88
        faang_score = 98 if diff in ["Medium", "Hard"] else 85
        
        # Assign enriched attributes
        p['id'] = idx
        p['learningOrder'] = idx
        p['stage'] = s_id
        p['stageName'] = s_name
        p['stageDescription'] = s_desc
        p['newConcept'] = new_concept
        p['reinforcedConcepts'] = reinforced
        p['transitionType'] = trans_type
        p['interviewValueScore'] = interview_score
        p['faangRelevanceScore'] = faang_score
        p['prerequisites'] = [f"Foundations of {topic}"] if idx > 15 else ["Basic Programming & Loops"]
        p['isCanonical'] = True
        
    # Assert Stage 1 & Stage 2 difficulty rules
    stage1_diffs = [p['difficulty'] for p in ordered_list[:15]]
    stage2_hards = [p for p in ordered_list[:70] if p['difficulty'] == 'Hard']
    
    assert all(d == 'Easy' for d in stage1_diffs), f"Stage 1 must be 100% Easy, got: {stage1_diffs}"
    assert len(stage2_hards) == 0, f"Stage 1 & 2 must have ZERO Hard problems, got {len(stage2_hards)}"
    
    print("[SUCCESS] Stage 1 (100% Easy) & Stage 2 (0% Hard) difficulty assertions passed!")
    
    # Save enriched dataset to data/questions.js
    js_output = f"// FAANG Master Learning Order — 1000 Canonical DSA Problems Dataset\nconst PROBLEMS = {json.dumps(ordered_list, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open("data/questions.js", "w", encoding="utf-8") as f:
        f.write(js_output)
        
    print("Successfully saved FAANG Master Learning Order to data/questions.js!")

if __name__ == "__main__":
    main()
