function rotateRight(head, k) {
    if (!head || !head.next || k === 0) return head;
    const oldHead = head;
    let curr = head;
    let size = 0;
    while (curr) {
        curr = curr.next;
        size++;
    }
    if (k % size === 0) return head;
    k %= size;
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        if (k <= 0) slow = slow.next;
        fast = fast.next;
        k--;
    }
    const newTail = slow;
    const newHead = slow.next;
    const oldTail = fast;
    newTail.next = null;
    oldTail.next = oldHead;
    return newHead;
}

module.exports = { rotateRight };

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
    assert.deepStrictEqual(listNodeToString(rotateRight(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))), 2)), listNodeToString(new ListNode(4, new ListNode(5, new ListNode(1, new ListNode(2, new ListNode(3, null)))))));
    assert.deepStrictEqual(listNodeToString(rotateRight(new ListNode(0, new ListNode(1, new ListNode(2, null))), 4)), listNodeToString(new ListNode(2, new ListNode(0, new ListNode(1, null)))));
}
