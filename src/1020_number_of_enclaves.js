function numEnclaves(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const dfs = (row, col) => {
        if (row >= 0 && row < rows && col >= 0 && col < cols && grid[row][col] === 1) {
            grid[row][col] = 0;
            dfs(row + 1, col);
            dfs(row - 1, col);
            dfs(row, col + 1);
            dfs(row, col - 1);
        }
    };
    for (let row = 0; row < rows; row++) {
        dfs(row, 0);
        dfs(row, cols - 1);
    }
    for (let col = 0; col < cols; col++) {
        dfs(0, col);
        dfs(rows - 1, col);
    }
    let total = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === 1) total++;
        }
    }
    return total;
}

module.exports = { numEnclaves };

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
    assert.deepStrictEqual(numEnclaves([[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]), 3);
    assert.deepStrictEqual(numEnclaves([[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]), 0);
}
