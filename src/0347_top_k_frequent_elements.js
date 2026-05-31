/**
 * Set - Frequency Counter | Using sort
 * Time O(NlogN) | Space O(N)
 * https://leetcode.com/problems/top-k-frequent-elements/
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
    let frequency = {};
    for (let i = 0; i < nums.length; i++) {
        if (frequency.hasOwnProperty(nums[i])) frequency[nums[i]] += 1;
        else frequency[nums[i]] = 1;
    }
    let result = Object.keys(frequency).map((key) => [
        Number(key),
        frequency[key],
    ]);
    let sortedResult = result.sort((a, b) => {
        return b[1] - a[1];
    });
    let output = [];
    for (let i = 0; i < k; i++) {
        output.push(sortedResult[i][0]);
    }
    return output;
};

/**
 * Without Sort
 * Time O(N) | Space O(k)
 * https://leetcode.com/problems/top-k-frequent-elements/
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */

var topKFrequent = function (nums, k) {
    const mp = new Map();
    const arr = new Array(nums.length + 1).fill(0);
    const ans = [];

    nums.forEach((el) => {
        const val = mp.get(el) || 0;
        mp.set(el, val + 1);
    });

    for (let [key, value] of mp) {
        const prev = arr[value] || [];
        prev.push(key);
        arr[value] = prev;
    }

    arr.reverse();
    for (let el of arr) {
        if (k < 1) break;
        if (el) {
            for (let el2 of el) {
                ans.push(el2);
                k--;
            }
        }
    }

    return ans;
};

module.exports = { topKFrequent };

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
    assert.deepStrictEqual(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
    assert.deepStrictEqual(topKFrequent([1], 1), [1]);
    assert.deepStrictEqual(topKFrequent([1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2), [1, 2]);
}
