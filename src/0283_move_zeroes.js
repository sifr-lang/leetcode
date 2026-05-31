/**
 * Two Pointer
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/move-zeroes/
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
    const arr = new Array(nums.length).fill(0);

    let [left, right] = [0, 0];

    while (right < nums.length) {
        const isZero = nums[right] === 0;
        if (!isZero) {
            arr[left] = nums[right];
            left++;
        }

        right++;
    }

    return arr;
};

/**
 * 2 Pointer
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/move-zeroes/
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = (nums) => {
    let [left, right] = [0, 0];

    while (right < nums.length) {
        const canSwap = nums[right] !== 0;
        if (canSwap) {
            [nums[left], nums[right]] = [nums[right], nums[left]];
            left++;
        }

        right++;
    }
};

module.exports = { moveZeroes };

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
    let arg0 = [0, 1, 0, 3, 12];
    let _result = moveZeroes(arg0);
    assert.deepStrictEqual(arg0, [1, 3, 12, 0, 0]);
    arg0 = [0];
    _result = moveZeroes(arg0);
    assert.deepStrictEqual(arg0, [0]);
}
