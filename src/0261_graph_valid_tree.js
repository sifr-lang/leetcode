function validTree(n, edges) {
    if (!n) return true;
    const adj = {};
    for (let i = 0; i < n; i++) adj[i] = [];
    for (const [n1, n2] of edges) {
        adj[n1].push(n2);
        adj[n2].push(n1);
    }
    const visit = new Set();
    const dfs = (i, prev) => {
        if (visit.has(i)) return false;
        visit.add(i);
        for (const j of adj[i]) {
            if (j === prev) continue;
            if (!dfs(j, i)) return false;
        }
        return true;
    };
    return dfs(0, -1) && n === visit.size;
}
function validTreeDsu(n, edges) {
    if (n === 0) return true;
    const parents = Array.from({ length: n }, (_, i) => i);
    const ranks = Array(n).fill(1);
    let components = n;
    const find = (node) => {
        while (node !== parents[node]) {
            parents[node] = parents[parents[node]];
            node = parents[node];
        }
        return node;
    };
    const union = (a, b) => {
        const rootA = find(a);
        const rootB = find(b);
        if (rootA === rootB) return false;
        if (ranks[rootA] < ranks[rootB]) parents[rootA] = rootB;
        else if (ranks[rootA] > ranks[rootB]) parents[rootB] = rootA;
        else { parents[rootB] = rootA; ranks[rootA]++; }
        components--;
        return true;
    };
    for (const [a, b] of edges) {
        if (!union(a, b)) return false;
    }
    return components === 1;
}

module.exports = { validTree, validTreeDsu };

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
    assert.deepStrictEqual(validTree(5, [[0, 1], [0, 2], [0, 3], [1, 4]]), true);
    assert.deepStrictEqual(validTree(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]), false);
    assert.deepStrictEqual(validTreeDsu(5, [[0, 1], [0, 2], [0, 3], [1, 4]]), true);
    assert.deepStrictEqual(validTreeDsu(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]), false);
}
