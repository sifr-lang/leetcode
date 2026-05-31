/**
 * https://leetcode.com/problems/binary-tree-level-order-traversal/
 * Time O(N) | Space O(W)
 * Note that the time complexity is actually O(N^2) if we consider the fact that we use an array as a queue. Calling Array.shift() takes O(N).
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return [];

    return bfs([root]);
};

const bfs = (queue /* Space O(W) */, levels = []) => {
    while (queue.length) {
        // Time O(N)
        const level = [];

        for (let i = queue.length - 1; 0 <= i; i--) {
            const node = queue.shift(); // Time O(N) ... This can be O(1) if we use an actual queue data structure

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);

            level.push(node.val);
        }

        levels.push(level.slice());
    }

    return levels;
};

/**
 * https://leetcode.com/problems/binary-tree-level-order-traversal/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function (root, level = 0, levels = []) {
    const isBaseCase = root === null;
    if (isBaseCase) return levels;

    const isLastNode = level === levels.length;
    if (isLastNode) levels.push([]);

    levels[level].push(root.val);

    return dfs(root, level, levels); // Time O(N) | Space O(H)
};

const dfs = (root, level, levels) => {
    if (root.left) levelOrder(root.left, level + 1, levels);
    if (root.right) levelOrder(root.right, level + 1, levels);

    return levels;
};

var levelOrder = function (root) {
    const res = [];
    const q = [];
    let head = 0;
    if (root) {
        q.push(root);
    }

    while (head < q.length) {
        const val = [];
        const length = q.length - head;

        for (let i = 0; i < length; i++) {
            const node = q[head++];
            val.push(node.val);
            if (node.left) {
                q.push(node.left);
            }
            if (node.right) {
                q.push(node.right);
            }
        }
        res.push(val);
    }
    return res;
};

module.exports = { levelOrder };

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
    assert.deepStrictEqual(levelOrder(new TreeNode(3, new TreeNode(9, null, null), new TreeNode(20, new TreeNode(15, null, null), new TreeNode(7, null, null)))), [[3], [9, 20], [15, 7]]);
    assert.deepStrictEqual(levelOrder(new TreeNode(1, null, null)), [[1]]);
    assert.deepStrictEqual(levelOrder(null), []);
}
