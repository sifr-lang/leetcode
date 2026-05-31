/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * Time O(log(N * M)) | Space O(N)
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
    const canSwap = nums2.length < nums1.length;
    if (canSwap) [nums1, nums2] = [nums2, nums1];

    let [left, right] = [0, nums1.length - 1];
    const totalLength = nums1.length + nums2.length;
    const mid = totalLength >> 1;
    const isEven = totalLength % 2 === 0;

    while (true) {
        const mid1 = left + right;
        const mid2 = mid - mid1 - 2;
        const { aLeft, aRight, bLeft, bRight } = getPointers(
            nums1,
            mid1,
            nums2,
            mid2,
        );

        const isTarget = aLeft <= bRight && bLeft <= aRight;
        if (isTarget)
            return isEven
                ? (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2
                : Math.min(aRight, bRight);

        const isTargetGreater = aLeft <= bRight;
        if (isTargetGreater) left = mid1 + 1;

        const isTargetLess = bRight < aLeft;
        if (isTargetLess) right = mid1 - 1;
    }
};

const getPointers = (nums1, mid1, nums2, mid2) => {
    const getLeft = (nums, index) => (0 <= index ? nums[index] : -Infinity);

    const [aLeft, bLeft] = [getLeft(nums1, mid1), getLeft(nums2, mid2)];

    const getRight = (nums, index) =>
        index + 1 < nums.length ? nums[index + 1] : Infinity;

    const [aRight, bRight] = [getRight(nums1, mid1), getRight(nums2, mid2)];

    return { aLeft, aRight, bLeft, bRight };
};

module.exports = { findMedianSortedArrays };

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
    assert.deepStrictEqual(findMedianSortedArrays([1, 3], [2]), 2);
    assert.deepStrictEqual(findMedianSortedArrays([1, 2], [3, 4]), 2.5);
    assert.deepStrictEqual(findMedianSortedArrays([], [1]), 1);
    assert.deepStrictEqual(findMedianSortedArrays([2], []), 2);
    assert.deepStrictEqual(findMedianSortedArrays([], [2, 3]), 2.5);
    assert.deepStrictEqual(findMedianSortedArrays([0, 0], [0, 0]), 0);
    assert.deepStrictEqual(findMedianSortedArrays([(-5), (-3)], [(-4)]), (-4));
}
