/**
 * https://leetcode.com/problems/number-of-1-bits/
 * Time O(1) | Space (1)
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n) {
    let [bits, mask] = [0, 1];

    for (let i = 0; i < 32; i++) {
        const hasBit = (n & mask) !== 0;
        if (hasBit) bits++;

        mask <<= 1;
    }

    return bits;
};

/**
 * https://leetcode.com/problems/number-of-1-bits/
 * Time O(1) | Space (1)
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n, sum = 0) {
    while (n !== 0) {
        n &= n - 1;
        sum++;
    }

    return sum;
};

module.exports = { hammingWeight };

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
    assert.deepStrictEqual(hammingWeight(11), 3);
    assert.deepStrictEqual(hammingWeight(128), 1);
    assert.deepStrictEqual(hammingWeight(2147483645), 30);
}
