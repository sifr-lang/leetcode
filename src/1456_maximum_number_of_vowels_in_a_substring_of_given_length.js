function maxVowels(s, k) {
    let l = 0;
    let res = 0;
    let total = 0;
    const vowels = 'aeiou';
    for (let r = 0; r < s.length; r++) {
        if (vowels.includes(s[r])) total++;
        if (r - l + 1 > k) {
            if (vowels.includes(s[l])) total--;
            l++;
        }
        res = Math.max(res, total);
    }
    return res;
}

module.exports = { maxVowels };

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
    assert.deepStrictEqual(maxVowels("abciiidef", 3), 3);
    assert.deepStrictEqual(maxVowels("aeiou", 2), 2);
}
