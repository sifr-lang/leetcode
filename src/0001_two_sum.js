function twoSum(nums, target) {
    const prevMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const n = nums[i];
        const diff = target - n;
        if (prevMap.has(diff)) return [prevMap.get(diff), i];
        prevMap.set(n, i);
    }
    return [];
}

module.exports = { twoSum };

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
    assert.deepStrictEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
    assert.deepStrictEqual(twoSum([3, 2, 4], 6), [1, 2]);
    assert.deepStrictEqual(twoSum([3, 3], 6), [0, 1]);
}
