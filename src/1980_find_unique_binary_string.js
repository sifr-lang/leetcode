function findDifferentBinaryString(nums) {
    const out = [];
    for (let i = 0; i < nums.length; i++) {
        out.push(nums[i][i] === '0' ? '1' : '0');
    }
    return out.join('');
}

module.exports = { findDifferentBinaryString };

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
    let nums1 = ["01", "10"];
    let ans1 = findDifferentBinaryString(nums1);
    assert.deepStrictEqual((ans1).length, (nums1).length);
    assert.ok(!nums1.includes(ans1));
    let nums2 = ["00", "01"];
    let ans2 = findDifferentBinaryString(nums2);
    assert.deepStrictEqual((ans2).length, (nums2).length);
    assert.ok(!nums2.includes(ans2));
    let nums3 = ["111", "011", "001"];
    let ans3 = findDifferentBinaryString(nums3);
    assert.deepStrictEqual((ans3).length, (nums3).length);
    assert.ok(!nums3.includes(ans3));
}
