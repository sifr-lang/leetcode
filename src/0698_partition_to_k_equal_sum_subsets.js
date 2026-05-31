function canPartitionKSubsets(nums, k) {
    const total = nums.reduce((sum, value) => sum + value, 0);
    if (total % k !== 0) return false;
    nums.sort((a, b) => b - a);
    const target = total / k;
    const visited = new Set();
    const backtrack = (idx, count, currSum) => {
        if (count === k) return true;
        if (target === currSum) return backtrack(0, count + 1, 0);
        for (let i = idx; i < nums.length; i++) {
            if (i > 0 && !visited.has(i - 1) && nums[i] === nums[i - 1]) continue;
            if (visited.has(i) || currSum + nums[i] > target) continue;
            visited.add(i);
            if (backtrack(i + 1, count, currSum + nums[i])) return true;
            visited.delete(i);
        }
        return false;
    };
    return backtrack(0, 0, 0);
}

module.exports = { canPartitionKSubsets };

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
    assert.deepStrictEqual(canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4), true);
    assert.deepStrictEqual(canPartitionKSubsets([1, 2, 3, 4], 3), false);
}
