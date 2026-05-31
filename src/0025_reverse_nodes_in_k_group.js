function ListNode(val = 0, next = null) { this.val = val; this.next = next; }
/**
 * https://leetcode.com/problems/reverse-nodes-in-k-group/
 * Time O(N) | Space O(N)
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {
    const sentinel = (tail = new ListNode(0, head));

    while (true) {
        let [start, last] = moveNode(tail, k);
        if (!last) break;

        reverse([start, tail.next, start]);

        const next = tail.next;
        tail.next = last;
        tail = next;
    }

    return sentinel.next;
};

const moveNode = (curr, k) => {
    const canMove = () => k && curr;
    while (canMove()) {
        curr = curr.next;
        k--;
    }

    return [curr?.next || null, curr];
};

const reverse = ([prev, curr, start]) => {
    const isSame = () => curr === start;
    while (!isSame()) {
        const next = curr.next;
        curr.next = prev;

        prev = curr;
        curr = next;
    }
};

module.exports = { reverseKGroup };

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
    assert.deepStrictEqual(listNodeToString(reverseKGroup(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))), 2)), listNodeToString(new ListNode(2, new ListNode(1, new ListNode(4, new ListNode(3, new ListNode(5, null)))))));
    assert.deepStrictEqual(listNodeToString(reverseKGroup(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5, null))))), 3)), listNodeToString(new ListNode(3, new ListNode(2, new ListNode(1, new ListNode(4, new ListNode(5, null)))))));
}
