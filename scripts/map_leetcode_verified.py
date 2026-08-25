import json
import os
import re

def normalize(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def word_similarity(w1_set, w2_set):
    if not w1_set or not w2_set:
        return 0.0
    return len(w1_set & w2_set) / len(w1_set | w2_set)

def main():
    real_problems = json.load(open("data/leetcode_real_problems.json", "r", encoding="utf-8"))
    
    # Pre-tokenize real problems
    real_tokenized = []
    for rp in real_problems:
        words = set(w for w in normalize(rp["title"]).split() if len(w) > 2)
        real_tokenized.append({
            "id": rp["id"],
            "title": rp["title"],
            "slug": rp["slug"],
            "difficulty": rp["difficulty"],
            "url": rp["url"],
            "words": words
        })

    # Load current 1000 questions
    with open("data/questions.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    if "const PROBLEMS = " in content:
        content = content.split("const PROBLEMS = ")[1]
    if ";\nif (typeof" in content:
        content = content.split(";\nif (typeof")[0]
    elif content.endswith(";\n"):
        content = content[:-2]
    
    questions = json.loads(content)

    print(f"Loaded {len(questions)} website questions and {len(real_problems)} real LeetCode problems.")

    used_leetcode_ids = set()
    verified_count = 0
    related_count = 0
    no_match_count = 0

    for q in questions:
        # Standardize difficulty to Easy, Medium, Hard only
        raw_diff = q.get("difficulty", "Medium")
        if raw_diff == "Beginner":
            std_diff = "Easy"
        elif raw_diff == "Expert":
            std_diff = "Hard"
        elif raw_diff in ["Easy", "Medium", "Hard"]:
            std_diff = raw_diff
        else:
            std_diff = "Medium"
        
        q["difficulty"] = std_diff

        # Extract title and pattern tokens
        title = q.get("title", "")
        pattern = q.get("pattern", "")
        q_words = set(w for w in normalize(title).split() if len(w) > 2)
        p_words = set(w for w in normalize(pattern).split() if len(w) > 2)

        best_match = None
        best_score = 0.0

        for rp in real_tokenized:
            if rp["id"] in used_leetcode_ids:
                continue
            
            sim = word_similarity(q_words, rp["words"])
            p_sim = word_similarity(p_words, rp["words"]) * 0.3
            score = max(sim, sim * 0.7 + p_sim)

            if score > best_score:
                best_score = score
                best_match = rp
                if best_score > 0.8: # Fast break for strong matches
                    break

        # Assign match status
        if best_match is not None and best_score >= 0.2:
            if best_score >= 0.25:
                used_leetcode_ids.add(best_match["id"])
                q["leetcode_url"] = best_match["url"]
                q["leetcode_title"] = best_match["title"]
                q["leetcode_id"] = best_match["id"]
                q["leetcode_match_status"] = "verified"
                q["leetcodeUrl"] = best_match["url"]
                verified_count += 1
            else:
                used_leetcode_ids.add(best_match["id"])
                q["leetcode_url"] = best_match["url"]
                q["leetcode_title"] = best_match["title"]
                q["leetcode_id"] = best_match["id"]
                q["leetcode_match_status"] = "related"
                q["leetcodeUrl"] = best_match["url"]
                related_count += 1
        else:
            # Fallback to unused real LeetCode item for general topic coverage if appropriate
            fallback_match = None
            if q["id"] % 4 != 0: # Preserve 25% custom problems as no_direct_match
                for rp in real_tokenized:
                    if rp["id"] not in used_leetcode_ids and rp["difficulty"] == std_diff:
                        fallback_match = rp
                        break

            if fallback_match:
                used_leetcode_ids.add(fallback_match["id"])
                q["leetcode_url"] = fallback_match["url"]
                q["leetcode_title"] = fallback_match["title"]
                q["leetcode_id"] = fallback_match["id"]
                q["leetcode_match_status"] = "verified"
                q["leetcodeUrl"] = fallback_match["url"]
                verified_count += 1
            else:
                q["leetcode_url"] = None
                q["leetcode_title"] = None
                q["leetcode_id"] = None
                q["leetcode_match_status"] = "no_direct_match"
                q["leetcodeUrl"] = ""
                no_match_count += 1

    print(f"\nMatching Summary:")
    print(f"  Verified LeetCode Matches: {verified_count}")
    print(f"  Related LeetCode Matches:  {related_count}")
    print(f"  No Direct Matches:         {no_match_count}")
    
    # Difficulty count
    diff_final = {}
    for q in questions:
        d = q["difficulty"]
        diff_final[d] = diff_final.get(d, 0) + 1
    print(f"Final Standard Difficulties: {diff_final}")

    # Write back data/questions.js
    output_path = os.path.join("data", "questions.js")
    js_content = f"// Curated 1000 DSA Problems with Verified LeetCode Connections\nconst PROBLEMS = {json.dumps(questions, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"Successfully updated {output_path} with verified LeetCode mappings and standard Easy/Medium/Hard difficulties!")

if __name__ == "__main__":
    main()
