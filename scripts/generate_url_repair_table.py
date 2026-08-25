import json

def generate_repair_table():
    with open("data/questions_backup.js", "r", encoding="utf-8") as f:
        raw_b = f.read()
    json_b = raw_b[raw_b.find("["):raw_b.rfind("]") + 1]
    old_data = json.loads(json_b)

    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw_n = f.read()
    json_n = raw_n[raw_n.find("["):raw_n.rfind("]") + 1]
    new_data = json.loads(json_n)

    repaired_records = []
    
    for i in range(1000):
        old_item = old_data[i]
        new_item = new_data[i]
        
        old_url = (old_item.get('canonicalUrl') or old_item.get('leetcode_url') or old_item.get('leetcodeUrl') or '').strip()
        new_url = new_item['canonicalUrl']
        
        is_synthetic_old = ('-var-' in old_url or 'variation' in old_url or 'arrays---' in old_url or 'strings---' in old_url)
        
        if is_synthetic_old or old_url != new_url:
            repaired_records.append({
                'num': new_item['id'],
                'leetcode_id': new_item['leetcodeId'],
                'title': new_item['title'],
                'old_url': old_url,
                'new_url': new_url,
                'result': 'REPLACED_SYNTHETIC' if is_synthetic_old else 'REPAIRED_URL'
            })

    print(f"Total Repaired / Replaced Records: {len(repaired_records)}")

    # Print first 20 sample repair rows
    print("\nSAMPLE URL REPAIR TABLE (First 20 Repaired Records):")
    print("| # | LeetCode ID | Title | Old URL | New Canonical URL | Result |")
    print("|---|------------:|-------|---------|-------------------|--------|")
    for r in repaired_records[:20]:
        print(f"| #{r['num']:03d} | {r['leetcode_id']} | {r['title']} | `{r['old_url']}` | `{r['new_url']}` | `{r['result']}` |")

if __name__ == "__main__":
    generate_repair_table()
