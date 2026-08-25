import json
import os

def generate_guide_dataset():
    topics = [
        {
            "id": "arrays",
            "title": "1. Arrays & Subarray Techniques",
            "category": "Linear Data Structures",
            "summary": "Array indexing, contiguous memory allocation, vector resizing, and Kadane's maximum subarray algorithm.",
            "theory": """
              <h3>Array Data Structure</h3>
              <p>An array stores elements of homogenous data types in contiguous memory blocks. Element access at index <code>i</code> computes in instant <strong>O(1) time complexity</strong> via formula <code>BaseAddress + (i * ElementSize)</code>.</p>
              <h3>Key Operations & Complexities</h3>
              <ul>
                <li><strong>Access:</strong> O(1) time</li>
                <li><strong>Search:</strong> O(N) linear time (un-sorted) / O(log N) binary search (sorted)</li>
                <li><strong>Insertion / Deletion:</strong> O(N) time due to element shifting</li>
              </ul>
            """,
            "exampleTitle": "Kadane's Algorithm for Maximum Subarray Sum",
            "explanation": "Kadane's algorithm computes the maximum contiguous subarray sum in a single linear pass by maintaining local current max and global max.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Kadane's Algorithm implementation
#include <iostream>
#include <vector>
#include <algorithm>

int maxSubArray(const std::vector<int>& nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    
    for (size_t i = 1; i < nums.size(); ++i) {
        currentMax = std::max(nums[i], currentMax + nums[i]);
        maxSoFar = std::max(maxSoFar, currentMax);
    }
    return maxSoFar;
}""",
                "java": """// Java Kadane's Algorithm implementation
public class ArrayExample {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}""",
                "python": """# Python Kadane's Algorithm implementation

def max_sub_array(nums: list[int]) -> int:
    max_so_far = nums[0]
    current_max = nums[0]
    
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
        
    return max_so_far
"""
            }
        },
        {
            "id": "strings",
            "title": "2. Strings & Character Frequency",
            "category": "Linear Data Structures",
            "summary": "String immutability vs mutability, ASCII array hashing, palindrome verification, and anagram checks.",
            "theory": """
              <h3>String Memory Representation</h3>
              <p>Strings are arrays of characters. In C++, <code>std::string</code> is mutable. In Java and Python, strings are immutable, making string concatenation inside loops computationally expensive (creates O(N^2) garbage memory).</p>
            """,
            "exampleTitle": "Valid Anagram Check using Frequency Table",
            "explanation": "Increments character counts for string S and decrements for string T using a 26-element frequency array. If all counts return 0, the strings are valid anagrams.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1) (fixed 26-size alphabet array)",
            "code": {
                "cpp": """// C++ Valid Anagram Check
#include <string>
#include <vector>

bool isAnagram(std::string s, std::string t) {
    if (s.length() != t.length()) return false;
    std::vector<int> count(26, 0);
    for (size_t i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int c : count) {
        if (c != 0) return false;
    }
    return true;
}""",
                "java": """// Java Valid Anagram Check
public class StringExample {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}""",
                "python": """# Python Valid Anagram Check

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for i in range(len(s)):
        count[ord(s[i]) - ord('a')] += 1
        count[ord(t[i]) - ord('a')] -= 1
    return all(c == 0 for c in count)
"""
            }
        },
        {
            "id": "hashing",
            "title": "3. Hashing, HashMap & HashSet",
            "category": "Linear Data Structures",
            "summary": "Hash tables, collision handling via chaining & open addressing, O(1) average lookup, and Two-Sum complement search.",
            "theory": """
              <h3>Hash Table Operations</h3>
              <p>Maps arbitrary keys to table indices using a Hash Function. Delivers average <strong>O(1) time complexity</strong> for search, insertion, and deletion operations.</p>
            """,
            "exampleTitle": "Two Sum Target Lookup using HashMap",
            "explanation": "Store previously seen numbers and their indices in a hash map. For each element X, query if (Target - X) exists in the map.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Two Sum using std::unordered_map
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map; // value -> index
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}""",
                "java": """// Java Two Sum using HashMap
import java.util.*;

public class HashExample {
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
                "python": """# Python Two Sum using Dict

def two_sum(nums: list[int], target: int) -> list[int]:
    num_map = {}
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
            "title": "4. Two Pointers Pattern",
            "category": "Linear Data Structures",
            "summary": "Opposite convergence pointers and same-direction fast/slow pointers to optimize quadratic loops to linear time.",
            "theory": """
              <h3>Two Pointers Mechanics</h3>
              <p>Maintains two index references moving across a sequence. Reduces quadratic $O(N^2)$ brute-force iterations down to <strong>O(N) linear time</strong>.</p>
            """,
            "exampleTitle": "Two Sum II in Sorted Array (Opposite Convergence)",
            "explanation": "With a sorted array, increment left pointer if sum < target, and decrement right pointer if sum > target.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Two Pointers on Sorted Array
#include <vector>

std::vector<int> twoSumSorted(const std::vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        if (sum < target) left++;
        else right--;
    }
    return {};
}""",
                "java": """// Java Two Pointers on Sorted Array
public class TwoPointersExample {
    public static int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }
}""",
                "python": """# Python Two Pointers on Sorted Array

def two_sum_sorted(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1]
        if curr_sum < target:
            left += 1
        else:
            right -= 1
    return []
"""
            }
        },
        {
            "id": "sliding-window",
            "title": "5. Sliding Window Technique",
            "category": "Linear Data Structures",
            "summary": "Fixed and variable length window mechanics for optimal contiguous subarray & substring processing.",
            "theory": """
              <h3>Sliding Window Concept</h3>
              <p>Maintains dynamic bounds over a contiguous window segment. As right boundary expands, left boundary contracts when constraints are broken.</p>
            """,
            "exampleTitle": "Maximum Sum Subarray of Size K (Fixed Window)",
            "explanation": "Computes sum of initial K elements, then slides window right by adding incoming element and subtracting outgoing element.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Fixed Sliding Window
#include <vector>
#include <algorithm>

int maxSubarraySumK(const std::vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    
    int maxSum = windowSum;
    for (size_t i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = std::max(maxSum, windowSum);
    }
    return maxSum;
}""",
                "java": """// Java Fixed Sliding Window
public class SlidingWindowExample {
    public static int maxSubarraySumK(int[] arr, int k) {
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
                "python": """# Python Fixed Sliding Window

def max_subarray_sum_k(arr: list[int], k: int) -> int:
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
            "title": "6. Prefix Sum & Range Queries",
            "category": "Linear Data Structures",
            "summary": "Cumulative precomputation array to evaluate range queries sum(L...R) in instant O(1) time.",
            "theory": """
              <h3>1D Prefix Array Formula</h3>
              <p>Construct array <code>pref[i] = pref[i-1] + arr[i-1]</code>. Range sum in index interval <code>[L, R]</code> is evaluated in <strong>O(1) time</strong> via <code>pref[R + 1] - pref[L]</code>.</p>
            """,
            "exampleTitle": "Subarray Sum Equals K using Prefix Sum & Map",
            "explanation": "Calculates cumulative prefix sum at each index. If (currentPrefix - K) occurred previously, adds its frequency to count.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Subarray Sum Equals K
#include <vector>
#include <unordered_map>

int subarraySumK(const std::vector<int>& nums, int k) {
    int count = 0, currentSum = 0;
    std::unordered_map<int, int> prefixMap;
    prefixMap[0] = 1;
    
    for (int num : nums) {
        currentSum += num;
        if (prefixMap.count(currentSum - k)) {
            count += prefixMap[currentSum - k];
        }
        prefixMap[currentSum]++;
    }
    return count;
}""",
                "java": """// Java Subarray Sum Equals K
import java.util.*;

public class PrefixSumExample {
    public static int subarraySum(int[] nums, int k) {
        int count = 0, currentSum = 0;
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        
        for (int num : nums) {
            currentSum += num;
            if (map.containsKey(currentSum - k)) {
                count += map.get(currentSum - k);
            }
            map.put(currentSum, map.getOrDefault(currentSum, 0) + 1);
        }
        return count;
    }
}""",
                "python": """# Python Subarray Sum Equals K

def subarray_sum(nums: list[int], k: int) -> int:
    count = 0
    current_sum = 0
    prefix_map = {0: 1}
    
    for num in nums:
        current_sum += num
        if (current_sum - k) in prefix_map:
            count += prefix_map[current_sum - k]
        prefix_map[current_sum] = prefix_map.get(current_sum, 0) + 1
        
    return count
"""
            }
        },
        {
            "id": "sorting",
            "title": "7. Sorting Algorithms (Merge Sort, Quick Sort)",
            "category": "Searching/Sorting",
            "summary": "Divide and conquer sorting, Merge Sort O(N log N) stable, and Quick Sort in-place partitioning.",
            "theory": """
              <h3>Comparison of Sorting Methods</h3>
              <ul>
                <li><strong>Merge Sort:</strong> Stable, O(N log N) worst-case time, O(N) space.</li>
                <li><strong>Quick Sort:</strong> In-place, O(N log N) average time, O(log N) stack space.</li>
              </ul>
            """,
            "exampleTitle": "QuickSort In-Place Partitioning & Sorting",
            "explanation": "Chooses pivot element, partitions array such that elements smaller than pivot go left and larger go right, then recursively sorts partitions.",
            "timeComplexity": "O(N log N) average, O(N^2) worst case",
            "spaceComplexity": "O(log N) recursive call stack",
            "code": {
                "cpp": """// C++ QuickSort Implementation
#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}""",
                "java": """// Java QuickSort Implementation
public class SortExample {
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }

    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
}""",
                "python": """# Python QuickSort Implementation

def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pi = i + 1
        
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
"""
            }
        },
        {
            "id": "binary-search",
            "title": "8. Binary Search & Search Space",
            "category": "Searching/Sorting",
            "summary": "Logarithmic O(log N) search on monotonic arrays and binary search on solution spaces.",
            "theory": """
              <h3>Search Space Reduction</h3>
              <p>Halves search range in each iteration. Requires sorted arrays or monotonic predicate functions <code>[FFFFTTTT]</code>.</p>
            """,
            "exampleTitle": "Binary Search in Sorted Array",
            "explanation": "Compares middle element with target. If mid equals target return index, else eliminate half of search space.",
            "timeComplexity": "O(log N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Iterative Binary Search
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
                "java": """// Java Iterative Binary Search
public class SearchExample {
    public static int binarySearch(int[] nums, int target) {
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
                "python": """# Python Iterative Binary Search

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
            "id": "recursion",
            "title": "9. Recursion & Call Stack",
            "category": "Searching/Sorting",
            "summary": "Base case design, recursive function call stack, call depth, and exponentiation algorithm.",
            "theory": """
              <h3>Recursive Architecture</h3>
              <p>A function calls itself with simplified parameters until hitting a <strong>Base Case</strong>. Excess recursive depth triggers Stack Overflow.</p>
            """,
            "exampleTitle": "Fast Exponentiation Power(x, n)",
            "explanation": "Calculates x^n recursively by squaring power of n/2 in O(log N) operations.",
            "timeComplexity": "O(log N)",
            "spaceComplexity": "O(log N) stack frames",
            "code": {
                "cpp": """// C++ Fast Power Recursion
double myPow(double x, long long n) {
    if (n == 0) return 1.0;
    if (n < 0) return 1.0 / myPow(x, -n);
    double half = myPow(x, n / 2);
    if (n % 2 == 0) return half * half;
    else return half * half * x;
}""",
                "java": """// Java Fast Power Recursion
public class RecursionExample {
    public static double myPow(double x, long n) {
        if (n == 0) return 1.0;
        if (n < 0) return 1.0 / myPow(x, -n);
        double half = myPow(x, n / 2);
        if (n % 2 == 0) return half * half;
        else return half * half * x;
    }
}""",
                "python": """# Python Fast Power Recursion

def my_pow(x: float, n: int) -> float:
    if n == 0:
        return 1.0
    if n < 0:
        return 1.0 / my_pow(x, -n)
    half = my_pow(x, n // 2)
    if n % 2 == 0:
        return half * half
    else:
        return half * half * x
"""
            }
        },
        {
            "id": "backtracking",
            "title": "10. Backtracking & Combinatorial Search",
            "category": "Searching/Sorting",
            "summary": "State space tree search, Choose-Explore-Unchoose design template, pruning, and subset generation.",
            "theory": """
              <h3>Backtracking Framework</h3>
              <p>Systematic search space traversal. Template: <code>Choose candidate ➔ Recurse ➔ Unchoose (backtrack) candidate</code>.</p>
            """,
            "exampleTitle": "Subsets Generation (Power Set)",
            "explanation": "Generates all 2^N subsets of a given array by making binary include/exclude decisions at each element.",
            "timeComplexity": "O(N * 2^N)",
            "spaceComplexity": "O(N) recursive space",
            "code": {
                "cpp": """// C++ Subsets Backtracking
#include <vector>

void backtrack(int start, const std::vector<int>& nums, std::vector<int>& current, std::vector<std::vector<int>>& result) {
    result.push_back(current);
    for (size_t i = start; i < nums.size(); i++) {
        current.push_back(nums[i]); // Choose
        backtrack(i + 1, nums, current, result); // Explore
        current.pop_back(); // Unchoose
    }
}""",
                "java": """// Java Subsets Backtracking
import java.util.*;

public class BacktrackExample {
    public static void backtrack(int start, int[] nums, List<Integer> current, List<List<Integer>> result) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]); // Choose
            backtrack(i + 1, nums, current, result); // Explore
            current.remove(current.size() - 1); // Unchoose
        }
    }
}""",
                "python": """# Python Subsets Backtracking

def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    def backtrack(start: int, current: list[int]):
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
            "id": "linked-list",
            "title": "11. Linked Lists (Singly, Doubly, Circular)",
            "category": "Linear Data Structures",
            "summary": "Node pointer linkages, head/tail dummy nodes, list reversal, and Floyd's cycle detection algorithm.",
            "theory": """
              <h3>Linked List Pointers</h3>
              <p>Linear structure of nodes connected via pointers. O(1) prepend/insertion with node references, O(N) index access.</p>
            """,
            "exampleTitle": "Reverse Singly Linked List In-Place",
            "explanation": "Iterates through list while updating next pointers to point backwards to previous node.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Reverse Linked List
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}""",
                "java": """// Java Reverse Linked List
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LinkedListExample {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}""",
                "python": """# Python Reverse Linked List

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev
"""
            }
        },
        {
            "id": "stack",
            "title": "12. Stack & Monotonic Stack",
            "category": "Linear Data Structures",
            "summary": "Last-In-First-Out (LIFO) stack operations, parentheses verification, and Monotonic Stack Next Greater Element.",
            "theory": """
              <h3>Monotonic Stack Invariant</h3>
              <p>Maintains stack elements in strictly monotonic increasing/decreasing order. Resolves nearest greater/smaller element queries in linear time.</p>
            """,
            "exampleTitle": "Next Greater Element using Monotonic Stack",
            "explanation": "Pushes array indices onto stack. When current number exceeds stack top, pops top index and records current number as its next greater element.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Monotonic Stack Next Greater Element
#include <vector>
#include <stack>

std::vector<int> nextGreaterElement(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> result(n, -1);
    std::stack<int> st; // stores index
    
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

public class StackExample {
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
    stack = []
    
    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
        
    return result
"""
            }
        },
        {
            "id": "queue-deque",
            "title": "13. Queue & Double-Ended Queue (Deque)",
            "category": "Linear Data Structures",
            "summary": "First-In-First-Out (FIFO) queue, circular deque operations, and sliding window maximum using monotonic queue.",
            "theory": """
              <h3>Queue Mechanics</h3>
              <p>Queue offers <strong>O(1) enqueue/dequeue</strong>. Deque supports O(1) insertion/deletion at both front and back ends.</p>
            """,
            "exampleTitle": "Sliding Window Maximum using Monotonic Deque",
            "explanation": "Maintains deque of indices in decreasing order of element values. Front of deque always holds index of maximum element in current window.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(K)",
            "code": {
                "cpp": """// C++ Sliding Window Maximum using Deque
#include <vector>
#include <deque>

std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq;
    std::vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        if (!dq.empty() && dq.front() == i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}""",
                "java": """// Java Sliding Window Maximum using Deque
import java.util.*;

public class QueueExample {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        int[] res = new int[nums.length - k + 1];
        int ri = 0;
        for (int i = 0; i < nums.length; i++) {
            if (!dq.isEmpty() && dq.peek() == i - k) dq.poll();
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
            dq.offer(i);
            if (i >= k - 1) res[ri++] = nums[dq.peek()];
        }
        return res;
    }
}""",
                "python": """# Python Sliding Window Maximum using Deque
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()
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
        },
        {
            "id": "trees",
            "title": "14. Binary Trees & Traversals",
            "category": "Trees",
            "summary": "Tree hierarchy, DFS Inorder/Preorder/Postorder traversals, and BFS Level-Order traversal.",
            "theory": """
              <h3>Tree Traversals</h3>
              <ul>
                <li><strong>Inorder:</strong> Left ➔ Root ➔ Right</li>
                <li><strong>Preorder:</strong> Root ➔ Left ➔ Right</li>
                <li><strong>Postorder:</strong> Left ➔ Right ➔ Root</li>
                <li><strong>Level-Order:</strong> Breadth-first search queue level by level</li>
              </ul>
            """,
            "exampleTitle": "Binary Tree Level-Order Traversal (BFS)",
            "explanation": "Uses a Queue to traverse tree nodes level by level from top to bottom.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Tree Level Order Traversal
#include <vector>
#include <queue>

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;
    std::queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int sz = q.size();
        std::vector<int> level;
        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}""",
                "java": """// Java Tree Level Order Traversal
import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class TreeExample {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        
        while (!q.isEmpty()) {
            int sz = q.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < sz; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}""",
                "python": """# Python Tree Level Order Traversal
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
        
    return result
"""
            }
        },
        {
            "id": "bst",
            "title": "15. Binary Search Trees (BST)",
            "category": "Trees",
            "summary": "BST properties (left < root < right), inorder sorted property, search, insertion, and validation.",
            "theory": """
              <h3>BST Invariant</h3>
              <p>For any node: <code>left.val < node.val < right.val</code>. Inorder traversal produces strictly sorted elements.</p>
            """,
            "exampleTitle": "Search in a Binary Search Tree",
            "explanation": "Navigates left if target < current node, and right if target > current node, achieving O(log N) search in balanced BST.",
            "timeComplexity": "O(log N) average, O(N) worst case",
            "spaceComplexity": "O(log N) call stack",
            "code": {
                "cpp": """// C++ BST Search
TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);
}""",
                "java": """// Java BST Search
public class BSTExample {
    public static TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
    }
}""",
                "python": """# Python BST Search

def search_bst(root: TreeNode, val: int) -> TreeNode:
    if not root or root.val == val:
        return root
    return search_bst(root.left, val) if val < root.val else search_bst(root.right, val)
"""
            }
        },
        {
            "id": "heap",
            "title": "16. Heaps & Priority Queues",
            "category": "Trees",
            "summary": "Binary Min/Max Heaps, Heapify O(N), push/pop O(log N), Top K elements, and median stream processing.",
            "theory": """
              <h3>Heap Property</h3>
              <p>Complete binary tree in array representation. Min-Heap root holds minimum element; Max-Heap root holds maximum element.</p>
            """,
            "exampleTitle": "Top K Frequent Elements using Priority Queue",
            "explanation": "Counts frequency of elements, then uses a Min-Heap of size K to retain the top K most frequent elements.",
            "timeComplexity": "O(N log K)",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Min-Heap Priority Queue for Top K
#include <vector>
#include <unordered_map>
#include <queue>

std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {
    std::unordered_map<int, int> counts;
    for (int num : nums) counts[num]++;
    
    // Min-heap storing pair<frequency, num>
    using Element = std::pair<int, int>;
    std::priority_queue<Element, std::vector<Element>, std::greater<Element>> minHeap;
    
    for (auto& entry : counts) {
        minHeap.push({entry.second, entry.first});
        if (minHeap.size() > k) minHeap.pop();
    }
    
    std::vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return result;
}""",
                "java": """// Java PriorityQueue for Top K
import java.util.*;

public class HeapExample {
    public static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int num : nums) counts.put(num, counts.getOrDefault(num, 0) + 1);
        
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap = 
            new PriorityQueue<>(Comparator.comparingInt(Map.Entry::getValue));
            
        for (var entry : counts.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) minHeap.poll();
        }
        
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll().getKey();
        }
        return result;
    }
}""",
                "python": """# Python heapq for Top K
import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    return [item for item, freq in heapq.nlargest(k, counts.items(), key=lambda x: x[1])]
"""
            }
        },
        {
            "id": "trie",
            "title": "17. Trie (Prefix Tree)",
            "category": "Trees",
            "summary": "Tree of alphabet character nodes, O(L) insert & search, autocomplete, and prefix matching.",
            "theory": """
              <h3>Trie Architecture</h3>
              <p>N-ary tree structure optimized for string operations. Fast prefix search in <strong>O(L) time</strong> where L is word length.</p>
            """,
            "exampleTitle": "Trie Insert and Search Operations",
            "explanation": "Inserts string character by character creating child nodes, and marks the final node as end-of-word.",
            "timeComplexity": "O(L) per operation",
            "spaceComplexity": "O(N * L)",
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
    
    void insert(const std::string& word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }
    
    bool search(const std::string& word) {
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
            "title": "18. Graphs & Network Representations",
            "category": "Graphs",
            "summary": "Adjacency List & Matrix representations, BFS, DFS, connected components, and cycle detection.",
            "theory": """
              <h3>Graph Representations</h3>
              <p>Adjacency List uses O(V + E) memory space and allows fast neighbor iteration. Adjacency Matrix uses O(V^2) memory space.</p>
            """,
            "exampleTitle": "Adjacency List Graph & BFS Traversal",
            "explanation": "Builds adjacency list representation and traverses vertices level by level using a queue.",
            "timeComplexity": "O(V + E)",
            "spaceComplexity": "O(V + E)",
            "code": {
                "cpp": """// C++ Graph BFS
#include <vector>
#include <queue>

void bfs(int start, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {
    std::queue<int> q;
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}""",
                "java": """// Java Graph BFS
import java.util.*;

public class GraphExample {
    public static void bfs(int start, List<List<Integer>> adj, boolean[] visited) {
        Queue<Integer> q = new LinkedList<>();
        q.offer(start);
        visited[start] = true;
        
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
                "python": """# Python Graph BFS
from collections import deque

def bfs(start: int, adj: list[list[int]], visited: list[bool]) -> None:
    queue = deque([start])
    visited[start] = True
    
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
            "id": "bfs-dfs",
            "title": "19. BFS & DFS Search Algorithms",
            "category": "Graphs",
            "summary": "Breadth-First Search queue traversal for shortest unweighted paths and Depth-First Search stack recursion.",
            "theory": """
              <h3>BFS vs DFS Comparison</h3>
              <ul>
                <li><strong>BFS:</strong> Queue level-order traversal. Guarantees shortest path in unweighted graphs.</li>
                <li><strong>DFS:</strong> Recursive stack exploration. Ideal for connected components, topological ordering, and path checking.</li>
              </ul>
            """,
            "exampleTitle": "Number of Islands using 2D Grid DFS",
            "explanation": "Iterates over grid. Upon encountering '1', increments island count and triggers DFS to sink all connected land cells.",
            "timeComplexity": "O(M * N)",
            "spaceComplexity": "O(M * N) call stack",
            "code": {
                "cpp": """// C++ Grid DFS (Number of Islands)
#include <vector>

void dfsSink(std::vector<std::vector<char>>& grid, int r, int c) {
    int m = grid.size(), n = grid[0].size();
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0'; // sink land
    dfsSink(grid, r + 1, c);
    dfsSink(grid, r - 1, c);
    dfsSink(grid, r, c + 1);
    dfsSink(grid, r, c - 1);
}

int numIslands(std::vector<std::vector<char>>& grid) {
    if (grid.empty()) return 0;
    int count = 0;
    for (int r = 0; r < grid.size(); r++) {
        for (int c = 0; c < grid[0].size(); c++) {
            if (grid[r][c] == '1') {
                count++;
                dfsSink(grid, r, c);
            }
        }
    }
    return count;
}""",
                "java": """// Java Grid DFS (Number of Islands)
public class DFSExample {
    private static void dfs(char[][] grid, int r, int c) {
        int m = grid.length, n = grid[0].length;
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
}""",
                "python": """# Python Grid DFS (Number of Islands)

def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    count = 0

    def dfs(r: int, c: int):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
                
    return count
"""
            }
        },
        {
            "id": "topological-sort",
            "title": "20. Topological Sort (Kahn's Algorithm)",
            "category": "Graphs",
            "summary": "Linear ordering of vertices in Directed Acyclic Graphs (DAG) using indegree counts and BFS queue.",
            "theory": """
              <h3>DAG Topological Ordering</h3>
              <p>Orders vertices such that for every directed edge <code>u ➔ v</code>, vertex <code>u</code> comes before <code>v</code>. Kahn's algorithm tracks <strong>In-degree counts</strong> in O(V + E) time.</p>
            """,
            "exampleTitle": "Course Schedule Cycle & Topological Order (Kahn's BFS)",
            "explanation": "Pushes zero indegree nodes onto queue, processes neighbors reducing indegree counts, and verifies if all nodes are processed.",
            "timeComplexity": "O(V + E)",
            "spaceComplexity": "O(V + E)",
            "code": {
                "cpp": """// C++ Kahn's Topological Sort Algorithm
#include <vector>
#include <queue>

bool canFinishCourses(int numCourses, const std::vector<std::vector<int>>& prerequisites) {
    std::vector<std::vector<int>> adj(numCourses);
    std::vector<int> indegree(numCourses, 0);
    
    for (const auto& pre : prerequisites) {
        adj[pre[1]].push_back(pre[0]);
        indegree[pre[0]]++;
    }
    
    std::queue<int> q;
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int processed = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        processed++;
        for (int v : adj[u]) {
            if (--indegree[v] == 0) q.push(v);
        }
    }
    return processed == numCourses;
}""",
                "java": """// Java Kahn's Topological Sort Algorithm
import java.util.*;

public class TopoSortExample {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        
        for (int[] pre : prerequisites) {
            adj.get(pre[1]).add(pre[0]);
            indegree[pre[0]]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.offer(i);
        }
        
        int processed = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            processed++;
            for (int v : adj.get(u)) {
                if (--indegree[v] == 0) q.offer(v);
            }
        }
        return processed == numCourses;
    }
}""",
                "python": """# Python Kahn's Topological Sort Algorithm
from collections import deque

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    adj = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    
    for course, pre in prerequisites:
        adj[pre].append(course)
        indegree[course] += 1
        
    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    processed = 0
    
    while queue:
        u = queue.popleft()
        processed += 1
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
                
    return processed == num_courses
"""
            }
        },
        {
            "id": "shortest-path",
            "title": "21. Shortest Path Algorithms (Dijkstra)",
            "category": "Graphs",
            "summary": "Single-source shortest paths in non-negative weighted graphs using Min-Heap Priority Queue.",
            "theory": """
              <h3>Dijkstra's Algorithm</h3>
              <p>Computes shortest distances from source to all vertices in non-negative weighted graphs in <strong>O((V + E) log V) time</strong> using a Min-Heap Priority Queue.</p>
            """,
            "exampleTitle": "Dijkstra's Algorithm Implementation",
            "explanation": "Maintains tentative distance array and min-heap. Greedily pops minimum distance node and relaxes neighbor edges.",
            "timeComplexity": "O((V + E) log V)",
            "spaceComplexity": "O(V + E)",
            "code": {
                "cpp": """// C++ Dijkstra Shortest Path
#include <vector>
#include <queue>

const int INF = 1e9;

std::vector<int> dijkstra(int n, int src, const std::vector<std::vector<std::pair<int, int>>>& adj) {
    std::vector<int> dist(n, INF);
    using Pair = std::pair<int, int>; // dist, node
    std::priority_queue<Pair, std::vector<Pair>, std::greater<Pair>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}""",
                "java": """// Java Dijkstra Shortest Path
import java.util.*;

public class DijkstraExample {
    public static int[] dijkstra(int n, int src, List<List<int[]>> adj) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;
        
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, src});
        
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int d = curr[0], u = curr[1];
            if (d > dist[u]) continue;
            for (int[] edge : adj.get(u)) {
                int v = edge[0], weight = edge[1];
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }
        return dist;
    }
}""",
                "python": """# Python Dijkstra Shortest Path
import heapq

def dijkstra(n: int, src: int, adj: list[list[tuple[int, int]]]) -> list[int]:
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)] # dist, node
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
                
    return dist
"""
            }
        },
        {
            "id": "union-find",
            "title": "22. Disjoint Set Union (DSU / Union-Find)",
            "category": "Graphs",
            "summary": "Path Compression, Union by Rank/Size, near-constant O(alpha(N)) amortized operations, and Kruskal's MST.",
            "theory": """
              <h3>DSU Optimization Techniques</h3>
              <ul>
                <li><strong>Path Compression:</strong> Flattens tree height during <code>find(x)</code> lookup.</li>
                <li><strong>Union by Rank / Size:</strong> Attaches smaller depth tree under larger tree root during <code>union(x, y)</code>.</li>
              </ul>
            """,
            "exampleTitle": "DSU Class with Path Compression & Union by Rank",
            "explanation": "Implements efficient find with path compression and union with rank heuristics, operating in amortized near-constant time.",
            "timeComplexity": "O(α(N)) amortized per operation",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ DSU Implementation
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
                "java": """// Java DSU Implementation
public class DSUExample {
    static class DSU {
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
    }
}""",
                "python": """# Python DSU Implementation

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
            "title": "23. Greedy Algorithms",
            "category": "Greedy",
            "summary": "Greedy Choice Property, Optimal Substructure, Non-overlapping Intervals, and Fractional Knapsack.",
            "theory": """
              <h3>Greedy Choice Principle</h3>
              <p>Makes locally optimal decision at each step to reach a globally optimal solution. Proof of correctness relies on exchange argument.</p>
            """,
            "exampleTitle": "Non-Overlapping Intervals Selection",
            "explanation": "Sorts intervals by end-time. Greedily keeps interval with earliest end time to leave maximum space for remaining intervals.",
            "timeComplexity": "O(N log N)",
            "spaceComplexity": "O(1)",
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

public class GreedyExample {
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
    intervals.sort(key=lambda x: x[1])
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
            "title": "24. Dynamic Programming (Memoization & Tabulation)",
            "category": "DP",
            "summary": "Overlapping subproblems, optimal substructure, Top-Down Memoization vs Bottom-Up Tabulation, 0/1 Knapsack, LCS.",
            "theory": """
              <h3>DP Principles</h3>
              <ul>
                <li><strong>Overlapping Subproblems:</strong> Problem decomposes into sub-problems solved repeatedly.</li>
                <li><strong>Optimal Substructure:</strong> Optimal solution constructed from optimal sub-solutions.</li>
              </ul>
            """,
            "exampleTitle": "0/1 Knapsack Tabulation DP",
            "explanation": "Fills 2D table dp[i][w] representing maximum value achievable with first i items and weight capacity w.",
            "timeComplexity": "O(N * W)",
            "spaceComplexity": "O(N * W)",
            "code": {
                "cpp": """// C++ 0/1 Knapsack Bottom-Up DP
#include <vector>
#include <algorithm>

int knapsack(int W, const std::vector<int>& wt, const std::vector<int>& val, int n) {
    std::vector<std::vector<int>> dp(n + 1, std::vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) {
                dp[i][w] = std::max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    return dp[n][W];
}""",
                "java": """// Java 0/1 Knapsack Bottom-Up DP
public class DPExample {
    public static int knapsack(int W, int[] wt, int[] val, int n) {
        int[][] dp = new int[n + 1][W + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= W; w++) {
                if (wt[i - 1] <= w) {
                    dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
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
            "title": "25. Bit Manipulation & Bitwise Operations",
            "category": "Bit Manipulation",
            "summary": "Bitwise AND, OR, XOR, NOT, left/right shifts, bitmasking, and single number cancellation.",
            "theory": """
              <h3>Essential Bitwise Formulas</h3>
              <ul>
                <li><code>x & (x - 1)</code>: Clears lowest set bit in O(1) time.</li>
                <li><code>x & (-x)</code>: Extracts lowest set bit.</li>
                <li><code>x ^ x = 0</code>: XOR cancels pairs of identical numbers.</li>
              </ul>
            """,
            "exampleTitle": "Single Number Search & Set Bit Counting",
            "explanation": "Uses XOR property to isolate single unique number in O(N) time and O(1) space.",
            "timeComplexity": "O(N)",
            "spaceComplexity": "O(1)",
            "code": {
                "cpp": """// C++ Bitwise Operations
#include <vector>

int singleNumber(const std::vector<int>& nums) {
    int result = 0;
    for (int x : nums) result ^= x;
    return result;
}

int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}""",
                "java": """// Java Bitwise Operations
public class BitExample {
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
                "python": """# Python Bitwise Operations

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
            "title": "26. Advanced Data Structures (Fenwick / Segment Tree)",
            "category": "Advanced DSA",
            "summary": "Fenwick Tree (Binary Indexed Tree), Segment Tree range min/sum queries in O(log N), lazy propagation, and interview cheat sheet.",
            "theory": """
              <h3>Fenwick Tree (Binary Indexed Tree)</h3>
              <p>Array-based structure for answering prefix sums and updating elements in <strong>O(log N) time</strong> using lowbit operations <code>i & (-i)</code>.</p>
            """,
            "exampleTitle": "Fenwick Tree Range Sum Query & Point Update",
            "explanation": "Maintains cumulative tree array using bitwise lowbit steps for point update and prefix sum query.",
            "timeComplexity": "O(log N) per update/query",
            "spaceComplexity": "O(N)",
            "code": {
                "cpp": """// C++ Fenwick Tree (Binary Indexed Tree)
#include <vector>

class FenwickTree {
    std::vector<int> tree;
public:
    FenwickTree(int n) : tree(n + 1, 0) {}
    
    void add(int i, int delta) {
        for (; i < tree.size(); i += i & -i) {
            tree[i] += delta;
        }
    }
    
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) {
            sum += tree[i];
        }
        return sum;
    }
};""",
                "java": """// Java Fenwick Tree (Binary Indexed Tree)
public class AdvancedExample {
    static class FenwickTree {
        private int[] tree;
        public FenwickTree(int n) {
            tree = new int[n + 1];
        }
        
        public void add(int i, int delta) {
            for (; i < tree.length; i += i & -i) {
                tree[i] += delta;
            }
        }
        
        public int query(int i) {
            int sum = 0;
            for (; i > 0; i -= i & -i) {
                sum += tree[i];
            }
            return sum;
        }
    }
}""",
                "python": """# Python Fenwick Tree (Binary Indexed Tree)

class FenwickTree:
    def __init__(self, n: int):
        self.tree = [0] * (n + 1)

    def add(self, i: int, delta: int) -> None:
        while i < len(self.tree):
            self.tree[i] += delta
            i += i & -i

    def query(self, i: int) -> int:
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total
"""
            }
        }
    ]
    return topics

def main():
    topics = generate_guide_dataset()
    js_content = f"// Comprehensive 26-Chapter DSA Guide Dataset with Working Code Examples (C++, Java, Python)\nconst GUIDE_DATA = {json.dumps(topics, indent=2)};\nif (typeof module !== 'undefined') module.exports = GUIDE_DATA;\n"
    output_path = os.path.join("data", "guide_data.js")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Successfully generated {len(topics)} chapters in {output_path}!")

if __name__ == "__main__":
    main()
