function ListNode(val = 0) { this.val = val; this.next = null; this.prev = null; }
class MyLinkedList {
    constructor() {
        this.left = new ListNode(0);
        this.right = new ListNode(0);
        this.left.next = this.right;
        this.right.prev = this.left;
        this.size = 0;
    }
    get(index) {
        if (index < 0 || index >= this.size) return -1;
        let cur = this.left.next;
        while (cur && index > 0) { cur = cur.next; index--; }
        if (cur && cur !== this.right && index === 0) return cur.val;
        return -1;
    }
    addAtHead(val) {
        const node = new ListNode(val), prev = this.left, next = this.left.next;
        node.next = next; node.prev = prev; next.prev = node; prev.next = node; this.size++;
    }
    addAtTail(val) {
        const node = new ListNode(val), prev = this.right.prev, next = this.right;
        node.next = next; node.prev = prev; next.prev = node; prev.next = node; this.size++;
    }
    addAtIndex(index, val) {
        if (index < 0) index = 0;
        if (index > this.size) return;
        let next = this.left.next;
        while (next && index > 0) { next = next.next; index--; }
        if (next && index === 0) {
            const node = new ListNode(val), prev = next.prev;
            node.next = next; node.prev = prev; next.prev = node; prev.next = node; this.size++;
        }
    }
    deleteAtIndex(index) {
        if (index < 0 || index >= this.size) return;
        let node = this.left.next;
        while (node && index > 0) { node = node.next; index--; }
        if (node && node !== this.right && index === 0) {
            node.prev.next = node.next; node.next.prev = node.prev; this.size--;
        }
    }
}

module.exports = { MyLinkedList };

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
    let obj = new MyLinkedList();
    obj.addAtHead(1);
    obj.addAtTail(3);
    obj.addAtIndex(1, 2);
    assert.deepStrictEqual(obj.get(1), 2);
    obj.deleteAtIndex(1);
    assert.deepStrictEqual(obj.get(1), 3);
    obj.addAtIndex(3, 4);
    assert.deepStrictEqual(obj.get(3), (-1));
    obj.addAtIndex((-1), 5);
    assert.deepStrictEqual(obj.get(0), 5);
    obj.deleteAtIndex(0);
    assert.deepStrictEqual(obj.get(0), 1);
}
