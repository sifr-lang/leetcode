function ListNode(val = 0, next = null) { this.val = val; this.next = next; }
/**
 * https://leetcode.com/problems/add-two-numbers/
 * Time O(MAX(N, M)) | Space O(MAX(N, M))
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
    let sentinel = (tail = new ListNode());

    return add(
        l1,
        l2,
        tail,
        sentinel,
    ); /* Time O(MAX(N, M)) | Space O(MAX(N, M)) */
};

const add = (l1, l2, tail, sentinel, carry = 0) => {
    const isBaseCase = !(l1 || l2 || carry);
    if (isBaseCase) return sentinel.next;

    return dfs(
        l1,
        l2,
        tail,
        sentinel,
        carry,
    ); /* Time O(MAX(N, M)) | Space O(MAX(N, M)) */
};

const dfs = (l1, l2, tail, sentinel, carry) => {
    const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
    const val = sum % 10;
    carry = Math.floor(sum / 10);

    tail.next = new ListNode(val);
    tail = tail.next;

    l1 = l1?.next || null;
    l2 = l2?.next || null;

    add(
        l1,
        l2,
        tail,
        sentinel,
        carry,
    ); /* Time O(MAX(N, M)) | Space O(MAX(N, M)) */

    return sentinel.next;
};

/**
 * https://leetcode.com/problems/add-two-numbers/
 * Time O(MAX(N, M)) | Space O(MAX(N, M))
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2, carry = 0) {
    let sentinel = (tail = new ListNode());

    while (l1 || l2 || carry) {
        /* Time O(MAX(N, M)) */
        const sum = (l1?.val || 0) + (l2?.val || 0) + carry;
        const val = sum % 10;
        carry = Math.floor(sum / 10);

        tail.next = new ListNode(val);
        tail = tail.next;

        l1 = l1?.next || null;
        l2 = l2?.next || null;
    }

    return sentinel.next;
};

module.exports = { addTwoNumbers };

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
    assert.deepStrictEqual(listNodeToString(addTwoNumbers(new ListNode(2, new ListNode(4, new ListNode(3, null))), new ListNode(5, new ListNode(6, new ListNode(4, null))))), listNodeToString(new ListNode(7, new ListNode(0, new ListNode(8, null)))));
    assert.deepStrictEqual(listNodeToString(addTwoNumbers(new ListNode(0, null), new ListNode(0, null))), listNodeToString(new ListNode(0, null)));
    assert.deepStrictEqual(listNodeToString(addTwoNumbers(new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9, null))))))), new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(9, null)))))), listNodeToString(new ListNode(8, new ListNode(9, new ListNode(9, new ListNode(9, new ListNode(0, new ListNode(0, new ListNode(0, new ListNode(1, null))))))))));
}
