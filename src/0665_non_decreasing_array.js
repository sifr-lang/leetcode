/**
 * @param {number[]} nums
 * @return {boolean}
 */
var checkPossibility = function (nums) {
    let changed = false;

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] <= nums[i + 1]) continue;
        if (changed) return false;

        if (i === 0 || nums[i + 1] >= nums[i - 1]) {
            nums[i] = nums[i + 1];
        } else {
            nums[i + 1] = nums[i];
        }

        changed = true;
    }

    return true;
};

module.exports = { checkPossibility };

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
    assert.deepStrictEqual(checkPossibility([4, 2, 3]), true);
    assert.deepStrictEqual(checkPossibility([4, 2, 1]), false);
}
