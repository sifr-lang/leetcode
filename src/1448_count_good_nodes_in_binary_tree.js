/**
 * https://leetcode.com/problems/count-good-nodes-in-binary-tree/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {number}
 */
 var goodNodes = function(root, max = -Infinity, total = [ 0 ]) {
    count(root, max, total);

    return total[0]
};

const count = (root, max, total) => {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return dfs(root, max, total);
}

const dfs = (root, max, total) => {
    const isGood = max <= root.val
    if (isGood) total[0]++;

    max = Math.max(max, root.val);

    count(root.left, max, total);
    count(root.right, max, total);
}

/**
 * https://leetcode.com/problems/count-good-nodes-in-binary-tree/
 * Time O(N) | Space O(W)
 * @param {TreeNode} root
 * @return {number}
 */
var goodNodes = function(root, ) {
    const isBaseCase = root === null;
    if (isBaseCase) return 0

    return bfs([[ root, -Infinity ]]);
}

const bfs = (queue, total = 0) => {
    while (queue.length) {
        for (let i = (queue.length - 1); 0 <= i; i--) {
            let [ root, max ] = queue.shift();

            const isGood = max <= root.val;
            if (isGood) total++;

            max = Math.max(max, root.val);

            if (root.right) queue.push([ root.right, max ]);
            if (root.left) queue.push([ root.left, max ]);
        }
    }

    return total;
}

var goodNodes = function(root) {
    const dfs = (node, maxVal) => {
        if (!node) {
            return 0;
        }

        let res = node.val >= maxVal ? 1 : 0;
        maxVal = Math.max(maxVal, node.val);
        res += dfs(node.left, maxVal);
        res += dfs(node.right, maxVal);
        return res;
    };

    return dfs(root, root.val);
};

module.exports = { goodNodes };

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
    assert.deepStrictEqual(goodNodes(new TreeNode(3, new TreeNode(1, new TreeNode(3, null, null), null), new TreeNode(4, new TreeNode(1, null, null), new TreeNode(5, null, null)))), 4);
    assert.deepStrictEqual(goodNodes(new TreeNode(3, new TreeNode(3, new TreeNode(4, null, null), new TreeNode(2, null, null)), null)), 3);
    assert.deepStrictEqual(goodNodes(new TreeNode(1, null, null)), 1);
}
