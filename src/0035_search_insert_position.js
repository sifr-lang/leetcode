/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        let midIdx = Math.floor((left + right) / 2);
        if (target === nums[midIdx]) {
            return midIdx;
        }

        if (target > nums[midIdx]) {
            left = midIdx + 1;
        } else {
            right = midIdx - 1;
        }
    }

    return left;
};

module.exports = { searchInsert };

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
    assert.deepStrictEqual(searchInsert([1, 3, 5, 6], 5), 2);
    assert.deepStrictEqual(searchInsert([1, 3, 5, 6], 2), 1);
    assert.deepStrictEqual(searchInsert([1, 3, 5, 6], 7), 4);
}
