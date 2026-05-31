/**
 * Greedy | Sliding Window | PrefixSum
 * Time O(n) | Space O(1)
 * https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/
 * @param {number[]} cardPoints
 * @param {number} k
 * @return {number}
 */
var maxScore = function (cardPoints, k) {
    const total = cardPoints.reduce((acc, curr) => acc + curr, 0);
    let currTotal = cardPoints
        .slice(0, cardPoints.length - k)
        .reduce((acc, curr) => acc + curr, 0);
    let max = total - currTotal;

    let left = 0;
    let right = cardPoints.length - k - 1; // -1 because the array is 0 indexed.

    while (right < cardPoints.length) {
        currTotal -= cardPoints[left];
        left++;
        right++;
        if (right < cardPoints.length) {
            currTotal += cardPoints[right];
            max = Math.max(max, total - currTotal);
        }
    }

    return max;
};

var maxScore = function (cardPoints, k) {
    const n = cardPoints.length;
    let score = 0;
    for (let i = 0; i < k; i++) score += cardPoints[i];
    let best = score;

    for (let i = 1; i < k + 1; i++) {
        score += cardPoints[n - i] - cardPoints[k - i];
        best = Math.max(best, score);
    }
    return best;
};

module.exports = { maxScore };

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
    assert.deepStrictEqual(maxScore([1, 2, 3, 4, 5, 6, 1], 3), 12);
}
