/**
 * @param {number[][]} costs
 * @return {number}
 */
const twoCitySchedCost = (costs) => {
    const diffs = [];
    for (const [c1, c2] of costs) {
        diffs.push([c2 - c1, c1, c2]);
    }
    diffs.sort((a, b) => a[0] - b[0]);
    let res = 0;
    for (let i = 0; i < diffs.length; i++) {
        if (i < diffs.length / 2) {
            res += diffs[i][2];
        } else {
            res += diffs[i][1];
        }
    }
    return res;
};

module.exports = { twoCitySchedCost };

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
    assert.deepStrictEqual(twoCitySchedCost([[10, 20], [30, 200], [400, 50], [30, 20]]), 110);
}
