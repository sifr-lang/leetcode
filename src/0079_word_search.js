/**
 * https://leetcode.com/problems/word-search/
 * Time O(N * 3^L) | Space O(L)
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function (board, word) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (dfs(board, row, col, word, 0)) return true;
        }
    }

    return false;
};

const dfs = (board, row, col, word, index) => {
    if (index === word.length) return true;
    if (isOutOfBound(board, row, col)) return false;
    if (board[row][col] !== word[index]) return false;

    board[row][col] = '*';

    const hasWord = Object.values(directions(row, col)).filter(([r, c]) =>
        dfs(board, r, c, word, index + 1),
    ).length;

    board[row][col] = word[index];
    return hasWord;
};

const isOutOfBound = (board, row, col) => {
    const isRowOutOfBound = row < 0 || board.length - 1 < row;
    const isColOutOfBound = col < 0 || board[0].length - 1 < col;
    return isRowOutOfBound || isColOutOfBound;
};

const directions = (row, col) => ({
    up: [row - 1, col],
    down: [row + 1, col],
    left: [row, col - 1],
    right: [row, col + 1],
});

var exist = function (board, word) {
    const rows = board.length;
    const cols = board[0].length;
    const path = new Set();

    const dfs = (r, c, i) => {
        const key = `${r},${c}`;
        if (i === word.length) return true;
        if (
            Math.min(r, c) < 0 ||
            r >= rows ||
            c >= cols ||
            word[i] !== board[r][c] ||
            path.has(key)
        ) {
            return false;
        }
        path.add(key);
        const res = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        path.delete(key);
        return res;
    };

    const count = new Map();
    for (const row of board) {
        for (const char of row) count.set(char, (count.get(char) || 0) + 1);
    }
    if ((count.get(word[0]) || 0) > (count.get(word[word.length - 1]) || 0)) {
        word = word.split('').reverse().join('');
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
};

module.exports = { exist };

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
    assert.deepStrictEqual(exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCCED"), true);
    assert.deepStrictEqual(exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "SEE"), true);
    assert.deepStrictEqual(exist([["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]], "ABCB"), false);
}
