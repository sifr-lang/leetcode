// Time Complexity: O(log n)
// Space Complexity: O(1)

/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function (nums) {
    let left = 0,
        right = nums.length - 2;

    while (left <= right) {
        const mid1 = (left + right) >> 1;
        const mid2 = mid1 ^ 1;

        if (nums[mid1] === nums[mid2]) left = mid1 + 1;
        else right = mid1 - 1;
    }

    return nums[left];
};

module.exports = { singleNonDuplicate };

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
    assert.deepStrictEqual(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
}
