function combinationSum4(nums, target) {
    const cache = new Map([[0, 1]]);
    for (let total = 1; total <= target; total++) {
        let count = 0;
        for (const n of nums) {
            count += cache.get(total - n) || 0;
        }
        cache.set(total, count);
    }
    return cache.get(target);
}

module.exports = { combinationSum4 };

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
    assert.deepStrictEqual(combinationSum4([1, 2, 3], 4), 7);
}
