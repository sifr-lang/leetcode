function removeDuplicates(nums) {
    let l = 0;
    let r = 0;
    while (r < nums.length) {
        let count = 1;
        while (r + 1 < nums.length && nums[r] === nums[r + 1]) {
            r++;
            count++;
        }
        for (let i = 0; i < Math.min(2, count); i++) {
            nums[l] = nums[r];
            l++;
        }
        r++;
    }
    return l;
}

module.exports = { removeDuplicates };

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
    assert.deepStrictEqual(removeDuplicates([1, 1, 1, 2, 2, 3]), 5);
}
