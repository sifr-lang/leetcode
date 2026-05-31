function TreeNode(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
/**
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 * Time complexity = O(n+m)
 */
var mergeTrees = function (root1, root2) {
    // Base case to return null as result of having both root1, root2 null
    if (!root1 && !root2) {
        return null;
    }

    const val1 = root1 ? root1.val : 0;
    const val2 = root2 ? root2.val : 0;

    const root = new TreeNode(val1 + val2);
    root.left = mergeTrees(
        root1 ? root1.left : null,
        root2 ? root2.left : null,
    );
    root.right = mergeTrees(
        root1 ? root1.right : null,
        root2 ? root2.right : null,
    );
    return root;
};

module.exports = { mergeTrees };

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
    assert.deepStrictEqual(treeToString(mergeTrees(new TreeNode(1, new TreeNode(3, new TreeNode(5, null, null), null), new TreeNode(2, null, null)), new TreeNode(2, new TreeNode(1, null, new TreeNode(4, null, null)), new TreeNode(3, null, new TreeNode(7, null, null))))), "3(4(5(None,None),4(None,None)),5(None,7(None,None)))");
    assert.deepStrictEqual(treeToString(mergeTrees(new TreeNode(1, null, null), new TreeNode(1, new TreeNode(2, null, null), null))), "2(2(None,None),None)");
}
