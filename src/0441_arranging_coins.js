/**
 * https://leetcode.com/problems/arranging-coins/
 * Linear time
 * Time O(n) | Space O(1)
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function (n) {
    let steps = 1;
    let canBuild = 0;

    while (n >= steps) {
        n = n - steps;
        canBuild++;
        steps++;
    }

    return canBuild || 1;
};

/**
 * Binary Search
 * Time O(log(n)) | Space O(1)
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function (n) {
    let left = 1;
    let right = n;
    let result = 0;

    while (left <= right) {
        const mid = Math.floor((right + left) / 2);
        const total = (1 + mid) * (mid / 2);
        if (n < total) {
            right = mid - 1;
        } else {
            left = mid + 1;
            result = Math.max(result, mid);
        }
    }

    return result;
};

/**
 * Math
 * Time O(1) | Space O(1)
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function (n) {
    let l = 1;
    let r = n;
    let res = 0;
    while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        const coins = (mid / 2) * (mid + 1);
        if (coins > n) {
            r = mid - 1;
        } else {
            l = mid + 1;
            res = Math.max(mid, res);
        }
    }
    return res;
};

module.exports = { arrangeCoins };

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
    assert.deepStrictEqual(arrangeCoins(5), 2);
    assert.deepStrictEqual(arrangeCoins(8), 3);
}
