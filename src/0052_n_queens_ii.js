var totalNQueens = function (n) {
    let col = new Set();
    let posDiag = new Set(); // (r + c)
    let negDiag = new Set(); // (r - c)

    let board = new Array(n).fill().map(() => new Array(n).fill('.'));
    let res = 0;

    function backtrack(r) {
        if (r === n) {
            res += 1;
            return;
        }

        for (let c = 0; c < n; c++) {
            if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) {
                continue;
            }

            col.add(c);
            posDiag.add(r + c);
            negDiag.add(r - c);

            backtrack(r + 1);

            col.delete(c);
            posDiag.delete(r + c);
            negDiag.delete(r - c);
        }
    }
    backtrack(0);
    return res;
};

module.exports = { totalNQueens };

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
    assert.deepStrictEqual(totalNQueens(4), 2);
    assert.deepStrictEqual(totalNQueens(1), 1);
}
