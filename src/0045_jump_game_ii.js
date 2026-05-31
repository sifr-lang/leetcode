/**
 * https://leetcode.com/problems/jump-game-ii/
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    let [left, right, jumps] = [0, 0, 0];

    while (right < nums.length - 1) {
        const maxReach = getMaxReach(nums, left, right);

        left = right + 1;
        right = maxReach;
        jumps += 1;
    }

    return jumps;
};

const getMaxReach = (nums, left, right, maxReach = 0) => {
    for (let i = left; i < right + 1; i++) {
        const reach = nums[i] + i;
        maxReach = Math.max(maxReach, reach);
    }

    return maxReach;
};

/**
 * https://leetcode.com/problems/jump-game-ii/
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
    let [jumps, currentJumpEnd, farthest] = [0, 0, 0];

    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        const canJump = i === currentJumpEnd;
        if (canJump) {
            jumps++;
            currentJumpEnd = farthest;
        }
    }

    return jumps;
};

module.exports = { jump };

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
    assert.deepStrictEqual(jump([2, 3, 1, 1, 4]), 2);
    assert.deepStrictEqual(jump([2, 3, 0, 1, 4]), 2);
    assert.deepStrictEqual(jump([1, 2, 3]), 2);
    assert.deepStrictEqual(jump([0]), 0);
}
