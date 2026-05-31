/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

/**
 * Linear Time
 * Time O(n) | Space O(1)
 * @param {ListNode} head
 * @return {number}
 */
var pairSum = function (head) {
    let slow = head;
    let fast = head;
    let prev = null;
    while (fast && fast.next) {
        fast = fast.next.next;
        const tmp = slow.next;
        slow.next = prev;
        prev = slow;
        slow = tmp;
    }

    let res = 0;
    while (slow) {
        res = Math.max(res, prev.val + slow.val);
        prev = prev.next;
        slow = slow.next;
    }
    return res;
};

var getMax = (leftPointer, rightPointer) => {
    let max = 0;
    while (leftPointer && rightPointer) {
        max = Math.max(leftPointer.val + rightPointer.val, max);
        leftPointer = leftPointer.next;
        rightPointer = rightPointer.next;
    }
    return max;
};
var getRightPointer = (head, mid) => {
    let count = 0;
    let rightPointer = head;
    while (count < mid) {
        rightPointer = rightPointer.next;
        count++;
    }
    return rightPointer;
};

var llLength = (head) => {
    let count = 0;
    while (head) {
        head = head.next;
        count++;
    }
    return count;
};

var reverseLL = (head, len) => {
    let count = 0;
    let temp = null;
    while (count < len) {
        const next = head.next;
        head.next = temp;
        temp = head;
        head = next;
        count++;
    }
    return temp;
};

module.exports = { pairSum };

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
    assert.deepStrictEqual(pairSum(new ListNode(5, new ListNode(4, new ListNode(2, new ListNode(1, null))))), 6);
    assert.deepStrictEqual(pairSum(new ListNode(4, new ListNode(2, new ListNode(2, new ListNode(3, null))))), 7);
    assert.deepStrictEqual(pairSum(new ListNode(1, new ListNode(100000, null))), 100001);
}
