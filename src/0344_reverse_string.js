/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
    let i = 0,
        j = s.length - 1;

    while (i <= j) {
        let leftval = s[i],
            rightval = s[j];
        s[i] = rightval;
        s[j] = leftval;

        i++;
        j--;
    }
};

module.exports = { reverseString };

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
    let arg0 = ["h", "e", "l", "l", "o"];
    let _result = reverseString(arg0);
    assert.deepStrictEqual(arg0, ["o", "l", "l", "e", "h"]);
    arg0 = ["H", "a", "n", "n", "a", "h"];
    _result = reverseString(arg0);
    assert.deepStrictEqual(arg0, ["h", "a", "n", "n", "a", "H"]);
}
