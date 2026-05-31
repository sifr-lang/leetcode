/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * DFS (level order traversal)
 * Time O(n) | Space O(n)
 * https://leetcode.com/problems/minimum-distance-between-bst-nodes/
 * @param {TreeNode} root
 * @return {number}
 */
var minDiffInBST = function (root) {
    // levelOrderTraversal
    const sortedArr = dfs(root, []);

    let min = Infinity;
    for (let i = 1; i < sortedArr.length; i++) {
        min = Math.min(min, sortedArr[i] - sortedArr[i - 1]);
    }
    return min;
};

const dfs = (node, sortedArr) => {
    if (!node) return;

    dfs(node.left, sortedArr);
    sortedArr.push(node.val);
    dfs(node.right, sortedArr);

    return sortedArr;
};

var minDiffInBST = function (root) {
    let currSmallest = Infinity;
    let prev = null;

    const inorder = (node) => {
        if (node === null) {
            return;
        }
        inorder(node.left);
        if (prev !== null) {
            currSmallest = Math.min(currSmallest, node.val - prev.val);
        }
        prev = node;
        inorder(node.right);
    };

    inorder(root);
    return currSmallest;
};

module.exports = { minDiffInBST };

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
    assert.deepStrictEqual(minDiffInBST(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(6, null, null))), 1);
    assert.deepStrictEqual(minDiffInBST(new TreeNode(1, new TreeNode(0, null, null), new TreeNode(48, new TreeNode(12, null, null), new TreeNode(49, null, null)))), 1);
}
