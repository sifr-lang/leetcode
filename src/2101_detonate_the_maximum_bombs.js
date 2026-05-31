function maximumDetonation(bombs) {
    const n = bombs.length;
    const graph = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [x1, y1, r1] = bombs[i];
                const [x2, y2] = bombs[j];
                const dst = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
                if (dst <= r1) graph[i].push(j);
            }
        }
    }
    const dfs = (node, vis) => {
        vis[node] = true;
        let count = 1;
        for (const nbh of graph[node]) {
            if (!vis[nbh]) count += dfs(nbh, vis);
        }
        return count;
    };
    let detonated = 0;
    for (let i = 0; i < n; i++) {
        detonated = Math.max(detonated, dfs(i, Array(n).fill(false)));
    }
    return detonated;
}

module.exports = { maximumDetonation };

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
    assert.deepStrictEqual(maximumDetonation([[2, 1, 3], [6, 1, 4]]), 2);
    assert.deepStrictEqual(maximumDetonation([[1, 1, 5], [10, 10, 5]]), 1);
    assert.deepStrictEqual(maximumDetonation([[1, 2, 3], [2, 3, 1], [3, 4, 2], [4, 5, 3], [5, 6, 4]]), 5);
}
