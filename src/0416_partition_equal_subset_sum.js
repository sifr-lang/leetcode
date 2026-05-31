function canPartition(nums) {
    const total = nums.reduce((sum, value) => sum + value, 0);
    if (total % 2) return false;
    let dp = new Set([0]);
    const target = Math.floor(total / 2);
    for (let i = nums.length - 1; i >= 0; i--) {
        const nextDP = new Set();
        for (const t of dp) {
            if (t + nums[i] === target) return true;
            nextDP.add(t + nums[i]);
            nextDP.add(t);
        }
        dp = nextDP;
    }
    return false;
}

module.exports = { canPartition };

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
    assert.deepStrictEqual(canPartition([1, 5, 11, 5]), true);
    assert.deepStrictEqual(canPartition([1, 2, 3, 5]), false);
}
