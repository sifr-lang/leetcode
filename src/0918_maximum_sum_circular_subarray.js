/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubarraySumCircular = function (nums) {
    let [globalMax, globalMin] = [nums[0], nums[0]];
    let [currentMax, currentMin] = [0, 0];
    let total = 0;

    for (num of nums) {
        currentMax = Math.max(num, currentMax + num);
        currentMin = Math.min(num, currentMin + num);
        total += num;
        globalMax = Math.max(globalMax, currentMax);
        globalMin = Math.min(globalMin, currentMin);
    }

    return globalMax > 0 ? Math.max(globalMax, total - globalMin) : globalMax;
};

module.exports = { maxSubarraySumCircular };

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
    assert.deepStrictEqual(maxSubarraySumCircular([1, (-2), 3, (-2)]), 3);
    assert.deepStrictEqual(maxSubarraySumCircular([5, (-3), 5]), 10);
    assert.deepStrictEqual(maxSubarraySumCircular([(-3), (-2), (-3)]), (-2));
}
