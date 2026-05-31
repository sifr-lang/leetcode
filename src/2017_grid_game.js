/**
 * Submission Details:
 * https://leetcode.com/problems/grid-game/
 * Time O(n), Space O(1)
 * Runtime: 89ms (beats 79.31%) || 53.5mb (beats 89.66%)
 */

/**
 * @param {number[][]} grid
 * @return {number}
 */

var gridGame = function (grid) {
    let one = grid[0].reduce((a, b) => a + b) - grid[0][0];
    let two = 0;
    let res = one;
    for (let i = 1; i < grid[0].length; i++) {
        one -= grid[0][i];
        two += grid[1][i - 1];
        res = Math.min(res, Math.max(one, two));
    }
    return res;
};

module.exports = { gridGame };

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
    assert.deepStrictEqual(gridGame([[2, 5, 4], [1, 5, 1]]), 4);
    assert.deepStrictEqual(gridGame([[3, 3, 1], [8, 5, 2]]), 4);
    assert.deepStrictEqual(gridGame([[1, 3, 1, 15], [1, 3, 3, 1]]), 7);
}
