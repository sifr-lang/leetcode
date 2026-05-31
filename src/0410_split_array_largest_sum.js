/**
 * https://leetcode.com/problems/split-array-largest-sum/
 *
 * Binary Search
 * Time O(log(s)*n) (s = difference between the least and max possible value) | Space O(1)
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var splitArray = function (nums, k) {
    let left = Math.max(...nums);
    let right = nums.reduce((acc, num) => acc + num, 0);
    let result = right;
    while (left <= right) {
        const mid = (left + right) >> 1;
        if (canSplit(mid)) {
            result = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    function canSplit(largest) {
        let splitCount = 0;
        let currSum = 0;

        for (let i = 0; i < nums.length; i++) {
            currSum += nums[i];
            if (currSum > largest) {
                currSum = nums[i];
                splitCount++;
            }
        }

        return splitCount + 1 <= k;
    }

    return result;
};

module.exports = { splitArray };

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
    assert.deepStrictEqual(splitArray([7, 2, 5, 10, 8], 2), 18);
}
