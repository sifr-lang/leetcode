/**
 * https://leetcode.com/problems/diameter-of-binary-tree/
 * TIme O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {number}
 */
var diameterOfBinaryTree = function (root, max = [0]) {
    diameterOfTree(root, max);

    return max[0];
};

const diameterOfTree = (root, max) => {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return dfs(root, max);
};

const dfs = (root, max) => {
    const left = diameterOfTree(root.left, max);
    const right = diameterOfTree(root.right, max);

    const diameter = left + right;
    max[0] = Math.max(max[0], diameter);

    const height = Math.max(left, right);

    return height + 1;
};

module.exports = { diameterOfBinaryTree };

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
    assert.deepStrictEqual(diameterOfBinaryTree(new TreeNode(1, new TreeNode(2, new TreeNode(4, null, null), new TreeNode(5, null, null)), new TreeNode(3, null, null))), 3);
    assert.deepStrictEqual(diameterOfBinaryTree(new TreeNode(1, new TreeNode(2, null, null), null)), 1);
}
