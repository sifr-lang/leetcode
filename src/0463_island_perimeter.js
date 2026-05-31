var islandPerimeter = function (grid) {
    const visit = new Set();

    const dfs = function (i, j) {
        if (
            i >= grid.length ||
            j >= grid[0].length ||
            i < 0 ||
            j < 0 ||
            grid[i][j] == 0
        )
            return 1;
        let flatCoord = i * grid[0].length + j;
        if (visit.has(flatCoord)) return 0;

        visit.add(flatCoord);
        let perim = dfs(i, j + 1);
        perim += dfs(i + 1, j);
        perim += dfs(i, j - 1);
        perim += dfs(i - 1, j);
        return perim;
    };

    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[0].length; j++)
            if (grid[i][j]) return dfs(i, j);
};

module.exports = { islandPerimeter };

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
    assert.deepStrictEqual(islandPerimeter([[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]]), 16);
    assert.deepStrictEqual(islandPerimeter([[1]]), 4);
    assert.deepStrictEqual(islandPerimeter([[1, 0]]), 4);
}
