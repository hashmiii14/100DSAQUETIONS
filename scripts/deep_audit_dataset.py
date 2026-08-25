import json
import os
import re

def normalize(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    return re.sub(r'\s+', ' ', text).strip()

def main():
    # Load dataset
    with open("data/questions.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    if "const PROBLEMS = " in content:
        content = content.split("const PROBLEMS = ")[1]
    if ";\nif (typeof" in content:
        content = content.split(";\nif (typeof")[0]
    elif content.endswith(";\n"):
        content = content[:-2]
    
    problems = json.loads(content)
    real_problems = json.load(open("data/leetcode_real_problems.json", "r", encoding="utf-8"))
    real_urls = set(rp["url"] for rp in real_problems)

    total_count = len(problems)
    valid_links = 0
    broken_links = 0
    no_match = 0

    seen_titles = {}
    duplicate_titles = []

    seen_slugs = {}
    duplicate_slugs = []

    seen_leetcode_ids = {}
    duplicate_leetcode_ids = []

    for p in problems:
        title = p.get("title", "")
        slug = p.get("slug", "")
        url = p.get("leetcode_url") or p.get("leetcodeUrl")
        status = p.get("leetcode_match_status")
        lc_id = p.get("leetcode_id")

        # Title uniqueness check
        norm_title = normalize(title)
        if norm_title in seen_titles:
            duplicate_titles.append((p["id"], title, seen_titles[norm_title]))
        else:
            seen_titles[norm_title] = p["id"]

        # Slug uniqueness check
        if slug in seen_slugs:
            duplicate_slugs.append((p["id"], slug, seen_slugs[slug]))
        else:
            seen_slugs[slug] = p["id"]

        # LeetCode link validity check
        if status == "no_direct_match" or not url:
            no_match += 1
        elif url in real_urls:
            valid_links += 1
            if lc_id:
                if lc_id in seen_leetcode_ids:
                    duplicate_leetcode_ids.append((p["id"], lc_id, title, seen_leetcode_ids[lc_id]))
                else:
                    seen_leetcode_ids[lc_id] = p["id"]
        else:
            broken_links += 1

    print("======================================== AUDIT REPORT ========================================")
    print(f"Total Questions:              {total_count}")
    print(f"Valid LeetCode Links:         {valid_links}")
    print(f"Broken / Unusable Links:       {broken_links}")
    print(f"No Direct Match (Original):   {no_match}")
    print(f"Duplicate Titles:             {len(duplicate_titles)}")
    print(f"Duplicate Slugs:              {len(duplicate_slugs)}")
    print(f"Duplicate LeetCode Mappings:  {len(duplicate_leetcode_ids)}")
    print("===============================================================================================")

    if duplicate_titles:
        print("\nSample Duplicate Titles:", duplicate_titles[:5])
    if duplicate_leetcode_ids:
        print("\nSample Duplicate LeetCode Mappings:", duplicate_leetcode_ids[:5])

if __name__ == "__main__":
    main()
