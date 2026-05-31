/**
 * HashMap and Stack
 * Time O(N + M) | Space O(N)
 * https://leetcode.com/problems/next-greater-element-i
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */

var nextGreaterElement = function (nums1, nums2) {
    const subsetMap = new Map(nums1.map((val, i) => [val, i]));
    const res = new Array(nums1.length).fill(-1);

    let stack = [];

    for (let num of nums2) {
        while (stack.length && num > stack.at(-1)) {
            const val = stack.pop();
            const idx = subsetMap.get(val);
            res[idx] = num;
        }

        if (subsetMap.has(num)) stack.push(num);
    }

    return res;
};

module.exports = { nextGreaterElement };

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
    assert.deepStrictEqual(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), [(-1), 3, (-1)]);
}
