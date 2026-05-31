/**
 * https://leetcode.com/problems/merge-intervals/
 * Time O(N * logN) | Space O(N)
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
    intervals.sort(([aStart, aEnd], [bStart, bEnd]) =>
        aStart !== bStart ? aStart - bStart : aEnd - bEnd,
    );

    return mergerInterval(intervals);
};

const mergerInterval = (intervals, merged = []) => {
    let prev = intervals.shift();

    for (const curr of intervals) {
        const [prevStart, prevEnd] = prev;
        const [currStart, currEnd] = curr;

        const hasOverlap = currStart <= prevEnd;
        if (hasOverlap) {
            prev[1] = Math.max(prev[1], curr[1]);
            continue;
        }

        merged.push(prev);
        prev = curr;
    }

    return [...merged, prev];
};

module.exports = { merge };

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
    assert.deepStrictEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
}
