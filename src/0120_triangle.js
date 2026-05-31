function minimumTotal(triangle) {
    const dp = triangle[triangle.length - 1];
    for (let row = triangle.length - 2; row >= 0; row--) {
        for (let col = 0; col <= row; col++) {
            dp[col] = triangle[row][col] + Math.min(dp[col], dp[col + 1]);
        }
    }
    return dp[0];
}

module.exports = { minimumTotal };

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
    assert.deepStrictEqual(minimumTotal([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]]), 11);
}
