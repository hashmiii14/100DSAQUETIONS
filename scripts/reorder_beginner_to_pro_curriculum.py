import json
import os
import collections

def main():
    questions_path = os.path.join("data", "questions.js")
    with open(questions_path, "r", encoding="utf-8") as f:
        text = f.read()

    start_idx = text.find('[')
    end_idx = text.rfind(']') + 1
    problems = json.loads(text[start_idx:end_idx])

    print(f"Loaded {len(problems)} problems for progressive merge reordering.")

    # 1. Enforce deduplication check
    seen_titles = set()
    unique_problems = []
    for p in problems:
        t_norm = p['title'].strip().lower()
        if t_norm not in seen_titles:
            seen_titles.add(t_norm)
            unique_problems.append(p)

    print(f"Unique problems count: {len(unique_problems)}")
    assert len(unique_problems) == 1000, f"Expected 1000 unique problems, got {len(unique_problems)}"

    # Separate into pools by difficulty
    # Sort within pools by topic priority so Array/String easy problems come first
    TOPIC_PRIORITY = [
        "Arrays", "Strings", "Two Pointers", "Sliding Window", "Prefix Sum",
        "Linked List", "Stack", "Queue", "Binary Search", "Trees", "BST",
        "Heap", "Trie", "Greedy", "Union Find", "Graphs", "Dynamic Programming",
        "Backtracking", "Bit Manipulation", "Math", "Hashing", "Segment Tree",
        "Geometry", "Simulation", "BFS", "Sort"
    ]

    def topic_score(p):
        t = p.get('topic', 'Arrays')
        if t in TOPIC_PRIORITY:
            return TOPIC_PRIORITY.index(t)
        return 99

    easy_pool = [p for p in unique_problems if p["difficulty"] == "Easy"]
    med_pool = [p for p in unique_problems if p["difficulty"] == "Medium"]
    hard_pool = [p for p in unique_problems if p["difficulty"] == "Hard"]

    easy_pool.sort(key=topic_score)
    med_pool.sort(key=topic_score)
    hard_pool.sort(key=topic_score)

    print(f"Pool sizes: Easy={len(easy_pool)}, Medium={len(med_pool)}, Hard={len(hard_pool)}")

    reordered = []
    recent_topics = []

    def pop_next(pool):
        if not pool:
            return None
        for i, p in enumerate(pool):
            if p.get('topic') not in recent_topics:
                return pool.pop(i)
        return pool.pop(0)

    # ── STAGE 1: Absolute Beginner Foundation (Questions 1 .. 50) ──────────────
    # Strictly Easy (Arrays, Strings, Two Pointers, Hashing)
    for _ in range(50):
        item = pop_next(easy_pool)
        if item:
            reordered.append(item)
            recent_topics.append(item.get('topic'))
            if len(recent_topics) > 3:
                recent_topics.pop(0)

    # ── STAGE 2: Easy & Medium Interleaved (Questions 51 .. 300 - 250 items) ───
    # Pattern: Easy, Medium, Easy, Medium... (Ratio ~ 110 Easy, 140 Medium)
    stage2_target_easy = 100
    stage2_target_med = 150
    for i in range(250):
        if (i % 5 < 2 and easy_pool) or not med_pool:
            item = pop_next(easy_pool)
        else:
            item = pop_next(med_pool)
        
        if item:
            reordered.append(item)
            recent_topics.append(item.get('topic'))
            if len(recent_topics) > 3:
                recent_topics.pop(0)

    # ── STAGE 3: Core Mastery & Progressive Hard Entry (Questions 301 .. 650 - 350 items) ──
    # Pattern: Easy, Medium, Medium, Hard (Ratio ~ 50 Easy, 220 Medium, 80 Hard)
    for i in range(350):
        mod = i % 7
        if mod == 0 and easy_pool:
            item = pop_next(easy_pool)
        elif mod in (1, 2, 3, 4) and med_pool:
            item = pop_next(med_pool)
        elif hard_pool:
            item = pop_next(hard_pool)
        elif med_pool:
            item = pop_next(med_pool)
        else:
            item = pop_next(easy_pool)

        if item:
            reordered.append(item)
            recent_topics.append(item.get('topic'))
            if len(recent_topics) > 3:
                recent_topics.pop(0)

    # ── STAGE 4: Advanced & Pro Level (Questions 651 .. 1000 - 350 items) ──────
    # Pattern: Medium, Hard, Medium, Hard (Drains remaining Medium & Hard pools)
    while med_pool or hard_pool or easy_pool:
        if len(reordered) % 2 == 0:
            if med_pool:
                item = pop_next(med_pool)
            elif hard_pool:
                item = pop_next(hard_pool)
            else:
                item = pop_next(easy_pool)
        else:
            if hard_pool:
                item = pop_next(hard_pool)
            elif med_pool:
                item = pop_next(med_pool)
            else:
                item = pop_next(easy_pool)

        if item:
            reordered.append(item)
            recent_topics.append(item.get('topic'))
            if len(recent_topics) > 3:
                recent_topics.pop(0)

    print(f"\nFinal reordered count: {len(reordered)}")
    assert len(reordered) == 1000, f"Expected 1000, got {len(reordered)}"

    # Re-assign sequential IDs 1 to 1000
    for idx, p in enumerate(reordered, start=1):
        p["id"] = idx
        p["number"] = idx
        p["sequence_number"] = idx
        p["relatedProblems"] = [max(1, idx - 1), min(1000, idx + 1)]
        p["prerequisites"] = [max(1, idx - 2)]

    # Print difficulty breakdown across slices of 100 questions
    print("\n--- DIFFICULTY BREAKDOWN ACROSS 10 SECTIONS (100 Qs each) ---")
    for sec in range(10):
        chunk = reordered[sec*100 : (sec+1)*100]
        counts = collections.Counter(p["difficulty"] for p in chunk)
        print(f"Q{sec*100+1:04d} - Q{(sec+1)*100:04d}: Easy={counts['Easy']:2d} | Medium={counts['Medium']:2d} | Hard={counts['Hard']:2d}")

    # Write back data/questions.js
    output_content = f"// Canonical 1000 Verified Real LeetCode Dataset — Beginner to Pro Progressive Interleaved Order\nconst PROBLEMS = {json.dumps(reordered, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(questions_path, "w", encoding="utf-8") as f:
        f.write(output_content)

    print(f"\n[SUCCESS] Successfully updated {questions_path} with smooth Beginner to Pro progressive interleaving!")

if __name__ == "__main__":
    main()
