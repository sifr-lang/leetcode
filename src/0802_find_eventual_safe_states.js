function eventualSafeNodes(graph) {
    const safe = new Map();
    const res = [];
    const dfs = (i) => {
        if (safe.has(i)) return safe.get(i);
        safe.set(i, false);
        for (const nei of graph[i]) {
            if (!dfs(nei)) return safe.get(i);
        }
        safe.set(i, true);
        return safe.get(i);
    };
    for (let i = 0; i < graph.length; i++) {
        if (dfs(i)) res.push(i);
    }
    return res;
}

module.exports = { eventualSafeNodes };

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
    assert.deepStrictEqual(eventualSafeNodes([[1, 2], [2, 3], [5], [0], [5], [], []]), [2, 4, 5, 6]);
    assert.deepStrictEqual(eventualSafeNodes([[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]), [4]);
}
