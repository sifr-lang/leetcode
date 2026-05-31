/**
 * @param {number[]} nums
 * @param {number} target
 * Time O(log(N)) | Space O(1)
 * @return {number}
 */
var search = (nums, target) => {
    let [left, right] = [0, nums.length - 1];

    while (left <= right) {
        const mid = (left + right) >> 1;
        const guess = nums[mid];
        const [leftNum, rightNum] = [nums[left], nums[right]];

        const isTarget = guess === target;
        if (isTarget) return mid;

        const isAscending = leftNum <= guess;
        if (isAscending) {
            const isInRange = leftNum <= target;
            const isLess = target < guess;

            const isTargetGreater = !(isInRange && isLess);
            if (isTargetGreater) left = mid + 1;

            const isTargetLess = isInRange && isLess;
            if (isTargetLess) right = mid - 1;
        }

        const isDescending = guess < leftNum;
        if (isDescending) {
            const isGreater = guess < target;
            const isInRange = target <= rightNum;

            const isTargetGreater = isGreater && isInRange;
            if (isTargetGreater) left = mid + 1;

            const isTargetLess = !(isGreater && isInRange);
            if (isTargetLess) right = mid - 1;
        }
    }

    return -1;
};

module.exports = { search };

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
    assert.deepStrictEqual(search([4, 5, 6, 7, 0, 1, 2], 0), 4);
    assert.deepStrictEqual(search([4, 5, 6, 7, 0, 1, 2], 3), (-1));
    assert.deepStrictEqual(search([1], 0), (-1));
}
