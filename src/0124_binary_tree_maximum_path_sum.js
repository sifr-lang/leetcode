/**
 * https://leetcode.com/problems/binary-tree-maximum-path-sum/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function (root, maxValue = [-Infinity]) {
    pathSum(root, maxValue);

    return maxValue[0];
};

const pathSum = (root, maxValue) => {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return dfs(root, maxValue);
};

const dfs = (node, maxValue) => {
    const left = Math.max(0, pathSum(node.left, maxValue));
    const right = Math.max(0, pathSum(node.right, maxValue));
    const sum = left + right + node.val;

    maxValue[0] = Math.max(maxValue[0], sum);

    return Math.max(left, right) + node.val;
};

module.exports = { maxPathSum };

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
    assert.deepStrictEqual(maxPathSum(new TreeNode(1, new TreeNode(2, null, null), new TreeNode(3, null, null))), 6);
    assert.deepStrictEqual(maxPathSum(new TreeNode((-10), new TreeNode(9, null, null), new TreeNode(20, new TreeNode(15, null, null), new TreeNode(7, null, null)))), 42);
}
