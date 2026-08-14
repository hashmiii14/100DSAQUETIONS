import json

def inspect_first_10():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)

    print("==================================================")
    print("=== INSPECTING FIRST 15 PROBLEMS IN REBUILT DATASET ===")
    print("==================================================")
    for p in problems[:15]:
        print(f"#{p['id']:03d} | Title: {p['title']:<45} | Diff: {p['difficulty']:<6} | Slug: {p['canonicalSlug']:<35} | URL: {p['canonicalUrl']}")

if __name__ == "__main__":
    inspect_first_10()
