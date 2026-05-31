/**
 * https://leetcode.com/problems/invert-binary-tree/
 * TIme O(N) | Space O(N)
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = (root) => {
    const isBaseCase = root === null;
    if (isBaseCase) return root;

    return dfs(root);
};

const dfs = (root) => {
    const left = invertTree(root.left);
    const right = invertTree(root.right);

    root.left = right;
    root.right = left;

    return root;
};

/**
 * https://leetcode.com/problems/invert-binary-tree/
 * TIme O(N) | Space O(W)
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = (root) => {
    const isBaseCase = root === null;
    if (isBaseCase) return root;

    bfs([root]);

    return root;
};

const bfs = (queue) => {
    while (queue.length) {
        for (let i = queue.length - 1; 0 <= i; i--) {
            const node = queue.shift();
            const left = node.right;
            const right = node.left;

            node.left = left;
            node.right = right;

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
};

var invertTree = (root) => {
    if (!root) {
        return null;
    }
    const left = root.left;
    root.left = root.right;
    root.right = left;
    invertTree(root.left);
    invertTree(root.right);
    return root;
};

module.exports = { invertTree };

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
    assert.deepStrictEqual(treeToString(invertTree(new TreeNode(4, new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)), new TreeNode(7, new TreeNode(6, null, null), new TreeNode(9, null, null))))), treeToString(new TreeNode(4, new TreeNode(7, new TreeNode(9, null, null), new TreeNode(6, null, null)), new TreeNode(2, new TreeNode(3, null, null), new TreeNode(1, null, null)))));
    assert.deepStrictEqual(treeToString(invertTree(new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null)))), treeToString(new TreeNode(2, new TreeNode(3, null, null), new TreeNode(1, null, null))));
    assert.deepStrictEqual(invertTree(null), null);
}
