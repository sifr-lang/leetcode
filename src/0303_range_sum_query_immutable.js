/**
 * https://leetcode.com/problems/range-sum-query-immutable/
 * @param {number[]} nums
 */
class NumArray {
    constructor(nums) {
        this.prefix = [];
        let cur = 0;
        for (const n of nums) {
            cur += n;
            this.prefix.push(cur);
        }
    }

    /**
     * Time O(n) | Space O(1)
     * @param {number} left
     * @param {number} right
     * @return {number}
     */
    sumRange(left, right) {
        const r = this.prefix[right];
        const l = left > 0 ? this.prefix[left - 1] : 0;
        return r - l;
    }
}

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * var param_1 = obj.sumRange(left,right)
 */

module.exports = { NumArray };

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
    let obj = new NumArray([(-2), 0, 3, (-5), 2, (-1)]);
    assert.deepStrictEqual(obj.sumRange(0, 2), 1);
    assert.deepStrictEqual(obj.sumRange(2, 5), (-1));
    assert.deepStrictEqual(obj.sumRange(0, 5), (-3));
}
