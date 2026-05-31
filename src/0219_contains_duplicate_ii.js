/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function (nums, k) {
    const window = new Set();
    let L = 0;
    for (let R = 0; R < nums.length; R++) {
        if (!window.has(nums[R])) {
            window.add(nums[R]);
        } else {
            return true;
        }

        if (R - L + 1 > k) {
            window.delete(nums[L]);
            L++;
        }
    }
    return false;
};

module.exports = { containsNearbyDuplicate };

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
    assert.deepStrictEqual(containsNearbyDuplicate([1, 2, 3, 1], 3), true);
    assert.deepStrictEqual(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2), false);
}
