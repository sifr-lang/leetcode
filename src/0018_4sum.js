/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
    nums.sort((a, b) => a - b);
    const results = [];

    const findNsum = (l, r, target, n, result) => {
        if (r - l + 1 < n || n < 2 || target < nums[l] * n || target > nums[r] * n) {
            return;
        }
        if (n === 2) {
            while (l < r) {
                const s = nums[l] + nums[r];
                if (s === target) {
                    results.push(result.concat([nums[l], nums[r]]));
                    l += 1;
                    while (l < r && nums[l] === nums[l - 1]) {
                        l += 1;
                    }
                } else if (s < target) {
                    l += 1;
                } else {
                    r -= 1;
                }
            }
        } else {
            for (let i = l; i <= r; i++) {
                if (i === l || (i > l && nums[i - 1] !== nums[i])) {
                    findNsum(i + 1, r, target - nums[i], n - 1, result.concat([nums[i]]));
                }
            }
        }
    };
    findNsum(0, nums.length - 1, target, 4, []);
    return results;
};

module.exports = { fourSum };

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
    assert.deepStrictEqual(fourSum([1, 0, (-1), 0, (-2), 2], 0), [[(-2), (-1), 1, 2], [(-2), 0, 0, 2], [(-1), 0, 0, 1]]);
}
