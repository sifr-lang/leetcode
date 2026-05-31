var MyHashMap = function () {
    this.buckets = new Array(769).fill(null).map(() => []);
};

MyHashMap.prototype.hashcode = function (key) {
    return key % this.buckets.length;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
MyHashMap.prototype.put = function (key, value) {
    const bucket = this.buckets[this.hashcode(key)];
    for (let index = 0; index < bucket.length; index++) {
        if (bucket[index][0] === key) {
            bucket[index] = [key, value];
            return;
        }
    }
    bucket.push([key, value]);
};

/**
 * @param {number} key
 * @return {number}
 */
MyHashMap.prototype.get = function (key) {
    const bucket = this.buckets[this.hashcode(key)];
    for (const [existingKey, existingValue] of bucket) {
        if (existingKey === key) {
            return existingValue;
        }
    }
    return -1;
};

/**
 * @param {number} key
 * @return {void}
 */
MyHashMap.prototype.remove = function (key) {
    const hash = this.hashcode(key);
    const bucket = this.buckets[hash];
    this.buckets[hash] = bucket.filter(([existingKey]) => existingKey !== key);
};

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */

module.exports = { MyHashMap };

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
    let obj = new MyHashMap();
    obj.put(1, 1);
    obj.put(2, 2);
    assert.deepStrictEqual(obj.get(1), 1);
    assert.deepStrictEqual(obj.get(3), (-1));
    obj.put(2, 1);
    assert.deepStrictEqual(obj.get(2), 1);
    obj.remove(2);
    assert.deepStrictEqual(obj.get(2), (-1));
    obj.put(5, (-1));
    assert.deepStrictEqual(obj.get(5), (-1));
    obj.put(5, 7);
    assert.deepStrictEqual(obj.get(5), 7);
    obj.remove(5);
    assert.deepStrictEqual(obj.get(5), (-1));
}
