/**
 * https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
 * Time O(N) | Space O(1)
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
    let [left, right] = [0, numbers.length - 1];

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        const isTarget = sum === target;
        if (isTarget) return [left + 1, right + 1];

        const isTargetGreater = sum < target;
        if (isTargetGreater) left++;

        const isTargetLess = target < sum;
        if (isTargetLess) right--;
    }

    return [-1, -1];
};

module.exports = { twoSum };

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
    assert.deepStrictEqual(twoSum([2, 7, 11, 15], 9), [1, 2]);
    assert.deepStrictEqual(twoSum([2, 3, 4], 6), [1, 3]);
}
