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

    # 1. Exact Count Check
    if len(problems) != 1000:
        errors.append(f"Problem count mismatch! Expected 1000, got {len(problems)}")

    # 2. Difficulty Balance Check (~300 Easy, ~500 Medium, ~200 Hard)
    easy_cnt = sum(1 for p in problems if p["difficulty"] == "Easy")
    med_cnt  = sum(1 for p in problems if p["difficulty"] == "Medium")
    hard_cnt = sum(1 for p in problems if p["difficulty"] == "Hard")

    if easy_cnt != 300 or med_cnt != 500 or hard_cnt != 200:
        errors.append(f"Difficulty balance mismatch! Easy={easy_cnt} (exp 300), Medium={med_cnt} (exp 500), Hard={hard_cnt} (exp 200)")

    # 3. Duplicate ID and Title Check
    ids = set()
    titles = set()
    for p in problems:
        if p["id"] in ids:
            errors.append(f"Duplicate ID found: {p['id']}")
        ids.add(p["id"])

        if p["title"] in titles:
            errors.append(f"Duplicate Title found: {p['title']}")
        titles.add(p["title"])

    # 4. Mandatory Schema Field Validation
    required_fields = [
        "id", "number", "title", "difficulty", "topic", "subtopic", "phase", "pattern",
        "statement", "constraints", "examples", "hints", "bruteForce", "optimalSolution",
        "edgeCases", "commonMistakes", "relatedProblems", "prerequisites", "tags",
        "whyThisPattern", "interviewExplanation", "reasoningChallenge", "testCases"
    ]

    for p in problems:
        for field in required_fields:
            if field not in p:
                errors.append(f"Problem #{p['id']} missing field: '{field}'")

        # 5. Multi-language Code Solution Check
        for sol_type in ["bruteForce", "optimalSolution"]:
            if sol_type in p:
                code_obj = p[sol_type].get("code", {})
                for lang in ["cpp", "java", "python", "javascript"]:
                    if lang not in code_obj or not code_obj[lang].strip():
                        errors.append(f"Problem #{p['id']} missing {sol_type} code for '{lang}'")

    if errors:
        print("\n[FAIL] QA Validation FAILED with errors:")
        for err in errors[:10]:
            print(f"  - {err}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors.")
        sys.exit(1)
    else:
        print("\n[SUCCESS] All 1000 DSA Problems passed Quality Control Validation perfectly!")
        print(f"   Summary: Total = {len(problems)} | Easy = {easy_cnt} | Medium = {med_cnt} | Hard = {hard_cnt}")

if __name__ == "__main__":
    validate()
