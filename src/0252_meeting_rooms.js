/**
 * https://leetcode.com/problems/meeting-rooms/
 * Time O(N * logN) | Space O(1)
 * @param {number[][]} intervals
 * @return {boolean}
 */
var canAttendMeetings = function (intervals) {
    intervals.sort(([aStart, aEnd], [bStart, bEnd]) =>
        aStart !== bStart ? aStart - bStart : aEnd - bEnd,
    );

    return canAttend(intervals);
};

const canAttend = (intervals) => {
    let prev = intervals.shift();

    for (const curr of intervals) {
        const [prevStart, prevEnd] = prev;
        const [currStart, currEnd] = curr;

        const hasOverlap = currStart < prevEnd;
        if (hasOverlap) return false;

        prev = curr;
    }

    return true;
};

module.exports = { canAttendMeetings };

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
    assert.deepStrictEqual(canAttendMeetings([[0, 30], [5, 10], [15, 20]]), false);
    assert.deepStrictEqual(canAttendMeetings([[7, 10], [2, 4]]), true);
}
