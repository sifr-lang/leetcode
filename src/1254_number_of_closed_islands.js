function closedIsland(grid) {
    const r = grid.length;
    const c = grid[0].length;
    const seen = new Set();
    const dfs = (x, y) => {
        const key = `${x},${y}`;
        if (x < 0 || x >= r || y < 0 || y >= c || seen.has(key) || grid[x][y] === 1) return;
        seen.add(key);
        grid[x][y] = 1;
        dfs(x + 1, y);
        dfs(x, y + 1);
        dfs(x - 1, y);
        dfs(x, y - 1);
    };
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (i === 0 || j === 0 || i === r - 1 || j === c - 1) dfs(i, j);
        }
    }
    let ans = 0;
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            if (grid[i][j] === 0) {
                dfs(i, j);
                ans++;
            }
        }
    }
    return ans;
}

module.exports = { closedIsland };

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
    assert.deepStrictEqual(closedIsland([[1, 1, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 1, 1, 0], [1, 0, 1, 0, 1, 1, 1, 0], [1, 0, 0, 0, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1, 1, 0]]), 2);
    assert.deepStrictEqual(closedIsland([[0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [0, 1, 1, 1, 0]]), 1);
    assert.deepStrictEqual(closedIsland([[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 1, 1, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1]]), 2);
}
