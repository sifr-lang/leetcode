/**
 * https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * Time O(N) | Space O(N)
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return dfs(root);
};

const dfs = (root) => {
    const left = maxDepth(root.left);
    const right = maxDepth(root.right);

    const height = Math.max(left, right);

    return height + 1;
};

/**
 * https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * Time O(N) | Space O(N)
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return iterativeDfs([[root, 1]]);
};

const iterativeDfs = (stack, height = 0) => {
    while (stack.length) {
        const [root, depth] = stack.pop();

        height = Math.max(height, depth);

        if (root.right) stack.push([root.right, depth + 1]);
        if (root.left) stack.push([root.left, depth + 1]);
    }

    return height;
};

/**
 * https://leetcode.com/problems/maximum-depth-of-binary-tree/
 * Time O(N) | Space O(N)
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return bfs([[root, 0]]);
};

const bfs = (queue, height = 0) => {
    while (queue.length) {
        for (let i = queue.length - 1; 0 <= i; i--) {
            const [root, depth] = queue.shift();

            height = Math.max(height, depth + 1);

            if (root.left) queue.push([root.left, depth + 1]);
            if (root.right) queue.push([root.right, depth + 1]);
        }
    }

    return height;
};

var maxDepth = function (root) {
    if (root === null) {
        return 0;
    }
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

module.exports = { maxDepth };

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
    assert.deepStrictEqual(maxDepth(new TreeNode(3, new TreeNode(9, null, null), new TreeNode(20, new TreeNode(15, null, null), new TreeNode(7, null, null)))), 3);
    assert.deepStrictEqual(maxDepth(new TreeNode(1, null, new TreeNode(2, null, null))), 2);
}
