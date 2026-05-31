/**
 * https://leetcode.com/problems/non-overlapping-intervals/
 * Time O(N * logN) | Space O(1)
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    let res = 0;
    let prevEnd = intervals[0][1];
    for (const [start, end] of intervals.slice(1)) {
        if (start >= prevEnd) {
            prevEnd = end;
        } else {
            res += 1;
            prevEnd = Math.min(end, prevEnd);
        }
    }
    return res;
};

module.exports = { eraseOverlapIntervals };

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
    assert.deepStrictEqual(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]), 1);
    assert.deepStrictEqual(eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]), 2);
}
