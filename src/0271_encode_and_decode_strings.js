function encode(strs) {
    let res = '';
    for (const s of strs) res += String(s.length) + '#' + s;
    return res;
}
function decode(s) {
    const res = [];
    let i = 0;
    while (i < s.length) {
        let j = i;
        while (s[j] !== '#') j++;
        const length = Number(s.slice(i, j));
        i = j + 1;
        j = i + length;
        res.push(s.slice(i, j));
        i = j;
    }
    return res;
}

module.exports = { encode, decode };

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
    assert.deepStrictEqual(encode(["Hello", "World"]), "5#Hello5#World");
    assert.deepStrictEqual(encode([""]), "0#");
}
