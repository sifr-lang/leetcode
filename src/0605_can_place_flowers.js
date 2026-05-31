/**
 * Loop Solution
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/can-place-flowers
 * @param {number[]} fb
 * @param {number} n
 * @return {boolean}
 */

var canPlaceFlowers = function (fb, n) {
    if (n === 0) return true;

    for (let i = 0; i < fb.length; i++) {
        if (fb[i] === 0) {
            fb[i - 1] !== 1 && fb[i + 1] !== 1 && n-- && i++;
        } else {
            i++;
        }
        if (n === 0) return true;
    }

    return false;
};

module.exports = { canPlaceFlowers };

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
    assert.deepStrictEqual(canPlaceFlowers([1, 0, 0, 0, 1], 1), true);
    assert.deepStrictEqual(canPlaceFlowers([1, 0, 0, 0, 1], 2), false);
    assert.deepStrictEqual(canPlaceFlowers([0, 0, 1, 0, 0], 1), true);
    assert.deepStrictEqual(canPlaceFlowers([0], 1), true);
}
