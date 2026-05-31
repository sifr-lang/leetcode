function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

/**
 * https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 * Time O(N) | Space O(N)
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    const sentinel = new ListNode();

    sentinel.next = head;

    const fast = moveFast(sentinel, n); /* Time O(N) */
    const slow = moveSlow(sentinel, fast); /* Time O(N) */

    slow.next = slow.next.next || null;

    return sentinel.next;
};

const moveFast = (fast, n) => {
    for (let i = 1; i <= n + 1; i++) {
        /* Time O(N) */
        fast = fast.next;
    }

    return fast;
};

const moveSlow = (slow, fast) => {
    while (fast) {
        /* Time O(N) */
        slow = slow.next;
        fast = fast.next;
    }

    return slow;
};

/**
 * https://leetcode.com/problems/remove-nth-node-from-end-of-list/
 * Time O(N) | Space O(1)
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
    const dummy = new ListNode(0, head);
    let left = dummy;
    let right = head;

    while (n > 0) {
        right = right.next;
        n -= 1;
    }

    while (right) {
        left = left.next;
        right = right.next;
    }

    left.next = left.next.next;
    return dummy.next;
};

const getNthFromEnd = (curr, n, length = 0) => {
    while (curr) {
        /* Time O(N) */
        curr = curr.next;
        length++;
    }

    return length - n - 1;
};

const moveNode = (curr, length) => {
    while (length) {
        /* Time O(N) */
        curr = curr.next;
        length--;
    }

    return curr;
};

module.exports = { removeNthFromEnd };

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
    assert.deepStrictEqual(listNodeToString(removeNthFromEnd(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))), 2)), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(5, null))))));
    assert.deepStrictEqual(removeNthFromEnd(new ListNode(1, null), 1), null);
    assert.deepStrictEqual(listNodeToString(removeNthFromEnd(new ListNode(1, new ListNode(2, null)), 1)), listNodeToString(new ListNode(1, null)));
}
