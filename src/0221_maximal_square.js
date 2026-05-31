function maximalSquare(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const cache = new Map();
    const helper = (r, c) => {
        if (r >= rows || c >= cols) return 0;
        const key = `${r},${c}`;
        if (!cache.has(key)) {
            const down = helper(r + 1, c);
            const right = helper(r, c + 1);
            const diag = helper(r + 1, c + 1);
            cache.set(key, matrix[r][c] === '1' ? 1 + Math.min(down, right, diag) : 0);
        }
        return cache.get(key);
    };
    helper(0, 0);
    let best = 0;
    for (const value of cache.values()) best = Math.max(best, value);
    return best * best;
}

module.exports = { maximalSquare };

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
    assert.deepStrictEqual(maximalSquare([["1", "0", "1", "0", "0"], ["1", "0", "1", "1", "1"], ["1", "1", "1", "1", "1"], ["1", "0", "0", "1", "0"]]), 4);
    assert.deepStrictEqual(maximalSquare([["0", "1"], ["1", "0"]]), 1);
    assert.deepStrictEqual(maximalSquare([["0"]]), 0);
}
