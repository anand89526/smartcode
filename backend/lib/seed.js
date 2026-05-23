/* eslint-disable @typescript-eslint/no-require-imports */
const Problem = require("../models/problem")

function getJavaReturnValue(javaSignature, returnValue) {
  if (returnValue !== "[]") {
    return returnValue
  }

  if (javaSignature.startsWith("int[][]")) {
    return "new int[][]{}"
  }

  if (javaSignature.startsWith("int[]")) {
    return "new int[]{}"
  }

  if (javaSignature.startsWith("List<")) {
    return "new ArrayList<>()"
  }

  return returnValue
}

function buildStarterCode(functionName, returnValue, jsArgs, tsArgs, javaSignature, pseudocodeLines) {
  const commentBlock = pseudocodeLines.map((line) => `  // ${line}`).join("\n")
  const javaReturnValue = getJavaReturnValue(javaSignature, returnValue)

  return {
    javascript: `function ${functionName}(${jsArgs}) {\n${commentBlock}\n  return ${returnValue};\n}`,
    typescript: `function ${functionName}(${tsArgs}) {\n${commentBlock}\n  return ${returnValue};\n}`,
    java: `import java.util.*;\n\nclass Solution {\n  public static ${javaSignature} {\n${commentBlock}\n    return ${javaReturnValue};\n  }\n}`
  }
}

const starterProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    tags: ["Array", "Hash Map"],
    companies: ["Google", "Amazon", "Meta", "Apple"],
    points: 100,
    compareMode: "unordered_array",
    acceptanceRate: 54,
    functionName: "twoSum",
    pseudocode: `1. Create a map from value to index.\n2. Scan the array once.\n3. Compute the complement for each value.\n4. If the complement already exists, return the saved index and current index.\n5. Otherwise save the current value and index.\n6. Return an empty array if no pair exists.`,
    starterCode: buildStarterCode(
      "twoSum",
      "[]",
      "nums, target",
      "nums: number[], target: number): number[]",
      "int[] twoSum(int[] nums, int target)",
      ["Create a hash map for previously seen values.", "Check whether target - current already exists.", "Return the pair of indices."]
    ),
    examples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "2 + 7 = 9." },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "2 + 4 = 6." }
    ],
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    description: "Return the maximum profit you can achieve from a single buy/sell transaction.",
    tags: ["Array", "Dynamic Programming"],
    points: 120,
    acceptanceRate: 51,
    functionName: "maxProfit",
    pseudocode: `1. Track the minimum price seen so far.\n2. For each price, compute profit = current - minimum.\n3. Update the best profit if needed.\n4. Return the best profit after the scan.`,
    starterCode: buildStarterCode(
      "maxProfit",
      "0",
      "prices",
      "prices: number[]): number",
      "int maxProfit(int[] prices)",
      ["Track the minimum price seen so far.", "Update the best profit on each step.", "Return the maximum profit."]
    ),
    examples: [
      { input: "prices = [7, 1, 5, 3, 6, 4]", output: "5", explanation: "Buy at 1 and sell at 6." },
      { input: "prices = [7, 6, 4, 3, 1]", output: "0", explanation: "No profitable transaction exists." }
    ],
    testCases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 }
    ]
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    description: "Determine whether a parentheses string is valid.",
    tags: ["Stack", "String"],
    points: 130,
    acceptanceRate: 49,
    functionName: "isValid",
    pseudocode: `1. Push opening brackets onto a stack.\n2. For a closing bracket, check whether the top of the stack matches.\n3. If not, return false.\n4. Return true only if the stack is empty at the end.`,
    starterCode: buildStarterCode(
      "isValid",
      "false",
      "s",
      "s: string): boolean",
      "boolean isValid(String s)",
      ["Use a stack for opening brackets.", "Verify each closing bracket against the latest opening bracket.", "Return whether the stack ends empty."]
    ),
    examples: [
      { input: "s = \"()[]{}\"", output: "true", explanation: "Every opening bracket closes in order." },
      { input: "s = \"(]\"", output: "false", explanation: "The closing bracket does not match." }
    ],
    testCases: [
      { args: ["()"], expected: true },
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false }
    ]
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    description: "Return true if any value appears at least twice in the array.",
    tags: ["Array", "Hash Set"],
    points: 80,
    acceptanceRate: 57,
    functionName: "containsDuplicate",
    pseudocode: `1. Create an empty set.\n2. Walk through the array.\n3. If a value is already in the set, return true.\n4. Otherwise add it.\n5. Return false after the scan.`,
    starterCode: buildStarterCode(
      "containsDuplicate",
      "false",
      "nums",
      "nums: number[]): boolean",
      "boolean containsDuplicate(int[] nums)",
      ["Use a set to track seen values.", "Return true when a duplicate appears.", "Return false if all values are unique."]
    ),
    examples: [
      { input: "nums = [1, 2, 3, 1]", output: "true" },
      { input: "nums = [1, 2, 3, 4]", output: "false" }
    ],
    testCases: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false }
    ]
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    description: "Return an array answer where answer[i] is the product of all elements except nums[i].",
    tags: ["Array", "Prefix Sum"],
    points: 180,
    acceptanceRate: 46,
    functionName: "productExceptSelf",
    pseudocode: `1. Build prefix products from left to right.\n2. Build suffix products from right to left.\n3. Multiply prefix and suffix values for each position.\n4. Return the final result array.`,
    starterCode: buildStarterCode(
      "productExceptSelf",
      "[]",
      "nums",
      "nums: number[]): number[]",
      "int[] productExceptSelf(int[] nums)",
      ["Build left products.", "Build right products.", "Multiply them for each index."]
    ),
    examples: [
      { input: "nums = [1, 2, 3, 4]", output: "[24, 12, 8, 6]" },
      { input: "nums = [-1, 1, 0, -3, 3]", output: "[0, 0, 9, 0, 0]" }
    ],
    testCases: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
    ]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    description: "Find the contiguous subarray with the largest sum and return that sum.",
    tags: ["Array", "Dynamic Programming"],
    points: 150,
    acceptanceRate: 48,
    functionName: "maxSubArray",
    pseudocode: `1. Track the best running sum ending at the current index.\n2. Either extend the current subarray or start fresh.\n3. Track the best answer seen so far.\n4. Return the best answer.`,
    starterCode: buildStarterCode(
      "maxSubArray",
      "0",
      "nums",
      "nums: number[]): number",
      "int maxSubArray(int[] nums)",
      ["Use Kadane's algorithm.", "Update the running sum each step.", "Track the maximum answer."]
    ),
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" }
    ],
    testCases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 }
    ]
  },
  {
    title: "Maximum Product Subarray",
    slug: "maximum-product-subarray",
    difficulty: "Medium",
    description: "Return the maximum product of a contiguous non-empty subarray.",
    tags: ["Array", "Dynamic Programming"],
    points: 190,
    acceptanceRate: 40,
    functionName: "maxProduct",
    pseudocode: `1. Track both the maximum and minimum product ending at each position.\n2. A negative value can swap these roles.\n3. Update the answer with the current maximum product.\n4. Return the best answer.`,
    starterCode: buildStarterCode(
      "maxProduct",
      "0",
      "nums",
      "nums: number[]): number",
      "int maxProduct(int[] nums)",
      ["Track max and min products.", "Swap roles when a negative value appears.", "Return the best product."]
    ),
    examples: [
      { input: "nums = [2,3,-2,4]", output: "6" },
      { input: "nums = [-2,0,-1]", output: "0" }
    ],
    testCases: [
      { args: [[2, 3, -2, 4]], expected: 6 },
      { args: [[-2, 0, -1]], expected: 0 }
    ]
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    slug: "find-minimum-in-rotated-sorted-array",
    difficulty: "Medium",
    description: "Find the minimum element in a rotated sorted array with distinct values.",
    tags: ["Array", "Binary Search"],
    points: 160,
    acceptanceRate: 52,
    functionName: "findMin",
    pseudocode: `1. Use binary search on the rotated array.\n2. Compare the middle value with the right boundary.\n3. Discard the sorted half that cannot contain the minimum.\n4. Return the remaining value.`,
    starterCode: buildStarterCode(
      "findMin",
      "0",
      "nums",
      "nums: number[]): number",
      "int findMin(int[] nums)",
      ["Use binary search.", "Compare middle and right values.", "Shrink the search range toward the pivot."]
    ),
    examples: [
      { input: "nums = [3,4,5,1,2]", output: "1" },
      { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
    ],
    testCases: [
      { args: [[3, 4, 5, 1, 2]], expected: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }
    ]
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    description: "Search a target value in a rotated sorted array and return its index.",
    tags: ["Array", "Binary Search"],
    points: 170,
    acceptanceRate: 44,
    functionName: "search",
    pseudocode: `1. Use binary search with rotation-aware logic.\n2. Detect which side is sorted.\n3. Decide whether the target lies in the sorted half.\n4. Narrow the search window accordingly.`,
    starterCode: buildStarterCode(
      "search",
      "-1",
      "nums, target",
      "nums: number[], target: number): number",
      "int search(int[] nums, int target)",
      ["Use binary search.", "Identify the sorted half each step.", "Move toward the target."]
    ),
    examples: [
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
    ],
    testCases: [
      { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }
    ]
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    description: "Return all unique triplets that sum to zero.",
    tags: ["Array", "Two Pointers", "Sorting"],
    points: 210,
    compareMode: "unordered_nested",
    acceptanceRate: 35,
    functionName: "threeSum",
    pseudocode: `1. Sort the array.\n2. Fix one index at a time.\n3. Use two pointers to find matching pairs.\n4. Skip duplicates to keep results unique.`,
    starterCode: buildStarterCode(
      "threeSum",
      "[]",
      "nums",
      "nums: number[]): number[][]",
      "List<List<Integer>> threeSum(int[] nums)",
      ["Sort the array first.", "Fix one index, then use two pointers.", "Skip duplicate values."]
    ),
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" }
    ],
    testCases: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] }
    ]
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    description: "Find two lines that together with the x-axis form a container holding the most water.",
    tags: ["Array", "Two Pointers"],
    points: 170,
    acceptanceRate: 55,
    functionName: "maxArea",
    pseudocode: `1. Place two pointers at the ends.\n2. Compute the area between them.\n3. Move the shorter line inward.\n4. Keep the best area found.`,
    starterCode: buildStarterCode(
      "maxArea",
      "0",
      "height",
      "height: number[]): number",
      "int maxArea(int[] height)",
      ["Use two pointers.", "Compute area using the shorter side.", "Move the shorter side inward."]
    ),
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" }
    ],
    testCases: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 }
    ]
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    description: "Merge all overlapping intervals and return the resulting list.",
    tags: ["Array", "Sorting"],
    points: 160,
    acceptanceRate: 47,
    functionName: "mergeIntervals",
    pseudocode: `1. Sort intervals by start time.\n2. Walk through the sorted intervals.\n3. Merge overlaps into the current interval.\n4. Push completed intervals into the answer.`,
    starterCode: buildStarterCode(
      "mergeIntervals",
      "[]",
      "intervals",
      "intervals: number[][]): number[][]",
      "int[][] mergeIntervals(int[][] intervals)",
      ["Sort by interval start.", "Merge overlapping intervals.", "Return the merged list."]
    ),
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
    ],
    testCases: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
    ]
  },
  {
    title: "Insert Interval",
    slug: "insert-interval",
    difficulty: "Medium",
    description: "Insert a new interval into a sorted list of non-overlapping intervals and merge if necessary.",
    tags: ["Array"],
    points: 165,
    acceptanceRate: 43,
    functionName: "insertInterval",
    pseudocode: `1. Add intervals ending before the new interval.\n2. Merge all overlapping intervals with the new one.\n3. Add the merged new interval.\n4. Append the remaining intervals.`,
    starterCode: buildStarterCode(
      "insertInterval",
      "[]",
      "intervals, newInterval",
      "intervals: number[][], newInterval: number[]): number[][]",
      "int[][] insertInterval(int[][] intervals, int[] newInterval)",
      ["Copy intervals before the new interval.", "Merge overlaps with the new interval.", "Append the remaining intervals."]
    ),
    examples: [
      { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
      { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]" }
    ],
    testCases: [
      { args: [[[1, 3], [6, 9]], [2, 5]], expected: [[1, 5], [6, 9]] },
      { args: [[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]], expected: [[1, 2], [3, 10], [12, 16]] }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    description: "Return the length of the longest substring without repeating characters.",
    tags: ["String", "Sliding Window"],
    points: 200,
    acceptanceRate: 37,
    functionName: "lengthOfLongestSubstring",
    pseudocode: `1. Use a sliding window.\n2. Track the last seen index of each character.\n3. Move the left boundary when a duplicate appears.\n4. Track the largest window length.`,
    starterCode: buildStarterCode(
      "lengthOfLongestSubstring",
      "0",
      "s",
      "s: string): number",
      "int lengthOfLongestSubstring(String s)",
      ["Use a sliding window.", "Move the left bound on duplicates.", "Track the best window size."]
    ),
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\"." },
      { input: "s = \"bbbbb\"", output: "1", explanation: "The answer is \"b\"." }
    ],
    testCases: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 }
    ]
  },
  {
    title: "Longest Repeating Character Replacement",
    slug: "longest-repeating-character-replacement",
    difficulty: "Medium",
    description: "Return the length of the longest substring containing the same letter after at most k replacements.",
    tags: ["String", "Sliding Window"],
    points: 190,
    acceptanceRate: 50,
    functionName: "characterReplacement",
    pseudocode: `1. Expand a sliding window.\n2. Track character counts and the highest frequency in the window.\n3. Shrink while replacements needed exceed k.\n4. Track the largest valid window.`,
    starterCode: buildStarterCode(
      "characterReplacement",
      "0",
      "s, k",
      "s: string, k: number): number",
      "int characterReplacement(String s, int k)",
      ["Use a sliding window.", "Track the most frequent character in the window.", "Shrink when replacements exceed k."]
    ),
    examples: [
      { input: "s = \"ABAB\", k = 2", output: "4" },
      { input: "s = \"AABABBA\", k = 1", output: "4" }
    ],
    testCases: [
      { args: ["ABAB", 2], expected: 4 },
      { args: ["AABABBA", 1], expected: 4 }
    ]
  },
  {
    title: "Minimum Window Substring",
    slug: "minimum-window-substring",
    difficulty: "Hard",
    description: "Return the smallest substring of s containing all the characters of t.",
    tags: ["String", "Sliding Window", "Hash Map"],
    points: 260,
    acceptanceRate: 39,
    functionName: "minWindow",
    pseudocode: `1. Count required characters from t.\n2. Expand a sliding window over s.\n3. When all characters are covered, shrink from the left.\n4. Track the smallest valid window.`,
    starterCode: buildStarterCode(
      "minWindow",
      "\"\"",
      "s, t",
      "s: string, t: string): string",
      "String minWindow(String s, String t)",
      ["Count required characters.", "Expand to satisfy the requirement.", "Shrink to find the smallest valid window."]
    ),
    examples: [
      { input: "s = \"ADOBECODEBANC\", t = \"ABC\"", output: "\"BANC\"" },
      { input: "s = \"a\", t = \"a\"", output: "\"a\"" }
    ],
    testCases: [
      { args: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
      { args: ["a", "a"], expected: "a" }
    ]
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    description: "Group strings that are anagrams of each other.",
    tags: ["Array", "Hash Map", "String"],
    points: 170,
    compareMode: "unordered_nested",
    acceptanceRate: 59,
    functionName: "groupAnagrams",
    pseudocode: `1. Build a signature for each string.\n2. Use the signature as a hash-map key.\n3. Append the string into its group.\n4. Return all grouped values.`,
    starterCode: buildStarterCode(
      "groupAnagrams",
      "[]",
      "strs",
      "strs: string[]): string[][]",
      "List<List<String>> groupAnagrams(String[] strs)",
      ["Create a canonical key for each word.", "Group words by key.", "Return the grouped lists."]
    ),
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]" },
      { input: "strs = [\"\"]", output: "[[\"\"]]" }
    ],
    testCases: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
      { args: [[""]], expected: [[""]] }
    ]
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    description: "Return true if t is an anagram of s.",
    tags: ["String", "Sorting", "Hash Map"],
    points: 90,
    acceptanceRate: 63,
    functionName: "isAnagram",
    pseudocode: `1. Count characters in both strings.\n2. Compare the final counts.\n3. Return whether they match.`,
    starterCode: buildStarterCode(
      "isAnagram",
      "false",
      "s, t",
      "s: string, t: string): boolean",
      "boolean isAnagram(String s, String t)",
      ["Count characters in both strings.", "Compare the results.", "Return whether the maps match."]
    ),
    examples: [
      { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
      { input: "s = \"rat\", t = \"car\"", output: "false" }
    ],
    testCases: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false }
    ]
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    description: "Return the length of the longest consecutive elements sequence.",
    tags: ["Array", "Hash Set"],
    points: 190,
    acceptanceRate: 47,
    functionName: "longestConsecutive",
    pseudocode: `1. Put all numbers into a set.\n2. Start counting only from sequence starts.\n3. Extend the sequence while consecutive numbers exist.\n4. Track the longest length.`,
    starterCode: buildStarterCode(
      "longestConsecutive",
      "0",
      "nums",
      "nums: number[]): number",
      "int longestConsecutive(int[] nums)",
      ["Put all values into a set.", "Start from numbers without a predecessor.", "Count the consecutive run length."]
    ),
    examples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" }
    ],
    testCases: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 }
    ]
  },
  {
    title: "Encode and Decode Strings",
    slug: "encode-and-decode-strings",
    difficulty: "Medium",
    description: "Design an algorithm to encode a list of strings to a string and decode it back.",
    tags: ["String", "Design"],
    points: 175,
    acceptanceRate: 58,
    functionName: "encodeDecodeLength",
    pseudocode: `1. Encode each string with its length and a separator.\n2. Concatenate all encoded parts.\n3. During decoding, read the length first.\n4. Slice the matching number of characters.`,
    starterCode: buildStarterCode(
      "encodeDecodeLength",
      "0",
      "strs",
      "strs: string[]): number",
      "int encodeDecodeLength(String[] strs)",
      ["Use length-prefix encoding.", "Simulate encode and decode steps.", "Return the decoded list size for this simplified judge."]
    ),
    examples: [
      { input: "strs = [\"lint\",\"code\",\"love\",\"you\"]", output: "4" },
      { input: "strs = [\"\"]", output: "1" }
    ],
    testCases: [
      { args: [["lint", "code", "love", "you"]], expected: 4 },
      { args: [[""]], expected: 1 }
    ]
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    difficulty: "Medium",
    description: "Return the k most frequent elements in the array.",
    tags: ["Array", "Hash Map", "Heap"],
    points: 180,
    compareMode: "unordered_array",
    acceptanceRate: 64,
    functionName: "topKFrequent",
    pseudocode: `1. Count the frequency of each value.\n2. Order values by frequency.\n3. Return the first k values.`,
    starterCode: buildStarterCode(
      "topKFrequent",
      "[]",
      "nums, k",
      "nums: number[], k: number): number[]",
      "int[] topKFrequent(int[] nums, int k)",
      ["Count value frequencies.", "Sort or bucket by frequency.", "Return the top k values."]
    ),
    examples: [
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
    ],
    testCases: [
      { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
      { args: [[1], 1], expected: [1] }
    ]
  },
  {
    title: "Valid Sudoku",
    slug: "valid-sudoku",
    difficulty: "Medium",
    description: "Determine if a partially filled 9x9 Sudoku board is valid.",
    tags: ["Array", "Hash Set", "Matrix"],
    points: 175,
    acceptanceRate: 50,
    functionName: "isValidSudoku",
    pseudocode: `1. Track values seen in each row, column, and box.\n2. Skip empty cells.\n3. If a duplicate appears in any row, column, or box, return false.\n4. Return true otherwise.`,
    starterCode: buildStarterCode(
      "isValidSudoku",
      "false",
      "board",
      "board: string[][]): boolean",
      "boolean isValidSudoku(String[][] board)",
      ["Track rows, columns, and 3x3 boxes.", "Reject duplicate digits.", "Return whether the board is valid."]
    ),
    examples: [
      { input: "board = valid sample board", output: "true" },
      { input: "board = invalid sample board", output: "false" }
    ],
    testCases: [
      { args: [[["5", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]]], expected: true },
      { args: [[["8", "3", ".", ".", "7", ".", ".", ".", "."], ["6", ".", ".", "1", "9", "5", ".", ".", "."], [".", "9", "8", ".", ".", ".", ".", "6", "."], ["8", ".", ".", ".", "6", ".", ".", ".", "3"], ["4", ".", ".", "8", ".", "3", ".", ".", "1"], ["7", ".", ".", ".", "2", ".", ".", ".", "6"], [".", "6", ".", ".", ".", ".", "2", "8", "."], [".", ".", ".", "4", "1", "9", ".", ".", "5"], [".", ".", ".", ".", "8", ".", ".", "7", "9"]]], expected: false }
    ]
  },
  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    description: "Return the longest palindromic substring in s.",
    tags: ["String", "Dynamic Programming"],
    points: 200,
    acceptanceRate: 36,
    functionName: "longestPalindrome",
    pseudocode: `1. Expand around every possible center.\n2. Track the best palindrome seen.\n3. Consider both odd and even length centers.\n4. Return the longest substring found.`,
    starterCode: buildStarterCode(
      "longestPalindrome",
      "\"\"",
      "s",
      "s: string): string",
      "String longestPalindrome(String s)",
      ["Expand around each center.", "Check odd and even palindromes.", "Track the longest valid substring."]
    ),
    examples: [
      { input: "s = \"babad\"", output: "\"bab\"" },
      { input: "s = \"cbbd\"", output: "\"bb\"" }
    ],
    testCases: [
      { args: ["babad"], expected: "bab" },
      { args: ["cbbd"], expected: "bb" }
    ]
  },
  {
    title: "Palindromic Substrings",
    slug: "palindromic-substrings",
    difficulty: "Medium",
    description: "Return the number of palindromic substrings in s.",
    tags: ["String", "Dynamic Programming"],
    points: 180,
    acceptanceRate: 64,
    functionName: "countSubstrings",
    pseudocode: `1. Treat each index as a center.\n2. Expand around odd and even centers.\n3. Count every valid palindrome found.\n4. Return the total count.`,
    starterCode: buildStarterCode(
      "countSubstrings",
      "0",
      "s",
      "s: string): number",
      "int countSubstrings(String s)",
      ["Expand around each center.", "Count odd and even palindromes.", "Return the total number of palindromic substrings."]
    ),
    examples: [
      { input: "s = \"abc\"", output: "3" },
      { input: "s = \"aaa\"", output: "6" }
    ],
    testCases: [
      { args: ["abc"], expected: 3 },
      { args: ["aaa"], expected: 6 }
    ]
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    description: "Return how many distinct ways you can climb to the top when taking 1 or 2 steps.",
    tags: ["Dynamic Programming"],
    points: 90,
    acceptanceRate: 54,
    functionName: "climbStairs",
    pseudocode: `1. Recognize the Fibonacci-style recurrence.\n2. Each step count depends on the previous two values.\n3. Build the answer iteratively.\n4. Return the nth value.`,
    starterCode: buildStarterCode(
      "climbStairs",
      "0",
      "n",
      "n: number): number",
      "int climbStairs(int n)",
      ["Use a Fibonacci-like recurrence.", "Build iteratively from the base cases.", "Return the number of ways for n."]
    ),
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    testCases: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 }
    ]
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    description: "Return the fewest number of coins needed to make up the amount, or -1 if impossible.",
    tags: ["Dynamic Programming"],
    points: 190,
    acceptanceRate: 43,
    functionName: "coinChange",
    pseudocode: `1. Build a DP array from 0 to amount.\n2. Initialize unreachable states to infinity.\n3. Try each coin for every amount.\n4. Return the best count or -1 if unreachable.`,
    starterCode: buildStarterCode(
      "coinChange",
      "0",
      "coins, amount",
      "coins: number[], amount: number): number",
      "int coinChange(int[] coins, int amount)",
      ["Use bottom-up dynamic programming.", "Try each coin for each amount.", "Return the minimum number of coins."]
    ),
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" },
      { input: "coins = [2], amount = 3", output: "-1" }
    ],
    testCases: [
      { args: [[1, 2, 5], 11], expected: 3 },
      { args: [[2], 3], expected: -1 }
    ]
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    description: "Return the maximum amount of money you can rob without robbing adjacent houses.",
    tags: ["Array", "Dynamic Programming"],
    points: 150,
    acceptanceRate: 50,
    functionName: "rob",
    pseudocode: `1. For each house, choose between robbing it or skipping it.\n2. Robbing means adding the value two steps back.\n3. Skipping means keeping the previous best.\n4. Return the best final value.`,
    starterCode: buildStarterCode(
      "rob",
      "0",
      "nums",
      "nums: number[]): number",
      "int rob(int[] nums)",
      ["Track the best answer including or excluding the current house.", "Use the recurrence based on the previous two houses.", "Return the maximum loot."]
    ),
    examples: [
      { input: "nums = [1,2,3,1]", output: "4" },
      { input: "nums = [2,7,9,3,1]", output: "12" }
    ],
    testCases: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 }
    ]
  },
  {
    title: "House Robber II",
    slug: "house-robber-ii",
    difficulty: "Medium",
    description: "Like House Robber, but the houses are arranged in a circle.",
    tags: ["Array", "Dynamic Programming"],
    points: 185,
    acceptanceRate: 42,
    functionName: "robCircular",
    pseudocode: `1. Break the circle into two linear cases.\n2. Exclude the first house in one case.\n3. Exclude the last house in the other case.\n4. Return the maximum of the two cases.`,
    starterCode: buildStarterCode(
      "robCircular",
      "0",
      "nums",
      "nums: number[]): number",
      "int robCircular(int[] nums)",
      ["Split the circular problem into two linear robberies.", "Solve each linear case.", "Return the larger answer."]
    ),
    examples: [
      { input: "nums = [2,3,2]", output: "3" },
      { input: "nums = [1,2,3,1]", output: "4" }
    ],
    testCases: [
      { args: [[2, 3, 2]], expected: 3 },
      { args: [[1, 2, 3, 1]], expected: 4 }
    ]
  },
  {
    title: "Decode Ways",
    slug: "decode-ways",
    difficulty: "Medium",
    description: "Return the number of ways to decode a numeric string using A=1 to Z=26.",
    tags: ["String", "Dynamic Programming"],
    points: 180,
    acceptanceRate: 35,
    functionName: "numDecodings",
    pseudocode: `1. Use DP from the end of the string.\n2. A zero digit contributes no valid decodings.\n3. A valid two-digit number can combine with the next state.\n4. Return the count at index 0.`,
    starterCode: buildStarterCode(
      "numDecodings",
      "0",
      "s",
      "s: string): number",
      "int numDecodings(String s)",
      ["Use dynamic programming.", "Handle zeros carefully.", "Combine one-digit and two-digit decoding choices."]
    ),
    examples: [
      { input: "s = \"12\"", output: "2" },
      { input: "s = \"226\"", output: "3" }
    ],
    testCases: [
      { args: ["12"], expected: 2 },
      { args: ["226"], expected: 3 }
    ]
  },
  {
    title: "Unique Paths",
    slug: "unique-paths",
    difficulty: "Medium",
    description: "Return the number of unique paths from the top-left corner to the bottom-right corner.",
    tags: ["Dynamic Programming", "Math"],
    points: 145,
    acceptanceRate: 63,
    functionName: "uniquePaths",
    pseudocode: `1. Each cell can be reached from the top or left.\n2. Build a DP grid or rolling row.\n3. Sum the ways from the two allowed directions.\n4. Return the final cell.`,
    starterCode: buildStarterCode(
      "uniquePaths",
      "0",
      "m, n",
      "m: number, n: number): number",
      "int uniquePaths(int m, int n)",
      ["Build dynamic programming states across the grid.", "Each state depends on top and left neighbors.", "Return the bottom-right count."]
    ),
    examples: [
      { input: "m = 3, n = 7", output: "28" },
      { input: "m = 3, n = 2", output: "3" }
    ],
    testCases: [
      { args: [3, 7], expected: 28 },
      { args: [3, 2], expected: 3 }
    ]
  },
  {
    title: "Jump Game",
    slug: "jump-game",
    difficulty: "Medium",
    description: "Return true if you can reach the last index.",
    tags: ["Array", "Greedy"],
    points: 150,
    acceptanceRate: 42,
    functionName: "canJump",
    pseudocode: `1. Track the farthest reachable index.\n2. If the current index is beyond it, fail.\n3. Update the farthest reach at each step.\n4. Return whether the last index is reachable.`,
    starterCode: buildStarterCode(
      "canJump",
      "false",
      "nums",
      "nums: number[]): boolean",
      "boolean canJump(int[] nums)",
      ["Track the farthest reachable position.", "Fail if you cannot reach the current index.", "Return whether the end is reachable."]
    ),
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" }
    ],
    testCases: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false }
    ]
  },
  {
    title: "Combination Sum",
    slug: "combination-sum",
    difficulty: "Medium",
    description: "Return all unique combinations of candidates where the chosen numbers sum to target.",
    tags: ["Array", "Backtracking"],
    points: 190,
    acceptanceRate: 60,
    functionName: "combinationSumCount",
    pseudocode: `1. Explore combinations using backtracking.\n2. Reuse the current value when allowed.\n3. Stop when the remaining target is zero or negative.\n4. Count or collect valid combinations.`,
    starterCode: buildStarterCode(
      "combinationSumCount",
      "0",
      "candidates, target",
      "candidates: number[], target: number): number",
      "int combinationSumCount(int[] candidates, int target)",
      ["Use backtracking.", "Reuse the current candidate if still valid.", "Return the count of valid combinations for this simplified judge."]
    ),
    examples: [
      { input: "candidates = [2,3,6,7], target = 7", output: "2" },
      { input: "candidates = [2,3,5], target = 8", output: "3" }
    ],
    testCases: [
      { args: [[2, 3, 6, 7], 7], expected: 2 },
      { args: [[2, 3, 5], 8], expected: 3 }
    ]
  },
  {
    title: "Combination Sum II",
    slug: "combination-sum-ii",
    difficulty: "Medium",
    description: "Return the number of unique combinations where each number may be used at most once.",
    tags: ["Array", "Backtracking", "Sorting"],
    points: 195,
    acceptanceRate: 55,
    functionName: "combinationSum2Count",
    pseudocode: `1. Sort the candidates.\n2. Use backtracking without reusing the same index.\n3. Skip duplicates on the same recursion level.\n4. Count valid combinations.`,
    starterCode: buildStarterCode(
      "combinationSum2Count",
      "0",
      "candidates, target",
      "candidates: number[], target: number): number",
      "int combinationSum2Count(int[] candidates, int target)",
      ["Sort the values.", "Skip duplicates on the same level.", "Return the count of valid unique combinations."]
    ),
    examples: [
      { input: "candidates = [10,1,2,7,6,1,5], target = 8", output: "4" },
      { input: "candidates = [2,5,2,1,2], target = 5", output: "2" }
    ],
    testCases: [
      { args: [[10, 1, 2, 7, 6, 1, 5], 8], expected: 4 },
      { args: [[2, 5, 2, 1, 2], 5], expected: 2 }
    ]
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    description: "Count the number of islands in a grid of '1's and '0's.",
    tags: ["Matrix", "DFS", "BFS"],
    points: 180,
    acceptanceRate: 60,
    functionName: "numIslands",
    pseudocode: `1. Scan every cell.\n2. When land is found, start DFS or BFS to mark the whole island.\n3. Increment the island count once per new traversal.\n4. Return the count.`,
    starterCode: buildStarterCode(
      "numIslands",
      "0",
      "grid",
      "grid: string[][]): number",
      "int numIslands(String[][] grid)",
      ["Scan the grid.", "Start a traversal when new land is found.", "Mark visited cells so they are not counted twice."]
    ),
    examples: [
      { input: "grid = sample island grid", output: "1" },
      { input: "grid = sample multi-island grid", output: "3" }
    ],
    testCases: [
      { args: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1 },
      { args: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], expected: 3 }
    ]
  },
  {
    title: "Rotting Oranges",
    slug: "rotting-oranges",
    difficulty: "Medium",
    description: "Return the minimum number of minutes until no fresh orange remains.",
    tags: ["Matrix", "BFS"],
    points: 170,
    acceptanceRate: 56,
    functionName: "orangesRotting",
    pseudocode: `1. Push all rotten oranges into a queue.\n2. Count fresh oranges.\n3. Process the grid level by level with BFS.\n4. Return elapsed minutes or -1 if fresh oranges remain.`,
    starterCode: buildStarterCode(
      "orangesRotting",
      "0",
      "grid",
      "grid: number[][]): number",
      "int orangesRotting(int[][] grid)",
      ["Use BFS from all initially rotten oranges.", "Process minute by minute.", "Return the time needed to rot all fresh oranges."]
    ),
    examples: [
      { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
      { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }
    ],
    testCases: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 }
    ]
  },
  {
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium",
    description: "Return true if you can finish all courses given prerequisite pairs.",
    tags: ["Graph", "Topological Sort"],
    points: 185,
    acceptanceRate: 48,
    functionName: "canFinish",
    pseudocode: `1. Build a graph and indegree count.\n2. Push all zero-indegree nodes into a queue.\n3. Process the queue with topological sorting.\n4. Return whether all courses were processed.`,
    starterCode: buildStarterCode(
      "canFinish",
      "false",
      "numCourses, prerequisites",
      "numCourses: number, prerequisites: number[][]): boolean",
      "boolean canFinish(int numCourses, int[][] prerequisites)",
      ["Build a directed graph.", "Run topological sort.", "Return whether all courses are reachable in order."]
    ),
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
    ],
    testCases: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false }
    ]
  },
  {
    title: "Pacific Atlantic Water Flow",
    slug: "pacific-atlantic-water-flow",
    difficulty: "Medium",
    description: "Return the count of coordinates from which water can flow to both oceans.",
    tags: ["Matrix", "DFS", "Graph"],
    points: 205,
    acceptanceRate: 55,
    functionName: "pacificAtlanticCount",
    pseudocode: `1. Reverse the water flow direction.\n2. Start DFS or BFS from the Pacific edges.\n3. Start DFS or BFS from the Atlantic edges.\n4. Count cells reachable from both traversals.`,
    starterCode: buildStarterCode(
      "pacificAtlanticCount",
      "0",
      "heights",
      "heights: number[][]): number",
      "int pacificAtlanticCount(int[][] heights)",
      ["Traverse from both ocean borders.", "Mark cells reachable from each side.", "Count cells reachable from both oceans."]
    ),
    examples: [
      { input: "heights = sample matrix", output: "7" },
      { input: "heights = [[1]]", output: "1" }
    ],
    testCases: [
      { args: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: 7 },
      { args: [[[1]]], expected: 1 }
    ]
  },
  {
    title: "Word Search",
    slug: "word-search",
    difficulty: "Medium",
    description: "Return true if a word exists in the board by sequentially adjacent cells.",
    tags: ["Matrix", "Backtracking"],
    points: 190,
    acceptanceRate: 42,
    functionName: "exist",
    pseudocode: `1. Try every cell as a starting point.\n2. Use DFS with backtracking.\n3. Mark a cell as visited during the current path.\n4. Return true if the whole word is matched.`,
    starterCode: buildStarterCode(
      "exist",
      "false",
      "board, word",
      "board: string[][], word: string): boolean",
      "boolean exist(String[][] board, String word)",
      ["Try DFS from each cell.", "Backtrack after exploring each path.", "Return whether the word can be formed."]
    ),
    examples: [
      { input: "board = sample board, word = \"ABCCED\"", output: "true" },
      { input: "board = sample board, word = \"ABCB\"", output: "false" }
    ],
    testCases: [
      { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"], expected: true },
      { args: [[["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"], expected: false }
    ]
  },
  {
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium",
    description: "Return the number of levels in the breadth-first traversal of a binary tree represented as an array.",
    tags: ["Tree", "BFS"],
    points: 170,
    acceptanceRate: 67,
    functionName: "levelCount",
    pseudocode: `1. Use BFS level by level.\n2. Count how many breadth-first layers are processed.\n3. Return the number of levels in the tree.`,
    starterCode: buildStarterCode(
      "levelCount",
      "0",
      "values",
      "values: number[]): number",
      "int levelCount(int[] values)",
      ["Model the array as a complete-tree representation for this simplified judge.", "Count how many levels contain nodes.", "Return the level count."]
    ),
    examples: [
      { input: "values = [3,9,20,0,0,15,7]", output: "3" },
      { input: "values = [1]", output: "1" }
    ],
    testCases: [
      { args: [[3, 9, 20, 0, 0, 15, 7]], expected: 3 },
      { args: [[1]], expected: 1 }
    ]
  },
  {
    title: "Same Tree",
    slug: "same-tree",
    difficulty: "Easy",
    description: "Return true if two array-represented trees are structurally identical with the same values.",
    tags: ["Tree", "DFS"],
    points: 85,
    acceptanceRate: 62,
    functionName: "isSameTreeArray",
    pseudocode: `1. Compare the two arrays position by position.\n2. Ensure the values and lengths match.\n3. Return whether all corresponding nodes are equal.`,
    starterCode: buildStarterCode(
      "isSameTreeArray",
      "false",
      "p, q",
      "p: number[], q: number[]): boolean",
      "boolean isSameTreeArray(int[] p, int[] q)",
      ["Compare each node position.", "Ensure both structures match.", "Return whether the trees are identical."]
    ),
    examples: [
      { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
      { input: "p = [1,2], q = [1,0,2]", output: "false" }
    ],
    testCases: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true },
      { args: [[1, 2], [1, 0, 2]], expected: false }
    ]
  },
  {
    title: "Subtree of Another Tree",
    slug: "subtree-of-another-tree",
    difficulty: "Easy",
    description: "Return true if a tree pattern appears as a contiguous slice in an array tree representation.",
    tags: ["Tree", "DFS"],
    points: 110,
    acceptanceRate: 47,
    functionName: "containsPattern",
    pseudocode: `1. Slide over the larger representation.\n2. Check whether the smaller pattern matches starting from each index.\n3. Return true if any position matches fully.`,
    starterCode: buildStarterCode(
      "containsPattern",
      "false",
      "root, subRoot",
      "root: number[], subRoot: number[]): boolean",
      "boolean containsPattern(int[] root, int[] subRoot)",
      ["Scan the larger tree representation.", "Try to match the smaller pattern at each position.", "Return true when a full match is found."]
    ),
    examples: [
      { input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" },
      { input: "root = [3,4,5,1,2,0,0,0,0,0], subRoot = [4,1,2,0]", output: "false" }
    ],
    testCases: [
      { args: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true },
      { args: [[3, 4, 5, 1, 2, 0, 0, 0, 0, 0], [4, 1, 2, 0]], expected: false }
    ]
  },
  {
    title: "Lowest Common Ancestor of a Binary Search Tree",
    slug: "lowest-common-ancestor-of-a-bst",
    difficulty: "Medium",
    description: "Return the lowest common ancestor value in a BST array representation.",
    tags: ["Tree", "Binary Search Tree"],
    points: 170,
    acceptanceRate: 65,
    functionName: "lowestCommonAncestorValue",
    pseudocode: `1. Start at the root.\n2. If both targets are smaller, move left.\n3. If both are larger, move right.\n4. Otherwise the current node is the answer.`,
    starterCode: buildStarterCode(
      "lowestCommonAncestorValue",
      "0",
      "values, p, q",
      "values: number[], p: number, q: number): number",
      "int lowestCommonAncestorValue(int[] values, int p, int q)",
      ["Walk down the BST.", "Move left or right based on both target values.", "Return the split point."]
    ),
    examples: [
      { input: "values = [6,2,8,0,4,7,9,0,0,3,5], p = 2, q = 8", output: "6" },
      { input: "values = [6,2,8,0,4,7,9,0,0,3,5], p = 2, q = 4", output: "2" }
    ],
    testCases: [
      { args: [[6, 2, 8, 0, 4, 7, 9, 0, 0, 3, 5], 2, 8], expected: 6 },
      { args: [[6, 2, 8, 0, 4, 7, 9, 0, 0, 3, 5], 2, 4], expected: 2 }
    ]
  },
  {
    title: "Implement Trie",
    slug: "implement-trie",
    difficulty: "Medium",
    description: "Return how many query words are found after inserting a word list into a trie-like dictionary.",
    tags: ["Trie", "Design", "String"],
    points: 185,
    acceptanceRate: 66,
    functionName: "trieHitCount",
    pseudocode: `1. Insert each word into a trie structure.\n2. Query each search string.\n3. Count how many are present.\n4. Return the total hits for this simplified judge.`,
    starterCode: buildStarterCode(
      "trieHitCount",
      "0",
      "words, queries",
      "words: string[], queries: string[]): number",
      "int trieHitCount(String[] words, String[] queries)",
      ["Insert words into a trie or set.", "Check each query.", "Return the number of queries found."]
    ),
    examples: [
      { input: "words = [\"apple\",\"app\"], queries = [\"app\",\"appl\",\"apple\"]", output: "2" },
      { input: "words = [\"cat\"], queries = [\"dog\"]", output: "0" }
    ],
    testCases: [
      { args: [["apple", "app"], ["app", "appl", "apple"]], expected: 2 },
      { args: [["cat"], ["dog"]], expected: 0 }
    ]
  },
  {
    title: "Kth Smallest Element in a BST",
    slug: "kth-smallest-element-in-a-bst",
    difficulty: "Medium",
    description: "Return the kth smallest value in a BST array representation.",
    tags: ["Tree", "Inorder Traversal"],
    points: 180,
    acceptanceRate: 70,
    functionName: "kthSmallestArray",
    pseudocode: `1. Inorder traversal of a BST yields sorted values.\n2. Traverse the nodes in-order.\n3. Stop at the kth visited node.\n4. Return its value.`,
    starterCode: buildStarterCode(
      "kthSmallestArray",
      "0",
      "values, k",
      "values: number[], k: number): number",
      "int kthSmallestArray(int[] values, int k)",
      ["Convert the tree representation to inorder order conceptually.", "Find the kth value in sorted order.", "Return that value."]
    ),
    examples: [
      { input: "values = [3,1,4,0,2], k = 1", output: "1" },
      { input: "values = [5,3,6,2,4,0,0,1], k = 3", output: "3" }
    ],
    testCases: [
      { args: [[3, 1, 4, 0, 2], 1], expected: 1 },
      { args: [[5, 3, 6, 2, 4, 0, 0, 1], 3], expected: 3 }
    ]
  },
  {
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    description: "Return the median of two sorted arrays.",
    tags: ["Array", "Binary Search"],
    points: 280,
    acceptanceRate: 39,
    functionName: "findMedianSortedArrays",
    pseudocode: `1. Binary search the partition position in the smaller array.\n2. Derive the matching partition in the larger array.\n3. Ensure left values are less than right values.\n4. Compute the median from the partition borders.`,
    starterCode: buildStarterCode(
      "findMedianSortedArrays",
      "0",
      "nums1, nums2",
      "nums1: number[], nums2: number[]): number",
      "int findMedianSortedArrays(int[] nums1, int[] nums2)",
      ["Binary search the smaller array.", "Find a valid partition.", "Compute the median from the border values."]
    ),
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2" }
    ],
    testCases: [
      { args: [[1, 3], [2]], expected: 2 },
      { args: [[1, 2], [3, 4]], expected: 2 }
    ]
  },
  {
    title: "Regular Expression Matching",
    slug: "regular-expression-matching",
    difficulty: "Hard",
    description: "Implement pattern matching with support for '.' and '*'.",
    tags: ["String", "Dynamic Programming"],
    points: 300,
    acceptanceRate: 29,
    functionName: "isMatch",
    pseudocode: `1. Use recursion with memoization or bottom-up DP.\n2. Compare the current pattern token with the current string position.\n3. Handle '*' as zero or more of the previous token.\n4. Return whether the whole string matches the whole pattern.`,
    starterCode: buildStarterCode(
      "isMatch",
      "false",
      "s, p",
      "s: string, p: string): boolean",
      "boolean isMatch(String s, String p)",
      ["Use DP or memoization.", "Handle '.' as any single character.", "Handle '*' as zero-or-more of the previous token."]
    ),
    examples: [
      { input: "s = \"aa\", p = \"a\"", output: "false" },
      { input: "s = \"aa\", p = \"a*\"", output: "true" }
    ],
    testCases: [
      { args: ["aa", "a"], expected: false },
      { args: ["aa", "a*"], expected: true }
    ]
  },
  {
    title: "Merge K Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: "Hard",
    description: "Return the sorted merge of k sorted integer arrays for this simplified judge.",
    tags: ["Heap", "Linked List", "Divide and Conquer"],
    points: 260,
    acceptanceRate: 51,
    functionName: "mergeKListsFlat",
    pseudocode: `1. Keep the smallest current value from each list in a min-heap.\n2. Pop the minimum and append it to the answer.\n3. Push the next value from that list.\n4. Continue until the heap is empty.`,
    starterCode: buildStarterCode(
      "mergeKListsFlat",
      "[]",
      "lists",
      "lists: number[][]): number[]",
      "int[] mergeKListsFlat(int[][] lists)",
      ["Use a min-heap or repeated merging.", "Always pull the smallest available value.", "Return the flattened sorted output."]
    ),
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "lists = []", output: "[]" }
    ],
    testCases: [
      { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { args: [[]], expected: [] }
    ]
  },
  {
    title: "Word Ladder",
    slug: "word-ladder",
    difficulty: "Hard",
    description: "Return the length of the shortest transformation sequence from beginWord to endWord.",
    tags: ["Graph", "BFS", "String"],
    points: 250,
    acceptanceRate: 41,
    functionName: "ladderLength",
    pseudocode: `1. Build wildcard patterns for fast neighbor lookup.\n2. Run BFS from the begin word.\n3. Explore words differing by one character.\n4. Return the level where the end word is found.`,
    starterCode: buildStarterCode(
      "ladderLength",
      "0",
      "beginWord, endWord, wordList",
      "beginWord: string, endWord: string, wordList: string[]): number",
      "int ladderLength(String beginWord, String endWord, String[] wordList)",
      ["Use BFS.", "Generate one-letter transformations efficiently.", "Return the shortest transformation length."]
    ),
    examples: [
      { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5" },
      { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]", output: "0" }
    ],
    testCases: [
      { args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]], expected: 5 },
      { args: ["hit", "cog", ["hot", "dot", "dog", "lot", "log"]], expected: 0 }
    ]
  },
  {
    title: "N-Queens",
    slug: "n-queens",
    difficulty: "Hard",
    description: "Return the number of distinct N-Queens solutions.",
    tags: ["Backtracking"],
    points: 260,
    acceptanceRate: 69,
    functionName: "solveNQueensCount",
    pseudocode: `1. Place queens row by row.\n2. Track used columns and diagonals.\n3. Backtrack when a placement is invalid.\n4. Count every complete valid board.`,
    starterCode: buildStarterCode(
      "solveNQueensCount",
      "0",
      "n",
      "n: number): number",
      "int solveNQueensCount(int n)",
      ["Place queens row by row.", "Track blocked columns and diagonals.", "Return the number of valid boards."]
    ),
    examples: [
      { input: "n = 4", output: "2" },
      { input: "n = 1", output: "1" }
    ],
    testCases: [
      { args: [4], expected: 2 },
      { args: [1], expected: 1 }
    ]
  },
  {
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    description: "Return how much rain water can be trapped between the bars.",
    tags: ["Array", "Two Pointers", "Stack"],
    points: 240,
    acceptanceRate: 61,
    functionName: "trap",
    pseudocode: `1. Track left and right maximum heights.\n2. Move the smaller boundary inward.\n3. Add trapped water based on the current max boundary.\n4. Return the total water.`,
    starterCode: buildStarterCode(
      "trap",
      "0",
      "height",
      "height: number[]): number",
      "int trap(int[] height)",
      ["Use two pointers.", "Track the maximum height on each side.", "Accumulate trapped water."]
    ),
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" }
    ],
    testCases: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 }
    ]
  },
  {
    title: "Largest Rectangle in Histogram",
    slug: "largest-rectangle-in-histogram",
    difficulty: "Hard",
    description: "Return the area of the largest rectangle in the histogram.",
    tags: ["Array", "Stack"],
    points: 250,
    acceptanceRate: 45,
    functionName: "largestRectangleArea",
    pseudocode: `1. Use a monotonic increasing stack.\n2. When a lower bar appears, pop taller bars.\n3. Compute the maximal area for each popped bar.\n4. Finish by flushing the stack.`,
    starterCode: buildStarterCode(
      "largestRectangleArea",
      "0",
      "heights",
      "heights: number[]): number",
      "int largestRectangleArea(int[] heights)",
      ["Use a monotonic stack.", "Compute width when a bar leaves the stack.", "Track the maximum area."]
    ),
    examples: [
      { input: "heights = [2,1,5,6,2,3]", output: "10" },
      { input: "heights = [2,4]", output: "4" }
    ],
    testCases: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { args: [[2, 4]], expected: 4 }
    ]
  },
  {
    title: "Word Break",
    slug: "word-break",
    difficulty: "Medium",
    description: "Return true if the string can be segmented into dictionary words.",
    tags: ["String", "Dynamic Programming"],
    points: 180,
    acceptanceRate: 46,
    functionName: "wordBreak",
    pseudocode: `1. Let dp[i] indicate whether s[0:i] can be segmented.\n2. For each end position, try all start positions.\n3. Check if the prefix is valid and the substring is in the dictionary.\n4. Return dp[n].`,
    starterCode: buildStarterCode(
      "wordBreak",
      "false",
      "s, wordDict",
      "s: string, wordDict: string[]): boolean",
      "boolean wordBreak(String s, String[] wordDict)",
      ["Use dynamic programming over prefix lengths.", "Try every possible last word.", "Return whether the whole string is segmentable."]
    ),
    examples: [
      { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
      { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" }
    ],
    testCases: [
      { args: ["leetcode", ["leet", "code"]], expected: true },
      { args: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false }
    ]
  }
]

async function seedProblems() {
  const seededProblems = await Promise.all(
    starterProblems.map((problem) =>
      Problem.findOneAndUpdate(
        { slug: problem.slug },
        { $set: problem },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  )

  const StudyPlan = require("../models/StudyPlan");
  const top150Problems = seededProblems.filter(p => ["two-sum", "best-time-to-buy-and-sell-stock", "valid-parentheses", "merge-intervals"].includes(p.slug)).map(p => p._id);
  const algo1Problems = seededProblems.filter(p => ["binary-search", "find-minimum-in-rotated-sorted-array", "search-in-rotated-sorted-array"].includes(p.slug)).map(p => p._id);
  
  const plans = [
    {
      title: "Top Interview 150",
      slug: "top-interview-150",
      description: "Must-do list for interview prep",
      color: "#f59e0b",
      problems: top150Problems
    },
    {
      title: "Algorithm I",
      slug: "algorithm-i",
      description: "Essential algorithmic patterns",
      color: "#3b82f6",
      problems: algo1Problems
    }
  ];

  await Promise.all(
    plans.map((plan) =>
      StudyPlan.findOneAndUpdate(
        { slug: plan.slug },
        { $set: plan },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  )
}

module.exports = {
  seedProblems
}
