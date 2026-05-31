/**
 * DP - Top Down
 * Hash Map - Memoization
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/min-cost-climbing-stairs/
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = (cost, i = cost.length, memo = new Map()) => {
    const isBaseCase = i <= 1;
    if (isBaseCase) return 0;

    if (memo.has(i)) return memo.get(i);

    const [prev, prevPrev] = [i - 1, i - 2];
    const downOne =
        minCostClimbingStairs(cost, prev, memo) +
        cost[prev]; /* Time O(N) | Space O(N) */
    const downTwo =
        minCostClimbingStairs(cost, prevPrev, memo) +
        cost[prevPrev]; /* Time O(N) | Space O(N) */

    memo.set(i, Math.min(downOne, downTwo));

    return memo.get(i);
};

/**
 * DP - Bottom Up
 * Array - Tabulation
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/min-cost-climbing-stairs/
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = (cost) => {
    const tabu = new Array(cost.length + 1).fill(0);

    for (let i = 2; i < tabu.length; i++) {
        const [prev, prevPrev] = [i - 1, i - 2];
        const downOne = tabu[prev] + cost[prev];
        const downTwo = tabu[prevPrev] + cost[prevPrev];

        tabu[i] = Math.min(downOne, downTwo);
    }

    return tabu[tabu.length - 1];
};

/**
 * DP - Bottom Up
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/min-cost-climbing-stairs/
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = (cost) => {
    let [downOne, downTwo] = [0, 0];

    for (let i = 2; i < cost.length + 1; i++) {
        /* Time O(N) */
        const temp = downOne;

        const [_prev, _prevPrev] = [i - 1, i - 2];
        const prev = downOne + cost[_prev];
        const prevPrev = downTwo + cost[_prevPrev];

        downOne = Math.min(prev, prevPrev);
        downTwo = temp;
    }

    return downOne;
};

module.exports = { minCostClimbingStairs };

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
    assert.deepStrictEqual(minCostClimbingStairs([10, 15, 20]), 15);
}
