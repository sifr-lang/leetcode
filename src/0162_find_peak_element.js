/**
 * Time O(log(N)) | Space O(1)
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function (nums) {
    let [l, r] = [0, nums.length - 1];
    let mid = null;
    while (l <= r) {
        mid = (l + r) >> 1;
        if (mid < nums.length - 1 && nums[mid] < nums[mid + 1]) {
            l = mid + 1;
        } else if (mid > 0 && nums[mid] < nums[mid - 1]) {
            r = mid - 1;
        } else {
            break;
        }
    }
    return mid;
};

module.exports = { findPeakElement };

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
    assert.deepStrictEqual(findPeakElement([1, 2, 3, 1]), 2);
}
