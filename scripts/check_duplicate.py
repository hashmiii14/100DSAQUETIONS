import json
import os
import sys
import re

def normalize(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def jaccard_similarity(str1, str2):
    t1 = set(w for w in normalize(str1).split() if len(w) > 2)
    t2 = set(w for w in normalize(str2).split() if len(w) > 2)
    if not t1 or not t2:
        return 0.0
    return len(t1 & t2) / len(t1 | t2)

def check_duplicate(candidate_title, candidate_statement="", dataset_path=None):
    if not dataset_path:
        dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "questions.js")

    with open(dataset_path, "r", encoding="utf-8") as f:
        content = f.read()

    prefix = "// Curated & Deduplicated Canonical 100 DSA Problems Dataset\nconst PROBLEMS = "
    if content.startswith(prefix):
        content = content[len(prefix):]
    elif "const PROBLEMS = " in content:
        content = content.split("const PROBLEMS = ")[1]

    if ";\nif (typeof" in content:
        content = content.split(";\nif (typeof")[0]
    elif content.endswith(";\n"):
        content = content[:-2]

    problems = json.loads(content)

    norm_cand_title = normalize(candidate_title)
    best_match = None
    highest_score = 0
    reason = ""

    for p in problems:
        norm_title = normalize(p.get("title", ""))
        statement = p.get("statement", "")

        if norm_cand_title == norm_title:
            highest_score = 100
            best_match = p
            reason = f"Exact match with Canonical #{p['id']} ({p['title']})"
            break

        title_sim = jaccard_similarity(candidate_title, p["title"]) * 100
        stmt_sim = jaccard_similarity(candidate_statement, statement) * 100 if candidate_statement else 0

        score = max(title_sim, (title_sim * 0.6 + stmt_sim * 0.4))
        if score > highest_score:
            highest_score = score
            best_match = p
            reason = f"High similarity ({round(score)}%) with Canonical #{p['id']} ({p['title']})"

    rounded_score = round(highest_score)
    status = "APPROVED"
    if rounded_score >= 95:
        status = "BLOCK_INSERT"
    elif rounded_score >= 85:
        status = "MANUAL_REVIEW_REQUIRED"
    elif rounded_score >= 70:
        status = "FLAG_FOR_REVIEW"

    result = {
        "candidate": candidate_title,
        "score": rounded_score,
        "status": status,
        "matchedProblem": best_match,
        "reason": reason if best_match else "Distinct question."
    }
    return result

if __name__ == "__main__":
    test_title = sys.argv[1] if len(sys.argv) > 1 else "Check Duplicate Elements"
    test_stmt = sys.argv[2] if len(sys.argv) > 2 else "Given an array, return true if any value appears at least twice."
    res = check_duplicate(test_title, test_stmt)
    print(json.dumps(res, indent=2))
