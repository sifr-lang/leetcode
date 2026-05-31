/**
 * https://leetcode.com/problems/counting-bits/
 * Time O(N) | Space (1)
 * @param {number} n
 * @return {number[]}
 */
var countBits = function (n, dp = [0]) {
    for (let i = 1; i < n + 1; i++) {
        const [mid, bit] = [i >> 1, i & 1];
        const bits = dp[mid] + bit;

        dp.push(bits);
    }

    return dp;
};

var countBits = function (n) {
    const res = new Array(n + 1).fill(0);
    for (let i = 1; i < n + 1; i++) {
        if (i % 2 === 1) {
            res[i] = res[i - 1] + 1;
        } else {
            res[i] = res[Math.floor(i / 2)];
        }
    }
    return res;
};

module.exports = { countBits };

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
    assert.deepStrictEqual(countBits(2), [0, 1, 1]);
    assert.deepStrictEqual(countBits(5), [0, 1, 1, 2, 1, 2]);
}
