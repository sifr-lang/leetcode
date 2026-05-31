/**
 * Brute Force
 * Time O(N^2) | Space O(1)
 * https://leetcode.com/problems/number-of-pairs-of-interchangeable-rectangles
 * @param {number[][]} rectangles
 * @return {number}
 */
var interchangeableRectangles = (rectangles) => {
    let totalPair = 0;
    for (let i = 0; i < rectangles.length; i++) {
        for (let j = i + 1; j < rectangles.length; j++) {
            if (
                rectangles[i][1] / rectangles[i][0] ===
                rectangles[j][1] / rectangles[j][0]
            ) {
                totalPair++;
            }
        }
    }
    return totalPair;
};
/**
 * Linear
 * Time O(N) | Space O(n)
 * @param {number[][]} rectangles
 * @return {number}
 */
var interchangeableRectangles = (rectangles) => {
    const ratioFrequency = {};

    for (let i = 0; i < rectangles.length; i++) {
        const ratio = rectangles[i][1] / rectangles[i][0];
        if (ratioFrequency[ratio.toString()]) {
            ratioFrequency[ratio.toString()] += 1;
        } else {
            ratioFrequency[ratio.toString()] = 1;
        }
    }

    let totalPair = 0;
    for (const key in ratioFrequency) {
        if (ratioFrequency[key] !== 1) {
            totalPair += (ratioFrequency[key] * (ratioFrequency[key] - 1)) / 2;
        }
    }

    return totalPair;
};

module.exports = { interchangeableRectangles };

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
    assert.deepStrictEqual(interchangeableRectangles([[4, 8], [3, 6], [10, 20], [15, 30]]), 6);
    assert.deepStrictEqual(interchangeableRectangles([[4, 5], [7, 8]]), 0);
}
