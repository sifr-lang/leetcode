/**
 * Linear
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/merge-sorted-array/
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
    let k = m + n - 1;
    m = m - 1;
    n = n - 1;
    while (m >= 0 && n >= 0) {
        if (nums1[m] > nums2[n]) {
            nums1[k] = nums1[m];
            m--;
        } else {
            nums1[k] = nums2[n];
            n--;
        }
        k--;
    }

    if (n >= 0) {
        while (n >= 0) {
            nums1[k] = nums2[n];
            n--;
            k--;
        }
    }
};

module.exports = { merge };

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
    let arg0 = [1, 2, 3, 0, 0, 0];
    let arg1 = 3;
    let arg2 = [2, 5, 6];
    let arg3 = 3;
    let _result = merge(arg0, arg1, arg2, arg3);
    assert.deepStrictEqual(arg0, [1, 2, 2, 3, 5, 6]);
    arg0 = [1];
    arg1 = 1;
    arg2 = [];
    arg3 = 0;
    _result = merge(arg0, arg1, arg2, arg3);
    assert.deepStrictEqual(arg0, [1]);
    arg0 = [0];
    arg1 = 0;
    arg2 = [1];
    arg3 = 1;
    _result = merge(arg0, arg1, arg2, arg3);
    assert.deepStrictEqual(arg0, [1]);
}
