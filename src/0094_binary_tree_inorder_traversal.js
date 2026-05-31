/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 * this.val   = (val===undefined ? 0 : val)
 * this.left  = (left===undefined ? null : left)
 * this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root, list = []) {
    if (!root) return [];

    inorderTraversal(root.left, list);
    list.push(root.val);
    inorderTraversal(root.right, list);

    return list;
};

module.exports = { inorderTraversal };

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
    assert.deepStrictEqual(inorderTraversal(new TreeNode(1, null, new TreeNode(2, new TreeNode(3, null, null), null))), [1, 3, 2]);
    assert.deepStrictEqual(inorderTraversal(new TreeNode(1, new TreeNode(2, new TreeNode(4, null, null), new TreeNode(5, new TreeNode(6, null, null), new TreeNode(7, null, null))), new TreeNode(3, null, new TreeNode(8, new TreeNode(9, null, null), null)))), [4, 2, 6, 5, 7, 1, 3, 9, 8]);
    assert.deepStrictEqual(inorderTraversal(null), []);
}
