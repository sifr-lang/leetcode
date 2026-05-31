function minimizeMax(nums, p) {
    nums.sort((a, b) => a - b);
    const checkPair = (mid) => {
        let count = 0;
        let i = 0;
        while (i < nums.length - 1) {
            if (nums[i + 1] - nums[i] <= mid) {
                count++;
                i += 2;
            } else {
                i++;
            }
        }
        return count >= p;
    };
    let left = 0;
    let right = nums[nums.length - 1] - nums[0];
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (checkPair(mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}

module.exports = { minimizeMax };

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
    assert.deepStrictEqual(minimizeMax([10, 1, 2, 7, 1, 3], 2), 1);
}
