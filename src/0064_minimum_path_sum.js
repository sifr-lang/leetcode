function minPathSum(grid) {
    const m = grid.length;
    const n = grid[0].length;
    let prev = Array(n).fill(Infinity);
    prev[n - 1] = 0;
    for (let row = m - 1; row >= 0; row--) {
        const dp = Array(n).fill(Infinity);
        for (let col = n - 1; col >= 0; col--) {
            if (col < n - 1) dp[col] = Math.min(dp[col], dp[col + 1]);
            dp[col] = Math.min(dp[col], prev[col]) + grid[row][col];
        }
        prev = dp;
    }
    return prev[0];
}

module.exports = { minPathSum };

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
    assert.deepStrictEqual(minPathSum([[1, 3, 1], [1, 5, 1], [4, 2, 1]]), 7);
}
