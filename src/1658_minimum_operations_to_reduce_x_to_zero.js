function minOperations(nums, x) {
    const targetSum = nums.reduce((sum, value) => sum + value, 0) - x;
    if (targetSum < 0) return -1;
    const n = nums.length;
    let minOps = -1;
    let left = 0;
    let right = 0;
    let currSum = 0;
    while (right < n) {
        currSum += nums[right];
        right++;
        while (left < n && currSum > targetSum) {
            currSum -= nums[left];
            left++;
        }
        if (currSum === targetSum) {
            const ops = n - (right - left);
            minOps = minOps === -1 ? ops : Math.min(minOps, ops);
        }
    }
    return minOps;
}

module.exports = { minOperations };

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
    assert.deepStrictEqual(minOperations([1, 1, 4, 2, 3], 5), 2);
    assert.deepStrictEqual(minOperations([5, 6, 7, 8, 9], 4), (-1));
}
