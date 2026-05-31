// problem link https://leetcode.com/problems/word-pattern
// time coplexity O(n)
// space complexity O(n)

var wordPattern = function (pattern, s) {
    s = s.split(' ');

    if (s.length !== pattern.length) return false;

    wordToChar = new Map();
    charToWord = new Map();

    for (let i = 0; i < pattern.length; i++) {
        wordToChar.set(s[i], pattern[i]);
        charToWord.set(pattern[i], s[i]);
    }

    for (let i = 0; i < pattern.length; i++) {
        if (
            charToWord.get(pattern[i]) !== s[i] ||
            pattern[i] !== wordToChar.get(s[i])
        ) {
            return false;
        }
    }

    return true;
};

module.exports = { wordPattern };

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
    assert.deepStrictEqual(wordPattern("abba", "dog cat cat dog"), true);
    assert.deepStrictEqual(wordPattern("abba", "dog cat cat fish"), false);
}
