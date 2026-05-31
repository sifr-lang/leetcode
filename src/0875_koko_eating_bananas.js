/**
 * @param {number[]} piles
 * @param {number} h
 * Time O(N * log(M)) | Space O(1)
 * @return {number}
 */
var minEatingSpeed = function (piles, h) {
    let [left, right] = [1, Math.max(...piles)];

    while (left < right) {
        const mid = (left + right) >> 1;
        const hourSpent = getHourSpent(mid, piles);

        const isTargetGreater = h < hourSpent;
        if (isTargetGreater) left = mid + 1;

        const isTargetLess = hourSpent <= h;
        if (isTargetLess) right = mid;
    }

    return right;
};

const getHourSpent = (mid, piles, hourSpent = 0) => {
    for (const pile of piles) {
        hourSpent += Math.ceil(pile / mid);
    }

    return hourSpent;
};

module.exports = { minEatingSpeed };

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
    assert.deepStrictEqual(minEatingSpeed([3, 6, 7, 11], 8), 4);
    assert.deepStrictEqual(minEatingSpeed([30, 11, 23, 4, 20], 5), 30);
}
