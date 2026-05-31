/**
 * @param {number} n
 * @return {number}
 */
const Memo = {};

var tribonacci = function (n) {
    if (n in Memo) return Memo[n];
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 1;
    Memo[n] = tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
    return Memo[n];
};

module.exports = { tribonacci };

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
    assert.deepStrictEqual(tribonacci(4), 4);
    assert.deepStrictEqual(tribonacci(25), 1389537);
}
