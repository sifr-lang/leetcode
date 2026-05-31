/**
 * Submission Details:
 * https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/
 * Time O(n * m), Space O(1)
 * Runtime: 48ms (beats 91.92%) || 41.6mb (beats 78.25%)
 */

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
    if (needle.length == 0) return 0;
    for (let i = 0; i < haystack.length; i++) {
        let k = i,
            j = 0;
        while (haystack[k] == needle[j] && j < needle.length) {
            (k++, j++);
        }
        if (j == needle.length) return i;
    }
    return -1;
};

module.exports = { strStr };

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
    assert.deepStrictEqual(strStr("sadbutsad", "sad"), 0);
    assert.deepStrictEqual(strStr("leetcode", "leeto"), (-1));
}
