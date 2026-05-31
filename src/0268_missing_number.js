/**
 * https://leetcode.com/problems/missing-number/
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function (nums, missingNumber = nums.length) {
    for (let i = 0; i < nums.length; i++) {
        const xor = i ^ nums[i];

        missingNumber ^= xor;
    }

    return missingNumber;
};

var missingNumber = function (nums) {
    let res = nums.length;
    for (let i = 0; i < nums.length; i++) {
        res += i - nums[i];
    }
    return res;
};

module.exports = { missingNumber };

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
    assert.deepStrictEqual(missingNumber([3, 0, 1]), 2);
    assert.deepStrictEqual(missingNumber([0, 1]), 2);
}
