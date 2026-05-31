/**
 * @param {number[][]} points
 * @return {number}
 */
var maxPoints = function (points) {
    let res = 1;

    for (let i = 0; i < points.length; i++) {
        const count = new Map();
        const point1 = points[i];
        for (let j = i + 1; j < points.length; j++) {
            const point2 = points[j];
            let slope;
            if (point2[0] === point1[0]) {
                slope = Number.MAX_SAFE_INTEGER;
            } else {
                slope = (point2[1] - point1[1]) / (point2[0] - point1[0]);
            }
            !count.has(slope)
                ? count.set(slope, 2)
                : count.set(slope, count.get(slope) + 1);

            res = Math.max(res, count.get(slope));
        }
    }
    return res;
};

module.exports = { maxPoints };

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
    assert.deepStrictEqual(maxPoints([[1, 1], [2, 2], [3, 3]]), 3);
    assert.deepStrictEqual(maxPoints([[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]), 4);
}
