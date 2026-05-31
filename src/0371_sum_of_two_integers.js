/**
 * https://leetcode.com/problems/sum-of-two-integers/
 * Time O(1) | Space O(1)
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function (a, b) {
    while (b !== 0) {
        const [xor, carry] = [a ^ b, (a & b) << 1];

        a = xor;
        b = carry;
    }

    return a;
};

var getSum = function (a, b) {
    const add = (left, right) => {
        if (!left || !right) {
            return left || right;
        }
        return add(left ^ right, (left & right) << 1);
    };

    if (a * b < 0) {
        if (a > 0) {
            return getSum(b, a);
        }
        if (add(~a, 1) === b) {
            return 0;
        }
        if (add(~a, 1) < b) {
            return add(~add(add(~a, 1), add(~b, 1)), 1);
        }
    }
    return add(a, b);
};

module.exports = { getSum };

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
    assert.deepStrictEqual(getSum(1, 2), 3);
    assert.deepStrictEqual(getSum(2, 3), 5);
}
