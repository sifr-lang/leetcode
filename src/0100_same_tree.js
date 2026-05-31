function isSameTree(p, q) {
    if (!p && !q) return true;
    if (p && q && p.val === q.val) return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    return false;
}

module.exports = { isSameTree };

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
    assert.deepStrictEqual(isSameTree(new TreeNode(1, new TreeNode(2, null, null), new TreeNode(3, null, null)), new TreeNode(1, new TreeNode(2, null, null), new TreeNode(3, null, null))), true);
    assert.deepStrictEqual(isSameTree(new TreeNode(1, new TreeNode(2, null, null), null), new TreeNode(1, null, new TreeNode(2, null, null))), false);
    assert.deepStrictEqual(isSameTree(new TreeNode(1, new TreeNode(2, null, null), new TreeNode(1, null, null)), new TreeNode(1, new TreeNode(1, null, null), new TreeNode(2, null, null))), false);
}
