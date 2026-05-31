/**
 * Expand Around Center
 * Time O(N^2) | Space O(1)
 * https://leetcode.com/problems/longest-palindromic-substring/
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = (s) => {
    const isEmpty = s.length === 0;
    if (isEmpty) return '';

    const [left, right] = search(s); /* Time O(N * N) */

    return s.slice(
        left,
        right + 1,
    ); /* Time O(N * N) | Ignore Auxillary Space (N) */
};

const search = (s, left = 0, right = 0) => {
    for (let index = 0; index < s.length; index++) {
        /* Time O(N) */
        const len1 = getLength(s, index, index); /* Time O(N) */
        const len2 = getLength(s, index, index + 1); /* Time O(N) */
        const [length, window] = [Math.max(len1, len2), right - left];

        const canSkip = length <= window;
        if (canSkip) continue;

        left = index - ((length - 1) >> 1);
        right = index + (length >> 1);
    }

    return [left, right];
};

const getLength = (s, left, right) => {
    const canExpand = () => 0 <= left && right < s.length;
    const isSame = () => s[left] === s[right];

    const isPalindrome = () => canExpand() && isSame();
    while (isPalindrome()) {
        left--;
        right++;
    } /* Time O(N) */

    const window = right - left - 1;

    return window;
};

module.exports = { longestPalindrome };

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
    assert.ok(["bab", "aba"].includes(longestPalindrome("babad")));
    assert.deepStrictEqual(longestPalindrome("cbbd"), "bb");
}
