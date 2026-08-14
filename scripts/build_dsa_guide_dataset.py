import json
import os

def generate_guide_topics():
    topics = [
        {
            "id": "fundamentals",
            "title": "1. DSA Fundamentals & Asymptotic Complexity",
            "category": "Basics",
            "summary": "Understand Data Structures & Algorithms, Big-O, Big-Omega, Big-Theta notations, and time/space complexity analysis.",
            "theory": """
              <h3>What is DSA & Why it Matters</h3>
              <p><strong>Data Structures</strong> provide structured ways to store, organize, and manage data efficiently in computer memory. <strong>Algorithms</strong> are step-by-step procedure definitions for performing calculations, processing data, and automated reasoning tasks.</p>
              <p>In software engineering and FAANG technical interviews, selecting the correct Data Structure and Algorithm can optimize execution runtime from hours down to milliseconds, and reduce RAM consumption from gigabytes to megabytes.</p>

              <h3>Asymptotic Notations</h3>
              <ul>
                <li><strong>Big-O Notation (O):</strong> Represents the <strong>worst-case scenario</strong> (upper bound) of an algorithm's growth rate as input size N approaches infinity.</li>
                <li><strong>Big-Omega Notation (Ω):</strong> Represents the <strong>best-case scenario</strong> (lower bound) execution limit.</li>
                <li><strong>Big-Theta Notation (Θ):</strong> Represents the <strong>tight bound</strong> (exact average-case behavior) when worst-case and best-case growth rates coincide.</li>
              </ul>

              <h3>Common Complexity Orders (Fastest to Slowest)</h3>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                    <th style="padding: 6px;">Notation</th>
                    <th style="padding: 6px;">Name</th>
                    <th style="padding: 6px;">Example Operation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(1)</code></td><td>Constant</td><td>Hash Map Lookup, Array Indexing, Stack Push/Pop</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(log N)</code></td><td>Logarithmic</td><td>Binary Search, Balanced BST Insertion</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(N)</code></td><td>Linear</td><td>Array Traversal, Linear Search</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(N log N)</code></td><td>Linearithmic</td><td>Merge Sort, Quick Sort (average case)</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(N²)</code></td><td>Quadratic</td><td>Nested Loops, Bubble Sort</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;"><code>O(2^N)</code></td><td>Exponential</td><td>Recursive Fibonacci, Subsets Backtracking</td></tr>
                </tbody>
              </table>
            """,
            "code": {
                "cpp": """// C++ Asymptotic Analysis Demonstration
#include <iostream>
#include <vector>

void analyzeComplexity(const std::vector<int>& arr) {
    int n = arr.size();

    // 1. O(1) Constant Time
    int firstElement = arr[0];

    // 2. O(log N) Logarithmic Time (Binary Search)
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == 42) break;
        if (arr[mid] < 42) low = mid + 1;
        else high = mid - 1;
    }

    // 3. O(N) Linear Time (Single Pass)
    long long totalSum = 0;
    for (int i = 0; i < n; i++) {
        totalSum += arr[i];
    }
}""",
                "java": """// Java Asymptotic Analysis Demonstration
import java.util.*;

public class ComplexityAnalysis {
    public static void analyze(int[] arr) {
        int n = arr.length;

        // 1. O(1) Constant Time
        int firstElement = arr[0];

        // 2. O(log N) Logarithmic Time (Binary Search)
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == 42) break;
            if (arr[mid] < 42) low = mid + 1;
            else high = mid - 1;
        }

        // 3. O(N) Linear Time
        long totalSum = 0;
        for (int i = 0; i < n; i++) {
            totalSum += arr[i];
        }
    }
}""",
                "python": """# Python Asymptotic Analysis Demonstration

def analyze_complexity(arr: list[int]) -> None:
    n = len(arr)

    # 1. O(1) Constant Time
    first_element = arr[0]

    # 2. O(log N) Logarithmic Time (Binary Search)
    low, high = 0, n - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == 42:
            break
        if arr[mid] < 42:
            low = mid + 1
        else:
            high = mid - 1

    # 3. O(N) Linear Time
    total_sum = sum(arr)
"""
            }
        },
        {
            "id": "arrays",
            "title": "2. Arrays & Dynamic Vectors",
            "category": "Linear Data Structures",
            "summary": "Master array memory layout, dynamic sizing, contiguous memory access, and essential array operations.",
            "theory": """
              <h3>Arrays & Memory Contiguity</h3>
              <p>An <strong>Array</strong> is a linear data structure storing fixed-size homogenous elements in <strong>contiguous memory locations</strong>. Memory address calculation for index <code>i</code> is calculated instantly via <code>BaseAddress + (i * ElementSize)</code>, providing instantaneous <strong>O(1) random access</strong>.</p>

              <h3>Static vs Dynamic Arrays</h3>
              <ul>
                <li><strong>Static Arrays:</strong> Fixed size allocated at compile time (e.g. <code>int arr[100]</code>).</li>
                <li><strong>Dynamic Arrays:</strong> Automatically resize upon reaching capacity (e.g. <code>std::vector</code> in C++, <code>ArrayList</code> in Java, <code>list</code> in Python). Growth factor is typically 1.5x or 2x, yielding <strong>Amortized O(1) insertion time</strong>.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Dynamic Vector Operations
#include <iostream>
#include <vector>

void vectorDemo() {
    std::vector<int> nums = {10, 20, 30, 40};
    
    // O(1) Push Back
    nums.push_back(50);
    
    // O(1) Random Access
    int val = nums[2]; 
    
    // O(N) Insertion at index
    nums.insert(nums.begin() + 1, 15);
    
    // O(N) Deletion at index
    nums.erase(nums.begin() + 3);
}""",
                "java": """// Java ArrayList Operations
import java.util.*;

public class ArrayDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(10, 20, 30, 40));
        
        // O(1) Append
        nums.add(50);
        
        // O(1) Access
        int val = nums.get(2);
        
        // O(N) Insertion
        nums.add(1, 15);
        
        // O(N) Deletion
        nums.remove(3);
    }
}""",
                "python": """# Python Dynamic List Operations

def list_demo():
    nums = [10, 20, 30, 40]
    
    # O(1) Append
    nums.append(50)
    
    # O(1) Access
    val = nums[2]
    
    # O(N) Insert
    nums.insert(1, 15)
    
    # O(N) Delete
    nums.pop(3)
"""
            }
        },
        {
            "id": "strings",
            "title": "3. Strings & Character Manipulation",
            "category": "Linear Data Structures",
            "summary": "String immutability vs mutability, ASCII operations, frequency maps, palindromes, and pattern matching.",
            "theory": """
              <h3>String Memory & Mutability</h3>
              <p>Strings represent sequences of characters. In languages like <strong>Java and Python</strong>, strings are <strong>immutable</strong> (modifications create new string objects in memory). In <strong>C++</strong>, <code>std::string</code> is <strong>mutable</strong> and can be modified in place.</p>
              <p>For extensive string concatenations in Java, always use <code>StringBuilder</code> to prevent $O(N^2)$ memory garbage creation.</p>
            """,
            "code": {
                "cpp": """// C++ String In-Place Manipulation & Palindrome Check
#include <iostream>
#include <string>

bool isPalindrome(std::string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}""",
                "java": """// Java String & StringBuilder Operations
public class StringDemo {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }
}""",
                "python": """# Python String & Slicing Operations

def is_palindrome(s: str) -> bool:
    # O(N) Slice Comparison
    return s == s[::-1]
"""
            }
        },
        {
            "id": "hashing",
            "title": "4. Hashing, HashMap & HashSet",
            "category": "Linear Data Structures",
            "summary": "Hash functions, collision handling via chaining & open addressing, O(1) average lookup, and frequency counting.",
            "theory": """
              <h3>Hash Table Architecture</h3>
              <p>A <strong>Hash Table</strong> maps keys to values using a <strong>Hash Function</strong>. It converts keys into integer array indices, delivering <strong>O(1) average time complexity</strong> for insertion, lookup, and deletion.</p>
              <h3>Collision Resolution Techniques</h3>
              <ul>
                <li><strong>Chaining (Separate Chaining):</strong> Each bucket contains a linked list or balanced tree of keys sharing the same hash code.</li>
                <li><strong>Open Addressing:</strong> Searches for next available slot in array via Linear Probing or Quadratic Probing.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Unordered Map & Unordered Set
#include <iostream>
#include <unordered_map>
#include <unordered_set>
#include <vector>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map; // key: val, value: index
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}""",
                "java": """// Java HashMap & HashSet Operations
import java.util.*;

public class HashDemo {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}""",
                "python": """# Python Dictionary & Set Operations

def two_sum(nums: list[int], target: int) -> list[int]:
    num_map = {} # val -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []
"""
            }
        },
        {
            "id": "two-pointers",
            "title": "5. Two Pointers Pattern",
            "category": "Linear Data Structures",
            "summary": "Opposite convergence pointers and same-direction fast & slow pointers to eliminate nested loop iterations.",
            "theory": """
              <h3>Two Pointers Strategy</h3>
              <p>The <strong>Two Pointers</strong> pattern uses two index references iterating over a linear data structure simultaneously. It optimizes brute-force $O(N^2)$ nested loop algorithms down to <strong>O(N) time complexity</strong>.</p>
              <h3>Variants</h3>
              <ul>
                <li><strong>Opposite Directions:</strong> Left starts at index 0, Right starts at N-1 (e.g. 2Sum in sorted array, Container With Most Water).</li>
                <li><strong>Same Direction (Fast & Slow):</strong> Fast pointer scans ahead while Slow pointer tracks condition boundary (e.g. Floyd's Cycle Detection, Remove Duplicates).</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Two Pointers Sorted 2-Sum
#include <vector>

bool hasArrayPairWithSum(std::vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}""",
                "java": """// Java Two Pointers Sorted 2-Sum
public class TwoPointersDemo {
    public static boolean hasPair(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return true;
            if (sum < target) left++;
            else right--;
        }
        return false;
    }
}""",
                "python": """# Python Two Pointers Sorted 2-Sum

def has_pair(arr: list[int], target: int) -> bool:
    left, right = 0, len(arr) - 1
    while left < right:
        curr_sum = arr[left] + arr[right]
        if curr_sum == target:
            return True
        if curr_sum < target:
            left += 1
        else:
            right -= 1
    return False
"""
            }
        },
        {
            "id": "sliding-window",
            "title": "6. Sliding Window Technique",
            "category": "Linear Data Structures",
            "summary": "Fixed and variable length window mechanics for optimal contiguous subarray & substring processing.",
            "theory": """
              <h3>Sliding Window Concept</h3>
              <p>A window is formed over a contiguous subsegment of an array or string. By dynamically sliding the window bounds (adding element at <code>right</code>, removing element at <code>left</code>), we process subarray state in <strong>O(N) time</strong> instead of $O(N^2)$.</p>
            """,
            "code": {
                "cpp": """// C++ Fixed Window Max Sum of Size K
#include <vector>
#include <algorithm>

int maxSumSubarray(const std::vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    
    int maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}""",
                "java": """// Java Fixed Window Max Sum of Size K
public class SlidingWindow {
    public static int maxSum(int[] arr, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        
        int maxSum = windowSum;
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }
}""",
                "python": """# Python Fixed Window Max Sum of Size K

def max_sum_subarray(arr: list[int], k: int) -> int:
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum
"""
            }
        },
        {
            "id": "prefix-sum",
            "title": "7. Prefix Sum & Difference Arrays",
            "category": "Linear Data Structures",
            "summary": "Precompute cumulative sums for O(1) range query evaluations and range update algorithms.",
            "theory": """
              <h3>1D Prefix Sum Array</h3>
              <p>Construct a prefix array where <code>pref[i] = pref[i-1] + arr[i-1]</code>. Any range sum <code>sum(L...R)</code> is evaluated in <strong>O(1) time</strong> via <code>pref[R + 1] - pref[L]</code>.</p>
            """,
            "code": {
                "cpp": """// C++ Prefix Sum Range Query
#include <vector>

class PrefixSum {
    std::vector<int> pref;
public:
    PrefixSum(const std::vector<int>& nums) {
        pref.resize(nums.size() + 1, 0);
        for (size_t i = 0; i < nums.size(); i++) {
            pref[i + 1] = pref[i] + nums[i];
        }
    }
    int query(int left, int right) {
        return pref[right + 1] - pref[left];
    }
};""",
                "java": """// Java Prefix Sum Range Query
public class PrefixSum {
    private int[] pref;
    public PrefixSum(int[] nums) {
        pref = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            pref[i + 1] = pref[i] + nums[i];
        }
    }
    public int query(int left, int right) {
        return pref[right + 1] - pref[left];
    }
}""",
                "python": """# Python Prefix Sum Range Query

class PrefixSum:
    def __init__(self, nums: list[int]):
        self.pref = [0] * (len(nums) + 1)
        for i, val in enumerate(nums):
            self.pref[i + 1] = self.pref[i] + val

    def query(self, left: int, right: int) -> int:
        return self.pref[right + 1] - self.pref[left]
"""
            }
        },
        {
            "id": "searching-sorting",
            "title": "8. Searching & Sorting Algorithms",
            "category": "Searching/Sorting",
            "summary": "Binary search space reduction O(log N), Merge Sort, Quick Sort, and custom sorting comparators.",
            "theory": """
              <h3>Binary Search Space Reduction</h3>
              <p>Requires a monotonic (sorted) search space. Halves the search range in each iteration, achieving <strong>O(log N) runtime complexity</strong>.</p>
              <h3>Sorting Algorithm Comparison</h3>
              <ul>
                <li><strong>Merge Sort:</strong> Divide and Conquer, Stable, <strong>O(N log N) worst time</strong>, O(N) space.</li>
                <li><strong>Quick Sort:</strong> Pivot partitioning, Unstable, <strong>O(N log N) average time</strong>, O(log N) space.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Binary Search Implementation
#include <vector>

int binarySearch(const std::vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}""",
                "java": """// Java Binary Search Implementation
public class BinarySearch {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}""",
                "python": """# Python Binary Search Implementation

def binary_search(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
"""
            }
        },
        {
            "id": "recursion-backtracking",
            "title": "9. Recursion & Backtracking",
            "category": "Searching/Sorting",
            "summary": "Base case design, call stack management, state space tree traversal, pruning, and combinatorial search.",
            "theory": """
              <h3>Backtracking Framework</h3>
              <p>Backtracking builds solution candidates incrementally and abandons (prunes) a candidate as soon as it determines that the candidate cannot lead to a valid final solution.</p>
              <p><strong>Standard Backtracking Template:</strong> <code>Choose ➔ Recurse / Explore ➔ Unchoose (Backtrack)</code>.</p>
            """,
            "code": {
                "cpp": """// C++ Subsets Generation Backtracking
#include <vector>

void backtrack(int start, const std::vector<int>& nums, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < nums.size(); i++) {
        current.push_back(nums[i]); // Choose
        backtrack(i + 1, nums, current, result); // Explore
        current.pop_back(); // Unchoose
    }
}""",
                "java": """// Java Subsets Generation Backtracking
import java.util.*;

public class BacktrackDemo {
    public static void backtrack(int start, int[] nums, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]); // Choose
            backtrack(i + 1, nums, current, result); // Explore
            current.remove(current.size() - 1); // Unchoose
        }
    }
}""",
                "python": """# Python Subsets Generation Backtracking

def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            current.append(nums[i]) # Choose
            backtrack(i + 1, current) # Explore
            current.pop() # Unchoose
    backtrack(0, [])
    return result
"""
            }
        },
        {
            "id": "linked-lists",
            "title": "10. Linked Lists (Singly, Doubly, Circular)",
            "category": "Linear Data Structures",
            "summary": "Node pointer manipulation, list reversal, Floyd's cycle detection, and dummy head patterns.",
            "theory": """
              <h3>Linked List Structure</h3>
              <p>Nodes connected via memory pointers. Provides <strong>O(1) insertion/deletion</strong> given a pointer reference, but <strong>O(N) sequential search access</strong>.</p>
            """,
            "code": {
                "cpp": """// C++ Reverse Singly Linked List
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}""",
                "java": """// Java Reverse Singly Linked List
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LinkedListDemo {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
}""",
                "python": """# Python Reverse Singly Linked List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev
"""
            }
        },
        {
            "id": "stacks-queues",
            "title": "11. Stacks, Queues & Monotonic Stack",
            "category": "Linear Data Structures",
            "summary": "LIFO Stacks, FIFO Queues, Monotonic Stack for Next Greater Element, and Min-Stack design.",
            "theory": """
              <h3>Stack & Queue Fundamentals</h3>
              <ul>
                <li><strong>Stack (LIFO):</strong> Last-In-First-Out. Operations: <code>push</code>, <code>pop</code>, <code>top</code> in <strong>O(1) time</strong>.</li>
                <li><strong>Queue (FIFO):</strong> First-In-First-Out. Operations: <code>enqueue</code>, <code>dequeue</code> in <strong>O(1) time</strong>.</li>
                <li><strong>Monotonic Stack:</strong> Stack maintaining elements in strictly increasing/decreasing order to find Next Greater Element in <strong>O(N) time</strong>.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Monotonic Stack Next Greater Element
#include <vector>
#include <stack>

std::vector<int> nextGreaterElement(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> st; // stores indices
    
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}""",
                "java": """// Java Monotonic Stack Next Greater Element
import java.util.*;

public class StackDemo {
    public static int[] nextGreater(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, -1);
        Deque<Integer> st = new ArrayDeque<>();
        
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && nums[st.peek()] < nums[i]) {
                result[st.pop()] = nums[i];
            }
            st.push(i);
        }
        return result;
    }
}""",
                "python": """# Python Monotonic Stack Next Greater Element

def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = [] # stores indices
    
    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    return result
"""
            }
        },
        {
            "id": "trees-bst",
            "title": "12. Binary Trees & Binary Search Trees (BST)",
            "category": "Trees",
            "summary": "Tree traversals (DFS Inorder/Preorder/Postorder, BFS Level-Order), BST properties, and height balance.",
            "theory": """
              <h3>Tree Architecture</h3>
              <p>A <strong>Binary Tree</strong> is a hierarchical node structure where each node has at most 2 children (left and right). A <strong>Binary Search Tree (BST)</strong> satisfies: <code>left.val < root.val < right.val</code> for all nodes.</p>
              <p>In-order traversal of a BST yields elements in <strong>strictly sorted order</strong>.</p>
            """,
            "code": {
                "cpp": """// C++ Tree Node & Inorder Traversal
#include <vector>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* root, std::vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);
    inorder(root->right, res);
}""",
                "java": """// Java Tree Node & Inorder Traversal
import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeDemo {
    public static void inorder(TreeNode root, List<Integer> res) {
        if (root == null) return;
        inorder(root.left, res);
        res.add(root.val);
        inorder(root.right, res);
    }
}""",
                "python": """# Python Tree Node & Inorder Traversal

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root: TreeNode, res: list[int]) -> None:
    if not root:
        return
    inorder(root.left, res)
    res.append(root.val)
    inorder(root.right, res)
"""
            }
        },
        {
            "id": "heaps",
            "title": "13. Heaps & Priority Queues",
            "category": "Trees",
            "summary": "Binary Max/Min-Heap arrays, Heapify O(N), push/pop O(log N), Top-K elements, and two-heap median stream.",
            "theory": """
              <h3>Priority Queue & Heap Property</h3>
              <p>A <strong>Binary Heap</strong> is a complete binary tree stored inside a contiguous array. Parent at index <code>i</code> has children at <code>2i + 1</code> and <code>2i + 2</code>.</p>
              <ul>
                <li><strong>Push / Pop:</strong> <code>O(log N)</code> time.</li>
                <li><strong>Peek Min/Max:</strong> <code>O(1)</code> time.</li>
                <li><strong>Build Heap (Heapify):</strong> <code>O(N)</code> time.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Min-Heap Priority Queue
#include <queue>
#include <vector>

std::vector<int> findKSmallest(const std::vector<int>& nums, int k) {
    std::priority_queue<int> maxHeap; // stores k smallest
    for (int x : nums) {
        maxHeap.push(x);
        if (maxHeap.size() > k) maxHeap.pop();
    }
    std::vector<int> result;
    while (!maxHeap.empty()) {
        result.push_back(maxHeap.top());
        maxHeap.pop();
    }
    return result;
}""",
                "java": """// Java PriorityQueue (Max-Heap for K smallest)
import java.util.*;

public class HeapDemo {
    public static List<Integer> findKSmallest(int[] nums, int k) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int x : nums) {
            maxHeap.offer(x);
            if (maxHeap.size() > k) maxHeap.poll();
        }
        return new ArrayList<>(maxHeap);
    }
}""",
                "python": """# Python heapq (Min-Heap / Max-Heap for K smallest)
import heapq

def find_k_smallest(nums: list[int], k: int) -> list[int]:
    # Use nsmallest in O(N log K) time
    return heapq.nsmallest(k, nums)
"""
            }
        },
        {
            "id": "trie",
            "title": "14. Trie (Prefix Tree)",
            "category": "Trees",
            "summary": "Prefix tree node hierarchy, O(L) insert & search, autocomplete, and Maximum XOR Pair queries.",
            "theory": """
              <h3>Trie Data Structure</h3>
              <p>A <strong>Trie</strong> (Prefix Tree) is an $N$-ary tree optimized for string storage and prefix retrieval. Insertion and search require <strong>O(L) time complexity</strong>, where $L$ is the string length.</p>
            """,
            "code": {
                "cpp": """// C++ Trie Implementation
#include <string>
#include <unordered_map>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(std::string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }
    bool search(std::string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return curr->isEnd;
    }
};""",
                "java": """// Java Trie Implementation
import java.util.*;

class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

public class Trie {
    private TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            curr.children.putIfAbsent(c, new TrieNode());
            curr = curr.children.get(c);
        }
        curr.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            if (!curr.children.containsKey(c)) return false;
            curr = curr.children.get(c);
        }
        return curr.isEnd;
    }
}""",
                "python": """# Python Trie Implementation

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end
"""
            }
        },
        {
            "id": "graphs",
            "title": "15. Graphs (BFS, DFS, Topological Sort, Dijkstra)",
            "category": "Graphs",
            "summary": "Adjacency lists, BFS shortest path, DFS cycle detection, Topological Sort (Kahn's), and Dijkstra's algorithm.",
            "theory": """
              <h3>Graph Representations</h3>
              <p>A Graph $G = (V, E)$ consists of Vertices $V$ and Edges $E$. Represented via <strong>Adjacency List</strong> ($O(V + E)$ space) or <strong>Adjacency Matrix</strong> ($O(V^2)$ space).</p>
              <h3>Core Graph Algorithms</h3>
              <ul>
                <li><strong>BFS (Breadth-First Search):</strong> Level-order queue traversal. Finds shortest path in unweighted graphs in $O(V + E)$ time.</li>
                <li><strong>DFS (Depth-First Search):</strong> Recursive stack traversal for connected components and cycle detection.</li>
                <li><strong>Dijkstra's Algorithm:</strong> Min-heap Priority Queue shortest path in weighted graphs in $O((V + E) \log V)$ time.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ BFS Graph Traversal
#include <vector>
#include <queue>

void bfs(int startNode, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    std::queue<int> q;
    q.push(startNode);
    visited[startNode] = true;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}""",
                "java": """// Java BFS Graph Traversal
import java.util.*;

public class GraphBFS {
    public static void bfs(int startNode, List<List<Integer>> adj, boolean[] visited) {
        Queue<Integer> q = new LinkedList<>();
        q.offer(startNode);
        visited[startNode] = true;
        
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.offer(v);
                }
            }
        }
    }
}""",
                "python": """# Python BFS Graph Traversal
from collections import deque

def bfs(start_node: int, adj: list[list[int]], visited: list[bool]) -> None:
    queue = deque([start_node])
    visited[start_node] = True
    
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                queue.append(v)
"""
            }
        },
        {
            "id": "dsu",
            "title": "16. Disjoint Set Union (Union Find / DSU)",
            "category": "Graphs",
            "summary": "Path Compression, Union by Rank/Size, near-constant O(alpha(N)) amortized time, and Kruskal's MST.",
            "theory": """
              <h3>DSU Mechanics</h3>
              <p>Tracks partitioned disjoint sets. Operations <code>find(x)</code> (with Path Compression) and <code>union(x, y)</code> (with Rank/Size) operate in <strong>amortized O(α(N)) time</strong> (where $\\alpha$ is the Inverse Ackermann function, effectively constant $< 5$).</p>
            """,
            "code": {
                "cpp": """// C++ DSU with Path Compression & Rank
#include <vector>

class DSU {
    std::vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path Compression
    }
    bool unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
    }
};""",
                "java": """// Java DSU with Path Compression & Rank
public class DSU {
    private int[] parent, rank;
    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    public int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    public boolean unite(int i, int j) {
        int rootI = find(i), rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;
        else if (rank[rootI] > rank[rootJ]) parent[rootJ] = rootI;
        else { parent[rootJ] = rootI; rank[rootI]++; }
        return true;
    }
}""",
                "python": """# Python DSU with Path Compression & Rank

class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i: int) -> int:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def unite(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i == root_j:
            return False
        if self.rank[root_i] < self.rank[root_j]:
            self.parent[root_i] = root_j
        elif self.rank[root_i] > self.rank[root_j]:
            self.parent[root_j] = root_i
        else:
            self.parent[root_j] = root_i
            self.rank[root_i] += 1
        return True
"""
            }
        },
        {
            "id": "greedy",
            "title": "17. Greedy Algorithms",
            "category": "Greedy",
            "summary": "Greedy Choice Property, Optimal Substructure, Activity Selection, Gas Station, and Fractional Knapsack.",
            "theory": """
              <h3>Greedy Choice Principle</h3>
              <p>A <strong>Greedy Algorithm</strong> makes the locally optimal choice at each decision step, aiming to reach a globally optimal solution. It is faster than Dynamic Programming but requires proving that greedy choice holds.</p>
            """,
            "code": {
                "cpp": """// C++ Non-Overlapping Intervals Greedy Algorithm
#include <vector>
#include <algorithm>

int eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[1] < b[1]; // sort by end time
    });
    int count = 0, prevEnd = intervals[0][1];
    for (size_t i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < prevEnd) count++;
        else prevEnd = intervals[i][1];
    }
    return count;
}""",
                "java": """// Java Non-Overlapping Intervals Greedy Algorithm
import java.util.*;

public class GreedyDemo {
    public static int eraseOverlap(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, Comparator.comparingInt(a -> a[1]));
        int count = 0, prevEnd = intervals[0][1];
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < prevEnd) count++;
            else prevEnd = intervals[i][1];
        }
        return count;
    }
}""",
                "python": """# Python Non-Overlapping Intervals Greedy Algorithm

def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0
    intervals.sort(key=lambda x: x[1]) # sort by end time
    count = 0
    prev_end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            count += 1
        else:
            prev_end = intervals[i][1]
    return count
"""
            }
        },
        {
            "id": "dp",
            "title": "18. Dynamic Programming (Memoization & Tabulation)",
            "category": "DP",
            "summary": "Overlapping Subproblems, Optimal Substructure, Top-Down Memoization vs Bottom-Up Tabulation, 1D & 2D DP.",
            "theory": """
              <h3>Dynamic Programming Essentials</h3>
              <p>Dynamic Programming solves complex problems by breaking them into simpler overlapping subproblems, solving each subproblem once, and storing their results.</p>
              <ul>
                <li><strong>Top-Down (Memoization):</strong> Recursion with caching table.</li>
                <li><strong>Bottom-Up (Tabulation):</strong> Iterative array table filling from base cases.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ 0/1 Knapsack Bottom-Up DP
#include <vector>
#include <algorithm>

int knapsack(int W, const std::vector<int>& wt, const std::vector<int>& val, int n) {
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = std::max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}""",
                "java": """// Java 0/1 Knapsack Bottom-Up DP
public class DPDemo {
    public static int knapsack(int W, int[] wt, int[] val, int n) {
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (wt[i - 1] <= w)
                    dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                else
                    dp[i][w] = dp[i - 1][w];
            }
        }
        return dp[n][W];
    }
}""",
                "python": """# Python 0/1 Knapsack Bottom-Up DP

def knapsack(W: int, wt: list[int], val: list[int], n: int) -> int:
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]
"""
            }
        },
        {
            "id": "bit-manipulation",
            "title": "19. Bit Manipulation & Bitwise Operations",
            "category": "Bit Manipulation",
            "summary": "Bitwise operators AND, OR, XOR, NOT, shift operations, bitmasking, and single number cancellation.",
            "theory": """
              <h3>Bitwise Operators Cheat Sheet</h3>
              <ul>
                <li><code>AND (&)</code>: 1 if both bits are 1. Used for bit masking.</li>
                <li><code>OR (|)</code>: 1 if either bit is 1. Used for setting bits.</li>
                <li><code>XOR (^)</code>: 1 if bits differ. Properties: <code>x ^ x = 0</code>, <code>x ^ 0 = x</code>.</li>
                <li><code>Clear Lowest Set Bit:</code> <code>x & (x - 1)</code>.</li>
                <li><code>Isolate Lowest Set Bit:</code> <code>x & (-x)</code>.</li>
              </ul>
            """,
            "code": {
                "cpp": """// C++ Bit Manipulation Tricks
#include <vector>

int singleNumber(const std::vector<int>& nums) {
    int result = 0;
    for (int x : nums) result ^= x; // XOR eliminates duplicates
    return result;
}

int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1); // Clears lowest set bit in O(set_bits)
        count++;
    }
    return count;
}""",
                "java": """// Java Bit Manipulation Tricks
public class BitDemo {
    public static int singleNumber(int[] nums) {
        int result = 0;
        for (int x : nums) result ^= x;
        return result;
    }
    public static int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }
}""",
                "python": """# Python Bit Manipulation Tricks

def single_number(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result

def count_set_bits(n: int) -> int:
    count = 0
    while n > 0:
        n &= (n - 1)
        count += 1
    return count
"""
            }
        },
        {
            "id": "advanced-dsa",
            "title": "20. Advanced Data Structures & FAANG Interview Cheat Sheet",
            "category": "Advanced DSA",
            "summary": "Segment Tree, Fenwick Tree / BIT, Monotonic Queue, and diagnostic decision matrix for technical interviews.",
            "theory": """
              <h3>Master FAANG Interview Decision Matrix</h3>
              <p>Use this decision tree during live technical coding interviews:</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
                    <th style="padding: 6px;">Problem Keyword / Condition</th>
                    <th style="padding: 6px;">Recommended Data Structure / Pattern</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Sorted Array & Target Sum / Palindrome</td><td>Two Pointers</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Contiguous Subarray / Substring Max/Min</td><td>Sliding Window / Monotonic Deque</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Range Sum Query Static / Dynamic</td><td>Prefix Sum (Static) / Fenwick or Segment Tree (Dynamic)</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Top K Frequent / Kth Largest Element</td><td>Min-Heap / Max-Heap Priority Queue</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Next Greater Element / Histogram Area</td><td>Monotonic Stack</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Prefix Search / Word Dictionary</td><td>Trie</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Connected Components / MST</td><td>Disjoint Set Union (DSU / Union-Find)</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Shortest Path Weighted / Unweighted</td><td>Dijkstra (Weighted) / BFS (Unweighted)</td></tr>
                  <tr style="border-bottom: 1px solid var(--border-subtle);"><td style="padding: 6px;">Overlapping Choices / Subproblems</td><td>Dynamic Programming (Memoization / Tabulation)</td></tr>
                </tbody>
              </table>
            """,
            "code": {
                "cpp": """// C++ Monotonic Queue Sliding Window Maximum
#include <vector>
#include <deque>

std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq; // stores indices
    std::vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        if (!dq.empty() && dq.front() == i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}""",
                "java": """// Java Monotonic Queue Sliding Window Maximum
import java.util.*;

public class AdvancedDemo {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        int[] result = new int[nums.length - k + 1];
        int ri = 0;
        for (int i = 0; i < nums.length; i++) {
            if (!dq.isEmpty() && dq.peek() == i - k) dq.poll();
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
            dq.offer(i);
            if (i >= k - 1) result[ri++] = nums[dq.peek()];
        }
        return result;
    }
}""",
                "python": """# Python Monotonic Queue Sliding Window Maximum
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque() # stores indices
    result = []
    for i, num in enumerate(nums):
        if dq and dq[0] == i - k:
            dq.popleft()
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
"""
            }
        }
    ]
    return topics

def main():
    topics = generate_guide_topics()
    js_content = f"// Comprehensive 20-Chapter DSA Guide Dataset with Multilingual Code Examples (C++, Java, Python)\nconst GUIDE_DATA = {json.dumps(topics, indent=2)};\nif (typeof module !== 'undefined') module.exports = GUIDE_DATA;\n"
    output_path = os.path.join("data", "guide_data.js")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Successfully generated {len(topics)} chapters in {output_path}!")

if __name__ == "__main__":
    main()
