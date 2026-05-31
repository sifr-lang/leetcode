var shiftGrid = function (grid, k) {
    const M = grid.length,
        N = grid[0].length;

    let posToVal = (r, c) => r * N + c;
    let valToPos = (v) => [Math.floor(v / N), v % N];

    res = [];
    for (let i = 0; i < M; i++) res.push([]);
    for (let r = 0; r < M; r++)
        for (let c = 0; c < N; c++) {
            let newVal = (posToVal(r, c) + k) % (M * N);
            let newRC = valToPos(newVal);
            res[newRC[0]][newRC[1]] = grid[r][c];
        }
    return res;
};

module.exports = { shiftGrid };

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
    assert.deepStrictEqual(shiftGrid([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 1), [[9, 1, 2], [3, 4, 5], [6, 7, 8]]);
    assert.deepStrictEqual(shiftGrid([[3, 8, 1, 9], [19, 7, 2, 5], [4, 6, 11, 10], [12, 0, 21, 13]], 4), [[12, 0, 21, 13], [3, 8, 1, 9], [19, 7, 2, 5], [4, 6, 11, 10]]);
    assert.deepStrictEqual(shiftGrid([[1, 2, 3], [4, 5, 6], [7, 8, 9]], 9), [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
}
