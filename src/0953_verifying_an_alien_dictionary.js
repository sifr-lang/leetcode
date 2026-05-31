var isAlienSorted = function (words, order) {
    // first differing char
    // if word A is prefix of word B, word B must be AFTER word A
    orderInd = new Map();
    {
        let ind = 0;
        for (const c of order) orderInd.set(c, ind++);
    }

    for (let i = 0; i < words.length - 1; i++) {
        let w1 = words[i],
            w2 = words[i + 1];

        for (let j = 0; j < w1.length; j++) {
            if (j == w2.length) return false;

            if (w1.charAt(j) != w2.charAt(j))
                if (orderInd.get(w2.charAt(j)) < orderInd.get(w1.charAt(j)))
                    return false;
                else break;
        }
    }
    return true;
};

module.exports = { isAlienSorted };

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
    assert.deepStrictEqual(isAlienSorted(["hello", "leetcode"], "hlabcdefgijkmnopqrstuvwxyz"), true);
    assert.deepStrictEqual(isAlienSorted(["word", "world", "row"], "worldabcefghijkmnpqstuvxyz"), false);
    assert.deepStrictEqual(isAlienSorted(["apple", "app"], "abcdefghijklmnopqrstuvwxyz"), false);
}
