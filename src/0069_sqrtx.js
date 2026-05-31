/**
 * Binary Search
 * https://leetcode.com/problems/sqrtx/
 *
 * Time O(log(n)) | Space O(1)
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
    let left = 1;
    let right = x;

    while (left <= right) {
        const mid = (left + right) >> 1;
        if (mid * mid <= x && (mid + 1) * (mid + 1) > x) return mid;
        if (mid * mid < x) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return 0;
};

module.exports = { mySqrt };

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
    assert.deepStrictEqual(mySqrt(4), 2);
    assert.deepStrictEqual(mySqrt(8), 2);
    assert.deepStrictEqual(mySqrt(0), 0);
}
