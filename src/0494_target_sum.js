/**
 * Brute Force - DFS
 * Time O(2^N) | Space O(N)
 * https://leetcode.com/problems/target-sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = (nums, target, index = 0, sum = 0) => {
    const isBaseCase = index === nums.length;
    if (isBaseCase) {
        const isTarget = sum === target;
        if (isTarget) return 1;

        return 0;
    }

    return dfs(nums, target, index, sum); /* Time O(2^N) | Space O(HEIGHT) */
};

var dfs = (nums, target, index, sum) => {
    const left = findTargetSumWays(
        nums,
        target,
        index + 1,
        sum + nums[index],
    ); /* Time O(2^N) | Space O(HEIGHT) */
    const right = findTargetSumWays(
        nums,
        target,
        index + 1,
        sum - nums[index],
    ); /* Time O(2^N) | Space O(HEIGHT) */

    return left + right;
};

/**
 * DP - Top Down
 * Matrix - Memoization
 * Time O(N * M) | Space O(N * M)
 * https://leetcode.com/problems/target-sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = (nums, target) => {
    const total = nums.reduce((sum, num) => sum + num, 0); /* Time O(N) */

    return calculate(
        nums,
        target,
        total,
    ); /* Time O(N * M) | Space O((N * M) + HEIGHT) */
};

var initMemo = (nums, total) =>
    new Array(nums.length)
        .fill() /* Time O(N) | Space O(N) */
        .map(() =>
            new Array((total + 1) << 1).fill(null),
        ); /* Time O(M) | Space O(M) */

const calculate = (
    nums,
    target,
    total,
    index = 0,
    sum = 0,
    memo = initMemo(nums, total),
) => {
    const isBaseCase = index === nums.length;
    if (isBaseCase) {
        const isTarget = sum === target;
        if (isTarget) return 1;

        return 0;
    }

    const hasSeen = memo[index][sum + total] != null;
    if (hasSeen) return memo[index][sum + total];

    return dfs(
        nums,
        target,
        total,
        index,
        sum,
        memo,
    ); /* Time O(N * M) | Space O((N * M) + HEIGHT) */
};

var dfs = (nums, target, total, index, sum, memo) => {
    const left = calculate(
        nums,
        target,
        total,
        index + 1,
        sum + nums[index],
        memo,
    ); /* Time O(N * M) | Space O(HEIGHT) */
    const right = calculate(
        nums,
        target,
        total,
        index + 1,
        sum - nums[index],
        memo,
    ); /* Time O(N * M) | Space O(HEIGHT) */

    memo[index][sum + total] =
        left + right; /*               | Space O(N * M) */
    return memo[index][sum + total];
};

/**
 * DP - Bottom Up
 * Matrix - Tabulation
 * Time O(N * M) | Space O(N * M)
 * https://leetcode.com/problems/target-sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = (nums, target) => {
    const total = nums.reduce((sum, num) => sum + num, 0); /* Time O(N) */
    const tabu = initTabu(nums, total); /* Time O(N * M) | Space O(N * M) */

    search(nums, total, tabu); /* Time O(N * M) | Space O(N * M) */

    return Math.abs(target) <= total
        ? tabu[nums.length - 1][target + total]
        : 0;
};

var initTabu = (nums, total) => {
    const tabu = new Array(nums.length)
        .fill() /* Time O(N) | Space O(N) */
        .map(() =>
            new Array((total + 1) << 1).fill(0),
        ); /* Time O(M) | Space O(M) */
    const [left, right] = [total + nums[0], total - nums[0]];

    tabu[0][left] = 1; /*          | Space O(N * M) */
    tabu[0][right] += 1; /*          | Space O(N * M) */

    return tabu;
};

var search = (nums, total, tabu) => {
    for (let i = 1; i < nums.length; i++) {
        /* Time O(N) */
        for (let sum = -total; sum <= total; sum++) {
            /* Time O(M) */
            const isInvalid = tabu[i - 1][sum + total] <= 0;
            if (isInvalid) continue;

            const dpSum = tabu[i - 1][sum + total];
            const left = sum + nums[i] + total;
            const right = sum - nums[i] + total;

            tabu[i][left] += dpSum; /* Space O(N * M) */
            tabu[i][right] += dpSum; /* Space O(N * M) */
        }
    }
};

/**
 * DP - Top Down
 * Array - Tabulation
 * Time O(N * M) | Space O(M)
 * https://leetcode.com/problems/target-sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = (nums, target) => {
    const total = nums.reduce((sum, num) => sum + num, 0); /* Time O(N) */
    let tabu = getTabu(nums, total); /* Time O(M)     | Space O(M) */

    tabu = search(nums, total, tabu); /* Time O(N * M) | Space O(M) */

    return Math.abs(target) <= total ? tabu[target + total] : 0;
};

var initTabu = (total) =>
    new Array((total + 1) << 1).fill(0); /* Time O(M) | Space O(M) */

var getTabu = (nums, total) => {
    const tabu = initTabu(total); /* Time O(M) | Space O(M) */
    const [left, right] = [total + nums[0], total - nums[0]];

    tabu[left] = 1; /*           | Space O(M) */
    tabu[right] += 1; /*           | Space O(M) */

    return tabu;
};

var search = (nums, total, tabu) => {
    for (let i = 1; i < nums.length; i++) {
        /* Time O(N) */
        const num = nums[i];
        const temp = initTabu(total); /* Time O(M) | Space O(M) */

        tabu = update(num, total, tabu, temp); /* Time O(M) | Space O(M) */
    }

    return tabu;
};

var update = (num, total, tabu, temp) => {
    for (let sum = -total; sum <= total; sum++) {
        /* Time O(M) */
        const isInvalid = tabu[sum + total] <= 0;
        if (isInvalid) continue;

        const dpSum = tabu[sum + total];
        const left = sum + num + total;
        const right = sum - num + total;

        temp[left] += dpSum; /* Space O(M) */
        temp[right] += dpSum; /* Space O(M) */
    }

    return temp;
};

var findTargetSumWays = (nums, target) => {
    const dp = new Map();

    const backtrack = (i, total) => {
        if (i === nums.length) {
            return total === target ? 1 : 0;
        }
        const key = `${i},${total}`;
        if (dp.has(key)) {
            return dp.get(key);
        }

        dp.set(key, backtrack(i + 1, total + nums[i]) + backtrack(i + 1, total - nums[i]));
        return dp.get(key);
    };

    return backtrack(0, 0);
};

module.exports = { findTargetSumWays };

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
    assert.deepStrictEqual(findTargetSumWays([1, 1, 1, 1, 1], 3), 5);
}
