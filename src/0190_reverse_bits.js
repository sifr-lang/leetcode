/**
 * https://leetcode.com/problems/reverse-bits/
 * Time O(1) | Space O(1)
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function (n, bit = 0) {
    for (let i = 0; i < 32; i++) {
        bit <<= 1; // Double * 2
        bit |= n & 1; // Flip
        n >>= 1; // Reduce * 0.5
    }

    return bit >>> 0;
};

module.exports = { reverseBits };

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
    assert.deepStrictEqual(reverseBits(43261596), 964176192);
    assert.deepStrictEqual(reverseBits(4294967293), 3221225471);
}
