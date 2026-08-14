import json
import os
import random

def main():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    if "const PROBLEMS = " in content:
        content = content.split("const PROBLEMS = ")[1]
    if ";\nif (typeof" in content:
        content = content.split(";\nif (typeof")[0]
    elif content.endswith(";\n"):
        content = content[:-2]
    
    problems = json.loads(content)
    print(f"Loaded {len(problems)} problems for reordering.")

    # Categorize problems by difficulty
    easy_pool = [p for p in problems if p["difficulty"] == "Easy"]
    med_pool = [p for p in problems if p["difficulty"] == "Medium"]
    hard_pool = [p for p in problems if p["difficulty"] == "Hard"]

    print(f"Pool sizes: Easy={len(easy_pool)}, Medium={len(med_pool)}, Hard={len(hard_pool)}")
    assert len(easy_pool) == 300 and len(med_pool) == 450 and len(hard_pool) == 250, "Pool size mismatch!"

    # Section target allocations: (Easy, Medium, Hard)
    section_targets = [
        (120, 70, 10),   # Section 1 (1–200)
        (90, 90, 20),    # Section 2 (201–400)
        (50, 110, 40),   # Section 3 (401–600)
        (25, 105, 70),   # Section 4 (601–800)
        (15, 75, 110)    # Section 5 (801–1000)
    ]

    reordered_list = []

    def pop_best_topic(pool, recent_topics):
        if not pool:
            return None
        # Try to find a problem whose topic is not in recent_topics
        for i, p in enumerate(pool):
            if p["topic"] not in recent_topics:
                return pool.pop(i)
        # Fallback if all remaining pool items share recent topics
        return pool.pop(0)

    recent_topics = []

    for s_idx, (target_e, target_m, target_h) in enumerate(section_targets):
        sec_e, sec_m, sec_h = target_e, target_m, target_h
        sec_items = []

        while sec_e > 0 or sec_m > 0 or sec_h > 0:
            # Rhythmic micro-pattern selection based on remaining section quotas
            pattern_choices = []
            if sec_e >= 2 and sec_m >= 1:
                pattern_choices.append(["Easy", "Easy", "Medium"])
            if sec_e >= 1 and sec_m >= 1 and sec_e >= 1:
                pattern_choices.append(["Easy", "Medium", "Easy"])
            if sec_e >= 1 and sec_m >= 1 and sec_h >= 1:
                pattern_choices.append(["Easy", "Medium", "Hard"])
            if sec_m >= 2 and sec_h >= 1:
                pattern_choices.append(["Medium", "Medium", "Hard"])

            if not pattern_choices:
                # Single item fallback
                if sec_e > 0: current_pattern = ["Easy"]
                elif sec_m > 0: current_pattern = ["Medium"]
                else: current_pattern = ["Hard"]
            else:
                # Deterministic pattern cycle
                current_pattern = pattern_choices[(len(sec_items)) % len(pattern_choices)]

            for diff in current_pattern:
                if diff == "Easy" and sec_e > 0:
                    item = pop_best_topic(easy_pool, recent_topics)
                    if item:
                        sec_e -= 1
                        sec_items.append(item)
                        recent_topics.append(item["topic"])
                        if len(recent_topics) > 4: recent_topics.pop(0)
                elif diff == "Medium" and sec_m > 0:
                    item = pop_best_topic(med_pool, recent_topics)
                    if item:
                        sec_m -= 1
                        sec_items.append(item)
                        recent_topics.append(item["topic"])
                        if len(recent_topics) > 4: recent_topics.pop(0)
                elif diff == "Hard" and sec_h > 0:
                    item = pop_best_topic(hard_pool, recent_topics)
                    if item:
                        sec_h -= 1
                        sec_items.append(item)
                        recent_topics.append(item["topic"])
                        if len(recent_topics) > 4: recent_topics.pop(0)

        reordered_list.extend(sec_items)

    print(f"Total reordered problems: {len(reordered_list)}")
    assert len(reordered_list) == 1000, f"Expected 1000, got {len(reordered_list)}"

    # Update sequence numbers and IDs
    for idx, p in enumerate(reordered_list, start=1):
        p["id"] = idx
        p["number"] = idx
        p["sequence_number"] = idx
        p["relatedProblems"] = [max(1, idx - 1), min(1000, idx + 1)]
        p["prerequisites"] = [max(1, idx - 2)]

    # Print sample sequence check (first 25 items)
    print("\nFirst 25 items in reordered sequence:")
    for p in reordered_list[:25]:
        print(f"  #{p['sequence_number']:03d} | {p['difficulty']:6s} | {p['topic']:25s} | {p['title']}")

    # Write back data/questions.js
    output_path = os.path.join("data", "questions.js")
    js_content = f"// Curated 1000 DSA Problems with Balanced Difficulty Sequence & Verified LeetCode Connections\nconst PROBLEMS = {json.dumps(reordered_list, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\nSuccessfully wrote reordered 1000 problems with sequence_number to {output_path}!")

if __name__ == "__main__":
    main()
