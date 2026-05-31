function swapNodes(head, k) {
    let rightPointer = head;
    for (let i = 1; i < k; i++) rightPointer = rightPointer.next;
    const leftKthNode = rightPointer;
    let leftPointer = head;
    let rightKthNode = head;
    while (rightPointer !== null) {
        rightKthNode = leftPointer;
        rightPointer = rightPointer.next;
        leftPointer = leftPointer.next;
    }
    [leftKthNode.val, rightKthNode.val] = [rightKthNode.val, leftKthNode.val];
    return head;
}

module.exports = { swapNodes };

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
    assert.deepStrictEqual(listNodeToString(swapNodes(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))), 2)), listNodeToString(new ListNode(1, new ListNode(4, new ListNode(3, new ListNode(2, new ListNode(5, null)))))));
    assert.deepStrictEqual(listNodeToString(swapNodes(new ListNode(7, new ListNode(9, new ListNode(6, new ListNode(6, new ListNode(7, new ListNode(8, new ListNode(3, new ListNode(0, new ListNode(9, new ListNode(5, null)))))))))), 5)), listNodeToString(new ListNode(7, new ListNode(9, new ListNode(6, new ListNode(6, new ListNode(8, new ListNode(7, new ListNode(3, new ListNode(0, new ListNode(9, new ListNode(5, null))))))))))));
}
