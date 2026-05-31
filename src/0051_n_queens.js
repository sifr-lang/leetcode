/**
 * https://leetcode.com/problems/n-queens/
 * Time O(N!) | Space O(N^2)
 * @param {number} n
 * @return {string[][]}
 */
function solveNQueens(
    n,
    colSet = new Set(),
    posDiagSet = new Set(),
    negDiagSet = new Set(),
) {
    const board = new Array(n).fill().map(() => new Array(n).fill('.'));

    return dfs(board, n, colSet, posDiagSet, negDiagSet);
}

const dfs = (board, n, colSet, posDiagSet, negDiagSet, row = 0, moves = []) => {
    const isBaseCase = row === n;
    if (isBaseCase) {
        const rows = board.map((_row) => _row.join(''));

        moves.push(rows);

        return moves;
    }

    for (let col = 0; col < n; col++) {
        const hasQueen =
            colSet.has(col) ||
            posDiagSet.has(row + col) ||
            negDiagSet.has(row - col);
        if (hasQueen) continue;

        backTrack(board, n, row, col, colSet, posDiagSet, negDiagSet, moves);
    }

    return moves;
};

const backTrack = (
    board,
    n,
    row,
    col,
    colSet,
    posDiagSet,
    negDiagSet,
    moves,
) => {
    colSet.add(col);
    posDiagSet.add(row + col);
    negDiagSet.add(row - col);
    board[row][col] = 'Q';

    dfs(board, n, colSet, posDiagSet, negDiagSet, row + 1, moves);

    colSet.delete(col);
    posDiagSet.delete(row + col);
    negDiagSet.delete(row - col);
    board[row][col] = '.';
};

module.exports = { solveNQueens };

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
    assert.deepStrictEqual(solveNQueens(4), [[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]]);
    assert.deepStrictEqual(solveNQueens(1), [["Q"]]);
}
