/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
    let minLength = Infinity;
    let leftWindow = 0;
    let currentSum = 0;

    for (let rightWindow = 0; rightWindow < nums.length; rightWindow++) {
        currentSum += nums[rightWindow];
        while (currentSum >= target) {
            minLength = Math.min(minLength, rightWindow - leftWindow + 1);
            currentSum -= nums[leftWindow];
            leftWindow++;
        }
    }
    return minLength === Infinity ? 0 : minLength;
};

module.exports = { minSubArrayLen };

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
    assert.deepStrictEqual(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]), 2);
    assert.deepStrictEqual(minSubArrayLen(4, [1, 4, 4]), 1);
    assert.deepStrictEqual(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]), 0);
}
