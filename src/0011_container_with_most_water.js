/**
 * https://leetcode.com/problems/container-with-most-water/
 * Two pointers, Time O(N) | Space(1)
 * @param {number[]} height
 * @return {number}
 */

var maxArea = function (height) {
    let [left, right, max] = [0, height.length - 1, 0];

    while (left < right) {
        let containerHeight, area;
        let containerWidth = right - left;

        if (height[left] < height[right]) {
            containerHeight = height[left];
            left++;
        } else {
            containerHeight = height[right];
            right--;
        }

        area = containerWidth * containerHeight;

        if (area > max) {
            max = area;
        }
    }

    return max;
};

module.exports = { maxArea };

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
    assert.deepStrictEqual(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    assert.deepStrictEqual(maxArea([1, 1]), 1);
}
