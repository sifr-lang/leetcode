function widthOfBinaryTree(root) {
    if (root === null) return 0;
    let q = [[root, 0]];
    let width = 0;
    while (q.length) {
        const leftIndex = q[0][1];
        const rightIndex = q[q.length - 1][1];
        width = Math.max(width, rightIndex - leftIndex + 1);
        const next = [];
        for (const [node, index] of q) {
            if (node.left) next.push([node.left, index * 2]);
            if (node.right) next.push([node.right, index * 2 + 1]);
        }
        q = next;
    }
    return width;
}

function widthOfBinaryTree(root) {
    if (root === null) return 0;
    const q = [[root, 0]];
    let width = 0;
    while (q.length) {
        const leftIndex = q[0][1];
        const rightIndex = q[q.length - 1][1];
        width = Math.max(width, rightIndex - leftIndex + 1);
        const queueLength = q.length;
        for (let i = 0; i < queueLength; i++) {
            const [node, index] = q.shift();
            if (node.left) q.push([node.left, index * 2]);
            if (node.right) q.push([node.right, index * 2 + 1]);
        }
    }
    return width;
}

module.exports = { widthOfBinaryTree };

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
    assert.deepStrictEqual(widthOfBinaryTree(new TreeNode(1, new TreeNode(3, new TreeNode(5, null, null), new TreeNode(3, null, null)), new TreeNode(2, null, new TreeNode(9, null, null)))), 4);
    assert.deepStrictEqual(widthOfBinaryTree(new TreeNode(1, new TreeNode(3, new TreeNode(5, new TreeNode(6, null, null), null), null), new TreeNode(2, null, new TreeNode(9, new TreeNode(7, null, null), null)))), 7);
    assert.deepStrictEqual(widthOfBinaryTree(new TreeNode(1, new TreeNode(3, new TreeNode(5, null, null), null), new TreeNode(2, null, null))), 2);
}
