/**
 * https://leetcode.com/problems/find-pivot-index/
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
    const totalSum = nums.reduce((sum, el) => {
        sum += el;
        return sum;
    }, 0);
    let pos = 0;
    let leftSum = 0;
    while (pos <= nums.length - 1) {
        if (leftSum === totalSum - nums[pos] - leftSum) {
            return pos;
        }
        leftSum += nums[pos];
        pos++;
    }
    return -1;
};

module.exports = { pivotIndex };

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
    assert.deepStrictEqual(pivotIndex([1, 7, 3, 6, 5, 6]), 3);
    assert.deepStrictEqual(pivotIndex([1, 2, 3]), (-1));
}
