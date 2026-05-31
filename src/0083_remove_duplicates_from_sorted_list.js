/**
 * https://leetcode.com/problems/remove-duplicates-from-sorted-list/
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
    let cur = head;
    while (cur != null && cur.next != null) {
        if (cur.next.val === cur.val) {
            cur.next = cur.next.next;
        } else {
            cur = cur.next;
        }
    }
    return head;
};

module.exports = { deleteDuplicates };

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
    assert.deepStrictEqual(listNodeToString(deleteDuplicates(new ListNode(1, new ListNode(1, new ListNode(2, null))))), listNodeToString(new ListNode(1, new ListNode(2, null))));
    assert.deepStrictEqual(listNodeToString(deleteDuplicates(new ListNode(1, new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(3, null))))))), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(3, null)))));
}
