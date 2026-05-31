//https://leetcode.com/problems/concatenation-of-array/description/

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var getConcatenation = function (nums) {
    let res = [];
    for (let i = 0; i < nums.length * 2; i++) {
        res.push(nums[i % nums.length]);
    }
    return res;
};

module.exports = { getConcatenation };

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
    assert.deepStrictEqual(getConcatenation([1, 2, 1]), [1, 2, 1, 1, 2, 1]);
    assert.deepStrictEqual(getConcatenation([1, 3, 2, 1]), [1, 3, 2, 1, 1, 3, 2, 1]);
}
