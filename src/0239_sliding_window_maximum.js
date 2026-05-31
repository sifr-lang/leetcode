function maxSlidingWindow(nums, k) {
    const output = [];
    const q = [];
    let l = 0;
    let r = 0;
    while (r < nums.length) {
        while (q.length && nums[q[q.length - 1]] < nums[r]) q.pop();
        q.push(r);
        if (l > q[0]) q.shift();
        if (r + 1 >= k) {
            output.push(nums[q[0]]);
            l++;
        }
        r++;
    }
    return output;
}

module.exports = { maxSlidingWindow };

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
    assert.deepStrictEqual(maxSlidingWindow([1, 3, (-1), (-3), 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
    assert.deepStrictEqual(maxSlidingWindow([1], 1), [1]);
}
