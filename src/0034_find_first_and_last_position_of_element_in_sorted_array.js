/**
 * Binary Search
 * https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/
 * Time O(log(n)) | Space O(1)
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
    const result = [];

    result.push(binarySearch(true, nums, target));
    result.push(binarySearch(false, nums, target));

    return result;
};

var binarySearch = (isLeftBias, nums, target) => {
    let left = 0;
    let right = nums.length - 1;
    let index = -1;

    while (left <= right) {
        const mid = (left + right) >> 1;

        if (target > nums[mid]) {
            left = mid + 1;
        }
        if (target < nums[mid]) {
            right = mid - 1;
        }

        const isTarget = target === nums[mid];
        if (isTarget) {
            if (isLeftBias) {
                index = mid;
                right = mid - 1;
            } else {
                index = mid;
                left = mid + 1;
            }
        }
    }
    return index;
};

module.exports = { searchRange };

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
    assert.deepStrictEqual(searchRange([5, 7, 7, 8, 8, 10], 8), [3, 4]);
    assert.deepStrictEqual(searchRange([5, 7, 7, 8, 8, 10], 6), [(-1), (-1)]);
}
