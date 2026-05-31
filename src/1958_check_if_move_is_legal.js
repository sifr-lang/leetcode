var checkMove = function (board, rMove, cMove, color) {
    const ROWS = board.length,
        COLS = board[0].length;
    let direction = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
    ];
    board[rMove][cMove] = color;

    let legal = function (row, col, color, direc) {
        let dr = direc[0],
            dc = direc[1];
        row = row + dr;
        col = col + dc;
        let length = 1;

        while (0 <= row && row < ROWS && 0 <= col && col < COLS) {
            length += 1;
            if (board[row][col] == '.') return false;
            if (board[row][col] == color) return length >= 3;
            row = row + dr;
            col = col + dc;
        }
        return false;
    };

    for (const d of direction) if (legal(rMove, cMove, color, d)) return true;
    return false;
};

module.exports = { checkMove };

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
    assert.deepStrictEqual(checkMove([[".", ".", ".", "B", ".", ".", ".", "."], [".", ".", ".", "W", ".", ".", ".", "."], [".", ".", ".", "W", ".", ".", ".", "."], [".", ".", ".", "W", ".", ".", ".", "."], ["W", "B", "B", ".", "W", "W", "W", "B"], [".", ".", ".", "B", ".", ".", ".", "."], [".", ".", ".", "B", ".", ".", ".", "."], [".", ".", ".", "W", ".", ".", ".", "."]], 4, 3, "B"), true);
    assert.deepStrictEqual(checkMove([[".", ".", ".", ".", ".", ".", ".", "."], [".", "B", ".", ".", "W", ".", ".", "."], [".", ".", "W", ".", ".", ".", ".", "."], [".", ".", ".", "W", "B", ".", ".", "."], [".", ".", ".", ".", ".", ".", ".", "."], [".", ".", ".", ".", "B", "W", ".", "."], [".", ".", ".", ".", ".", ".", "W", "."], [".", ".", ".", ".", ".", ".", ".", "B"]], 4, 4, "W"), false);
}
