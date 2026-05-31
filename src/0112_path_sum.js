// problem link https://leetcode.com/problems/path-sum/
// time complexity O(n) // whatever the number of nodes are.

var hasPathSum = function (root, targetSum) {
    if (!root) {
        return false;
    }
    const de = [[root, targetSum - root.val]];
    while (de.length) {
        const [node, currSum] = de.pop();
        if (!node.left && !node.right && currSum === 0) {
            return true;
        }
        if (node.right) {
            de.push([node.right, currSum - node.right.val]);
        }
        if (node.left) {
            de.push([node.left, currSum - node.left.val]);
        }
    }
    return false;
};

module.exports = { hasPathSum };

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
    let root = new TreeNode(5, new TreeNode(4, new TreeNode(11, new TreeNode(7), new TreeNode(2))), new TreeNode(8, new TreeNode(13), new TreeNode(4, null, new TreeNode(1))));
    assert.deepStrictEqual(hasPathSum(root, 22), true);
    assert.deepStrictEqual(hasPathSum(new TreeNode(1, new TreeNode(2), new TreeNode(3)), 5), false);
    assert.deepStrictEqual(hasPathSum(null, 0), false);
}
