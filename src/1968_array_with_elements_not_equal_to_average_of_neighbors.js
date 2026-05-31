function rearrangeArray(nums) {
    nums.sort((a, b) => a - b);
    let i = 0;
    let j = 0;
    const n = nums.length;
    const ans = Array(n).fill(0);
    while (i < n && j < n) { ans[i] = nums[j]; i += 2; j++; }
    i = 1;
    while (i < n && j < n) { ans[i] = nums[j]; i += 2; j++; }
    return ans;
}

module.exports = { rearrangeArray };

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
    assert.deepStrictEqual(rearrangeArray([3, 1, (-2), (-5), 2, (-4)]), [(-5), 1, (-4), 2, (-2), 3]);
}
