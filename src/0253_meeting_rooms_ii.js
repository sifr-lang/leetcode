// LeetCode 253: Meeting Rooms Ii
// JavaScript version

function minMeetingRooms(self, intervals) {
    const time = [];
    for (const [start, end] of intervals) {
        time.push([start, 1]);
        time.push([end, -1]);
    }
    time.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return a[1] - b[1];
    });

    let count = 0;
    let maxCount = 0;
    for (const t of time) {
        count += t[1];
        maxCount = Math.max(maxCount, count);
    }
    return maxCount;
}

module.exports = { minMeetingRooms };

if (require.main === module) {
    const assert = require('assert');
    assert.deepStrictEqual(minMeetingRooms(null, [[0, 30], [5, 10], [15, 20]]), 2);
    assert.deepStrictEqual(minMeetingRooms(null, [[7, 10], [2, 4]]), 1);
}
