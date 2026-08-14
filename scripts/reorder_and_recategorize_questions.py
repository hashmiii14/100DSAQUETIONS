import json
import os

questions_path = os.path.join('data', 'questions.js')

with open(questions_path, 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('[')
end_idx = text.rfind(']') + 1
data = json.loads(text[start_idx:end_idx])

# Comprehensive set of Array problem titles
ARRAY_TITLES = {
    "Two Sum", "Best Time to Buy and Sell Stock", "Contains Duplicate", "Maximum Subarray",
    "Plus One", "Remove Duplicates from Sorted Array", "Remove Element", "Merge Sorted Array",
    "Intersection of Two Arrays", "Rotate Array", "Move Zeroes", "Product of Array Except Self",
    "Find All Numbers Disappeared in an Array", "Majority Element", "Missing Number",
    "Pascal's Triangle", "3Sum", "4Sum", "Container With Most Water", "Subarray Sum Equals K",
    "Maximum Product Subarray", "Find Minimum in Rotated Sorted Array", "Search in Rotated Sorted Array",
    "Trapping Rain Water", "First Missing Positive", "Contains Duplicate II", "Contains Duplicate III",
    "Pascal's Triangle II", "Intersection of Two Arrays II", "Third Maximum Number", "Find All Duplicates in an Array",
    "Can Place Flowers", "Maximum Average Subarray I", "Find Pivot Index", "Sort Array By Parity",
    "Squares of a Sorted Array", "Height Checker", "Relative Sort Array", "Degree of an Array",
    "Richest Customer Wealth", "Shuffle the Array", "Kids With the Greatest Number of Candies",
    "Create Target Array in the Given Order", "Find Numbers with Even Number of Digits",
    "Maximum Product of Two Elements in an Array", "Count Good Triplets", "Matrix Diagonal Sum",
    "Special Positions in a Binary Matrix", "Sum of All Odd Length Subarrays", "Check if Array Is Sorted and Rotated",
    "Count Items Matching a Rule", "Determine Whether Matrix Can Be Obtained By Rotation",
    "Sort an Array", "Max Increase to Keep City Skyline", "Monotonic Array", "Rotate Image",
    "Spiral Matrix", "Spiral Matrix II", "Set Matrix Zeroes", "Game of Life", "Reshape the Matrix",
    "Toeplitz Matrix", "Transpose Matrix", "Valid Mountain Array", "K-diff Pairs in an Array",
    "Non-decreasing Array", "Array Nesting", "Teemo Attacking",
    "Shortest Unsorted Continuous Subarray", "Maximum Product of Three Numbers", "Subarray Sums Divisible by K",
    "Contiguous Array", "Continuous Subarray Sum", "Subarray Product Less Than K", "Maximum Sum Circular Subarray",
    "Sum of Subarray Minimums", "Shortest Subarray with Sum at Least K", "Subarrays with K Different Integers",
    "Task Scheduler", "Gas Station", "Candy", "Jump Game", "Jump Game II", "Array Partition"
}

for p in data:
    title = p.get('title', '')
    curr_topic = p.get('topic', '')
    if title in ARRAY_TITLES:
        p['topic'] = 'Arrays'
    elif 'Array' in title or 'Subarray' in title or 'Matrix' in title:
        if curr_topic in ['Strings', 'Hashing', 'Simulation', 'Sort']:
            p['topic'] = 'Arrays'

TOPIC_ORDER = [
    "Arrays",
    "Strings",
    "Two Pointers",
    "Sliding Window",
    "Prefix Sum",
    "Linked List",
    "Stack",
    "Queue",
    "Binary Search",
    "Trees",
    "BST",
    "Heap",
    "Trie",
    "Greedy",
    "Union Find",
    "Graphs",
    "Dynamic Programming",
    "Backtracking",
    "Bit Manipulation",
    "Math",
    "Hashing",
    "Segment Tree",
    "Geometry",
    "Simulation",
    "BFS",
    "Sort"
]

def topic_rank(p):
    t = p.get('topic', 'Arrays')
    if t in TOPIC_ORDER:
        return TOPIC_ORDER.index(t)
    return 999

difficulty_rank = {"Easy": 1, "Medium": 2, "Hard": 3}

data.sort(key=lambda p: (topic_rank(p), difficulty_rank.get(p.get('difficulty'), 2), p.get('id', 0)))

for idx, p in enumerate(data, start=1):
    p['id'] = idx
    p['number'] = idx
    p['sequence_number'] = idx

output_content = f"// Canonical 1000 Verified Real LeetCode Dataset — 200 Easy / 500 Medium / 300 Hard\nconst PROBLEMS = {json.dumps(data, indent=2)};\nif (typeof module !== 'undefined') module.exports = PROBLEMS;\n"

with open(questions_path, 'w', encoding='utf-8') as f:
    f.write(output_content)

print(f"[SUCCESS] Updated {questions_path} with {len(data)} problems ordered starting with Arrays!")
