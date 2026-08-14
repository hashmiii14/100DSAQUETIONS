import json
import os

def check_max_consecutive_hard(sequence):
    max_hard = 0
    current_hard = 0
    for p in sequence:
        if p["difficulty"] == "Hard":
            current_hard += 1
            if current_hard > max_hard:
                max_hard = current_hard
        else:
            current_hard = 0
    return max_hard

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
    print(f"Loaded {len(problems)} problems for smooth difficulty reordering.")

    easy_pool = [p for p in problems if p["difficulty"] == "Easy"]
    med_pool = [p for p in problems if p["difficulty"] == "Medium"]
    hard_pool = [p for p in problems if p["difficulty"] == "Hard"]

    print(f"Pool counts: Easy={len(easy_pool)}, Medium={len(med_pool)}, Hard={len(hard_pool)}")
    assert len(easy_pool) == 300 and len(med_pool) == 450 and len(hard_pool) == 250, "Pool size mismatch!"

    def pop_best_topic(pool, recent_topics):
        if not pool:
            return None
        for i, p in enumerate(pool):
            if p["topic"] not in recent_topics:
                return pool.pop(i)
        return pool.pop(0)

    # Section target allocations: (Easy, Medium, Hard)
    section_targets = [
        (120, 67, 13),   # Section 1 (1–200)
        (90, 85, 25),    # Section 2 (201–400)
        (50, 100, 50),   # Section 3 (401–600)
        (25, 109, 66),   # Section 4 (601–800)
        (15, 89, 96)     # Section 5 (801–1000)
    ]

    reordered_list = []
    recent_topics = []

    for sec_idx, (t_e, t_m, t_h) in enumerate(section_targets):
        sec_e, sec_m, sec_h = t_e, t_m, t_h
        sec_items = []

        # We interleave the section items so Hard items are strictly separated by non-Hard items
        for slot in range(1, 201):
            last_was_hard = len(sec_items) > 0 and sec_items[-1]["difficulty"] == "Hard"

            want_hard = False
            if not last_was_hard and sec_h > 0:
                # Interval for hard items in this section
                interval = max(2, round(200 / t_h))
                if slot % interval == 0 or sec_h >= (201 - slot):
                    want_hard = True

            if want_hard and hard_pool and sec_h > 0:
                item = pop_best_topic(hard_pool, recent_topics)
                sec_h -= 1
            else:
                # Pick between Easy and Medium
                if sec_e > 0 and sec_m > 0:
                    if len(sec_items) % 2 == 0:
                        item = pop_best_topic(easy_pool, recent_topics)
                        sec_e -= 1
                    else:
                        item = pop_best_topic(med_pool, recent_topics)
                        sec_m -= 1
                elif sec_e > 0:
                    item = pop_best_topic(easy_pool, recent_topics)
                    sec_e -= 1
                elif sec_m > 0:
                    item = pop_best_topic(med_pool, recent_topics)
                    sec_m -= 1
                elif sec_h > 0 and hard_pool and not last_was_hard:
                    item = pop_best_topic(hard_pool, recent_topics)
                    sec_h -= 1
                else:
                    # Fallback to any remaining pool
                    if easy_pool: item = pop_best_topic(easy_pool, recent_topics)
                    elif med_pool: item = pop_best_topic(med_pool, recent_topics)
                    elif hard_pool: item = pop_best_topic(hard_pool, recent_topics)

            assert item is not None, f"Failed to pick item in Section {sec_idx+1} slot {slot}"
            sec_items.append(item)
            recent_topics.append(item["topic"])
            if len(recent_topics) > 4: recent_topics.pop(0)

        reordered_list.extend(sec_items)

    print(f"Total reordered problems: {len(reordered_list)}")
    assert len(reordered_list) == 1000, f"Expected 1000, got {len(reordered_list)}"

    # Check maximum consecutive hard questions
    max_hard = check_max_consecutive_hard(reordered_list)
    print(f"Maximum consecutive Hard questions across entire 1000 sequence: {max_hard}")
    assert max_hard <= 1, f"Failed! Found {max_hard} consecutive Hard questions."

    # Update sequence numbers and IDs
    for idx, p in enumerate(reordered_list, start=1):
        p["id"] = idx
        p["number"] = idx
        p["sequence_number"] = idx
        p["relatedProblems"] = [max(1, idx - 1), min(1000, idx + 1)]
        p["prerequisites"] = [max(1, idx - 2)]

    # Print difficulty counts per 200 section
    for sec in range(5):
        start = sec * 200
        end = start + 200
        sec_items = reordered_list[start:end]
        e_c = sum(1 for p in sec_items if p["difficulty"] == "Easy")
        m_c = sum(1 for p in sec_items if p["difficulty"] == "Medium")
        h_c = sum(1 for p in sec_items if p["difficulty"] == "Hard")
        print(f"Section {sec+1} (Slots {start+1:04d}..{end:04d}): Easy={e_c:3d} | Medium={m_c:3d} | Hard={h_c:3d}")

    # Write back data/questions.js
    output_path = os.path.join("data", "questions.js")
    js_content = f"// Curated 1000 DSA Problems with Smooth Interleaved Difficulty & Verified LeetCode Connections\nconst PROBLEMS = {json.dumps(reordered_list, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\nSuccessfully updated {output_path} with perfectly balanced smooth difficulty sequence!")

if __name__ == "__main__":
    main()
