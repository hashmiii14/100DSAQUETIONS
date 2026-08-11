"""
Add clickable LeetCode hyperlinks to every question in the DSA 100 roadmap PDF.

Uses PyMuPDF to precisely locate each question title on the page and overlays
an invisible URI link annotation — no visual change whatsoever.

Works in: Chrome PDF Viewer, Adobe Acrobat, Edge, mobile PDF viewers.
"""

import pymupdf  # PyMuPDF >= 1.28

INPUT_PATH  = r"c:\Users\mdhas\Desktop\Dsa Quetions\DSA_100_LeetCode_Roadmap_CPP_Java.pdf"
OUTPUT_PATH = r"c:\Users\mdhas\Desktop\Dsa Quetions\DSA_100_LeetCode_Roadmap_CPP_Java_Hyperlinked.pdf"

# ──────────────────────────────────────────────────────────────────────────────
# Exact question list extracted from PDF inspection  (100 questions)
# ──────────────────────────────────────────────────────────────────────────────

QUESTION_LINKS = {

    # ── 1. ARRAYS ─────────────────────────────────────────────────────────────
    # Easy
    "Two Sum":
        "https://leetcode.com/problems/two-sum/",
    "Best Time to Buy and Sell Stock":
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    "Contains Duplicate":
        "https://leetcode.com/problems/contains-duplicate/",
    "Maximum Subarray":
        "https://leetcode.com/problems/maximum-subarray/",
    "Plus One":
        "https://leetcode.com/problems/plus-one/",
    "Remove Duplicates from Sorted Array":
        "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
    "Remove Element":
        "https://leetcode.com/problems/remove-element/",
    "Merge Sorted Array":
        "https://leetcode.com/problems/merge-sorted-array/",
    "Intersection of Two Arrays":
        "https://leetcode.com/problems/intersection-of-two-arrays/",
    "Move Zeroes":
        "https://leetcode.com/problems/move-zeroes/",
    "Majority Element":
        "https://leetcode.com/problems/majority-element/",
    "Missing Number":
        "https://leetcode.com/problems/missing-number/",
    "Single Number":
        "https://leetcode.com/problems/single-number/",
    "Find Pivot Index":
        "https://leetcode.com/problems/find-pivot-index/",
    "Running Sum of 1d Array":
        "https://leetcode.com/problems/running-sum-of-1d-array/",
    # Medium
    "Merge Intervals":
        "https://leetcode.com/problems/merge-intervals/",
    "3Sum":
        "https://leetcode.com/problems/3sum/",
    "Product of Array Except Self":
        "https://leetcode.com/problems/product-of-array-except-self/",
    "Maximum Product Subarray":
        "https://leetcode.com/problems/maximum-product-subarray/",
    "Subarray Sum Equals K":
        "https://leetcode.com/problems/subarray-sum-equals-k/",
    "Container With Most Water":
        "https://leetcode.com/problems/container-with-most-water/",
    # Hard
    "Sliding Window Median":
        "https://leetcode.com/problems/sliding-window-median/",
    "Trapping Rain Water":
        "https://leetcode.com/problems/trapping-rain-water/",
    "First Missing Positive":
        "https://leetcode.com/problems/first-missing-positive/",
    "Median of Two Sorted Arrays":
        "https://leetcode.com/problems/median-of-two-sorted-arrays/",

    # ── 2. STRINGS ────────────────────────────────────────────────────────────
    # Easy
    "Valid Anagram":
        "https://leetcode.com/problems/valid-anagram/",
    "Valid Palindrome":
        "https://leetcode.com/problems/valid-palindrome/",
    "Longest Common Prefix":
        "https://leetcode.com/problems/longest-common-prefix/",
    "Roman to Integer":
        "https://leetcode.com/problems/roman-to-integer/",
    "Length of Last Word":
        "https://leetcode.com/problems/length-of-last-word/",
    "Reverse String":
        "https://leetcode.com/problems/reverse-string/",
    "Is Subsequence":
        "https://leetcode.com/problems/is-subsequence/",
    "First Unique Character in a String":
        "https://leetcode.com/problems/first-unique-character-in-a-string/",
    # Medium
    "Longest Substring Without Repeating Characters":
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "Group Anagrams":
        "https://leetcode.com/problems/group-anagrams/",
    "Longest Palindromic Substring":
        "https://leetcode.com/problems/longest-palindromic-substring/",
    "String to Integer (atoi)":
        "https://leetcode.com/problems/string-to-integer-atoi/",
    # Hard
    "Minimum Window Substring":
        "https://leetcode.com/problems/minimum-window-substring/",
    "Regular Expression Matching":
        "https://leetcode.com/problems/regular-expression-matching/",
    "Wildcard Matching":
        "https://leetcode.com/problems/wildcard-matching/",

    # ── 3. LINKED LIST ────────────────────────────────────────────────────────
    # Easy
    "Reverse Linked List":
        "https://leetcode.com/problems/reverse-linked-list/",
    "Merge Two Sorted Lists":
        "https://leetcode.com/problems/merge-two-sorted-lists/",
    "Linked List Cycle":
        "https://leetcode.com/problems/linked-list-cycle/",
    "Middle of the Linked List":
        "https://leetcode.com/problems/middle-of-the-linked-list/",
    "Remove Linked List Elements":
        "https://leetcode.com/problems/remove-linked-list-elements/",
    "Palindrome Linked List":
        "https://leetcode.com/problems/palindrome-linked-list/",
    "Intersection of Two Linked Lists":
        "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    "Remove Duplicates from Sorted List":
        "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
    # Medium
    "Remove Nth Node From End of List":
        "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    "Add Two Numbers":
        "https://leetcode.com/problems/add-two-numbers/",
    "Reorder List":
        "https://leetcode.com/problems/reorder-list/",
    "Copy List with Random Pointer":
        "https://leetcode.com/problems/copy-list-with-random-pointer/",
    # Hard
    "Reverse Nodes in k-Group":
        "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    "Merge k Sorted Lists":
        "https://leetcode.com/problems/merge-k-sorted-lists/",
    "LRU Cache":
        "https://leetcode.com/problems/lru-cache/",

    # ── 4. STACK / QUEUE ──────────────────────────────────────────────────────
    # Easy
    "Implement Queue using Stacks":
        "https://leetcode.com/problems/implement-queue-using-stacks/",
    "Implement Stack using Queues":
        "https://leetcode.com/problems/implement-stack-using-queues/",
    "Next Greater Element I":
        "https://leetcode.com/problems/next-greater-element-i/",
    "Baseball Game":
        "https://leetcode.com/problems/baseball-game/",
    "Backspace String Compare":
        "https://leetcode.com/problems/backspace-string-compare/",
    "Valid Parentheses":
        "https://leetcode.com/problems/valid-parentheses/",
    # Medium
    "Min Stack":
        "https://leetcode.com/problems/min-stack/",
    "Evaluate Reverse Polish Notation":
        "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    "Daily Temperatures":
        "https://leetcode.com/problems/daily-temperatures/",
    "Simplify Path":
        "https://leetcode.com/problems/simplify-path/",
    # Hard
    "Asteroid Collision":
        "https://leetcode.com/problems/asteroid-collision/",
    "Largest Rectangle in Histogram":
        "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    "Sliding Window Maximum":
        "https://leetcode.com/problems/sliding-window-maximum/",

    # ── 5. TREES ──────────────────────────────────────────────────────────────
    # Easy
    "Maximum Depth of Binary Tree":
        "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    "Same Tree":
        "https://leetcode.com/problems/same-tree/",
    "Invert Binary Tree":
        "https://leetcode.com/problems/invert-binary-tree/",
    "Symmetric Tree":
        "https://leetcode.com/problems/symmetric-tree/",
    "Binary Tree Inorder Traversal":
        "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    "Binary Tree Preorder Traversal":
        "https://leetcode.com/problems/binary-tree-preorder-traversal/",
    "Binary Tree Postorder Traversal":
        "https://leetcode.com/problems/binary-tree-postorder-traversal/",
    "Search in a Binary Search Tree":
        "https://leetcode.com/problems/search-in-a-binary-search-tree/",
    # Medium
    "Binary Tree Level Order Traversal":
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    "Validate Binary Search Tree":
        "https://leetcode.com/problems/validate-binary-search-tree/",
    "Lowest Common Ancestor of a Binary Tree":
        "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "Kth Smallest Element in a BST":
        "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    # Hard
    "Binary Tree Maximum Path Sum":
        "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    "Serialize and Deserialize Binary Tree":
        "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",

    # ── 6. GRAPHS ─────────────────────────────────────────────────────────────
    # Easy
    "Find if Path Exists in Graph":
        "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    "Flood Fill":
        "https://leetcode.com/problems/flood-fill/",
    # Medium
    "Number of Islands":
        "https://leetcode.com/problems/number-of-islands/",
    "Clone Graph":
        "https://leetcode.com/problems/clone-graph/",
    "Rotting Oranges":
        "https://leetcode.com/problems/rotting-oranges/",
    "Course Schedule":
        "https://leetcode.com/problems/course-schedule/",
    "Pacific Atlantic Water Flow":
        "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    # Hard
    "Word Ladder":
        "https://leetcode.com/problems/word-ladder/",
    "Alien Dictionary":
        "https://leetcode.com/problems/alien-dictionary/",
    "Reconstruct Itinerary":
        "https://leetcode.com/problems/reconstruct-itinerary/",

    # ── 7. DYNAMIC PROGRAMMING ────────────────────────────────────────────────
    # Easy
    "Climbing Stairs":
        "https://leetcode.com/problems/climbing-stairs/",
    "Min Cost Climbing Stairs":
        "https://leetcode.com/problems/min-cost-climbing-stairs/",
    "House Robber":
        "https://leetcode.com/problems/house-robber/",
    # Medium
    "Coin Change":
        "https://leetcode.com/problems/coin-change/",
    "Longest Increasing Subsequence":
        "https://leetcode.com/problems/longest-increasing-subsequence/",
    "Partition Equal Subset Sum":
        "https://leetcode.com/problems/partition-equal-subset-sum/",
    # Hard
    "Edit Distance":
        "https://leetcode.com/problems/edit-distance/",
    "Burst Balloons":
        "https://leetcode.com/problems/burst-balloons/",
}


def add_hyperlinks():
    doc = pymupdf.open(INPUT_PATH)

    total_links    = 0
    matched_titles = set()

    for page_num, page in enumerate(doc):
        for title, url in QUESTION_LINKS.items():
            # search_for returns list of Rect objects
            rects = page.search_for(title)
            if rects:
                for rect in rects:
                    # insert_link adds an invisible URI link annotation
                    page.insert_link({
                        "kind": pymupdf.LINK_URI,
                        "from": rect,
                        "uri":  url,
                    })
                    total_links += 1
                matched_titles.add(title)

    # ── Report ────────────────────────────────────────────────────────────────
    not_found = [t for t in QUESTION_LINKS if t not in matched_titles]
    print(f"\n{'='*60}")
    print(f"  Pages processed              : {len(doc)}")
    print(f"  Total link annotations added : {total_links}")
    print(f"  Unique question titles found : {len(matched_titles)} / {len(QUESTION_LINKS)}")
    print(f"  Titles NOT found in PDF      : {len(not_found)}")
    if not_found:
        for t in not_found:
            print(f"    !! MISSING: {t}")
    print(f"{'='*60}\n")

    # ── Save (new file, never overwrites original) ─────────────────────────────
    doc.save(OUTPUT_PATH, garbage=4, deflate=True)
    doc.close()

    print(f"  Output  : {OUTPUT_PATH}")
    print(f"  Original: {INPUT_PATH}  (unchanged)")


if __name__ == "__main__":
    add_hyperlinks()
