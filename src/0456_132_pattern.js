/**
 * @param {number[]} nums
 * @return {boolean}
 */
var find132pattern = function (nums) {
    let stack = []; // [num, minLeft]
    let curMin = nums[0];

    for (n of nums.slice(1)) {
        while (stack.length > 0 && n >= stack.at(-1)[0]) {
            stack.pop();
        }
        if (stack.length > 0 && n > stack.at(-1)[1]) {
            return true;
        }

        stack.push([n, curMin]);
        curMin = Math.min(curMin, n);
    }

    return false;
};

module.exports = { find132pattern };

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
    assert.deepStrictEqual(find132pattern([1, 2, 3, 4]), false);
    assert.deepStrictEqual(find132pattern([3, 1, 4, 2]), true);
}
