class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class MyCircularQueue {
    constructor(k) {
        this.head = null;
        this.tail = null;
        this.capacity = k;
        this.size = 0;
    }
    enQueue(value) {
        if (this.isFull()) return false;
        const node = new Node(value);
        if (this.size === 0) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.size++;
        return true;
    }
    deQueue() {
        if (this.isEmpty()) return false;
        this.head = this.head.next;
        this.size--;
        return true;
    }
    Front() { return this.isEmpty() ? -1 : this.head.val; }
    Rear() { return this.isEmpty() ? -1 : this.tail.val; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.capacity === this.size; }
}

module.exports = { MyCircularQueue };

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
    let obj = new MyCircularQueue(3);
    assert.deepStrictEqual(obj.enQueue(1), true);
    assert.deepStrictEqual(obj.enQueue(2), true);
    assert.deepStrictEqual(obj.enQueue(3), true);
    assert.deepStrictEqual(obj.enQueue(4), false);
    assert.deepStrictEqual(obj.Rear(), 3);
    assert.deepStrictEqual(obj.isFull(), true);
    assert.deepStrictEqual(obj.deQueue(), true);
    assert.deepStrictEqual(obj.enQueue(4), true);
    assert.deepStrictEqual(obj.Rear(), 4);
}
