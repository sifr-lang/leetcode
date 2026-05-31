/**
 * DP - Bottom Up
 * Array - Tabulation
 * Time O(N^2) | Space O(N)
 * https://leetcode.com/problems/longest-increasing-subsequence/
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = (nums) => {
    const tabu = initTabu(nums); /*               | Space O(N) */

    linearSearch(nums, tabu); /* Time O(N * N) | Space O(N)*/

    return Math.max(...tabu); /* Time O(N) */
};

const initTabu = (nums) => new Array(nums.length).fill(1);

var linearSearch = (nums, tabu) => {
    for (let right = 1; right < nums.length; right++) {
        /* Time O(N) */
        for (let left = 0; left < right; left++) {
            /* Time O(N) */
            const canUpdate = nums[left] < nums[right];
            if (!canUpdate) continue;

            const [_left, _right] = [tabu[left] + 1, tabu[right]];
            tabu[right] = Math.max(_right, _left); /* Space O(N) */
        }
    }
};

/**
 * Array - Subsequence
 * Time O(N^2) | Space O(N)
 * https://leetcode.com/problems/longest-increasing-subsequence/
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = (nums) => {
    const subsequence = linearSort(nums); /* Time O(N * N) | Space O(N) */

    return subsequence.length;
};

var linearSort = (nums, subsequence = []) => {
    for (const num of nums) {
        /* Time O(N) */
        const max = subsequence[subsequence.length - 1];

        const canAdd = max < num;
        if (canAdd) {
            subsequence.push(num);
            continue;
        } /* Space O(N) */

        const index = getMax(subsequence, num); /* Time O(N) */

        subsequence[index] = num;
    }

    return subsequence;
};

const getMax = (subsequence, num, index = 0) => {
    const isLess = () => subsequence[index] < num;
    while (isLess()) index++; /* Time O(N) */

    return index;
};

/**
 * Array - Subsequence
 * Time O(N * log(N)) | Space O(N)
 * https://leetcode.com/problems/longest-increasing-subsequence/
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = (nums) => {
    const n = nums.length;
    if (n === 0) {
        return 0;
    }
    const dp = [];
    for (let i = 0; i < n; i++) {
        dp.push(1);
    }
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (dp[j] + 1 > dp[i]) {
                    dp[i] = dp[j] + 1;
                }
            }
        }
    }
    let best = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] > best) {
            best = dp[i];
        }
    }
    return best;
};

var logarithmicSort = (nums, subsequence = []) => {
    for (const num of nums) {
        /* Time O(N) */
        const max = subsequence[subsequence.length - 1];

        const canAdd = max < num;
        if (canAdd) {
            subsequence.push(num);
            continue;
        } /* Space O(N) */

        const index = binarySearch(num, subsequence); /* Time O(log(N)) */

        subsequence[index] = num;
    }

    return subsequence;
};

const binarySearch = (num, subsequence) => {
    let [left, right] = [0, subsequence.length - 1];

    while (left < right) {
        /* Time O(log(N)) */
        const mid = (left + right) >> 1;
        const guess = subsequence[mid];

        const isNumTarget = num === guess;
        if (isNumTarget) return mid;

        const isNumGreater = guess < num;
        if (isNumGreater) left = mid + 1;

        const isNumLess = num < guess;
        if (isNumLess) right = mid;
    }

    return left;
};

module.exports = { lengthOfLIS };

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
    assert.deepStrictEqual(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
    assert.deepStrictEqual(lengthOfLIS([0, 1, 0, 3, 2, 3]), 4);
    assert.deepStrictEqual(lengthOfLIS([7, 7, 7, 7, 7, 7, 7]), 1);
    assert.deepStrictEqual(lengthOfLIS([1]), 1);
}
