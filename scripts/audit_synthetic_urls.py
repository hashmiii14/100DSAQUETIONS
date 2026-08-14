import json
import re

def audit_synthetic():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    data = json.loads(json_str)

    print("=== INSPECTING FIRST 15 PROBLEMS IN DATASET ===")
    for q in data[:20]:
        url = (q.get('canonicalUrl') or q.get('leetcode_url') or q.get('leetcodeUrl') or '').strip()
        is_synthetic = ('-var-' in url or 'variation' in url or 'arrays---' in url or 'strings---' in url)
        print(f"#{q['id']:03d} | Title: {q['title']} | Diff: {q['difficulty']} | Topic: {q['topic']} | Synthetic: {is_synthetic} | URL: {url}")

    all_urls = [(q.get('canonicalUrl') or q.get('leetcode_url') or q.get('leetcodeUrl') or '').strip() for q in data]
    all_synthetic = [u for u in all_urls if ('-var-' in u or 'variation' in u or 'arrays---' in u or 'strings---' in u)]
    print(f"\nTotal synthetic/fake URLs across all 1000 problems: {len(all_synthetic)}")

if __name__ == "__main__":
    audit_synthetic()
