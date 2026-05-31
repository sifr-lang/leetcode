function findOrder(numCourses, prerequisites) {
    const prereq = {};
    for (let c = 0; c < numCourses; c++) prereq[c] = [];
    for (const [crs, pre] of prerequisites) prereq[crs].push(pre);
    const output = [];
    const visit = new Set();
    const cycle = new Set();
    const dfs = (crs) => {
        if (cycle.has(crs)) return false;
        if (visit.has(crs)) return true;
        cycle.add(crs);
        for (const pre of prereq[crs]) {
            if (dfs(pre) === false) return false;
        }
        cycle.delete(crs);
        visit.add(crs);
        output.push(crs);
        return true;
    };
    for (let c = 0; c < numCourses; c++) {
        if (dfs(c) === false) return [];
    }
    return output;
}

module.exports = { findOrder };

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
    assert.deepStrictEqual(findOrder(2, [[1, 0]]), [0, 1]);
    assert.deepStrictEqual(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]]), [0, 1, 2, 3]);
    assert.deepStrictEqual(findOrder(1, []), [0]);
}
