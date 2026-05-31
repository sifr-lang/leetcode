/**
 * https://leetcode.com/problems/reverse-linked-list/
 * Time O(N) | Space O(N)
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    const isBaseCase = !head?.next;
    if (isBaseCase) return head;

    return dfs(head); /* Time O(N) | Space O(N) */
};

const dfs = (curr) => {
    const prev = reverseList(curr.next); /* Time O(N) | Space O(N) */

    curr.next.next = curr;
    curr.next = null;

    return prev;
};

/**
 * https://leetcode.com/problems/reverse-linked-list/
 * Time O(N) | Space O(1)
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    let [prev, curr, next] = [null, head, null];

    while (curr) {
        /* Time O(N) */
        next = curr.next;
        curr.next = prev;

        prev = curr;
        curr = next;
    }

    return prev;
};

module.exports = { reverseList };

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
    assert.deepStrictEqual(listNodeToString(reverseList(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))))), listNodeToString(new ListNode(5, new ListNode(4, new ListNode(3, new ListNode(2, new ListNode(1, null)))))));
    assert.deepStrictEqual(listNodeToString(reverseList(new ListNode(1, new ListNode(2, null)))), listNodeToString(new ListNode(2, new ListNode(1, null))));
    assert.deepStrictEqual(reverseList(null), null);
}
