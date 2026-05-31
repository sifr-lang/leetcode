/**
 * https://leetcode.com/problems/meeting-rooms-ii/
 * Time O((N * logN) + (M * logM)) | Space O(1)
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function (intervals) {
    const { start, end } = splitIntervals(intervals);
    let [minRooms, startIndex, endIndex] = [0, 0, 0];

    while (startIndex < intervals.length) {
        const [currStart, prevEnd] = [start[startIndex], end[endIndex]];

        const hasGap = prevEnd <= currStart;
        if (hasGap) {
            minRooms--;
            endIndex++;
        }

        minRooms++;
        startIndex++;
    }

    return minRooms;
};

const splitIntervals = (intervals, start = [], end = []) => {
    for (const [startTime, endTime] of intervals) {
        start.push(startTime);
        end.push(endTime);
    }

    const comparator = (a, b) => a - b;

    start.sort(comparator);
    end.sort(comparator);

    return { start, end };
};

module.exports = { minMeetingRooms };

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
    assert.deepStrictEqual(minMeetingRooms([[0, 30], [5, 10], [15, 20]]), 2);
    assert.deepStrictEqual(minMeetingRooms([[7, 10], [2, 4]]), 1);
}
