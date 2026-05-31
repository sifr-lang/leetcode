/**
 * @param {number[][]} mat
 * @return {number}
 */
var diagonalSum = function (mat) {
    let sum = 0; // initialize sum to zero
    let n = mat.length - 1; // initialize n to mat length - 1
    for (let i = 0; i <= n; i++) {
        // loop through to 0 to n
        sum += mat[i][i]; // add mat[i][i] to sum
        if (i !== n - i) {
            // if i not equal to n - i then add mat[i][n - i] to sum
            sum += mat[i][n - i];
        }
    }
    return sum; // return sum;
};

module.exports = { diagonalSum };

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
    assert.deepStrictEqual(diagonalSum([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), 25);
}
