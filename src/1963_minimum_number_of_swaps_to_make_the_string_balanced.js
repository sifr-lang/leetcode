// problem link https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced
// time complexity O(n)
// space complexity O(1)

var minSwaps = function (s) {
    let extraClosing = 0;
    let maxClosing = 0;
    for (let i = 0; i < s.length; i++) {
        s[i] === ']' ? extraClosing++ : extraClosing--;
        maxClosing = Math.max(maxClosing, extraClosing);
    }

    return Math.ceil(maxClosing / 2);
};

module.exports = { minSwaps };

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
    assert.deepStrictEqual(minSwaps("][]["), 1);
    assert.deepStrictEqual(minSwaps("[][][]"), 0);
}
