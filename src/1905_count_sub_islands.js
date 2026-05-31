var countSubIslands = function (grid1, grid2) {
    let ROWS = grid1.length,
        COLS = grid1[0].length;
    let visit = new Set();

    const dfs = function (r, c) {
        let flatCoord = r * COLS + c;
        if (
            r < 0 ||
            c < 0 ||
            r == ROWS ||
            c == COLS ||
            grid2[r][c] == 0 ||
            visit.has(flatCoord)
        )
            return true;

        visit.add(flatCoord);
        let res = true;
        if (grid1[r][c] == 0) res = false;

        res = dfs(r - 1, c) && res;
        res = dfs(r + 1, c) && res;
        res = dfs(r, c - 1) && res;
        res = dfs(r, c + 1) && res;
        return res;
    };

    let count = 0;
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (grid2[r][c] && !visit.has(r * COLS + c) && dfs(r, c))
                count += 1;
    return count;
};

module.exports = { countSubIslands };

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
    assert.deepStrictEqual(countSubIslands([[1, 1, 1, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 0, 1, 1]], [[1, 1, 1, 0, 0], [0, 0, 1, 1, 1], [0, 1, 0, 0, 0], [1, 0, 1, 1, 0], [0, 1, 0, 1, 0]]), 3);
    assert.deepStrictEqual(countSubIslands([[1, 0, 1, 0, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [1, 0, 1, 0, 1]], [[0, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1]]), 2);
}
