function ListNode(val = 0, next = null) {
    this.val = val;
    this.next = next;
}

function sortList(head) {
    if (!head || !head.next) return head;
    const mid = getMid(head);
    const left = sortList(head);
    const right = sortList(mid);
    return mergeTwoSorted(left, right);
}

function mergeTwoSorted(list1, list2) {
    if (!list1) return list2;
    if (!list2) return list1;
    const sentinel = new ListNode();
    let prev = sentinel;
    while (list1 && list2) {
        if (list1.val < list2.val) {
            prev.next = list1;
            list1 = list1.next;
        } else {
            prev.next = list2;
            list2 = list2.next;
        }
        prev = prev.next;
    }
    prev.next = list1 || list2;
    return sentinel.next;
}

function getMid(head) {
    let midPrev = null;
    while (head && head.next) {
        midPrev = midPrev ? midPrev.next : head;
        head = head.next.next;
    }
    const mid = midPrev.next;
    midPrev.next = null;
    return mid;
}

module.exports = { sortList };

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
    assert.deepStrictEqual(listNodeToString(sortList(new ListNode(4, new ListNode(2, new ListNode(1, new ListNode(3, null)))))), listNodeToString(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, null))))));
    assert.deepStrictEqual(listNodeToString(sortList(new ListNode((-1), new ListNode(5, new ListNode(3, new ListNode(4, new ListNode(0, null))))))), listNodeToString(new ListNode((-1), new ListNode(0, new ListNode(3, new ListNode(4, new ListNode(5, null)))))));
    assert.deepStrictEqual(sortList(null), null);
}
