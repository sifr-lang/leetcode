/**
 * https://leetcode.com/problems/gas-station/
 * Time: O(n)
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function (gas, cost) {
    let netDistance = 0;
    let res = 0;

    //Checks if theres enough gas to complete a cycle
    if (gas.reduce((a, b) => a + b) - cost.reduce((a, b) => a + b) < 0)
        return -1;

    // Finds the first appearence of a positive netDistance, if the cycle can't
    // be completed (netDistance < 0), starts cycle again @ the next positive netDistance value.
    for (let i = 0; i < gas.length; i++) {
        netDistance += gas[i] - cost[i];

        if (netDistance < 0) {
            netDistance = 0;
            res = i + 1;
        }
    }

    return res;
};

/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function (gas, cost) {
    let [totalTank, currTank, startingStation] = [0, 0, 0];

    for (let i = 0; i < gas.length; i++) {
        totalTank += gas[i] - cost[i];
        currTank += gas[i] - cost[i];

        const isEmpty = currTank < 0;
        if (isEmpty) {
            startingStation = i + 1;
            currTank = 0;
        }
    }

    return 0 <= totalTank ? startingStation : -1;
};

module.exports = { canCompleteCircuit };

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
    assert.deepStrictEqual(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3);
    assert.deepStrictEqual(canCompleteCircuit([2, 3, 4], [3, 4, 3]), (-1));
    assert.deepStrictEqual(canCompleteCircuit([5, 1, 2, 3, 4], [4, 4, 1, 5, 1]), 4);
}
