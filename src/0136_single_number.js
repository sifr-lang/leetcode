/**
 * https://leetcode.com/problems/single-number/
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums, xor = 0) {
    for (num of nums) {
        xor ^= num;
    }

    return xor;
};

module.exports = { singleNumber };

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
    assert.deepStrictEqual(singleNumber([2, 2, 1]), 1);
    assert.deepStrictEqual(singleNumber([4, 1, 2, 1, 2]), 4);
}
