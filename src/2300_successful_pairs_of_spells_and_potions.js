function successfulPairs(spells, potions, success) {
    const pairs = [];
    potions.sort((a, b) => a - b);
    const n = potions.length;
    for (let i = 0; i < spells.length; i++) {
        let l = 0;
        let r = potions.length - 1;
        while (l <= r) {
            const m = Math.floor((l + r) / 2);
            if (spells[i] * potions[m] >= success) r = m - 1;
            else l = m + 1;
        }
        pairs.push(l < potions.length ? n - l : 0);
    }
    return pairs;
}

module.exports = { successfulPairs };

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
    assert.deepStrictEqual(successfulPairs([5, 1, 3], [1, 2, 3, 4, 5], 7), [4, 0, 3]);
}
