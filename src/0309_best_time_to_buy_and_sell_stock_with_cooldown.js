/**
 * Greedy - State Machine
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = (prices) => {
    let [sold, held, reset] = [-Infinity, -Infinity, 0];

    [sold, reset] = search(prices, sold, held, reset); /* Time O(N) */

    return Math.max(sold, reset);
};

var search = (prices, sold, held, reset) => {
    for (const price of prices) {
        /* Time O(N) */
        const preSold = sold;

        sold = held + price;
        held = Math.max(held, reset - price);
        reset = Math.max(reset, preSold);
    }

    return [sold, reset];
};

/**
 * DP - Bottom Up
 * Array - Tabulation
 * Time O(N^2) | Space O(N)
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = (prices) => {
    const tabu = initTabu(prices); /* Space O(N) */

    search(prices, tabu); /* Time O(N * N) */

    return tabu[0];
};

var initTabu = (prices) => new Array(prices.length + 2).fill(0);

var search = (prices, tabu) => {
    for (let i = prices.length - 1; 0 <= i; i--) {
        /* Time O(N) */
        const prev = buyAndSell(prices, i, tabu); /* Time O(N) */
        const next = tabu[i + 1];

        tabu[i] = Math.max(prev, next); /* Space O(N) */
    }
};

const buyAndSell = (prices, i, tabu, max = 0) => {
    for (let sell = i + 1; sell < prices.length; sell++) {
        /* Time O(N) */
        const profit = prices[sell] - prices[i] + tabu[sell + 2];

        max = Math.max(max, profit);
    }

    return max;
};

var maxProfit = (prices) => {
    const dp = new Map();

    const dfs = (i, buying) => {
        if (i >= prices.length) {
            return 0;
        }
        const key = `${i},${buying}`;
        if (dp.has(key)) {
            return dp.get(key);
        }

        const cooldown = dfs(i + 1, buying);
        if (buying) {
            const buy = dfs(i + 1, !buying) - prices[i];
            dp.set(key, Math.max(buy, cooldown));
        } else {
            const sell = dfs(i + 2, !buying) + prices[i];
            dp.set(key, Math.max(sell, cooldown));
        }
        return dp.get(key);
    };

    return dfs(0, true);
};

module.exports = { maxProfit };

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
    assert.deepStrictEqual(maxProfit([1, 2, 3, 0, 2]), 3);
    assert.deepStrictEqual(maxProfit([1]), 0);
}
