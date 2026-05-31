/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} low
 * @param {number} high
 * @return {TreeNode}
 */
var trimBST = function (root, low, high) {
    if (!root) {
        return null;
    }

    if (root.val < low) {
        return trimBST(root.right, low, high);
    }

    if (root.val > high) {
        return trimBST(root.left, low, high);
    }

    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);

    return root;
};

module.exports = { trimBST };

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
    assert.deepStrictEqual(treeToString(trimBST(new TreeNode(1, new TreeNode(0, null, null), new TreeNode(2, null, null)), 1, 2)), treeToString(new TreeNode(1, null, new TreeNode(2, null, null))));
    assert.deepStrictEqual(treeToString(trimBST(new TreeNode(3, new TreeNode(0, null, new TreeNode(2, new TreeNode(1, null, null), null)), new TreeNode(4, null, null)), 1, 3)), treeToString(new TreeNode(3, new TreeNode(2, new TreeNode(1, null, null), null), null)));
}
