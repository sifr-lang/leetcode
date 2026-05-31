/**
 * Brute Force - Linear Search
 * Time O(N^2) | Space O(1)
 * https://leetcode.com/problems/maximum-product-subarray/
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = (nums) => {
    const isEmpty = nums.length === 0;
    if (isEmpty) return 0;

    return linearSearch(nums); /* Time O(N * N) */
};

const linearSearch = (nums, max = nums[0]) => {
    for (let index = 0; index < nums.length; index++) {
        /* Time O(N) */
        max = getMax(nums, index, max); /* Time O(N) */
    }

    return max;
};

const getMax = (nums, index, max, product = 1) => {
    for (let num = index; num < nums.length; num++) {
        /* Time O(N) */
        product *= nums[num];
        max = Math.max(max, product);
    }

    return max;
};

/**
 * Greedy - product
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/maximum-product-subarray/
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = (nums) => {
    const isEmpty = nums.length === 0;
    if (isEmpty) return 0;

    return greedySearch(nums); /* Time O(N) */
};

const greedySearch = (nums) => {
    let min = (max = product = nums[0]);

    for (let num = 1; num < nums.length; num++) {
        /* Time O(N) */
        const [minProduct, maxProduct] = [min * nums[num], max * nums[num]];

        min = Math.min(maxProduct, minProduct, nums[num]);
        max = Math.max(maxProduct, minProduct, nums[num]);

        product = Math.max(product, max);
    }

    return product;
};

module.exports = { maxProduct };

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
    assert.deepStrictEqual(maxProduct([2, 3, (-2), 4]), 6);
    assert.deepStrictEqual(maxProduct([(-2), 0, (-1)]), 0);
    assert.deepStrictEqual(maxProduct([(-2), 3, (-4)]), 24);
    assert.deepStrictEqual(maxProduct([2, (-5), (-2), (-4), 3]), 24);
}
