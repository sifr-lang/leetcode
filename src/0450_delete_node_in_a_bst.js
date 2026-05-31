/**
 * Recursion
 * h = height of the tree;
 * Time O(h) | Space O(h)
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function (root, key) {
    if (!root) return root;

    if (key === root.val) {
        if (!root.left) return root.right;
        if (!root.right) return root.left;

        // find the smallest val in right bst
        let curr = root.right;
        while (curr.left) {
            curr = curr.left;
        }
        // change the curr value
        root.val = curr.val;

        root.right = deleteNode(root.right, root.val);

        return root;
    }
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
        return root;
    }
    root.right = deleteNode(root.right, key);
    return root;
};

module.exports = { deleteNode };

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
    assert.deepStrictEqual(treeToString(deleteNode(new TreeNode(5, new TreeNode(3, new TreeNode(2, null, null), new TreeNode(4, null, null)), new TreeNode(6, null, new TreeNode(7, null, null))), 3)), treeToString(new TreeNode(5, new TreeNode(4, new TreeNode(2, null, null), null), new TreeNode(6, null, new TreeNode(7, null, null)))));
    assert.deepStrictEqual(treeToString(deleteNode(new TreeNode(5, new TreeNode(3, new TreeNode(2, null, null), new TreeNode(4, null, null)), new TreeNode(6, null, new TreeNode(7, null, null))), 0)), treeToString(new TreeNode(5, new TreeNode(3, new TreeNode(2, null, null), new TreeNode(4, null, null)), new TreeNode(6, null, new TreeNode(7, null, null)))));
    assert.deepStrictEqual(deleteNode(null, 0), null);
}
