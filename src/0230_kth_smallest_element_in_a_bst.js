/**
 * https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 * Time O(N + K) | Space O(H)
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k, inOrder = []) {
    if (!root) return inOrder;

    return dfs(root, k, inOrder);
};

const dfs = (root, k, inOrder) => {
    if (root.left) kthSmallest(root.left, k, inOrder);

    inOrder.push(root.val);

    if (root.right) kthSmallest(root.right, k, inOrder);

    return inOrder[k - 1];
};

/**
 * https://leetcode.com/problems/kth-smallest-element-in-a-bst/
 * Time O(N + K) | Space O(H)
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k, stack = []) {
    while (k--) {
        root = moveLeft(root, stack);

        const isSmallest = k === 0;
        if (isSmallest) return root.val;

        root = root.right;
    }
};

const moveLeft = (root, stack) => {
    while (root !== null) {
        stack.push(root);
        root = root.left;
    }

    return stack.pop();
};

module.exports = { kthSmallest };

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
    assert.deepStrictEqual(kthSmallest(new TreeNode(3, new TreeNode(1, null, new TreeNode(2, null, null)), new TreeNode(4, null, null)), 1), 1);
    assert.deepStrictEqual(kthSmallest(new TreeNode(5, new TreeNode(3, new TreeNode(2, new TreeNode(1, null, null), null), new TreeNode(4, null, null)), new TreeNode(6, null, null)), 3), 3);
}
