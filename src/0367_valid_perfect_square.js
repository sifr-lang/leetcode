/**
 * @param {number} num
 * @return {boolean}
 */
var isPerfectSquare = function (num) {
    for (let i = 1; i <= num; i++) {
        if (i * i === num) {
            return true;
        }
        if (i * i > num) {
            return false;
        }
    }
    return false;
};

module.exports = { isPerfectSquare };

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
    assert.deepStrictEqual(isPerfectSquare(16), true);
    assert.deepStrictEqual(isPerfectSquare(14), false);
}
