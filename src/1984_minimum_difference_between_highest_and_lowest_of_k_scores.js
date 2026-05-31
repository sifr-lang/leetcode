/**
 * Loglinear/N*log(N)
 * Time O(N*log(N)) | Space O(1)
 * https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores
 *
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minimumDifference = function(nums, k) {

    const isEdgeCase = (k === 1);
    if (isEdgeCase) return 0;

    nums = nums.sort((a, b) => {
        return a - b;
    });

    let i = 0;
    let j = k - 1;
    let minDiffrence = Infinity;

    while (j < nums.length) {
        minDiffrence = Math.min(Math.abs(nums[i] - nums[j]), minDiffrence);
        j++;
        i++;
    }

    return minDiffrence;
};

module.exports = { minimumDifference };

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
    assert.deepStrictEqual(minimumDifference([90], 1), 0);
}
