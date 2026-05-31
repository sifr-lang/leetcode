function isBipartiteBFS(graph) {
    const colors = Array(graph.length).fill(-1);
    for (let i = 0; i < graph.length; i++) {
        if (colors[i] === -1) {
            const q = [i];
            let head = 0;
            colors[i] = 0;
            while (head < q.length) {
                const node = q[head++];
                for (const nbh of graph[node]) {
                    if (colors[nbh] === -1) {
                        colors[nbh] = 1 - colors[node];
                        q.push(nbh);
                    } else if (colors[nbh] === colors[node]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

module.exports = { isBipartiteBFS };

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
    assert.deepStrictEqual(isBipartiteBFS([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]), false);
    assert.deepStrictEqual(isBipartiteBFS([[1, 3], [0, 2], [1, 3], [0, 2]]), true);
}
