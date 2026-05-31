/**
 * Additional Space
 * Array - Tabulation
 * Time O(ROWS * COLS) | Space (ROWS + COLS)
 * https://leetcode.com/problems/set-matrix-zeroes/
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
    const [rows, cols] = [matrix.length, matrix[0].length];
    const [_row, _col] = initTabu(rows, cols); /* Space (ROWS + COLS) */

    fillPlacements(
        matrix,
        _row,
        _col,
    ); /* Time O(ROWS * COLS) | Space (ROWS + COLS) */
    setZero(matrix, _row, _col); /* Time O(ROWS * COLS) */
};

const initTabu = (rows, cols) => [
    new Array(rows).fill(1) /* Space O(ROWS) */,
    new Array(cols).fill(1) /* Space O(COLS) */,
];

const fillPlacements = (matrix, _row, _col) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time (ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time (COLS) */
            const isZero = matrix[row][col] === 0;
            if (!isZero) continue;

            _row[row] = 0; /* Space (ROWS) */
            _col[col] = 0; /* Space (COLS) */
        }
    }
};

const setZero = (matrix, _row, _col) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time (ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time (COLS) */
            const canSet = _row[row] === 0 || _col[col] === 0;
            if (!canSet) continue;

            matrix[row][col] = 0;
        }
    }
};

/**
 * Constant Space
 * Time O(ROWS * COLS) | Space (1)
 * https://leetcode.com/problems/set-matrix-zeroes/
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = (matrix) => {
    const _isColZero = isColZero(matrix); /* Time O(ROWS) */

    setEdgesToZero(matrix); /* Time O(ROWS) */
    setCellsToZero(matrix, _isColZero); /* Time O(ROWS * COLS) */
};

var isColZero = (matrix) =>
    matrix.some((row) => row[0] === 0); /* Time O(ROWS) */

var setEdgesToZero = (matrix) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time (ROWS) */
        for (let col = 1; col < cols; col++) {
            /* Time (COLS) */
            const canSet = matrix[row][col] === 0;
            if (!canSet) continue;

            matrix[row][0] = 0;
            matrix[0][col] = 0;
        }
    }
};

var setCellsToZero = (matrix, isColZero) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = rows - 1; 0 <= row; row--) {
        /* Time (ROWS) */
        for (let col = cols - 1; 1 <= col; col--) {
            /* Time (COLS) */
            if (!isZero(matrix, row, col)) continue;

            matrix[row][col] = 0;
        }

        if (isColZero) matrix[row][0] = 0;
    }
};

var isZero = (matrix, row, col) => {
    const [rowLeftEdge, colTopEdge] = [matrix[row][0], matrix[0][col]];

    return rowLeftEdge === 0 || colTopEdge === 0;
};

/**
 * Constant Space
 * Time O(ROWS * COLS) | Space (1)
 * https://leetcode.com/problems/set-matrix-zeroes/
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = (matrix) => {
    const isColZero = setEdgesToZero(matrix); /* Time O(ROWS * COLS) */

    setCellsToZero(matrix); /* Time O(ROWS * COLS) */

    const isZero = matrix[0][0] === 0;
    if (isZero) setFirstRowZero(matrix); /* Time O(COLS) */

    if (isColZero) setFirstColZero(matrix); /* Time O(ROWS) */
};

var setCellsToZero = (matrix) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 1; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 1; col < cols; col++) {
            /* Time O(COLS) */
            const isZero = matrix[row][0] === 0 || matrix[0][col] == 0;
            if (!isZero) continue;

            matrix[row][col] = 0;
        }
    }
};

var setEdgesToZero = (matrix, isColZero = false) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        if (matrix[row][0] === 0) isColZero = true;

        for (let col = 1; col < cols; col++) {
            /* Time O(COLS) */
            const canSet = matrix[row][col] === 0;
            if (!canSet) continue;

            matrix[0][col] = 0;
            matrix[row][0] = 0;
        }
    }

    return isColZero;
};

var setFirstRowZero = (matrix, cols = matrix[0].length) => {
    for (let col = 0; col < cols; col++) {
        /* Time O(COLS) */
        matrix[0][col] = 0;
    }
};

var setFirstColZero = (matrix, rows = matrix.length) => {
    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        matrix[row][0] = 0;
    }
};

module.exports = { setZeroes };

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
    let arg0 = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
    let _result = setZeroes(arg0);
    assert.deepStrictEqual(arg0, [[1, 0, 1], [0, 0, 0], [1, 0, 1]]);
    arg0 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]];
    _result = setZeroes(arg0);
    assert.deepStrictEqual(arg0, [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]);
}
