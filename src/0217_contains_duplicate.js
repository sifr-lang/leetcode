/**
 * Brute Force - Linear Search
 * Time O(N^2) | Space O(1)
 * https://leetcode.com/problems/contains-duplicate/
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = (nums) => {
    for (let right = 0; right < nums.length; right++) {
        /* Time O(N) */
        for (let left = 0; left < right; left++) {
            /* Time O(N) */
            const isDuplicate = nums[left] === nums[right];
            if (isDuplicate) return true;
        }
    }

    return false;
};

/**
 * Sort - HeapSort Space O(1) | QuickSort Space O(log(N))
 * Time O(N * log(N)) | Space O(1)
 * https://leetcode.com/problems/contains-duplicate/
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = (nums) => {
    nums.sort((a, b) => a - b); /* Time O(N * log(N)) | Space O(1 || log(N)) */

    return hasDuplicate(nums);
};

const hasDuplicate = (nums) => {
    for (let curr = 0; curr < nums.length - 1; curr++) {
        /* Time O(N) */
        const next = curr + 1;

        const isNextDuplicate = nums[curr] === nums[next];
        if (isNextDuplicate) return true;
    }

    return false;
};

/**
 * Hash Set
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/contains-duplicate/
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = (nums) => {
    const numsSet = new Set(nums); /* Time O(N) | Space O(N) */
    const isEqual = numsSet.size === nums.length;

    return !isEqual;
};

/**
 * Hash Set - Early Exit
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/contains-duplicate/
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = (nums, numsSet = new Set()) => {
    for (const num of nums) {
        /* Time O(N) */
        if (numsSet.has(num)) return true;

        numsSet.add(num); /* Space O(N) */
    }

    return false;
};

module.exports = { containsDuplicate };

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
    assert.deepStrictEqual(containsDuplicate([1, 2, 3, 1]), true);
    assert.deepStrictEqual(containsDuplicate([1, 2, 3, 4]), false);
}
