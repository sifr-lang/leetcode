// https://leetcode.com/problems/design-underground-system/
class UndergroundSystem {
    constructor() {
        this.stationSystem = {};
        this.averageTime = {};
    }

    /**
     * Time O(1) | Space O(1)
     * Records the check-in time and station for a user.
     * @param {number} id - User ID
     * @param {string} stationName - Check-in station name
     * @param {number} t - Check-in time
     * @return {void}
     */
    checkIn(id, stationName, t) {
        this.stationSystem[id] = [stationName, '', t, ''];
    }

    /**
     * Time O(1) | Space O(1)
     * Records the check-out time and station for a user, and calculates the average time.
     * @param {number} id - User ID
     * @param {string} stationName - Check-out station name
     * @param {number} t - Check-out time
     * @return {void}
     */
    checkOut(id, stationName, t) {
        const user = this.stationSystem[id];
        user[1] = stationName;
        user[3] = t;
        const stationHash = `${user[0]}-${user[1]}`;
        if (this.averageTime[stationHash]) {
            this.averageTime[stationHash][0] += 1;
            this.averageTime[stationHash][1] += user[3] - user[2];
        } else {
            this.averageTime[stationHash] = [];
            this.averageTime[stationHash][0] = 1;
            this.averageTime[stationHash][1] = user[3] - user[2];
        }
    }

    /**
     * Time O(1) | Space O(1)
     * Returns the average time taken to travel between two stations.
     * @param {string} startStation - Start station name
     * @param {string} endStation - End station name
     * @return {number} - Average time in hours
     */
    getAverageTime(startStation, endStation) {
        const [rounds, totalHours] =
            this.averageTime[`${startStation}-${endStation}`];
        return totalHours / rounds;
    }
}

module.exports = { UndergroundSystem };

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
    let obj = new UndergroundSystem();
    obj.checkIn(45, "Leyton", 3);
    obj.checkIn(32, "Paradise", 8);
    obj.checkIn(27, "Leyton", 10);
    obj.checkOut(45, "Waterloo", 15);
    obj.checkOut(27, "Waterloo", 20);
    obj.checkOut(32, "Cambridge", 22);
    assert.deepStrictEqual(obj.getAverageTime("Paradise", "Cambridge"), 14.0);
    assert.deepStrictEqual(obj.getAverageTime("Leyton", "Waterloo"), 11.0);
    obj.checkIn(10, "Leyton", 24);
    assert.deepStrictEqual(obj.getAverageTime("Leyton", "Waterloo"), 11.0);
    obj.checkOut(10, "Waterloo", 38);
    assert.deepStrictEqual(obj.getAverageTime("Leyton", "Waterloo"), 12.0);
}
