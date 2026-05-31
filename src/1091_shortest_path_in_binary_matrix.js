function shortestPathBinaryMatrix(grid) {
    const n = grid.length;
    const q = [[0, 0, 1]];
    let head = 0;
    const visit = new Set(['0,0']);
    const direct = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
    while (head < q.length) {
        const [r, c, length] = q[head++];
        if (Math.min(r, c) < 0 || Math.max(r, c) >= n || grid[r][c]) continue;
        if (r === n - 1 && c === n - 1) return length;
        for (const [dr, dc] of direct) {
            const nr = r + dr;
            const nc = c + dc;
            const key = `${nr},${nc}`;
            if (!visit.has(key)) {
                q.push([nr, nc, length + 1]);
                visit.add(key);
            }
        }
    }
    return -1;
}

module.exports = { shortestPathBinaryMatrix };

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
    assert.deepStrictEqual(shortestPathBinaryMatrix([[0, 1], [1, 0]]), 2);
    assert.deepStrictEqual(shortestPathBinaryMatrix([[0, 0, 0], [1, 1, 0], [1, 1, 0]]), 4);
    assert.deepStrictEqual(shortestPathBinaryMatrix([[1, 0, 0], [1, 1, 0], [1, 1, 0]]), (-1));
}
