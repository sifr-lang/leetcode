//////////////////////////////////////////////////////////////////////////////
// Two level Binary search
// Time: O(log(m) + log(n))  Space: O(1)
//////////////////////////////////////////////////////////////////////////////
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    let [rows, cols] = [matrix.length, matrix[0].length];
    let [top, bot] = [0, rows - 1];

    while (top <= bot) {
        let row = Math.floor((top + bot) / 2);
        if (target > matrix[row][cols - 1]) {
            top = row + 1;
        } else if (target < matrix[row][0]) {
            bot = row - 1;
        } else {
            break;
        }
    }

    if (!(top <= bot)) {
        return false;
    }

    let row = Math.floor((top + bot) / 2);
    let [l, r] = [0, cols - 1];
    while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (target > matrix[row][m]) {
            l = m + 1;
        } else if (target < matrix[row][m]) {
            r = m - 1;
        } else if (target == matrix[row][m]) {
            return true;
        }
    }
    return false;
};

//////////////////////////////////////////////////////////////////////////////
// Single Binary Search
// Time: O(log(mn))  Space: O(1)
//////////////////////////////////////////////////////////////////////////////

/**
 * @param {number[][]} matrix
 * @param {number} target
 * Time O(log(ROWS * COLS)) | Space O(1)
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    let top = 0;
    let bot = rows - 1;
    while (top <= bot) {
        const row = Math.floor((top + bot) / 2);
        if (target > matrix[row][cols - 1]) {
            top = row + 1;
        } else if (target < matrix[row][0]) {
            bot = row - 1;
        } else {
            break;
        }
    }

    if (!(top <= bot)) {
        return false;
    }
    const row = Math.floor((top + bot) / 2);
    let l = 0;
    let r = cols - 1;
    while (l <= r) {
        const m = Math.floor((l + r) / 2);
        if (target > matrix[row][m]) {
            l = m + 1;
        } else if (target < matrix[row][m]) {
            r = m - 1;
        } else {
            return true;
        }
    }
    return false;
};

module.exports = { searchMatrix };

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
    assert.deepStrictEqual(searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3), true);
    assert.deepStrictEqual(searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13), false);
}
