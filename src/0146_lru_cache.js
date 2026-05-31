/**
 * https://leetcode.com/problems/lru-cache/
 * Time O(1) | Space O(N)
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();

        this.head = {};
        this.tail = {};

        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    removeLastUsed() {
        const [key, next, prev] = [
            this.head.next.key,
            this.head.next.next,
            this.head,
        ];

        this.map.delete(key);
        this.head.next = next;
        this.head.next.prev = prev;
    }

    put(key, value) {
        const hasKey = this.get(key) !== -1;
        const isAtCapacity = this.map.size === this.capacity;

        if (hasKey) return (this.tail.prev.value = value);
        if (isAtCapacity) this.removeLastUsed();

        const node = { key, value };
        this.map.set(key, node);
        this.moveToFront(node);
    }

    moveToFront(node) {
        const [prev, next] = [this.tail.prev, this.tail];

        this.tail.prev.next = node;
        this.connectNode(node, { prev, next });
        this.tail.prev = node;
    }

    connectNode(node, top) {
        node.prev = top.prev;
        node.next = top.next;
    }

    get(key) {
        const hasKey = this.map.has(key);
        if (!hasKey) return -1;

        const node = this.map.get(key);

        this.disconnectNode(node);
        this.moveToFront(node);

        return node.value;
    }

    disconnectNode(node) {
        node.next.prev = node.prev;
        node.prev.next = node.next;
    }
}

module.exports = { LRUCache };

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
    let obj = new LRUCache(2);
    obj.put(1, 1);
    obj.put(2, 2);
    assert.deepStrictEqual(obj.get(1), 1);
    obj.put(3, 3);
    assert.deepStrictEqual(obj.get(2), (-1));
    obj.put(4, 4);
    assert.deepStrictEqual(obj.get(1), (-1));
    assert.deepStrictEqual(obj.get(3), 3);
    assert.deepStrictEqual(obj.get(4), 4);
    let obj2 = new LRUCache(1);
    obj2.put(8, (-1));
    assert.deepStrictEqual(obj2.get(8), (-1));
    obj2.put(9, 9);
    assert.deepStrictEqual(obj2.get(8), (-1));
    assert.deepStrictEqual(obj2.get(9), 9);
}
