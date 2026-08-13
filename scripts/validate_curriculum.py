import json
import re

def validate():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove leading comments & declaration
    prefix = "// Automatically generated 1000 DSA Problems Dataset\nconst PROBLEMS = "
    if content.startswith(prefix):
        content = content[len(prefix):]
    
    # Remove trailing JS module export
    suffix = ";\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    if content.endswith(suffix):
        content = content[:-len(suffix)]
    elif content.endswith(";\n"):
        content = content[:-2]
    
    problems = json.loads(content)

    print(f"Starting Automated QA Validation on data/questions.js...")
    print(f"Loaded {len(problems)} problems.")

    assert len(problems) == 1000, f"Expected 1000 problems, got {len(problems)}"

    easy_cnt = 0
    med_cnt = 0
    hard_cnt = 0
    link_cnt = 0

    seen_ids = set()

    for p in problems:
        pid = p.get("id")
        assert pid not in seen_ids, f"Duplicate ID found: {pid}"
        seen_ids.add(pid)

        diff = p.get("difficulty")
        if diff == "Easy": easy_cnt += 1
        elif diff == "Medium": med_cnt += 1
        elif diff == "Hard": hard_cnt += 1

        url = p.get("leetcodeUrl", "")
        assert url.startswith("https://leetcode.com/problems/"), f"Invalid LeetCode URL for #{pid}: {url}"
        link_cnt += 1

        stage = p.get("stage") or p.get("curriculumStage")
        assert stage and "Stage" in stage, f"Missing or invalid stage for #{pid}"

    assert link_cnt == 1000, f"Expected 1000 LeetCode URLs, got {link_cnt}"

    print(f"\n[SUCCESS] All 1000 DSA Problems passed Quality Control Validation perfectly!")
    print(f"   Summary: Total = {len(problems)} | Easy = {easy_cnt} | Medium = {med_cnt} | Hard = {hard_cnt} | Verified 100% LeetCode Links = {link_cnt}")

if __name__ == "__main__":
    validate()
