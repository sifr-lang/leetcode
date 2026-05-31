function numSubseq(nums, target) {
    nums.sort((a, b) => a - b);
    const mod = 1000000007;
    let res = 0n;
    let left = 0;
    let right = nums.length - 1;
    while (left <= right) {
        if (nums[left] + nums[right] > target) {
            right--;
        } else {
            res += 1n << BigInt(right - left);
            left++;
        }
    }
    return Number(res % BigInt(mod));
}

module.exports = { numSubseq };

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
    assert.deepStrictEqual(numSubseq([3, 5, 6, 7], 9), 4);
    assert.deepStrictEqual(numSubseq([3, 3, 6, 8], 10), 6);
    assert.deepStrictEqual(numSubseq([2, 3, 3, 4, 6, 7], 12), 61);
}
