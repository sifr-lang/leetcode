/**
 * Time O(N) | Space O(1)
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
    if (!s.length || s === t) return true;
    if (s.length > t.length) return false;

    let j = 0;

    for (let i = 0; i < t.length && j < s.length; i++) {
        if (s[j] === t[i]) {
            j++;
        }
    }

    return j === s.length;
};

/**
 * Time O(N^2) | Space O(1)
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
    let si = 0;
    let ti = 0;
    while (si < s.length && ti < t.length) {
        if (s[si] === t[ti]) {
            si += 1;
        }
        ti += 1;
    }
    return si === s.length;
};

module.exports = { isSubsequence };

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
    assert.deepStrictEqual(isSubsequence("abc", "ahbgdc"), true);
    assert.deepStrictEqual(isSubsequence("axc", "ahbgdc"), false);
    assert.deepStrictEqual(isSubsequence("", "ahbgdc"), true);
    assert.deepStrictEqual(isSubsequence("ace", "abcde"), true);
}
