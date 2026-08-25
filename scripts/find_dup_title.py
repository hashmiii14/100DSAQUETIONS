import json
from collections import Counter

def find_dups():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    data = json.loads(json_str)

    titles = [p['title'] for p in data]
    c = Counter(titles)
    for title, cnt in c.items():
        if cnt > 1:
            print(f"Duplicate title: '{title}' (Count: {cnt})")
            matches = [p for p in data if p['title'] == title]
            for m in matches:
                print(f"  #{m['id']}: Slug={m['canonicalSlug']} | URL={m['canonicalUrl']}")

if __name__ == "__main__":
    find_dups()
