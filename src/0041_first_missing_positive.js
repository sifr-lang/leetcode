/**
 * Cyclic Sort
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/first-missing-positive
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = (nums) => {
    cyclicSort(nums);

    return search(nums);
};

const cyclicSort = (nums, index = 0) => {
    while (index < nums.length) {
        const num = nums[index];
        const indexKey = num - 1;
        const indexNum = nums[indexKey];

        if (canSwap(nums, num, indexNum)) {
            swap(nums, index, indexKey);
            continue;
        }

        index += 1;
    }
};

const search = (nums, index = 0) => {
    while (index < nums.length) {
        const num = nums[index];
        const indexKey = index + 1;

        if (!isEqual(num, indexKey)) return indexKey;

        index += 1;
    }

    return nums.length + 1;
};

const canSwap = (nums, num, indexNum) =>
    isPositive(num) && isInBound(num, nums) && !isEqual(num, indexNum);

const swap = (nums, index, indexKey) =>
    ([nums[index], nums[indexKey]] = [nums[indexKey], nums[index]]);

const isPositive = (num) => 0 < num;

const isInBound = (num, nums) => num <= nums.length;

const isEqual = (num, indexNum) => num === indexNum;

module.exports = { firstMissingPositive };

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
    assert.deepStrictEqual(firstMissingPositive([1, 2, 0]), 3);
    assert.deepStrictEqual(firstMissingPositive([3, 4, (-1), 1]), 2);
    assert.deepStrictEqual(firstMissingPositive([7, 8, 9, 11, 12]), 1);
}
