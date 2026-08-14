import json
import re

def validate():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove leading comments & declaration
    if "const PROBLEMS = " in content:
        content = content.split("const PROBLEMS = ")[1]
    
    # Remove trailing JS module export
    if ";\nif (typeof" in content:
        content = content.split(";\nif (typeof")[0]
    elif content.endswith(";\n"):
        content = content[:-2]
    
    problems = json.loads(content)

    print(f"Starting Automated QA Validation on data/questions.js...")
    print(f"Loaded {len(problems)} problems.")

    assert len(problems) == 1000, f"Expected 1000 problems, got {len(problems)}"

    beg_cnt = 0
    easy_cnt = 0
    med_cnt = 0
    hard_cnt = 0
    exp_cnt = 0
    link_cnt = 0

    seen_ids = set()

    for p in problems:
        pid = p.get("id")
        assert pid not in seen_ids, f"Duplicate ID found: {pid}"
        seen_ids.add(pid)

        diff = p.get("difficulty")
        if diff == "Beginner": beg_cnt += 1
        elif diff == "Easy": easy_cnt += 1
        elif diff == "Medium": med_cnt += 1
        elif diff == "Hard": hard_cnt += 1
        elif diff == "Expert": exp_cnt += 1
        else:
            raise AssertionError(f"Unknown difficulty {diff} for #{pid}")

        url = p.get("leetcodeUrl", "")
        assert url.startswith("https://leetcode.com/problems/"), f"Invalid LeetCode URL for #{pid}: {url}"
        assert not url.endswith("/problems//"), f"Malformed LeetCode URL for #{pid}: {url}"
        link_cnt += 1

        stage = p.get("stage") or p.get("curriculumStage")
        assert stage and "Stage" in stage, f"Missing or invalid stage for #{pid}"

    assert beg_cnt == 100, f"Expected 100 Beginner, got {beg_cnt}"
    assert easy_cnt == 200, f"Expected 200 Easy, got {easy_cnt}"
    assert med_cnt == 450, f"Expected 450 Medium, got {med_cnt}"
    assert hard_cnt == 200, f"Expected 200 Hard, got {hard_cnt}"
    assert exp_cnt == 50, f"Expected 50 Expert, got {exp_cnt}"
    assert link_cnt == 1000, f"Expected 1000 LeetCode URLs, got {link_cnt}"

    print(f"\n[SUCCESS] All 1000 Distinct Original DSA Problems passed Quality Control Validation perfectly!")
    print(f"   Summary: Total = {len(problems)} | Beginner = {beg_cnt} | Easy = {easy_cnt} | Medium = {med_cnt} | Hard = {hard_cnt} | Expert = {exp_cnt} | Verified Links = {link_cnt}")

if __name__ == "__main__":
    validate()
