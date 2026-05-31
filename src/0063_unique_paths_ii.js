function uniquePathsWithObstacles(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(n).fill(0);
    dp[n - 1] = 1;
    for (let r = m - 1; r >= 0; r--) {
        for (let c = n - 1; c >= 0; c--) {
            if (grid[r][c]) {
                dp[c] = 0;
            } else if (c + 1 < n) {
                dp[c] = dp[c] + dp[c + 1];
            }
        }
    }
    return dp[0];
}

module.exports = { uniquePathsWithObstacles };

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
    assert.deepStrictEqual(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), 2);
}
