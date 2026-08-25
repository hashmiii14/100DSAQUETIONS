import json
import re

def audit_all_20_pages():
    print("==================================================")
    print("=== AUDITING ALL 20 PAGINATION PAGES (PAGES 1 - 20) ===")
    print("==================================================")
    
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    total = len(problems)
    page_size = 50
    total_pages = (total + page_size - 1) // page_size
    
    print(f"Total problems: {total} | Page size: {page_size} | Total pages: {total_pages}")
    assert total == 1000, f"Expected 1000 problems, got {total}"
    assert total_pages == 20, f"Expected 20 pages, got {total_pages}"
    
    corruptions = 0
    total_audited = 0
    
    for page_num in range(1, total_pages + 1):
        start_idx = (page_num - 1) * page_size
        end_idx = min(start_idx + page_size, total)
        page_items = problems[start_idx:end_idx]
        
        print(f"Page {page_num:2d} (Items #{start_idx+1:04d} to #{end_idx:04d}): {len(page_items)} problems")
        
        for p in page_items:
            total_audited += 1
            url = (p.get('canonicalUrl') or p.get('leetcode_url') or p.get('leetcodeUrl') or '').strip()
            
            # Checks
            if not url.startswith("https://leetcode.com/problems/"):
                corruptions += 1
                print(f"  [ERROR] Page {page_num} Item #{p['id']}: Malformed URL '{url}'")
            elif any(sub in url for sub in ["/solutions/", "/discuss/", "/editorial/", "/submissions/"]):
                corruptions += 1
                print(f"  [ERROR] Page {page_num} Item #{p['id']}: Forbidden path in URL '{url}'")
            elif p['learningOrder'] != p['id']:
                corruptions += 1
                print(f"  [ERROR] Page {page_num} Item #{p['id']}: ID mismatch learningOrder={p['learningOrder']}")
                
    print("\n--------------------------------------------------")
    print(f"Total Problems Audited across 20 Pages: {total_audited}")
    print(f"Total Corruptions Found: {corruptions}")
    print("--------------------------------------------------")
    
    assert corruptions == 0, f"BUILD FAIL: Found {corruptions} page corruptions!"
    print("[SUCCESS] All 20 Pagination Pages (1000 items) passed complete QA verification!")

if __name__ == "__main__":
    audit_all_20_pages()
