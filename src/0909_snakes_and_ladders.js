/**
 * @param {number[][]} board
 * @return {number}
 */
var snakesAndLadders = function (board) {
    let n = board.length;
    let set = new Set();
    let getPos = (pos) => {
        let row = Math.floor((pos - 1) / n);
        let col = (pos - 1) % n;
        col = row % 2 == 1 ? n - 1 - col : col;
        row = n - 1 - row;
        return [row, col];
    };
    let q = [[1, 0]];
    while (q.length > 0) {
        [pos, moves] = q.shift();
        for (let i = 1; i < 7; i++) {
            let newPos = i + pos;
            let [r, c] = getPos(newPos);
            if (board[r][c] != -1) newPos = board[r][c];
            if (newPos == n * n) return moves + 1;
            if (!set.has(newPos)) {
                set.add(newPos);
                q.push([newPos, moves + 1]);
            }
        }
    }
    return -1;
};

module.exports = { snakesAndLadders };

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
    assert.deepStrictEqual(snakesAndLadders([[(-1), (-1), (-1), (-1), (-1), (-1)], [(-1), (-1), (-1), (-1), (-1), (-1)], [(-1), (-1), (-1), (-1), (-1), (-1)], [(-1), 35, (-1), (-1), 13, (-1)], [(-1), (-1), (-1), (-1), (-1), (-1)], [(-1), 15, (-1), (-1), (-1), (-1)]]), 4);
    assert.deepStrictEqual(snakesAndLadders([[(-1), (-1)], [(-1), 3]]), 1);
}
