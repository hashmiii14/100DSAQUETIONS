import json
import re

def extract_real():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)

    real_problems = []
    seen_slugs = set()

    for q in problems:
        url = (q.get('canonicalUrl') or q.get('leetcode_url') or q.get('leetcodeUrl') or '').strip()
        title = q.get('title', '').strip()
        is_synthetic = ('-var-' in url or 'variation' in url or 'arrays---' in url or 'strings---' in url or 'pattern' in title.lower())
        
        match = re.search(r"leetcode\.com/problems/([^/]+)/?", url)
        slug = match.group(1).lower() if match else None

        if slug and not is_synthetic and slug not in seen_slugs:
            # Clean up title if it has optimization/challenge suffixes
            clean_title = re.sub(r'\s+(Optimization|Challenge|Variation\s+\d+).*$', '', title, flags=re.IGNORECASE).strip()
            q['title'] = clean_title
            q['canonicalSlug'] = slug
            q['canonicalUrl'] = f"https://leetcode.com/problems/{slug}/"
            real_problems.append(q)
            seen_slugs.add(slug)

    print(f"Extracted {len(real_problems)} genuine non-synthetic LeetCode problems.")
    
    easy = [p for p in real_problems if p['difficulty'] == 'Easy']
    med = [p for p in real_problems if p['difficulty'] == 'Medium']
    hard = [p for p in real_problems if p['difficulty'] == 'Hard']
    print(f"Breakdown of extracted real problems: Easy={len(easy)}, Medium={len(med)}, Hard={len(hard)}")

if __name__ == "__main__":
    extract_real()
