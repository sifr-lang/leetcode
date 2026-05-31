function countOdds(low, high) {
    if (low % 2 !== 0 || high % 2 !== 0) return Math.floor((high - low) / 2) + 1;
    return Math.floor((high - low) / 2);
}

module.exports = { countOdds };

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
    assert.deepStrictEqual(countOdds(3, 7), 3);
    assert.deepStrictEqual(countOdds(8, 10), 1);
}
