/**
 * Your TimeMap object will be instantiated and called as such:
 * var obj = new TimeMap()
 * obj.set(key,value,timestamp)
 * var param_2 = obj.get(key,timestamp)
 */
class TimeMap {
    constructor() {
        this.map = {};
    }

    /**
     * @param {string} key
     * @param {string} value
     * @param {number} timestamp
     * Time O(1) | Space O(1)
     * @return {void}
     */
    set(key, value, timestamp) {
        const bucket = this.map[key] || [];

        this.map[key] = bucket;

        bucket.push([value, timestamp]);
    }

    /**
     * @param {string} key
     * @param {number} timestamp
     * Time O(log(N)) | Space O(1)
     * @return {string}
     */
    get(key, timestamp, value = '', bucket = this.map[key] || []) {
        let [left, right] = [0, bucket.length - 1];

        while (left <= right) {
            const mid = (left + right) >> 1;
            const [guessValue, guessTimestamp] = bucket[mid];

            const isTargetGreater = guessTimestamp <= timestamp;
            if (isTargetGreater) {
                value = guessValue;
                left = mid + 1;
            }

            const isTargetLess = timestamp < guessTimestamp;
            if (isTargetLess) right = mid - 1;
        }

        return value;
    }
}

module.exports = { TimeMap };

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
    let obj = new TimeMap();
    obj.set("foo", "bar", 1);
    assert.deepStrictEqual(obj.get("foo", 1), "bar");
    assert.deepStrictEqual(obj.get("foo", 3), "bar");
    obj.set("foo", "bar2", 4);
    assert.deepStrictEqual(obj.get("foo", 4), "bar2");
    assert.deepStrictEqual(obj.get("foo", 5), "bar2");
}
