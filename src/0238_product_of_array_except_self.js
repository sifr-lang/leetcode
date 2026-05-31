function productExceptSelf(nums) {
    const n = nums.length;
    const result = Array(n).fill(1);
    let left = 1;
    for (let i = 0; i < n; i++) {
        result[i] = left;
        left *= nums[i];
    }
    let right = 1;
    let i = n - 1;
    while (i >= 0) {
        result[i] *= right;
        right *= nums[i];
        i--;
    }
    for (let index = 0; index < result.length; index++) {
        if (Object.is(result[index], -0)) result[index] = 0;
    }
    return result;
}

module.exports = { productExceptSelf };

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
    assert.deepStrictEqual(productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
    assert.deepStrictEqual(productExceptSelf([(-1), 1, 0, (-3), 3]), [0, 0, 9, 0, 0]);
    assert.deepStrictEqual(productExceptSelf([2, 3]), [3, 2]);
}
