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
 * Recursion | Tree
 * Time O(n) | Space O(n)
 * https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
    let globleIdx = inorder.length - 1;

    const dfs = (start, end) => {
        if (start === end) {
            globleIdx--;
            return new TreeNode(inorder[start]);
        }

        if (start > end) return null;

        let i = start;

        while (i < end + 1) {
            if (inorder[i] === postorder[globleIdx]) break;
            i++;
        }

        globleIdx--;
        const currRoot = new TreeNode(inorder[i]);

        currRoot.right = dfs(i + 1, end);
        currRoot.left = dfs(start, i - 1);

        return currRoot;
    };

    return dfs(0, globleIdx);
};

module.exports = { buildTree };

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
    assert.deepStrictEqual(treeToString(buildTree([9, 3, 15, 20, 7], [9, 15, 7, 20, 3])), "3(9(None,None),20(15(None,None),7(None,None)))");
    assert.deepStrictEqual(treeToString(buildTree([(-1)], [(-1)])), "-1(None,None)");
}
