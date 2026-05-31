/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
    let carry = 0;
    let maxLength = a.length;
    let result = '';

    if (a.length < b.length) {
        a = '0'.repeat(b.length - a.length) + a;
        maxLength = b.length;
    } else {
        b = '0'.repeat(a.length - b.length) + b;
    }

    for (let i = maxLength - 1; i >= 0; i--) {
        sum = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (sum % 2) + result;
        if (sum >= 2) {
            carry = 1;
        } else {
            carry = 0;
        }
    }
    if (carry) result = '1' + result;
    return result;
};

var addBinary = function (a, b) {
    let res = '';
    let carry = 0;

    a = a.split('').reverse().join('');
    b = b.split('').reverse().join('');
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const bitA = i < a.length ? a.charCodeAt(i) - '0'.charCodeAt(0) : 0;
        const bitB = i < b.length ? b.charCodeAt(i) - '0'.charCodeAt(0) : 0;
        const total = bitA + bitB + carry;
        const char = String(total % 2);
        res = char + res;
        carry = Math.floor(total / 2);
    }
    if (carry) {
        res = '1' + res;
    }
    return res;
};

module.exports = { addBinary };

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
    assert.deepStrictEqual(addBinary("11", "1"), "100");
    assert.deepStrictEqual(addBinary("1010", "1011"), "10101");
}
