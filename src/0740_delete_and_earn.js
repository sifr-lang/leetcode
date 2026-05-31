function deleteAndEarn(nums) {
    const upperLimit = Math.max(...nums) + 1;
    const store = Array(upperLimit).fill(0);
    for (const num of nums) {
        store[num] += num;
    }
    const dp = Array(upperLimit).fill(0);
    if (upperLimit > 1) {
        dp[1] = store[1];
    }
    for (let i = 2; i < upperLimit; i++) {
        dp[i] = Math.max(dp[i - 2] + store[i], dp[i - 1]);
    }
    return dp[upperLimit - 1];
}

module.exports = { deleteAndEarn };

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
    assert.deepStrictEqual(deleteAndEarn([3, 4, 2]), 6);
    assert.deepStrictEqual(deleteAndEarn([2, 2, 3, 3, 3, 4]), 9);
}
