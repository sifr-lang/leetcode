/**
 * 2348. Number of Zero-Filled Subarrays
 * -----------------------
 * link: https://leetcode.com/problems/number-of-zero-filled-subarrays/
 *
 * description:
 * length => no of sub arrays
 * '0' => 1
 * '00' => 3
 * '000' => 6
 * '0000' => 10
 * for each zero we found count++ and adding count to result
 * if the element not zero => count = 0
 *
 * time : O(n)
 * space : O(1)
 */

/**
 * @param {number[]} nums
 * @return {number}
 */

let zeroFilledSubarray = function (nums) {
    let res = nums.filter((num) => num === 0).length;
    if (res === 0) {
        return 0;
    }

    let r = 0;
    const l = nums.length;
    while (r < l) {
        const tempSubarray = [];
        while (r < l && nums[r] === 0) {
            tempSubarray.push(nums[r]);
            r += 1;
        }
        if (tempSubarray.length > 1) {
            const tempCount = (tempSubarray.length * (tempSubarray.length - 1)) / 2;
            res += Math.trunc(tempCount);
        }

        r += 1;
    }
    return res;
};

module.exports = { zeroFilledSubarray };

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
    assert.deepStrictEqual(zeroFilledSubarray([1, 3, 0, 0, 2, 0, 0, 4]), 6);
    assert.deepStrictEqual(zeroFilledSubarray([0, 0, 0, 2, 0, 0]), 9);
}
