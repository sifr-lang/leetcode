function permuteUnique(nums) {
    const result = [];
    const counter = new Map();
    for (const n of nums) counter.set(n, (counter.get(n) || 0) + 1);
    const backtrack = (perm) => {
        if (perm.length === nums.length) result.push(perm.slice());
        for (const n of counter.keys()) {
            if (counter.get(n) === 0) continue;
            perm.push(n);
            counter.set(n, counter.get(n) - 1);
            backtrack(perm);
            perm.pop();
            counter.set(n, counter.get(n) + 1);
        }
    };
    backtrack([]);
    return result;
}

module.exports = { permuteUnique };

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
    assert.deepStrictEqual(permuteUnique([1, 1, 2]), [[1, 1, 2], [1, 2, 1], [2, 1, 1]]);
}
