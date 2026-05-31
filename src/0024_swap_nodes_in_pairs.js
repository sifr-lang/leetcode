function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

function swapPairs(head) {
    const dummy = new ListNode(0, head);
    let prev = dummy;
    let curr = head;
    while (curr && curr.next) {
        const nxtPair = curr.next.next;
        const second = curr.next;
        second.next = curr;
        curr.next = nxtPair;
        prev.next = second;
        prev = curr;
        curr = nxtPair;
    }
    return dummy.next;
}

module.exports = { swapPairs };

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
    assert.deepStrictEqual(listNodeToString(swapPairs(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, null)))))), listNodeToString(new ListNode(2, new ListNode(1, new ListNode(4, new ListNode(3, null))))));
    assert.deepStrictEqual(swapPairs(null), null);
    assert.deepStrictEqual(listNodeToString(swapPairs(new ListNode(1, null))), listNodeToString(new ListNode(1, null)));
}
