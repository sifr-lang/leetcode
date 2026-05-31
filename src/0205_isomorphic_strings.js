var isIsomorphic = function (s, t) {
    if (s.length !== t.length) return false;

    const mapOne = new Map();
    const mapTwo = new Map();

    for (let i = 0; i < s.length; i++) {
        if (mapOne.has(s[i])) {
            if (mapOne.get(s[i]) !== t[i]) return false;
        } else mapOne.set(s[i], t[i]);

        if (mapTwo.has(t[i])) {
            if (mapTwo.get(t[i]) !== s[i]) return false;
        } else mapTwo.set(t[i], s[i]);
    }

    return true;
};

module.exports = { isIsomorphic };

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
    assert.deepStrictEqual(isIsomorphic("egg", "add"), true);
    assert.deepStrictEqual(isIsomorphic("foo", "bar"), false);
}
