// Time complexity: O(n)
// Space complexity: O(n)

var mergeAlternately = function (word1, word2) {
    const buffer = [];

    for (let i = 0; i < word1.length || i < word2.length; i++) {
        if (i < word1.length) buffer.push(word1[i]);
        if (i < word2.length) buffer.push(word2[i]);
    }

    return buffer.join('');
};

module.exports = { mergeAlternately };

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
    assert.deepStrictEqual(mergeAlternately("abc", "pqr"), "apbqcr");
    assert.deepStrictEqual(mergeAlternately("ab", "pqrs"), "apbqrs");
    assert.deepStrictEqual(mergeAlternately("abcd", "pq"), "apbqcd");
}
