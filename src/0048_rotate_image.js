/**
 * Time O(ROWS * COLS) | Space O(1)
 * https://leetcode.com/problems/rotate-image/
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = (matrix) => {
    transpose(matrix); /* Time O(ROWS * COLS) */
    reflect(matrix); /* Time O(ROWS * COLS) */
};

var transpose = (matrix) => {
    const rows = matrix.length;

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = row + 1; col < rows; col++) {
            /* Time O(COLS) */
            swap1(matrix, row, col);
        }
    }
};

var swap1 = (matrix, row, col) =>
    ([matrix[row][col], matrix[col][row]] = [
        matrix[col][row],
        matrix[row][col],
    ]);

var reflect = (matrix) => {
    const rows = matrix.length;

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < rows / 2; col++) {
            /* Time O(COLS) */
            const reflection = rows - col - 1;

            swap2(matrix, row, col, reflection);
        }
    }
};

var swap2 = (matrix, row, col, reflection) =>
    ([matrix[row][col], matrix[row][reflection]] = [
        matrix[row][reflection],
        matrix[row][col],
    ]);

/**
 * Time O(ROWS * COLS) | Space O(1)
 * https://leetcode.com/problems/rotate-image/
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = (matrix) => {
    reverse(matrix); /* Time O(ROWS) */
    transpose(matrix); /* Time O(ROWS * COLS) */
};

var reverse = (matrix) => matrix.reverse();

var transpose = (matrix) => {
    const rows = matrix.length;

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < row; col++) {
            /* Time O(COLS) */
            swap(matrix, row, col);
        }
    }
};

var swap = (matrix, row, col) =>
    ([matrix[row][col], matrix[col][row]] = [
        matrix[col][row],
        matrix[row][col],
    ]);

var rotate = (matrix) => {
    let l = 0;
    let r = matrix.length - 1;
    while (l < r) {
        for (let i = 0; i < r - l; i++) {
            const top = l;
            const bottom = r;
            const topLeft = matrix[top][l + i];
            matrix[top][l + i] = matrix[bottom - i][l];
            matrix[bottom - i][l] = matrix[bottom][r - i];
            matrix[bottom][r - i] = matrix[top + i][r];
            matrix[top + i][r] = topLeft;
        }
        r -= 1;
        l += 1;
    }
};

module.exports = { rotate };

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
    let arg0 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    let _result = rotate(arg0);
    assert.deepStrictEqual(arg0, [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
    arg0 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]];
    _result = rotate(arg0);
    assert.deepStrictEqual(arg0, [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]);
}
