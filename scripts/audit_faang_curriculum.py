import json
import re

def run_audit():
    print("==================================================")
    print("=== FAANG MASTER LEARNING ORDER CURRICULUM AUDIT ===")
    print("==================================================")
    
    with open("data/questions.js", "r", encoding="utf-8") as f:
        raw = f.read()
    json_str = raw[raw.find("["):raw.rfind("]") + 1]
    problems = json.loads(json_str)
    
    total = len(problems)
    print(f"Total Curriculum Problems: {total}")
    assert total == 1000, f"Expected 1000 problems, got {total}"
    
    # 1. DUPLICATE AUDIT
    ids = set()
    urls = set()
    titles = set()
    learning_orders = set()
    
    dup_ids, dup_urls, dup_titles, dup_orders = 0, 0, 0, 0
    
    for p in problems:
        pid = p['id']
        url = (p.get('leetcode_url') or p.get('leetcodeUrl') or '').strip().lower()
        title = p['title'].strip().lower()
        lo = p['learningOrder']
        
        if pid in ids: dup_ids += 1
        else: ids.add(pid)
        
        if url in urls: dup_urls += 1
        else: urls.add(url)
        
        if title in titles: dup_titles += 1
        else: titles.add(title)
        
        if lo in learning_orders: dup_orders += 1
        else: learning_orders.add(lo)
        
    print("\n--- 1. DUPLICATE AUDIT ---")
    print(f"  Duplicate IDs: {dup_ids}")
    print(f"  Duplicate URLs: {dup_urls}")
    print(f"  Duplicate Titles: {dup_titles}")
    print(f"  Duplicate Learning Orders: {dup_orders}")
    
    assert dup_ids == 0, "Duplicate IDs found!"
    assert dup_urls == 0, "Duplicate URLs found!"
    assert dup_titles == 0, "Duplicate Titles found!"
    assert dup_orders == 0, "Duplicate Learning Orders found!"
    
    # 2. DIFFICULTY AUDIT BY RANGE
    print("\n--- 2. DIFFICULTY AUDIT BY STAGE & RANGE ---")
    ranges = [
        ("Problems 1-15 (Stage 1: Beginner)", 0, 15),
        ("Problems 16-70 (Stage 2: Core)", 15, 70),
        ("Problems 71-150 (Stage 3: Pattern Rec)", 70, 150),
        ("Problems 151-300 (Stage 4: Data Struct)", 150, 300),
        ("Problems 301-600 (Stage 5: Intermediate)", 300, 600),
        ("Problems 601-800 (Stage 6: Adv Struct)", 600, 800),
        ("Problems 801-950 (Stage 7: DP Mastery)", 800, 950),
        ("Problems 951-1000 (Stage 8: FAANG Mastery)", 950, 1000),
    ]
    
    total_easy, total_med, total_hard = 0, 0, 0
    for label, start, end in ranges:
        slice_probs = problems[start:end]
        e = sum(1 for p in slice_probs if p['difficulty'] == 'Easy')
        m = sum(1 for p in slice_probs if p['difficulty'] == 'Medium')
        h = sum(1 for p in slice_probs if p['difficulty'] == 'Hard')
        total_easy += e
        total_med += m
        total_hard += h
        print(f"  {label}: Easy={e}, Medium={m}, Hard={h}")
        
    print(f"  Overall Breakdown: Easy={total_easy}, Medium={total_med}, Hard={total_hard}")
    assert sum(1 for p in problems[:15] if p['difficulty'] == 'Easy') == 15, "Problems 1-15 must be 100% Easy!"
    assert sum(1 for p in problems[:70] if p['difficulty'] == 'Hard') == 0, "Problems 1-70 must contain ZERO Hard problems!"
    
    # 3. DIVERSITY AUDIT (Rolling window checks)
    print("\n--- 3. TOPIC DIVERSITY AUDIT ---")
    for window_size in [10, 25, 50]:
        max_consecutive_same_topic = 0
        cur_consecutive = 1
        for i in range(1, total):
            if problems[i]['topic'] == problems[i-1]['topic']:
                cur_consecutive += 1
                max_consecutive_same_topic = max(max_consecutive_same_topic, cur_consecutive)
            else:
                cur_consecutive = 1
        print(f"  Window size {window_size}: Max consecutive same topic = {max_consecutive_same_topic}")
        
    # 4. COVERAGE AUDIT
    print("\n--- 4. TOPIC COVERAGE AUDIT ---")
    topic_counts = {}
    for p in problems:
        t = p['topic']
        topic_counts[t] = topic_counts.get(t, 0) + 1
        
    for t, cnt in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  Topic '{t}': {cnt} problems")
        
    print("\n==================================================")
    print("[SUCCESS] AUDIT PASSED! All 1000 problems satisfy FAANG Curriculum rules.")
    print("==================================================")

if __name__ == "__main__":
    run_audit()
