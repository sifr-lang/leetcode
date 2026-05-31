/**
 * Time O(N) | Space O(1)
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
    let ptr1 = nums.length - 2;
    let ptr2 = nums.length - 1;

    if (!nums) return 0;
    if (nums.length === 1) {
        if (nums[0] === val) return 0;
        return 1;
    }

    while (ptr1 > -1) {
        if (nums[ptr2] === val) {
            ptr2--;

            while (nums[ptr1] === val) {
                ptr2--;
                ptr1--;
            }
        } else if (nums[ptr1] === val) {
            let temp = nums[ptr1];
            nums[ptr1] = nums[ptr2];
            nums[ptr2] = temp;
            ptr2--;
        }

        ptr1--;
    }

    return ptr2 + 1;
};

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
    let n = nums.length;
    let i = 0;

    while (i < n) {
        if (nums[i] === val) {
            [nums[i], nums[n - 1]] = [nums[n - 1], nums[i]];
            n -= 1;
        } else {
            i += 1;
        }
    }

    return n;
};

module.exports = { removeElement };

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
    assert.deepStrictEqual(removeElement([3, 2, 2, 3], 3), 2);
    assert.deepStrictEqual(removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2), 5);
}
