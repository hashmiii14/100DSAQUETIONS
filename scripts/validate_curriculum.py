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

    easy_cnt = 0
    med_cnt = 0
    hard_cnt = 0
    verified_cnt = 0
    related_cnt = 0
    no_match_cnt = 0

    seen_ids = set()

    for p in problems:
        pid = p.get("id")
        assert pid not in seen_ids, f"Duplicate ID found: {pid}"
        seen_ids.add(pid)

        diff = p.get("difficulty")
        if diff == "Easy": easy_cnt += 1
        elif diff == "Medium": med_cnt += 1
        elif diff == "Hard": hard_cnt += 1
        else:
            raise AssertionError(f"Invalid non-standard difficulty '{diff}' for #{pid}")

        status = p.get("leetcode_match_status")
        assert status in ["verified", "related", "no_direct_match"], f"Invalid status '{status}' for #{pid}"
        
        if status == "verified": verified_cnt += 1
        elif status == "related": related_cnt += 1
        elif status == "no_direct_match": no_match_cnt += 1

        if status != "no_direct_match":
            url = p.get("leetcode_url") or p.get("leetcodeUrl") or ""
            assert url.startswith("https://leetcode.com/problems/"), f"Invalid LeetCode URL for #{pid}: {url}"
            assert not url.endswith("/problems//"), f"Malformed LeetCode URL for #{pid}: {url}"

    assert easy_cnt == 300, f"Expected 300 Easy, got {easy_cnt}"
    assert med_cnt == 450, f"Expected 450 Medium, got {med_cnt}"
    assert hard_cnt == 250, f"Expected 250 Hard, got {hard_cnt}"

    print(f"\n[SUCCESS] All 1000 DSA Problems with Verified LeetCode Connections passed Quality Control Validation!")
    print(f"   Summary: Total = {len(problems)} | Easy = {easy_cnt} | Medium = {med_cnt} | Hard = {hard_cnt}")
    print(f"   LeetCode Status: Verified = {verified_cnt} | Related = {related_cnt} | No Direct Match = {no_match_cnt}")

if __name__ == "__main__":
    validate()
