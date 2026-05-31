// https://leetcode.com/problems/design-hashset
class MyHashSet {
    constructor() {
        this.hashset = [];
    }

    /**
     * Time O(1) | Space O(1)
     * @param {number} key
     * @return {void}
     */
    add(key) {
        if (!this.contains(key)) {
            this.hashset.push(key);
        }
    }

    /**
     * Time O(1) | Space O(1)
     * @param {number} key
     * @return {void}
     */
    remove(key) {
        if (this.contains(key)) {
            this.hashset.splice(this.hashset.indexOf(key), 1);
        }
    }

    /**
     * Time O(1) | Space O(1)
     * @param {number} key
     * @return {boolean}
     */
    contains(key) {
        return this.hashset.includes(key);
    }
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */

module.exports = { MyHashSet };

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
    let obj = new MyHashSet();
    obj.add(1);
    obj.add(2);
    assert.deepStrictEqual(obj.contains(1), true);
    assert.deepStrictEqual(obj.contains(3), false);
    obj.add(2);
    assert.deepStrictEqual(obj.contains(2), true);
    obj.remove(2);
    assert.deepStrictEqual(obj.contains(2), false);
}
