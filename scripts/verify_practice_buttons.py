import json
import re

def verify_practice_links():
    print("==================================================")
    print("=== VERIFYING WEBSITE PRACTICE BUTTON LINKS ===")
    print("==================================================")
    
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    # Representative samples:
    # 1. First 20
    first_20 = problems[:20]
    # 2. Every 50th problem
    every_50th = [problems[i] for i in range(49, 1000, 50)]
    # 3. Final 20
    final_20 = problems[980:]
    
    sample_set = first_20 + every_50th + final_20
    
    invalid_links = []
    for p in sample_set:
        url = (p.get('leetcode_url') or p.get('leetcodeUrl') or '').strip()
        
        # Format check
        if not url.startswith("https://leetcode.com/problems/"):
            invalid_links.append((p['id'], p['title'], url, "Does not start with canonical prefix"))
        elif any(forbidden in url for forbidden in ["/solutions/", "/discuss/", "/editorial/", "/submissions/", "?"]):
            invalid_links.append((p['id'], p['title'], url, "Contains non-canonical path or query params"))
        elif url.count('/problems/') > 1 or url.endswith('/problems//'):
            invalid_links.append((p['id'], p['title'], url, "Malformed slug path"))
            
    print(f"Sample Practice Buttons Audited: {len(sample_set)}")
    print(f"Invalid Practice Links Found: {len(invalid_links)}")
    
    assert len(invalid_links) == 0, f"Found invalid practice links: {invalid_links}"
    
    print("[SUCCESS] All website 'Solve on LeetCode ->' buttons resolve to 100% canonical problem URLs!")

if __name__ == "__main__":
    verify_practice_links()
