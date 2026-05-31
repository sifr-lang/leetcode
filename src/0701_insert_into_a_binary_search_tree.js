function TreeNode(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
}

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * h = height of the tree, could be n.
 * Time O(h) | Space O(h)
 * @param {TreeNode} root
 * @param {number} val
 * @return {TreeNode}
 */
var insertIntoBST = function (root, val) {
    return dfs(root, val);
};

const dfs = (root, val) => {
    if (!root) {
        return new TreeNode(val);
    }
    if (val > root.val) {
        root.right = dfs(root.right, val);
        return root;
    }
    root.left = dfs(root.left, val);
    return root;
};

module.exports = { insertIntoBST };

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
    assert.deepStrictEqual(treeToString(insertIntoBST(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(7, null, null)), 5)), treeToString(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(7, new TreeNode(5, null, null), null))));
    assert.deepStrictEqual(treeToString(insertIntoBST(new TreeNode(40, new TreeNode(20, new TreeNode(10, null, null), new TreeNode(30, null, null)), new TreeNode(60, new TreeNode(50, null, null), new TreeNode(70, null, null))), 25)), treeToString(new TreeNode(40, new TreeNode(20, new TreeNode(10, null, null), new TreeNode(30, new TreeNode(25, null, null), null)), new TreeNode(60, new TreeNode(50, null, null), new TreeNode(70, null, null)))));
    assert.deepStrictEqual(treeToString(insertIntoBST(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(7, null, null)), 5)), treeToString(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(7, new TreeNode(5, null, null), null))));
}
