var isUgly = function (n) {
    if (n <= 0) return false;

    for (const p of [2, 3, 5]) while (n % p == 0) n = n / p;
    return n == 1;
};

module.exports = { isUgly };

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
    assert.deepStrictEqual(isUgly(6), true);
    assert.deepStrictEqual(isUgly(1), true);
    assert.deepStrictEqual(isUgly(14), false);
}
