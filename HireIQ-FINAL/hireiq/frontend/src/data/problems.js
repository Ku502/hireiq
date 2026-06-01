export const PROBLEMS = [
  // ── ARRAYS ────────────────────────────────────────────────────────────────
  {
    id: 1, title: 'Two Sum', category: 'Arrays', difficulty: 'EASY',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    testCases: [
      { input: '[2,7,11,15]\n9', expected: '[0,1]' },
      { input: '[3,2,4]\n6', expected: '[1,2]' },
      { input: '[3,3]\n6', expected: '[0,1]' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        int[] nums = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        int target = Integer.parseInt(sc.nextLine().trim());\n        int[] res = new Main().twoSum(nums, target);\n        System.out.println(Arrays.toString(res).replaceAll(" ", ""));\n    }\n}`,
      python: `import sys\n\ndef twoSum(nums, target):\n    # Your code here\n    pass\n\nlines = sys.stdin.read().split('\\n')\nnums = list(map(int, lines[0].strip('[]').split(',')))\ntarget = int(lines[1])\nprint(twoSum(nums, target))`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');\nconst nums = JSON.parse(lines[0]);\nconst target = parseInt(lines[1]);\n\nfunction twoSum(nums, target) {\n    // Your code here\n}\n\nconsole.log(JSON.stringify(twoSum(nums, target)));`,
    },
    timeLimit: 20,
  },
  {
    id: 2, title: 'Best Time to Buy and Sell Stock', category: 'Arrays', difficulty: 'EASY',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.\nReturn the maximum profit you can achieve. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5' },
      { input: 'prices = [7,6,4,3,1]', output: '0' },
    ],
    testCases: [
      { input: '[7,1,5,3,6,4]', expected: '5' },
      { input: '[7,6,4,3,1]', expected: '0' },
      { input: '[1,2]', expected: '1' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int maxProfit(int[] prices) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        int[] prices = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().maxProfit(prices));\n    }\n}`,
      python: `import sys\ndef maxProfit(prices):\n    # Your code here\n    pass\nprices = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))\nprint(maxProfit(prices))`,
      javascript: `const prices = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction maxProfit(prices) {\n    // Your code here\n}\nconsole.log(maxProfit(prices));`,
    },
    timeLimit: 20,
  },
  {
    id: 3, title: 'Contains Duplicate', category: 'Arrays', difficulty: 'EASY',
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
    ],
    testCases: [
      { input: '[1,2,3,1]', expected: 'true' },
      { input: '[1,2,3,4]', expected: 'false' },
      { input: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        int[] nums = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().containsDuplicate(nums));\n    }\n}`,
      python: `import sys\ndef containsDuplicate(nums):\n    # Your code here\n    pass\nnums = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))\nprint(str(containsDuplicate(nums)).lower())`,
      javascript: `const nums = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction containsDuplicate(nums) {\n    // Your code here\n}\nconsole.log(containsDuplicate(nums));`,
    },
    timeLimit: 20,
  },
  {
    id: 4, title: 'Maximum Subarray', category: 'Arrays', difficulty: 'MEDIUM',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: 'nums = [1]', output: '1' },
    ],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5,4,-1,7,8]', expected: '23' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        int[] nums = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().maxSubArray(nums));\n    }\n}`,
      python: `import sys\ndef maxSubArray(nums):\n    # Your code here\n    pass\nnums = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))\nprint(maxSubArray(nums))`,
      javascript: `const nums = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction maxSubArray(nums) {\n    // Your code here\n}\nconsole.log(maxSubArray(nums));`,
    },
    timeLimit: 25,
  },
  {
    id: 5, title: 'Product of Array Except Self', category: 'Arrays', difficulty: 'MEDIUM',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    testCases: [
      { input: '[1,2,3,4]', expected: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        int[] nums = Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(Arrays.toString(new Main().productExceptSelf(nums)).replaceAll(" ",""));\n    }\n}`,
      python: `import sys\ndef productExceptSelf(nums):\n    # Your code here\n    pass\nnums = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))\nprint(productExceptSelf(nums))`,
      javascript: `const nums = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction productExceptSelf(nums) {\n    // Your code here\n}\nconsole.log(JSON.stringify(productExceptSelf(nums)));`,
    },
    timeLimit: 30,
  },

  // ── STRINGS ───────────────────────────────────────────────────────────────
  {
    id: 6, title: 'Valid Anagram', category: 'Strings', difficulty: 'EASY',
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    testCases: [
      { input: 'anagram\nnagaram', expected: 'true' },
      { input: 'rat\ncar', expected: 'false' },
      { input: 'a\nab', expected: 'false' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        String t = sc.nextLine().trim();\n        System.out.println(new Main().isAnagram(s, t));\n    }\n}`,
      python: `import sys\ndef isAnagram(s, t):\n    # Your code here\n    pass\nlines = sys.stdin.read().split('\\n')\nprint(str(isAnagram(lines[0].strip(), lines[1].strip())).lower())`,
      javascript: `const [s,t] = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nfunction isAnagram(s, t) {\n    // Your code here\n}\nconsole.log(isAnagram(s.trim(), t.trim()));`,
    },
    timeLimit: 20,
  },
  {
    id: 7, title: 'Valid Palindrome', category: 'Strings', difficulty: 'EASY',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\nGiven a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    testCases: [
      { input: 'A man, a plan, a canal: Panama', expected: 'true' },
      { input: 'race a car', expected: 'false' },
      { input: ' ', expected: 'true' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public boolean isPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new Main().isPalindrome(s));\n    }\n}`,
      python: `import sys\ndef isPalindrome(s):\n    # Your code here\n    pass\ns = sys.stdin.read().strip()\nprint(str(isPalindrome(s)).lower())`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();\nfunction isPalindrome(s) {\n    // Your code here\n}\nconsole.log(isPalindrome(s));`,
    },
    timeLimit: 20,
  },
  {
    id: 8, title: 'Longest Substring Without Repeating Characters', category: 'Strings', difficulty: 'MEDIUM',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    testCases: [
      { input: 'abcabcbb', expected: '3' },
      { input: 'bbbbb', expected: '1' },
      { input: 'pwwkew', expected: '3' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        System.out.println(new Main().lengthOfLongestSubstring(s));\n    }\n}`,
      python: `import sys\ndef lengthOfLongestSubstring(s):\n    # Your code here\n    pass\ns = sys.stdin.read().strip()\nprint(lengthOfLongestSubstring(s))`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();\nfunction lengthOfLongestSubstring(s) {\n    // Your code here\n}\nconsole.log(lengthOfLongestSubstring(s));`,
    },
    timeLimit: 25,
  },

  // ── LINKED LIST ───────────────────────────────────────────────────────────
  {
    id: 9, title: 'Reverse Linked List', category: 'Linked List', difficulty: 'EASY',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.\nInput is given as space-separated values. Output the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
    ],
    testCases: [
      { input: '1 2 3 4 5', expected: '5 4 3 2 1' },
      { input: '1 2', expected: '2 1' },
      { input: '1', expected: '1' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    static class ListNode { int val; ListNode next; ListNode(int v){val=v;} }\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n        return null;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int[] vals = Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        ListNode dummy = new ListNode(0), cur = dummy;\n        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }\n        ListNode res = new Main().reverseList(dummy.next);\n        StringBuilder sb = new StringBuilder();\n        while (res != null) { sb.append(res.val); if (res.next != null) sb.append(" "); res = res.next; }\n        System.out.println(sb);\n    }\n}`,
      python: `import sys\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\ndef reverseList(head):\n    # Your code here\n    pass\nvals = list(map(int, sys.stdin.read().strip().split()))\ndummy = ListNode(0)\ncur = dummy\nfor v in vals:\n    cur.next = ListNode(v)\n    cur = cur.next\nres = reverseList(dummy.next)\nout = []\nwhile res:\n    out.append(str(res.val))\n    res = res.next\nprint(' '.join(out))`,
      javascript: `const vals = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nclass ListNode { constructor(val,next=null){this.val=val;this.next=next;} }\nfunction reverseList(head) {\n    // Your code here\n}\nlet dummy = new ListNode(0), cur = dummy;\nfor (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }\nlet res = reverseList(dummy.next), out = [];\nwhile (res) { out.push(res.val); res = res.next; }\nconsole.log(out.join(' '));`,
    },
    timeLimit: 20,
  },
  {
    id: 10, title: 'Merge Two Sorted Lists', category: 'Linked List', difficulty: 'EASY',
    description: `You are given the heads of two sorted linked lists list1 and list2.\nMerge the two lists into one sorted list. Return the head of the merged linked list.\nInput: two lines, each with space-separated values of each list.`,
    examples: [
      { input: 'list1=[1,2,4], list2=[1,3,4]', output: '[1,1,2,3,4,4]' },
    ],
    testCases: [
      { input: '1 2 4\n1 3 4', expected: '1 1 2 3 4 4' },
      { input: '\n', expected: '' },
      { input: '1\n', expected: '1' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    static class ListNode { int val; ListNode next; ListNode(int v){val=v;} }\n    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n        // Your code here\n        return null;\n    }\n    static ListNode build(String line) {\n        if (line == null || line.isBlank()) return null;\n        ListNode d = new ListNode(0), c = d;\n        for (String s : line.trim().split(" ")) { c.next = new ListNode(Integer.parseInt(s)); c = c.next; }\n        return d.next;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        ListNode l1 = build(sc.hasNextLine() ? sc.nextLine() : "");\n        ListNode l2 = build(sc.hasNextLine() ? sc.nextLine() : "");\n        ListNode res = new Main().mergeTwoLists(l1, l2);\n        StringBuilder sb = new StringBuilder();\n        while (res != null) { sb.append(res.val); if(res.next!=null)sb.append(" "); res=res.next; }\n        System.out.println(sb);\n    }\n}`,
      python: `import sys\nclass ListNode:\n    def __init__(self, val=0, next=None): self.val=val; self.next=next\ndef mergeTwoLists(l1, l2):\n    # Your code here\n    pass\ndef build(line):\n    if not line.strip(): return None\n    d=ListNode(0); c=d\n    for v in line.strip().split(): c.next=ListNode(int(v)); c=c.next\n    return d.next\nlines = sys.stdin.read().split('\\n')\nl1=build(lines[0] if len(lines)>0 else '')\nl2=build(lines[1] if len(lines)>1 else '')\nres=mergeTwoLists(l1,l2); out=[]\nwhile res: out.append(str(res.val)); res=res.next\nprint(' '.join(out))`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');\nclass ListNode{constructor(v,n=null){this.val=v;this.next=n;}}\nfunction build(line){if(!line||!line.trim())return null;let d=new ListNode(0),c=d;for(const v of line.trim().split(' ')){c.next=new ListNode(+v);c=c.next;}return d.next;}\nfunction mergeTwoLists(l1,l2){\n    // Your code here\n}\nlet res=mergeTwoLists(build(lines[0]),build(lines[1])),out=[];\nwhile(res){out.push(res.val);res=res.next;}\nconsole.log(out.join(' '));`,
    },
    timeLimit: 20,
  },

  // ── TREES ─────────────────────────────────────────────────────────────────
  {
    id: 11, title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'EASY',
    description: `Given the root of a binary tree, return its maximum depth.\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\nInput: level-order array with -1 for null nodes.`,
    examples: [
      { input: 'root = [3,9,20,-1,-1,15,7]', output: '3' },
      { input: 'root = [1,-1,2]', output: '2' },
    ],
    testCases: [
      { input: '3 9 20 -1 -1 15 7', expected: '3' },
      { input: '1 -1 2', expected: '2' },
      { input: '1', expected: '1' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    static class TreeNode { int val; TreeNode left,right; TreeNode(int v){val=v;} }\n    public int maxDepth(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n    static TreeNode build(int[] a) {\n        if (a.length==0||a[0]==-1) return null;\n        TreeNode root=new TreeNode(a[0]);\n        Queue<TreeNode> q=new LinkedList<>(); q.add(root);\n        int i=1;\n        while(!q.isEmpty()&&i<a.length){\n            TreeNode n=q.poll();\n            if(i<a.length&&a[i]!=-1){n.left=new TreeNode(a[i]);q.add(n.left);}i++;\n            if(i<a.length&&a[i]!=-1){n.right=new TreeNode(a[i]);q.add(n.right);}i++;\n        }\n        return root;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int[] a=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().maxDepth(build(a)));\n    }\n}`,
      python: `import sys\nfrom collections import deque\nclass TreeNode:\n    def __init__(self,val=0,left=None,right=None): self.val=val;self.left=left;self.right=right\ndef build(vals):\n    if not vals or vals[0]==-1: return None\n    root=TreeNode(vals[0]); q=deque([root]); i=1\n    while q and i<len(vals):\n        n=q.popleft()\n        if i<len(vals) and vals[i]!=-1: n.left=TreeNode(vals[i]); q.append(n.left)\n        i+=1\n        if i<len(vals) and vals[i]!=-1: n.right=TreeNode(vals[i]); q.append(n.right)\n        i+=1\n    return root\ndef maxDepth(root):\n    # Your code here\n    pass\nvals=list(map(int,sys.stdin.read().strip().split()))\nprint(maxDepth(build(vals)))`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nclass TreeNode{constructor(v,l=null,r=null){this.val=v;this.left=l;this.right=r;}}\nfunction build(a){if(!a.length||a[0]===-1)return null;let root=new TreeNode(a[0]),q=[root],i=1;while(q.length&&i<a.length){let n=q.shift();if(i<a.length&&a[i]!==-1){n.left=new TreeNode(a[i]);q.push(n.left);}i++;if(i<a.length&&a[i]!==-1){n.right=new TreeNode(a[i]);q.push(n.right);}i++;}return root;}\nfunction maxDepth(root) {\n    // Your code here\n}\nconsole.log(maxDepth(build(vals)));`,
    },
    timeLimit: 20,
  },
  {
    id: 12, title: 'Invert Binary Tree', category: 'Trees', difficulty: 'EASY',
    description: `Given the root of a binary tree, invert the tree, and return its root.\nInput/Output: level-order array with -1 for null.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
    ],
    testCases: [
      { input: '4 2 7 1 3 6 9', expected: '4 7 2 9 6 3 1' },
      { input: '2 1 3', expected: '2 3 1' },
      { input: '1', expected: '1' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    static class TreeNode { int val; TreeNode left,right; TreeNode(int v){val=v;} }\n    public TreeNode invertTree(TreeNode root) {\n        // Your code here\n        return root;\n    }\n    static TreeNode build(int[] a) {\n        if(a.length==0||a[0]==-1)return null;\n        TreeNode root=new TreeNode(a[0]); Queue<TreeNode> q=new LinkedList<>(); q.add(root); int i=1;\n        while(!q.isEmpty()&&i<a.length){TreeNode n=q.poll();if(i<a.length&&a[i]!=-1){n.left=new TreeNode(a[i]);q.add(n.left);}i++;if(i<a.length&&a[i]!=-1){n.right=new TreeNode(a[i]);q.add(n.right);}i++;}\n        return root;\n    }\n    static String serialize(TreeNode root) {\n        if(root==null)return"";\n        Queue<TreeNode> q=new LinkedList<>();q.add(root);\n        List<String> res=new ArrayList<>();\n        while(!q.isEmpty()){TreeNode n=q.poll();if(n==null)continue;res.add(String.valueOf(n.val));q.add(n.left);q.add(n.right);}\n        return String.join(" ",res);\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int[] a=Arrays.stream(sc.nextLine().trim().split(" ")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(serialize(new Main().invertTree(build(a))));\n    }\n}`,
      python: `import sys\nfrom collections import deque\nclass TreeNode:\n    def __init__(self,val=0,left=None,right=None): self.val=val;self.left=left;self.right=right\ndef build(vals):\n    if not vals or vals[0]==-1: return None\n    root=TreeNode(vals[0]);q=deque([root]);i=1\n    while q and i<len(vals):\n        n=q.popleft()\n        if i<len(vals) and vals[i]!=-1: n.left=TreeNode(vals[i]);q.append(n.left)\n        i+=1\n        if i<len(vals) and vals[i]!=-1: n.right=TreeNode(vals[i]);q.append(n.right)\n        i+=1\n    return root\ndef serialize(root):\n    if not root: return ''\n    q=deque([root]);res=[]\n    while q:\n        n=q.popleft()\n        if not n: continue\n        res.append(str(n.val));q.append(n.left);q.append(n.right)\n    return ' '.join(res)\ndef invertTree(root):\n    # Your code here\n    pass\nvals=list(map(int,sys.stdin.read().strip().split()))\nprint(serialize(invertTree(build(vals))))`,
      javascript: `const vals=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);\nclass TreeNode{constructor(v,l=null,r=null){this.val=v;this.left=l;this.right=r;}}\nfunction build(a){if(!a.length||a[0]===-1)return null;let root=new TreeNode(a[0]),q=[root],i=1;while(q.length&&i<a.length){let n=q.shift();if(i<a.length&&a[i]!==-1){n.left=new TreeNode(a[i]);q.push(n.left);}i++;if(i<a.length&&a[i]!==-1){n.right=new TreeNode(a[i]);q.push(n.right);}i++;}return root;}\nfunction serialize(root){if(!root)return'';let q=[root],res=[];while(q.length){let n=q.shift();if(!n)continue;res.push(n.val);q.push(n.left,n.right);}return res.join(' ');}\nfunction invertTree(root) {\n    // Your code here\n}\nconsole.log(serialize(invertTree(build(vals))));`,
    },
    timeLimit: 20,
  },

  // ── DYNAMIC PROGRAMMING ───────────────────────────────────────────────────
  {
    id: 13, title: 'Climbing Stairs', category: 'Dynamic Programming', difficulty: 'EASY',
    description: `You are climbing a staircase. It takes n steps to reach the top.\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
    ],
    testCases: [
      { input: '2', expected: '2' },
      { input: '3', expected: '3' },
      { input: '10', expected: '89' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        System.out.println(new Main().climbStairs(Integer.parseInt(sc.nextLine().trim())));\n    }\n}`,
      python: `import sys\ndef climbStairs(n):\n    # Your code here\n    pass\nprint(climbStairs(int(sys.stdin.read().strip())))`,
      javascript: `const n=parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction climbStairs(n){\n    // Your code here\n}\nconsole.log(climbStairs(n));`,
    },
    timeLimit: 20,
  },
  {
    id: 14, title: 'House Robber', category: 'Dynamic Programming', difficulty: 'MEDIUM',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected.\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4' },
      { input: 'nums = [2,7,9,3,1]', output: '12' },
    ],
    testCases: [
      { input: '[1,2,3,1]', expected: '4' },
      { input: '[2,7,9,3,1]', expected: '12' },
      { input: '[2,1,1,2]', expected: '4' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int rob(int[] nums) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String line=sc.nextLine().replaceAll("[\\\\[\\\\]]","");\n        int[] nums=Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().rob(nums));\n    }\n}`,
      python: `import sys\ndef rob(nums):\n    # Your code here\n    pass\nnums=list(map(int,sys.stdin.read().strip().strip('[]').split(',')))\nprint(rob(nums))`,
      javascript: `const nums=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());\nfunction rob(nums){\n    // Your code here\n}\nconsole.log(rob(nums));`,
    },
    timeLimit: 25,
  },
  {
    id: 15, title: 'Coin Change', category: 'Dynamic Programming', difficulty: 'MEDIUM',
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\nInput: first line is coins array, second line is amount.`,
    examples: [
      { input: 'coins=[1,2,5], amount=11', output: '3' },
      { input: 'coins=[2], amount=3', output: '-1' },
    ],
    testCases: [
      { input: '[1,2,5]\n11', expected: '3' },
      { input: '[2]\n3', expected: '-1' },
      { input: '[1]\n0', expected: '0' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n        return -1;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int[] coins=Arrays.stream(sc.nextLine().replaceAll("[\\\\[\\\\]]","").split(",")).mapToInt(Integer::parseInt).toArray();\n        int amount=Integer.parseInt(sc.nextLine().trim());\n        System.out.println(new Main().coinChange(coins,amount));\n    }\n}`,
      python: `import sys\ndef coinChange(coins, amount):\n    # Your code here\n    pass\nlines=sys.stdin.read().split('\\n')\ncoins=list(map(int,lines[0].strip().strip('[]').split(',')))\namount=int(lines[1].strip())\nprint(coinChange(coins,amount))`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst coins=JSON.parse(lines[0]),amount=parseInt(lines[1]);\nfunction coinChange(coins,amount){\n    // Your code here\n}\nconsole.log(coinChange(coins,amount));`,
    },
    timeLimit: 30,
  },

  // ── GRAPHS ────────────────────────────────────────────────────────────────
  {
    id: 16, title: 'Number of Islands', category: 'Graphs', difficulty: 'MEDIUM',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.\nInput: rows of the grid, each row space-separated.`,
    examples: [
      { input: '1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' },
      { input: '1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3' },
    ],
    testCases: [
      { input: '1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expected: '1' },
      { input: '1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expected: '3' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int numIslands(char[][] grid) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        List<char[]> rows=new ArrayList<>();\n        while(sc.hasNextLine()){String l=sc.nextLine();if(l.isBlank())break;String[] p=l.trim().split(" ");char[] row=new char[p.length];for(int i=0;i<p.length;i++)row[i]=p[i].charAt(0);rows.add(row);}\n        char[][] grid=rows.toArray(new char[0][]);\n        System.out.println(new Main().numIslands(grid));\n    }\n}`,
      python: `import sys\ndef numIslands(grid):\n    # Your code here\n    pass\nlines=[l for l in sys.stdin.read().split('\\n') if l.strip()]\ngrid=[list(l.split()) for l in lines]\nprint(numIslands(grid))`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n').filter(l=>l.trim());\nconst grid=lines.map(l=>l.split(' '));\nfunction numIslands(grid){\n    // Your code here\n}\nconsole.log(numIslands(grid));`,
    },
    timeLimit: 30,
  },

  // ── STACK ─────────────────────────────────────────────────────────────────
  {
    id: 17, title: 'Valid Parentheses', category: 'Stack', difficulty: 'EASY',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nAn input string is valid if open brackets are closed by the same type of brackets and in the correct order.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    testCases: [
      { input: '()', expected: 'true' },
      { input: '()[]{}', expected: 'true' },
      { input: '(]', expected: 'false' },
      { input: '([)]', expected: 'false' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        System.out.println(new Main().isValid(sc.nextLine().trim()));\n    }\n}`,
      python: `import sys\ndef isValid(s):\n    # Your code here\n    pass\nprint(str(isValid(sys.stdin.read().strip())).lower())`,
      javascript: `const s=require('fs').readFileSync('/dev/stdin','utf8').trim();\nfunction isValid(s){\n    // Your code here\n}\nconsole.log(isValid(s));`,
    },
    timeLimit: 20,
  },

  // ── BINARY SEARCH ─────────────────────────────────────────────────────────
  {
    id: 18, title: 'Binary Search', category: 'Binary Search', difficulty: 'EASY',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\nInput: first line is the array, second line is target.`,
    examples: [
      { input: 'nums=[-1,0,3,5,9,12], target=9', output: '4' },
      { input: 'nums=[-1,0,3,5,9,12], target=2', output: '-1' },
    ],
    testCases: [
      { input: '[-1,0,3,5,9,12]\n9', expected: '4' },
      { input: '[-1,0,3,5,9,12]\n2', expected: '-1' },
      { input: '[5]\n5', expected: '0' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int[] nums=Arrays.stream(sc.nextLine().replaceAll("[\\\\[\\\\]]","").split(",")).mapToInt(Integer::parseInt).toArray();\n        int target=Integer.parseInt(sc.nextLine().trim());\n        System.out.println(new Main().search(nums,target));\n    }\n}`,
      python: `import sys\ndef search(nums, target):\n    # Your code here\n    pass\nlines=sys.stdin.read().split('\\n')\nnums=list(map(int,lines[0].strip().strip('[]').split(',')))\ntarget=int(lines[1].strip())\nprint(search(nums,target))`,
      javascript: `const lines=require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');\nconst nums=JSON.parse(lines[0]),target=parseInt(lines[1]);\nfunction search(nums,target){\n    // Your code here\n}\nconsole.log(search(nums,target));`,
    },
    timeLimit: 20,
  },

  // ── HASHING ───────────────────────────────────────────────────────────────
  {
    id: 19, title: 'Group Anagrams', category: 'Hashing', difficulty: 'MEDIUM',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.\nInput: space-separated strings on one line. Output: groups separated by | with words space-separated, sorted lexicographically within and across groups.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: 'ate eat tea | bat | nat tan' },
    ],
    testCases: [
      { input: 'eat tea tan ate nat bat', expected: 'ate eat tea | bat | nat tan' },
      { input: 'a', expected: 'a' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String[] strs=sc.nextLine().trim().split(" ");\n        List<List<String>> res=new Main().groupAnagrams(strs);\n        res.forEach(g->Collections.sort(g));\n        res.sort(Comparator.comparing(g->g.get(0)));\n        List<String> parts=new ArrayList<>();\n        for(List<String> g:res) parts.add(String.join(" ",g));\n        System.out.println(String.join(" | ",parts));\n    }\n}`,
      python: `import sys\nfrom collections import defaultdict\ndef groupAnagrams(strs):\n    # Your code here\n    pass\nstrs=sys.stdin.read().strip().split()\nres=groupAnagrams(strs)\nfor g in res: g.sort()\nres.sort(key=lambda g:g[0])\nprint(' | '.join(' '.join(g) for g in res))`,
      javascript: `const strs=require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ');\nfunction groupAnagrams(strs){\n    // Your code here\n}\nlet res=groupAnagrams(strs);\nres.forEach(g=>g.sort());\nres.sort((a,b)=>a[0].localeCompare(b[0]));\nconsole.log(res.map(g=>g.join(' ')).join(' | '));`,
    },
    timeLimit: 25,
  },
  {
    id: 20, title: 'Longest Consecutive Sequence', category: 'Hashing', difficulty: 'MEDIUM',
    description: `Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.\nYou must write an algorithm that runs in O(n) time.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
    ],
    testCases: [
      { input: '[100,4,200,1,3,2]', expected: '4' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', expected: '9' },
      { input: '[]', expected: '0' },
    ],
    starterCode: {
      java: `import java.util.*;\npublic class Main {\n    public int longestConsecutive(int[] nums) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String line=sc.nextLine().replaceAll("[\\\\[\\\\]]","").trim();\n        int[] nums=line.isEmpty()?new int[0]:Arrays.stream(line.split(",")).mapToInt(Integer::parseInt).toArray();\n        System.out.println(new Main().longestConsecutive(nums));\n    }\n}`,
      python: `import sys\ndef longestConsecutive(nums):\n    # Your code here\n    pass\nraw=sys.stdin.read().strip().strip('[]')\nnums=list(map(int,raw.split(','))) if raw else []\nprint(longestConsecutive(nums))`,
      javascript: `const raw=require('fs').readFileSync('/dev/stdin','utf8').trim();\nconst nums=JSON.parse(raw);\nfunction longestConsecutive(nums){\n    // Your code here\n}\nconsole.log(longestConsecutive(nums));`,
    },
    timeLimit: 30,
  },

  // ── MCQ DATA ──────────────────────────────────────────────────────────────
]

export const MCQ_QUESTIONS = {
  'Java Developer': [
    { id:1, question:'Which keyword is used to prevent a method from being overridden in Java?', options:['static','final','private','abstract'], answer:1 },
    { id:2, question:'What is the default value of a boolean variable in Java?', options:['true','false','null','0'], answer:1 },
    { id:3, question:'Which collection allows duplicate elements and maintains insertion order?', options:['HashSet','TreeSet','ArrayList','LinkedHashSet'], answer:2 },
    { id:4, question:'What does JVM stand for?', options:['Java Virtual Memory','Java Virtual Machine','Java Variable Method','Java Verified Module'], answer:1 },
    { id:5, question:'Which exception is thrown when you try to access an array index out of bounds?', options:['NullPointerException','IllegalArgumentException','ArrayIndexOutOfBoundsException','IndexOutOfBoundsException'], answer:2 },
    { id:6, question:'What is the parent class of all classes in Java?', options:['Base','Super','Object','Class'], answer:2 },
    { id:7, question:'Which of these is NOT a feature of Java?', options:['Platform independent','Object-oriented','Pointers','Multithreaded'], answer:2 },
    { id:8, question:'What is the size of an int in Java?', options:['16 bits','32 bits','64 bits','Depends on platform'], answer:1 },
    { id:9, question:'Which interface must be implemented to make a class usable in a for-each loop?', options:['Runnable','Comparable','Iterable','Serializable'], answer:2 },
    { id:10, question:'What is autoboxing in Java?', options:['Converting int to Integer automatically','Converting String to int','Wrapping a class in another class','None of these'], answer:0 },
    { id:11, question:'Which method is called first in a Java program?', options:['start()','init()','main()','run()'], answer:2 },
    { id:12, question:'What is the output of: System.out.println(10 + 20 + "30")?', options:['"102030"','60','"3030"','3030'], answer:2 },
    { id:13, question:'Which of these supports multiple inheritance in Java?', options:['Class','Abstract Class','Interface','None'], answer:2 },
    { id:14, question:'What is the use of the `transient` keyword?', options:['To prevent serialization of a variable','To make a variable thread-safe','To declare a constant','To skip garbage collection'], answer:0 },
    { id:15, question:'Which garbage collection algorithm is used by default in modern JVMs?', options:['Mark and Sweep','G1 GC','Serial GC','CMS'], answer:1 },
  ],
  'Python Developer': [
    { id:1, question:'What is the output of type([])?', options:["<class 'list'>",'list','[]','None'], answer:0 },
    { id:2, question:'Which keyword is used to define a generator function in Python?', options:['return','yield','generate','async'], answer:1 },
    { id:3, question:'What does the `*args` syntax allow in a function?', options:['Keyword arguments','Variable number of positional arguments','Unpacking a dictionary','None'], answer:1 },
    { id:4, question:'Which of these is immutable in Python?', options:['List','Dictionary','Set','Tuple'], answer:3 },
    { id:5, question:'What is the output of: bool("") in Python?', options:['True','False','None','Error'], answer:1 },
    { id:6, question:'Which module is used for regular expressions in Python?', options:['regex','re','regexp','string'], answer:1 },
    { id:7, question:'What does PEP stand for?', options:['Python Enhancement Proposal','Python Executable Program','Python Error Protocol','None'], answer:0 },
    { id:8, question:'What is a lambda function?', options:['A named function','An anonymous function','A recursive function','A built-in function'], answer:1 },
    { id:9, question:'Which method removes and returns the last element of a list?', options:['remove()','delete()','pop()','discard()'], answer:2 },
    { id:10, question:'What is the output of: 3 ** 2?', options:['6','9','8','None'], answer:1 },
  ],
  'Full Stack Developer': [
    { id:1, question:'What does REST stand for?', options:['Remote Execution State Transfer','Representational State Transfer','Remote State Transfer','None'], answer:1 },
    { id:2, question:'Which HTTP method is idempotent?', options:['POST','GET','PATCH','None of these'], answer:1 },
    { id:3, question:'What is CORS?', options:['Cross-Origin Resource Sharing','Cross-Origin Request Security','Client-Origin Resource Sharing','None'], answer:0 },
    { id:4, question:'Which of these is a NoSQL database?', options:['MySQL','PostgreSQL','MongoDB','Oracle'], answer:2 },
    { id:5, question:'What does JWT stand for?', options:['Java Web Token','JSON Web Token','JavaScript Web Transfer','JSON Web Transfer'], answer:1 },
    { id:6, question:'What is the virtual DOM in React?', options:['A real browser DOM','A JavaScript representation of the DOM','A server-side DOM','None'], answer:1 },
    { id:7, question:'Which status code means "Not Found"?', options:['200','401','403','404'], answer:3 },
    { id:8, question:'What is the purpose of a reverse proxy?', options:['To cache static files','To forward client requests to backend servers','To manage databases','To compress data'], answer:1 },
    { id:9, question:'Which SQL clause is used to filter groups?', options:['WHERE','GROUP BY','HAVING','FILTER'], answer:2 },
    { id:10, question:'What is Docker?', options:['A virtual machine','A containerization platform','A CI/CD tool','A cloud provider'], answer:1 },
  ],
  'default': [
    { id:1, question:'What does OOP stand for?', options:['Object-Oriented Programming','Object-Oriented Protocol','Open-Oriented Programming','None'], answer:0 },
    { id:2, question:'What is a stack data structure?', options:['FIFO','LIFO','Random access','None'], answer:1 },
    { id:3, question:'What is Big O notation used for?', options:['Measuring memory','Describing algorithm complexity','Counting lines of code','None'], answer:1 },
    { id:4, question:'What is recursion?', options:['A loop','A function calling itself','A data structure','None'], answer:1 },
    { id:5, question:'What does SQL stand for?', options:['Structured Query Language','Simple Query Language','Standard Query Logic','None'], answer:0 },
  ],
}
