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

    print(f"Loaded {len(problems)} problems for reordering with Hard starting at Page 3 (Q101).")

    # Verify uniqueness
    seen = set()
    unique_problems = []
    for p in problems:
        t = p['title'].strip().lower()
        if t not in seen:
            seen.add(t)
            unique_problems.append(p)

    assert len(unique_problems) == 1000, f"Expected 1000 unique problems, got {len(unique_problems)}"

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
    assert len(easy_pool) == 200 and len(med_pool) == 500 and len(hard_pool) == 300, "Pool size mismatch!"

    reordered = []
    recent_topics = []

    def pop_next(pool):
        if not pool:
            return None
        for i, p in enumerate(pool):
            if p.get('topic') not in recent_topics:
                return pool.pop(i)
        return pool.pop(0)

    # Page 1 (Q1 - Q50): 35 Easy, 15 Medium, 0 Hard
    # Page 2 (Q51 - Q100): 25 Easy, 25 Medium, 0 Hard
    # Page 3 - 6 (Q101 - Q300, 4 pages): Each page 15 Easy, 25 Medium, 10 Hard
    # Page 7 - 12 (Q301 - Q600, 6 pages): Each page 10 Easy, 25 Medium, 15 Hard
    # Page 13 - 18 (Q601 - Q900, 6 pages): Each page 3 Easy, 28 Medium, 19 Hard
    # Page 19 - 20 (Q901 - Q1000, 2 pages): Each page 1 Easy, 21 Medium, 28 Hard

    page_allocations = [
        # Page 1 (Q1-50): 0 Hard
        (35, 15, 0),
        # Page 2 (Q51-100): 0 Hard
        (25, 25, 0),
        # Page 3 (Q101-150): HARD STARTS HERE!
        (15, 25, 10),
        # Page 4 (Q151-200)
        (15, 25, 10),
        # Page 5 (Q201-250)
        (15, 25, 10),
        # Page 6 (Q251-300)
        (15, 25, 10),
        # Page 7 (Q301-350)
        (10, 25, 15),
        # Page 8 (Q351-400)
        (10, 25, 15),
        # Page 9 (Q401-450)
        (10, 25, 15),
        # Page 10 (Q451-500)
        (10, 25, 15),
        # Page 11 (Q501-550)
        (10, 25, 15),
        # Page 12 (Q551-600)
        (10, 25, 15),
        # Page 13 (Q601-650)
        (3, 28, 19),
        # Page 14 (Q651-700)
        (3, 28, 19),
        # Page 15 (Q701-750)
        (3, 28, 19),
        # Page 16 (Q751-800)
        (3, 28, 19),
        # Page 17 (Q801-850)
        (3, 28, 19),
        # Page 18 (Q851-900)
        (3, 28, 19),
        # Page 19 (Q901-950)
        (1, 21, 28),
        # Page 20 (Q951-1000)
        (1, 21, 28)
    ]

    total_target_easy = sum(a[0] for a in page_allocations)
    total_target_med = sum(a[1] for a in page_allocations)
    total_target_hard = sum(a[2] for a in page_allocations)

    print(f"Allocations total: Easy={total_target_easy}, Medium={total_target_med}, Hard={total_target_hard}")
    assert total_target_easy == 200 and total_target_med == 500 and total_target_hard == 300, "Allocation sum mismatch!"

    for page_idx, (t_e, t_m, t_h) in enumerate(page_allocations, start=1):
        sec_e, sec_m, sec_h = t_e, t_m, t_h
        sec_total = sec_e + sec_m + sec_h

        for slot in range(1, sec_total + 1):
            last_was_hard = len(reordered) > 0 and reordered[-1]["difficulty"] == "Hard"

            want_hard = False
            if sec_h > 0 and not last_was_hard:
                interval = max(2, round(sec_total / t_h)) if t_h > 0 else 999
                if slot % interval == 0 or sec_h >= (sec_total - slot + 1):
                    want_hard = True

            if want_hard and hard_pool and sec_h > 0:
                item = pop_next(hard_pool)
                sec_h -= 1
            else:
                if sec_e > 0 and sec_m > 0:
                    if len(reordered) % 2 == 0:
                        item = pop_next(easy_pool)
                        sec_e -= 1
                    else:
                        item = pop_next(med_pool)
                        sec_m -= 1
                elif sec_e > 0:
                    item = pop_next(easy_pool)
                    sec_e -= 1
                elif sec_m > 0:
                    item = pop_next(med_pool)
                    sec_m -= 1
                elif sec_h > 0 and hard_pool:
                    item = pop_next(hard_pool)
                    sec_h -= 1
                else:
                    if easy_pool: item = pop_next(easy_pool)
                    elif med_pool: item = pop_next(med_pool)
                    elif hard_pool: item = pop_next(hard_pool)

            assert item is not None, f"Failed to select item for Page {page_idx} slot {slot}"
            reordered.append(item)
            recent_topics.append(item.get('topic'))
            if len(recent_topics) > 3:
                recent_topics.pop(0)

    print(f"\nFinal reordered total: {len(reordered)}")
    assert len(reordered) == 1000, f"Expected 1000, got {len(reordered)}"

    # Re-assign sequential IDs 1 to 1000
    for idx, p in enumerate(reordered, start=1):
        p["id"] = idx
        p["number"] = idx
        p["sequence_number"] = idx
        p["relatedProblems"] = [max(1, idx - 1), min(1000, idx + 1)]
        p["prerequisites"] = [max(1, idx - 2)]

    print("\n--- DIFFICULTY BREAKDOWN PER PAGE (50 Qs per page) ---")
    for page in range(1, 21):
        chunk = reordered[(page-1)*50 : page*50]
        counts = collections.Counter(p["difficulty"] for p in chunk)
        print(f"Page {page:2d} (Q{(page-1)*50+1:03d}-Q{page*50:03d}): Easy={counts['Easy']:2d} | Medium={counts['Medium']:2d} | Hard={counts['Hard']:2d}")

    # Write back data/questions.js
    output_content = f"// Canonical 1000 Verified Real LeetCode Dataset — Hard Questions Merged Starting from Page 3 (Q101)\nconst PROBLEMS = {json.dumps(reordered, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(questions_path, "w", encoding="utf-8") as f:
        f.write(output_content)

    print(f"\n[SUCCESS] Successfully updated {questions_path} with Hard questions starting on Page 3 (Q101)!")

if __name__ == "__main__":
    main()
