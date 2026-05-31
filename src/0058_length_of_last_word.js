/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function (s) {
    let len = 0;

    for (let i in s) {
        if (s[i] != ' ') {
            if (s[i - 1] == ' ') len = 1;
            else len += 1;
        }
    }
    return len;
};

// another approach. starting out from the last so we don't have to go all the way to the end.
var lengthOfLastWord = function (s) {
    let firstCharOccurance = false;
    let lastWordLen = 0;

    for (let i = s.length - 1; i > -1; i--) {
        if (s[i] !== ' ') {
            firstCharOccurance = true;
            lastWordLen++;
        }
        if (firstCharOccurance && s[i] === ' ') {
            break;
        }
    }
    return lastWordLen;
};

module.exports = { lengthOfLastWord };

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
    assert.deepStrictEqual(lengthOfLastWord("Hello World"), 5);
    assert.deepStrictEqual(lengthOfLastWord("   fly me   to   the moon  "), 4);
    assert.deepStrictEqual(lengthOfLastWord("luffy is still joyboy"), 6);
    assert.deepStrictEqual(lengthOfLastWord("a"), 1);
}
