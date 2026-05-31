function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

function partition(head, x) {
    const lessHead = new ListNode(-1);
    const biggerHead = new ListNode(-1);
    let lessPrev = lessHead;
    let biggerPrev = biggerHead;
    while (head) {
        if (head.val < x) {
            lessPrev.next = head;
            lessPrev = lessPrev.next;
        } else {
            biggerPrev.next = head;
            biggerPrev = biggerPrev.next;
        }
        head = head.next;
    }
    lessPrev.next = null;
    biggerPrev.next = null;
    lessPrev.next = biggerHead.next;
    return lessHead.next;
}

module.exports = { partition };

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
    assert.deepStrictEqual(listNodeToString(partition(new ListNode(1, new ListNode(4, new ListNode(3, new ListNode(2, new ListNode(5, new ListNode(2, null)))))), 3)), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(2, new ListNode(4, new ListNode(3, new ListNode(5, null))))))));
    assert.deepStrictEqual(listNodeToString(partition(new ListNode(2, new ListNode(1, null)), 2)), listNodeToString(new ListNode(1, new ListNode(2, null))));
}
