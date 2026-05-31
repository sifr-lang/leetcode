// problem link https://leetcode.com/problems/sort-colors

function sortColors(nums) {
    let i = 0;
    let l = 0;
    let r = nums.length - 1;

    while (i <= r) {
        const num = nums[i];
        if (num === 0) {
            swap(nums, i, l);
            i++;
            l++;
        } else if (num === 2) {
            swap(nums, i, r);
            r--;
        } else {
            i++;
        }
    }

    return nums;
}

function swap(nums, i, j) {
    [nums[i], nums[j]] = [nums[j], nums[i]];
}

module.exports = { sortColors };

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
    let arg0 = [2, 0, 2, 1, 1, 0];
    let _result = sortColors(arg0);
    assert.deepStrictEqual(arg0, [0, 0, 1, 1, 2, 2]);
    arg0 = [2, 0, 1];
    _result = sortColors(arg0);
    assert.deepStrictEqual(arg0, [0, 1, 2]);
}
