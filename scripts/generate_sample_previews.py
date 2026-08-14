import json

def generate_previews():
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    data = json.loads(json_str)

    def format_range(start, end, label):
        out = [f"### {label}"]
        for q in data[start-1:end]:
            line = f"- **#{q['learningOrder']}** LeetCode ID: `{q['leetcodeId']}` | **{q['title']}** | `{q['difficulty']}` | Topic: `{q['topic']}` | Pattern: `{q.get('pattern', '-')}` | **What You Learn:** {q.get('newConcept', '-')} | **Why It Comes Here:** `{q.get('transitionType', 'INTRODUCE')}` | [Practice →]({q['canonicalUrl']})"
            out.append(line)
        return "\n".join(out)

    ranges = [
        (1, 20, "First 20 (#1–#20)"),
        (21, 30, "Sample #21–#30"),
        (51, 60, "Sample #51–#60"),
        (101, 110, "Sample #101–#110"),
        (201, 210, "Sample #201–#210"),
        (401, 410, "Sample #401–#410"),
        (701, 710, "Sample #701–#710"),
        (901, 910, "Sample #901–#910"),
        (991, 1000, "Sample #991–#1000")
    ]

    full_text = []
    for s, e, lbl in ranges:
        full_text.append(format_range(s, e, lbl))

    result = "\n\n".join(full_text)
    with open("scripts/sample_preview_output.txt", "w", encoding="utf-8") as f:
        f.write(result)
    print("Successfully generated scripts/sample_preview_output.txt!")

if __name__ == "__main__":
    generate_previews()
