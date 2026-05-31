/**
 * InOrder Traversal
 * Time O(n) | Space O(n)
 * https://leetcode.com/problems/construct-string-from-binary-tree/
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string}
 */
var tree2str = function (root) {
    return dfs(root, []).join('');
};

const dfs = (node, strArr) => {
    if (!node) return;

    strArr.push(node.val);

    if (node.right || node.left) strArr.push('(');
    dfs(node.left, strArr);
    if (node.right || node.left) strArr.push(')');

    // right tree
    if (node.right) strArr.push('(');
    dfs(node.right, strArr);
    if (node.right) strArr.push(')');

    return strArr;
};

module.exports = { tree2str };

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
    assert.deepStrictEqual(tree2str(new TreeNode(1, new TreeNode(2, new TreeNode(4, null, null), null), new TreeNode(3, null, null))), "1(2(4))(3)");
    assert.deepStrictEqual(tree2str(new TreeNode(1, new TreeNode(2, null, new TreeNode(4, null, null)), new TreeNode(3, null, null))), "1(2()(4))(3)");
}
