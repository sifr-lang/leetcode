/**
 * https://leetcode.com/problems/combination-sum-ii/
 * Time O(2^N) | Space O(N)
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
    candidates.sort((a, b) => a - b);

    return dfs(candidates, target);
};

const dfs = (
    candidates,
    target,
    index = 0,
    combination = [],
    combinations = [],
) => {
    const isBaseCase = target < 0;
    if (isBaseCase) return combinations;

    const isTarget = target === 0;
    if (isTarget) {
        if (combination.length) combinations.push(combination.slice());

        return combinations;
    }

    for (let i = index; i < candidates.length; i++) {
        const isDuplicate = index < i && candidates[i - 1] === candidates[i];
        if (isDuplicate) continue;

        backTrack(candidates, target, i, combination, combinations);
    }

    return combinations;
};

const backTrack = (candidates, target, i, combination, combinations) => {
    combination.push(candidates[i]);
    dfs(candidates, target - candidates[i], i + 1, combination, combinations);
    combination.pop();
};

module.exports = { combinationSum2 };

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
    assert.deepStrictEqual(combinationSum2([10, 1, 2, 7, 6, 1, 5], 8), [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]);
}
