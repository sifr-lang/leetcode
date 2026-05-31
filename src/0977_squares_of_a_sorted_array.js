/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
    let left = 0;
    let right = nums.length - 1;

    const answer = [];

    while (left <= right) {
        const leftSqr = Math.pow(nums[left], 2);
        const rightSqr = Math.pow(nums[right], 2);

        if (leftSqr > rightSqr) {
            answer.push(leftSqr);
            left++;
        } else {
            answer.push(rightSqr);
            right--;
        }
    }
    return answer.reverse();
};

module.exports = { sortedSquares };

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
    assert.deepStrictEqual(sortedSquares([(-4), (-1), 0, 3, 10]), [0, 1, 9, 16, 100]);
}
