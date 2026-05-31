/**
 * @param {string} s
 * @return {number}
 */
var countPalindromicSubsequence = function (s) {
    let count = 0;
    let chars = new Set(s);
    for (const char of chars) {
        let first = s.indexOf(char),
            last = s.lastIndexOf(char);
        count += new Set(s.slice(first + 1, last)).size;
    }
    return count;
};

module.exports = { countPalindromicSubsequence };

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
    assert.deepStrictEqual(countPalindromicSubsequence("aabca"), 3);
    assert.deepStrictEqual(countPalindromicSubsequence("adc"), 0);
    assert.deepStrictEqual(countPalindromicSubsequence("bbcbaba"), 4);
}
