function TreeNode(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
/**
 * https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * Time O(N^2) | Space(H)
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
    const isBaseCase = !preorder.length || !inorder.length;
    if (isBaseCase) return null;

    return dfs(preorder, inorder);
};

var dfs = (preorder, inorder) => {
    const { leftInorder, mid, rightInorder } = getPointers(preorder, inorder);
    const root = new TreeNode(inorder[mid]);

    root.left = buildTree(preorder, leftInorder);
    root.right = buildTree(preorder, rightInorder);

    return root;
};

const getPointers = (preorder, inorder) => {
    const next = preorder.shift();
    const mid = inorder.indexOf(next);
    const leftInorder = inorder.slice(0, mid);
    const rightInorder = inorder.slice(mid + 1);

    return { leftInorder, mid, rightInorder };
};

/**
 * https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
 * Time O(N) | Space(H)
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (
    preorder,
    inorder,
    max = -Infinity,
    indices = { preorder: 0, inorder: 0 },
) {
    const isBaseCase = preorder.length <= indices.inorder;
    if (isBaseCase) return null;

    const isAtEnd = inorder[indices.inorder] === max;
    if (isAtEnd) {
        indices.inorder++;
        return null;
    }

    return dfs(preorder, inorder, max, indices);
};

var dfs = (preorder, inorder, max, indices) => {
    const val = preorder[indices.preorder++];
    const root = new TreeNode(val);

    root.left = buildTree(preorder, inorder, root.val, indices);
    root.right = buildTree(preorder, inorder, max, indices);

    return root;
};

var buildTree = function (preorder, inorder) {
    if (!preorder.length || !inorder.length) {
        return null;
    }

    const root = new TreeNode(preorder[0]);
    const mid = inorder.indexOf(preorder[0]);
    root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
    root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
    return root;
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
    assert.deepStrictEqual(treeToString(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])), "3(9(None,None),20(15(None,None),7(None,None)))");
    assert.deepStrictEqual(treeToString(buildTree([(-1)], [(-1)])), "-1(None,None)");
}
