function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

function insertionSortList(head) {
    if (!head || !head.next) return head;
    const sentinel = new ListNode();
    let curr = head;
    while (curr) {
        let prev = sentinel;
        while (prev.next && curr.val >= prev.next.val) prev = prev.next;
        const nextCurr = curr.next;
        curr.next = prev.next;
        prev.next = curr;
        curr = nextCurr;
    }
    return sentinel.next;
}

module.exports = { insertionSortList };

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
    assert.deepStrictEqual(listNodeToString(insertionSortList(new ListNode(4, new ListNode(2, new ListNode(1, new ListNode(3, null)))))), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, null))))));
    assert.deepStrictEqual(listNodeToString(insertionSortList(new ListNode((-1), new ListNode(5, new ListNode(3, new ListNode(4, new ListNode(0, null))))))), listNodeToString(new ListNode((-1), new ListNode(0, new ListNode(3, new ListNode(4, new ListNode(5, null)))))));
}
