/**
 * https://leetcode.com/problems/linked-list-cycle/
 * Time O(N) | Space O(N)
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head, seen = new Set()) {
    while (head) {
        /* Time O(N) */
        if (seen.has(head)) return true;

        seen.add(head); /* Space O(N) */
        head = head.next;
    }

    return false;
};

/**
 * https://leetcode.com/problems/linked-list-cycle/
 * Time O(N) | Space O(1)
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function (head) {
    let [slow, fast] = [head, head];

    while (fast && fast.next) {
        /* Time O(N) */
        slow = slow.next;
        fast = fast.next.next;

        const hasCycle = slow === fast;
        if (hasCycle) return true;
    }

    return false;
};

module.exports = { hasCycle };

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
    assert.deepStrictEqual(hasCycle(new ListNode(0, null)), false);
}
