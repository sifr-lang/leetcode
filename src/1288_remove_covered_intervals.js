function removeCoveredIntervals(intervals) {
    intervals.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    let covered = 0;
    let maxri = 0;
    for (const [, ri] of intervals) {
        if (ri > maxri) maxri = ri;
        else covered++;
    }
    return intervals.length - covered;
}

module.exports = { removeCoveredIntervals };

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
    assert.deepStrictEqual(removeCoveredIntervals([[1, 4], [3, 6], [2, 8]]), 2);
}
