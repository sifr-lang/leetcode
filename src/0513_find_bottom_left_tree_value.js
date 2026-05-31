/**
 * PreOrder Traversal
 * Time O(n) | Space O(n) (because of the call stack space is O(n). If the tree has only left children then it's kind of  like a linkedList)
 * https://leetcode.com/problems/find-bottom-left-tree-value/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var findBottomLeftValue = function (root) {
    let leftVal = 0;
    let deepestLevel = -Infinity;

    const dfs = (node, level) => {
        if (!node.left && !node.right) {
            if (level > deepestLevel) {
                leftVal = node.val;
                deepestLevel = level;
            }
            return;
        }

        node.left && dfs(node.left, level + 1);
        node.right && dfs(node.right, level + 1);
    };

    dfs(root, 0);
    return leftVal;
};

module.exports = { findBottomLeftValue };

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
    assert.deepStrictEqual(findBottomLeftValue(new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null))), 1);
    assert.deepStrictEqual(findBottomLeftValue(new TreeNode(1, new TreeNode(2, new TreeNode(4, null, null), null), new TreeNode(3, new TreeNode(5, new TreeNode(7, null, null), null), new TreeNode(6, null, null)))), 7);
}
