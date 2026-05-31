/**
 * https://leetcode.com/problems/binary-tree-right-side-view/
 * Time O(N) | Space O(W)
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return [];

    return bfs([root]);
};

const bfs = (queue, rightSide = []) => {
    while (queue.length) {
        let prev = null;

        for (let i = queue.length - 1; 0 <= i; i--) {
            const node = queue.shift();

            prev = node;

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        rightSide.push(prev.val);
    }

    return rightSide;
};

/**
 * https://leetcode.com/problems/binary-tree-right-side-view/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function (root, level = 0, rightSide = []) {
    const isBaseCase = root === null;
    if (isBaseCase) return rightSide;

    const isLastNode = level === rightSide.length;
    if (isLastNode) rightSide.push(root.val);

    return dfs(root, level, rightSide);
};

const dfs = (root, level, rightSide) => {
    if (root.right) rightSideView(root.right, level + 1, rightSide);
    if (root.left) rightSideView(root.left, level + 1, rightSide);

    return rightSide;
};

var rightSideView = function (root) {
    const res = [];
    const q = [root];
    let head = 0;

    while (head < q.length) {
        let rightSide = null;
        const qLen = q.length - head;

        for (let i = 0; i < qLen; i++) {
            const node = q[head++];
            if (node) {
                rightSide = node;
                q.push(node.left);
                q.push(node.right);
            }
        }
        if (rightSide) {
            res.push(rightSide.val);
        }
    }
    return res;
};

module.exports = { rightSideView };

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
    assert.deepStrictEqual(rightSideView(new TreeNode(1, new TreeNode(2, null, new TreeNode(5, null, null)), new TreeNode(3, null, new TreeNode(4, null, null)))), [1, 3, 4]);
    assert.deepStrictEqual(rightSideView(new TreeNode(1, new TreeNode(2, new TreeNode(4, new TreeNode(5, null, null), null), null), new TreeNode(3, null, null))), [1, 3, 4, 5]);
    assert.deepStrictEqual(rightSideView(new TreeNode(1, null, new TreeNode(3, null, null))), [1, 3]);
}
