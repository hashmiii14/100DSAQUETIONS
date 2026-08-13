"""
validate_curriculum.py
Automated Quality Control & Validation Test Suite for 1000 DSA Problems
"""

import json
import os
import sys

def validate():
    print("Starting Automated QA Validation on data/questions.js...")
    file_path = os.path.join("data", "questions.js")
    if not os.path.exists(file_path):
        print("ERROR: data/questions.js not found!")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    json_str = content.split("const PROBLEMS = ")[1].split(";\nif (typeof module")[0]
    problems = json.loads(json_str)

    print(f"Loaded {len(problems)} problems.")

    errors = []

    if len(problems) != 1000:
        errors.append(f"Problem count mismatch! Expected 1000, got {len(problems)}")

    easy_cnt = sum(1 for p in problems if p["difficulty"] == "Easy")
    med_cnt  = sum(1 for p in problems if p["difficulty"] == "Medium")
    hard_cnt = sum(1 for p in problems if p["difficulty"] == "Hard")

    if easy_cnt != 300 or med_cnt != 500 or hard_cnt != 200:
        errors.append(f"Difficulty balance mismatch! Easy={easy_cnt} (exp 300), Medium={med_cnt} (exp 500), Hard={hard_cnt} (exp 200)")

    ids = set()
    titles = set()
    for p in problems:
        if p["id"] in ids:
            errors.append(f"Duplicate ID found: {p['id']}")
        ids.add(p["id"])

        if p["title"] in titles:
            errors.append(f"Duplicate Title found: {p['title']}")
        titles.add(p["title"])

    required_fields = [
        "id", "number", "title", "difficulty", "topic", "subtopic", "phase", "roadmapPhase", "pattern",
        "statement", "constraints", "examples", "hints", "bruteForce", "optimalSolution",
        "edgeCases", "commonMistakes", "interviewTips", "relatedProblems", "prerequisites", "tags",
        "whyThisPattern", "interviewExplanation", "reasoningChallenge", "testCases", "leetcodeUrl"
    ]

    leetcode_link_count = 0
    for p in problems:
        for field in required_fields:
            if field not in p:
                errors.append(f"Problem #{p['id']} missing field: '{field}'")

        url = p.get("leetcodeUrl")
        if not isinstance(url, str) or not url.startswith("https://leetcode.com/problems/"):
            errors.append(f"Problem #{p['id']} has invalid LeetCode URL: '{url}'")
        else:
            leetcode_link_count += 1

    if leetcode_link_count != 1000:
        errors.append(f"LeetCode link count mismatch! Expected 1000, got {leetcode_link_count}")

    if errors:
        print("\n[FAIL] QA Validation FAILED with errors:")
        for err in errors[:10]:
            print(f"  - {err}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors.")
        sys.exit(1)
    else:
        print("\n[SUCCESS] All 1000 DSA Problems passed Quality Control Validation perfectly!")
        print(f"   Summary: Total = {len(problems)} | Easy = {easy_cnt} | Medium = {med_cnt} | Hard = {hard_cnt} | Verified 100% LeetCode Links = {leetcode_link_count}")

if __name__ == "__main__":
    validate()
