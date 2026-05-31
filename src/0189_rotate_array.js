/**
 * Two Pointers
 * https://leetcode.com/problems/rotate-array/
 *
 * Time O(n) | Space O(1)
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
    // if the k exceeds the length of nums.
    k = k % nums.length;

    nums.reverse();
    reversePortionOfArray(nums, 0, k - 1);
    reversePortionOfArray(nums, k, nums.length - 1);
};

var reversePortionOfArray = function (nums, start, end) {
    while (start < end) {
        [nums[start], nums[end]] = [nums[end], nums[start]];
        start++;
        end--;
    }
};

/**
 * Two Pointers
 * https://leetcode.com/problems/rotate-array/
 *
 * Time O(n) | Space O(1)
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
    k = k % nums.length;

    let l = 0;
    let r = nums.length - 1;

    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l += 1;
        r -= 1;
    }
    ((l = 0), (r = k - 1));
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l += 1;
        r -= 1;
    }
    l = k;
    r = nums.length - 1;
    while (l < r) {
        [nums[l], nums[r]] = [nums[r], nums[l]];
        l += 1;
        r -= 1;
    }
};

module.exports = { rotate };

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
    let arg0 = [1, 2, 3, 4, 5, 6, 7];
    let arg1 = 3;
    let _result = rotate(arg0, arg1);
    assert.deepStrictEqual(arg0, [5, 6, 7, 1, 2, 3, 4]);
    arg0 = [(-1), (-100), 3, 99];
    arg1 = 2;
    _result = rotate(arg0, arg1);
    assert.deepStrictEqual(arg0, [3, 99, (-1), (-100)]);
}
