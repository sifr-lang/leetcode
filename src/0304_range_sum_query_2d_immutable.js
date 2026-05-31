/**
 * https://leetcode.com/problems/range-sum-query-2d-immutable/
 * @class NumMatrix
 * @param {number[][]} matrix
 */
class NumMatrix {
    constructor(matrix) {
        this.sum_ = new Array(matrix.length + 1)
            .fill(null)
            .map(() => new Array(matrix[0].length + 1).fill(0));
        for (let i = 0; i < matrix.length; i++) {
            let previous = 0;
            for (let j = 0; j < matrix[i].length; j++) {
                previous += matrix[i][j];
                const above = this.sum_[i][j + 1];
                this.sum_[i + 1][j + 1] = previous + above;
            }
        }
    }

    /**
     *
     * m = row2 - row1; n = col2 - col1
     * Time O(m*n) | Space O(1)
     * @param {number} row1
     * @param {number} col1
     * @param {number} row2
     * @param {number} col2
     * @return {number}
     */
    sumRegion(row1, col1, row2, col2) {
        const sumCol2 = this.sum_[row2 + 1][col2 + 1] - this.sum_[row1][col2 + 1];
        const sumCol1 = this.sum_[row2 + 1][col1] - this.sum_[row1][col1];
        return sumCol2 - sumCol1;
    }
}

/**
 * Your NumMatrix object will be instantiated and called as such:
 * var obj = new NumMatrix(matrix)
 * var param_1 = obj.sumRegion(row1,col1,row2,col2)
 */

module.exports = { NumMatrix };

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
    let obj = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);
    assert.deepStrictEqual(obj.sumRegion(2, 1, 4, 3), 8);
    assert.deepStrictEqual(obj.sumRegion(1, 1, 2, 2), 11);
    assert.deepStrictEqual(obj.sumRegion(1, 2, 2, 4), 12);
}
