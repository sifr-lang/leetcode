function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 * this.val  = (val===undefined ? 0 : val)
 * this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
    let sentinel_node = new ListNode(0, head);
    let slow_pointer = sentinel_node;
    let fast_pointer = null;

    while (slow_pointer) {
        // get next legible node
        fast_pointer = slow_pointer.next;
        while (fast_pointer && fast_pointer.val === val) {
            fast_pointer = fast_pointer.next;
        }

        // Set next node to the legible node
        slow_pointer.next = fast_pointer;
        slow_pointer = slow_pointer.next;
    }

    return sentinel_node.next;
};

module.exports = { removeElements };

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
    assert.deepStrictEqual(listNodeToString(removeElements(new ListNode(1, new ListNode(2, new ListNode(6, new ListNode(3, new ListNode(4, new ListNode(5, new ListNode(6, null))))))), 6)), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null)))))));
    assert.deepStrictEqual(removeElements(null, 1), null);
    assert.deepStrictEqual(removeElements(new ListNode(7, new ListNode(7, new ListNode(7, new ListNode(7, null)))), 7), null);
}
