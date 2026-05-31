/**
 * https://leetcode.com/problems/check-if-a-string-contains-all-binary-codes-of-size-k/
 *
 * Hashing
 * Time O(n*k) | Space O(2^k) (it can't get any bigger than 2^k in the worst case)
 * @param {string} s
 * @param {number} k
 * @return {boolean}
 */
var hasAllCodes = function (s, k) {
    const bitSet = new Set();

    for (let i = 0; i < s.length; i++) {
        if (s.substring(i, i + k).length === k) {
            bitSet.add(s.substring(i, i + k));
        }
    }

    return bitSet.size === 1 << k;
};

module.exports = { hasAllCodes };

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
    assert.deepStrictEqual(hasAllCodes("00110110", 2), true);
    assert.deepStrictEqual(hasAllCodes("0110", 1), true);
    assert.deepStrictEqual(hasAllCodes("0110", 2), false);
}
