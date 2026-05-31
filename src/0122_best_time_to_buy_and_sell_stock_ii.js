// problem link https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii
// time coplexity O(n)

var maxProfit = function (prices) {
    let maxProfit = 0;
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < prices[i + 1]) {
            maxProfit += prices[i + 1] - prices[i];
        }
    }

    return maxProfit;
};

module.exports = { maxProfit };

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
    assert.deepStrictEqual(maxProfit([7, 1, 5, 3, 6, 4]), 7);
    assert.deepStrictEqual(maxProfit([1, 2, 3, 4, 5]), 4);
    assert.deepStrictEqual(maxProfit([7, 6, 4, 3, 1]), 0);
}
