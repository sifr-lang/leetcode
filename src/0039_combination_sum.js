/**
 * https://leetcode.com/problems/combination-sum/
 * Time O(N * ((Target/MIN) + 1)) | Space O(N * (Target/Min))
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function (
    candidates,
    target,
    index = 0,
    combination = [],
    combinations = [],
) {
    const isBaseCase = target < 0;
    if (isBaseCase) return combinations;

    const isTarget = target === 0;
    if (isTarget) return combinations.push(combination.slice());

    for (let i = index; i < candidates.length; i++) {
        backTrack(candidates, target, i, combination, combinations);
    }

    return combinations;
};

const backTrack = (candidates, target, i, combination, combinations) => {
    combination.push(candidates[i]);
    combinationSum(
        candidates,
        target - candidates[i],
        i,
        combination,
        combinations,
    );
    combination.pop();
};

module.exports = { combinationSum };

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
    assert.deepStrictEqual(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
}
