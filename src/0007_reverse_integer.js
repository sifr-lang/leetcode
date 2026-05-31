/**
 * https://leetcode.com/problems/reverse-integer/
 * Time O(log(x)) | Space O(1)
 * @param {number} x
 * @return {number}
 */
var reverse = function (x, result = 0) {
    while (x !== 0) {
        const digit = x % 10;

        if (isOutOfBounds(digit, result)) return 0;

        x = Math.trunc(x / 10);
        result = result * 10 + digit;
    }

    return result;
};

const isOutOfBounds = (digit, result) => {
    const [max, min] = [2 ** 31 - 1, -(2 ** 31)];
    const [maxProduct, maxRemainder] = [max / 10, max % 10];
    const [minProduct, minRemainder] = [min / 10, min % 10];
    const isTarget = result === maxProduct;

    const isMaxOut = maxProduct < result || (isTarget && maxRemainder <= digit);
    const isMinOut = result < minProduct || (isTarget && digit <= minRemainder);

    return isMaxOut || isMinOut;
};

module.exports = { reverse };

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
    assert.deepStrictEqual(reverse(123), 321);
    assert.deepStrictEqual(reverse((-123)), (-321));
    assert.deepStrictEqual(reverse(120), 21);
    assert.deepStrictEqual(reverse(0), 0);
}
