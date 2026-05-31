/**
 * Time O(2^N) | Space O(N)
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = (nums, index = 0) => {
    const isBaseCase = index === nums.length - 1;
    if (isBaseCase) return true;

    const furthestJump = Math.min(index + nums[index], nums.length - 1);
    for (let nextIndex = index + 1; nextIndex <= furthestJump; nextIndex++) {
        if (canJump(nums, nextIndex)) return true;
    }

    return false;
};

/**
 * Time O(N^2) | Space O(N)
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = (nums) => {
    const memo = new Array(nums.length).fill(0);
    memo[memo.length - 1] = 1;

    return canJumpFromIndex(nums, memo);
};

const canJumpFromIndex = (nums, memo, index = 0) => {
    if (memo[index] !== 0) return memo[index] === 1;

    const furthestJump = Math.min(index + nums[index], nums.length - 1);
    for (let nextIndex = index + 1; nextIndex <= furthestJump; nextIndex++) {
        if (!canJumpFromIndex(nums, memo, nextIndex)) continue;

        memo[index] = 1;
        return true;
    }

    memo[index] = -1;
    return false;
};

/**
 * Time O(N^2) | Space O(N)
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = (nums) => {
    const memo = new Array(nums.length).fill(0);
    memo[memo.length - 1] = 1;

    for (let i = nums.length - 2; 0 <= i; i--) {
        const furthestJump = Math.min(i + nums[i], nums.length - 1);
        for (let j = i + 1; j <= furthestJump; j++) {
            const isGood = memo[j] === 1;
            if (isGood) {
                memo[i] = 1;
                break;
            }
        }
    }

    return memo[0] === 1;
};

/**
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = (nums, max = 0, index = 0) => {
    while (index < nums.length) {
        const num = nums[index];
        const jumps = num + index;

        const canNotReachEnd = max < index;
        if (canNotReachEnd) return false;

        max = Math.max(max, jumps);
        index++;
    }

    return true;
};

/**
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = (nums, right = nums.length - 1) => {
    for (let i = right; 0 <= i; i--) {
        const isJumpable = right <= i + nums[i];
        if (isJumpable) right = i;
    }

    return right === 0;
};

module.exports = { canJump };

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
    assert.deepStrictEqual(canJump([2, 3, 1, 1, 4]), true);
    assert.deepStrictEqual(canJump([3, 2, 1, 0, 4]), false);
    assert.deepStrictEqual(canJump([0]), true);
    assert.deepStrictEqual(canJump([2, 0, 0]), true);
}
