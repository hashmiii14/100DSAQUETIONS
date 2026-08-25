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
    print(f"Loaded {len(problems)} problems for easy-start reordering.")

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

    recent_topics = []
    reordered_list = []

    # Step 1: First 35 questions are strictly EASY for a solid foundation
    for i in range(35):
        item = pop_best_topic(easy_pool, recent_topics)
        reordered_list.append(item)
        recent_topics.append(item["topic"])
        if len(recent_topics) > 4: recent_topics.pop(0)

    print(f"Added initial 35 Easy foundation problems. Remaining Easy: {len(easy_pool)}")

    # Step 2: Section target allocations for remaining 965 questions across 5 sections
    # Section 1 (Slots 36..200 - 165 items): 85 Easy, 67 Medium, 13 Hard
    # Section 2 (Slots 201..400 - 200 items): 90 Easy, 85 Medium, 25 Hard
    # Section 3 (Slots 401..600 - 200 items): 50 Easy, 100 Medium, 50 Hard
    # Section 4 (Slots 601..800 - 200 items): 25 Easy, 109 Medium, 66 Hard
    # Section 5 (Slots 801..1000 - 200 items): 15 Easy, 89 Medium, 96 Hard
    section_targets = [
        (85, 67, 13),    # Section 1 (165 items)
        (90, 85, 25),    # Section 2 (200 items)
        (50, 100, 50),   # Section 3 (200 items)
        (25, 109, 66),   # Section 4 (200 items)
        (15, 89, 96)     # Section 5 (200 items)
    ]

    for sec_idx, (t_e, t_m, t_h) in enumerate(section_targets):
        sec_e, sec_m, sec_h = t_e, t_m, t_h
        sec_count = sec_e + sec_m + sec_h

        for slot in range(1, sec_count + 1):
            last_was_hard = len(reordered_list) > 0 and reordered_list[-1]["difficulty"] == "Hard"

            want_hard = False
            if not last_was_hard and sec_h > 0:
                interval = max(2, round(sec_count / t_h))
                if slot % interval == 0 or sec_h >= (sec_count - slot + 1):
                    want_hard = True

            if want_hard and hard_pool and sec_h > 0:
                item = pop_best_topic(hard_pool, recent_topics)
                sec_h -= 1
            else:
                if sec_e > 0 and sec_m > 0:
                    if len(reordered_list) % 2 == 0:
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
                    if easy_pool: item = pop_best_topic(easy_pool, recent_topics)
                    elif med_pool: item = pop_best_topic(med_pool, recent_topics)
                    elif hard_pool: item = pop_best_topic(hard_pool, recent_topics)

            assert item is not None, f"Failed to pick item in Section {sec_idx+1} slot {slot}"
            reordered_list.append(item)
            recent_topics.append(item["topic"])
            if len(recent_topics) > 4: recent_topics.pop(0)

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

    # Print first 35 items difficulty check
    first_35_diffs = [p["difficulty"] for p in reordered_list[:35]]
    print(f"\nFirst 35 items difficulties: {set(first_35_diffs)}")
    assert set(first_35_diffs) == {"Easy"}, "First 35 items must be strictly Easy!"

    # Write back data/questions.js
    output_path = os.path.join("data", "questions.js")
    js_content = f"// Curated 1000 DSA Problems starting with Easy foundation & smooth interleaved difficulty\nconst PROBLEMS = {json.dumps(reordered_list, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\nSuccessfully updated {output_path} with Easy start and smooth interleaved difficulty sequence!")

if __name__ == "__main__":
    main()
