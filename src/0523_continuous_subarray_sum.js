/**
 * https://leetcode.com/problems/continuous-subarray-sum/
 * Hasing
 * Time O(n) | Space O(n)
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var checkSubarraySum = function (arr, k) {
    let sum = 0;
    const remainderMap = new Map([[0, -1]]);

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (remainderMap.has(sum % k) && i - remainderMap.get(sum % k) > 1) {
            return true;
        }
        if (!remainderMap.has(sum % k)) {
            remainderMap.set(sum % k, i);
        }
    }

    return false;
};

module.exports = { checkSubarraySum };

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
    assert.deepStrictEqual(checkSubarraySum([23, 2, 4, 6, 7], 6), true);
}
