function ListNode(val = 0, next = null) { this.val = val; this.next = next; }
/**
 * https://leetcode.com/problems/merge-two-sorted-lists/
 * Time O(N + M) | Space O(N + M)
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    const isBaseCase1 = list1 === null;
    if (isBaseCase1) return list2;

    const isBaseCase2 = list2 === null;
    if (isBaseCase2) return list1;

    const isL2Greater = list1.val <= list2.val;
    if (isL2Greater) {
        list1.next = mergeTwoLists(
            list1.next,
            list2,
        ); /* Time O(N + M) | Space O(N + M) */

        return list1;
    }

    const isL2Less = list2.val <= list1.val;
    if (isL2Less) {
        list2.next = mergeTwoLists(
            list1,
            list2.next,
        ); /* Time O(N + M) | Space O(N + M) */

        return list2;
    }
};

/**
 * https://leetcode.com/problems/merge-two-sorted-lists/
 * Time O(N + M) | Space O(N + M)
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
    if (!list1) {
        return list2;
    }
    if (!list2) {
        return list1;
    }
    const lil = list1.val < list2.val ? list1 : list2;
    const big = list1.val < list2.val ? list2 : list1;
    lil.next = mergeTwoLists(lil.next, big);
    return lil;
};

module.exports = { mergeTwoLists };

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
    assert.deepStrictEqual(listNodeToString(mergeTwoLists(new ListNode(1, new ListNode(2, new ListNode(4, null))), new ListNode(1, new ListNode(3, new ListNode(4, null))))), listNodeToString(new ListNode(1, new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(4, null))))))));
    assert.deepStrictEqual(mergeTwoLists(null, null), null);
    assert.deepStrictEqual(listNodeToString(mergeTwoLists(null, new ListNode(0, null))), listNodeToString(new ListNode(0, null)));
}
