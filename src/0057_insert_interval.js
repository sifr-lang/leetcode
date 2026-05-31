function insert(_self, intervals, newInterval) {
    const res = [];
    for (let i = 0; i < intervals.length; i++) {
        if (newInterval[1] < intervals[i][0]) {
            res.push(newInterval);
            return res.concat(intervals.slice(i));
        } else if (newInterval[0] > intervals[i][1]) {
            res.push(intervals[i]);
        } else {
            newInterval = [Math.min(newInterval[0], intervals[i][0]), Math.max(newInterval[1], intervals[i][1])];
        }
    }
    res.push(newInterval);
    return res;
}

module.exports = { insert };

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
    assert.deepStrictEqual(insert(null, [[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
    assert.deepStrictEqual(insert(null, [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);
}
