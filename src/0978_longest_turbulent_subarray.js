/**
 * Two Pointers | Greedy
 * Time O(n) | Space O(1)
 * https://leetcode.com/problems/longest-turbulent-subarray/
 * @param {number[]} arr
 * @return {number}
 */
var maxTurbulenceSize = function (arr) {
    const higherAndLower = (start) => {
        let i = start;
        let shouldBeLow = true;

        while (i + 1 < arr.length) {
            if (shouldBeLow && arr[i + 1] > arr[i]) break;
            if (!shouldBeLow && arr[i + 1] < arr[i]) break;
            if (arr[i + 1] === arr[i]) break;
            shouldBeLow = !shouldBeLow;
            i++;
        }

        return i;
    };

    const lowerAndHigher = (start) => {
        let i = start;
        let shouldBeHigh = true;

        while (i + 1 < arr.length) {
            if (shouldBeHigh && arr[i + 1] < arr[i]) break;
            if (!shouldBeHigh && arr[i + 1] > arr[i]) break;
            if (arr[i + 1] === arr[i]) break;
            shouldBeHigh = !shouldBeHigh;
            i++;
        }

        return i;
    };

    let left = 0;
    let right = 1;
    let max = 1;

    while (right < arr.length) {
        if (arr[left] > arr[right]) {
            right = higherAndLower(left);
            max = Math.max(right - left + 1, max);
            left = right;
            right = right + 1;
            continue;
        }

        if (arr[left] < arr[right]) {
            right = lowerAndHigher(left);
            max = Math.max(right - left + 1, max);
            left = right;
            right = right + 1;
            continue;
        }

        if (arr[left] === arr[right]) {
            left++;
            right++;
        }
    }

    return max;
};

module.exports = { maxTurbulenceSize };

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
    assert.deepStrictEqual(maxTurbulenceSize([9, 4, 2, 10, 7, 8, 8, 1, 9]), 5);
    assert.deepStrictEqual(maxTurbulenceSize([100]), 1);
}
