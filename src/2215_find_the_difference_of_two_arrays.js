/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[][]}
 */

// Time Complexity: O(m + n), we check each element of nums1Set and nums2Set
// Space Complexity: O(m + n), where m and n are length sets in worst case.

var findDifference = function (nums1, nums2) {
    const nums1Set = new Set(nums1);
    const nums2Set = new Set(nums2);

    const lst1 = Array.from(nums1Set).filter((num) => !nums2Set.has(num));
    const lst2 = Array.from(nums2Set).filter((num) => !nums1Set.has(num));

    return [lst1, lst2];
};

module.exports = { findDifference };

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
    assert.deepStrictEqual(findDifference([1, 2, 3], [2, 4, 6]), [[1, 3], [4, 6]]);
    assert.deepStrictEqual(findDifference([1, 2, 3, 3], [1, 1, 2, 2]), [[3], []]);
}
