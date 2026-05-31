/**
 * Boyer Moore Algorithm
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/majority-element
 * @param {number[]} nums
 * @return {number}
 */

var majorityElement = function (nums) {
    let res = nums[0];
    let count = 1;

    for (let i = 1; i < nums.length - 1; i++) {
        if (nums[i] === res) count++;
        else if (!--count) {
            res = nums[i + 1];
            count = 0;
        }
    }

    return res;
};

/**
 * HashMap
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/majority-element
 * @param {number[]} nums
 * @return {number}
 */

var majorityElement = function (nums) {
    let candidate = nums[0];
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        if (count === 0) {
            candidate = nums[i];
        }
        if (nums[i] === candidate) {
            count += 1;
        } else {
            count -= 1;
        }
    }
    return candidate;
};

module.exports = { majorityElement };

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
    assert.deepStrictEqual(majorityElement([3, 2, 3]), 3);
    assert.deepStrictEqual(majorityElement([2, 2, 1, 1, 1, 2, 2]), 2);
    assert.deepStrictEqual(majorityElement([1]), 1);
    assert.deepStrictEqual(majorityElement([6, 5, 5]), 5);
}
