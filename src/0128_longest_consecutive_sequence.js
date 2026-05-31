/**
 * Brute Force
 * Greedy - Max Score
 * Time O (N^3) | Space O(1)
 * https://leetcode.com/problems/longest-consecutive-sequence/
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = (nums, maxScore = 0) => {
    for (const num of nums) {
        /* Time O(N) */
        let [currNum, score] = [num, 1];

        while (isStreak(nums, currNum + 1)) {
            /* Time O(N * N) */
            currNum++;
            score++;
        }

        maxScore = Math.max(maxScore, score);
    }

    return maxScore;
};

const isStreak = (nums, num) => {
    for (let i = 0; i < nums.length; i++) {
        /* Time O(N) */
        const isEqual = nums[i] === num;
        if (isEqual) return true;
    }

    return false;
};

/**
 * Sort - HeapSort Space O(1) | QuickSort Space O(log(K))
 * Greedy - Max Score
 * Time O (N * log(N)) | Space O(1)
 * https://leetcode.com/problems/longest-consecutive-sequence/
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = (nums) => {
    if (!nums.length) return 0;

    nums.sort((a, b) => a - b); /* Time O(N * log(N)) | Space O(1 || log(N)) */

    return search(nums); /* Time O(N) */
};

const search = (nums) => {
    let [maxScore, score] = [1, 1];

    for (let i = 1; i < nums.length; i++) {
        /* Time O(N) */
        const isPrevDuplicate = nums[i - 1] === nums[i];
        if (isPrevDuplicate) continue;

        const isStreak = nums[i] === nums[i - 1] + 1;
        if (isStreak) {
            score++;
            continue;
        }

        maxScore = Math.max(maxScore, score);
        score = 1;
    }

    return Math.max(maxScore, score);
};

/**
 * Hash Set - Intelligent Sequence
 * Greedy - Max Score
 * Time O (N) | Space O(N)
 * https://leetcode.com/problems/longest-consecutive-sequence/
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = (nums, maxScore = 0) => {
    const numSet = new Set(nums); /* Time O(N) | Space O(N) */

    for (const num of [...numSet]) {
        /* Time O(N) */
        const prevNum = num - 1;

        if (numSet.has(prevNum)) continue; /* Time O(N) */

        let [currNum, score] = [num, 1];

        const isStreak = () => numSet.has(currNum + 1);
        while (isStreak()) {
            /* Time O(N) */
            currNum++;
            score++;
        }

        maxScore = Math.max(maxScore, score);
    }

    return maxScore;
};

module.exports = { longestConsecutive };

if (require.main === module) {
    const assert = require('assert');
    function ListNode(val = 0, next = null) { this.val = val; this.next = next; }
    function TreeNode(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
    function Node(val = 0, neighbors = []) { this.val = val; this.neighbors = neighbors; }
    function listNodeToString(node) {
        const values = [];
        let current = node;
        while (current !== null) {
            values.push(String(current.val));
            current = current.next;
        }
        return values.join('->');
    }
    function treeToString(node) {
        if (node === null) return 'None';
        return `${node.val}(${treeToString(node.left)},${treeToString(node.right)})`;
    }
    function sorted(value) { return value.slice().sort(); }
    assert.deepStrictEqual(longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
}
