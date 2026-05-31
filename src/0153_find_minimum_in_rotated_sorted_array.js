/**
 * @param {number[]} nums
 * Time O(log(N)) | Space O(1)
 * @return {number}
 */
var findMin = function (nums) {
    let [left, right] = [0, nums.length - 1];

    while (left < right) {
        const mid = (left + right) >> 1;
        const guess = nums[mid];
        const [leftNum, rightNum] = [nums[left], nums[right]];

        const isTarget = leftNum < rightNum;
        if (isTarget) return leftNum;

        const isTargetGreater = leftNum <= guess;
        if (isTargetGreater) left = mid + 1;

        const isTargetLess = guess < leftNum;
        if (isTargetLess) right = mid;
    }

    return nums[left];
};

module.exports = { findMin };

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
    assert.deepStrictEqual(findMin([3, 4, 5, 1, 2]), 1);
    assert.deepStrictEqual(findMin([4, 5, 6, 7, 0, 1, 2]), 0);
}
