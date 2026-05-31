/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * DFS | Tree-trevarsal
 * Time O(n) | Space O(n)
 * https://leetcode.com/problems/symmetric-tree/
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function (root) {
    return dfs(root.left, root.right);
};

const dfs = (node1, node2) => {
    if (!node1 && !node2) return true;

    if (node1 && !node2) return false;
    if (!node1 && node2) return false;
    if (node1.val !== node2.val) return false;

    return dfs(node1.right, node2.left) && dfs(node1.left, node2.right);
};

module.exports = { isSymmetric };

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
    assert.deepStrictEqual(isSymmetric(new TreeNode(1, new TreeNode(2, new TreeNode(3, null, null), new TreeNode(4, null, null)), new TreeNode(2, new TreeNode(4, null, null), new TreeNode(3, null, null)))), true);
    assert.deepStrictEqual(isSymmetric(new TreeNode(1, new TreeNode(2, null, new TreeNode(3, null, null)), new TreeNode(2, null, new TreeNode(3, null, null)))), false);
}
