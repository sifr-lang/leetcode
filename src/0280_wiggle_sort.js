function wiggleSort(nums) {
    for (let i = 1; i < nums.length; i++) {
        if ((i % 2 === 1 && nums[i] < nums[i - 1]) || (i % 2 === 0 && nums[i] > nums[i - 1])) {
            [nums[i], nums[i - 1]] = [nums[i - 1], nums[i]];
        }
    }
}

module.exports = { wiggleSort };

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
    let arg0 = [3, 5, 2, 1, 6, 4];
    let _result = wiggleSort(arg0);
    assert.deepStrictEqual(arg0, [3, 5, 1, 6, 2, 4]);
    arg0 = [6, 6, 5, 6, 3, 8];
    _result = wiggleSort(arg0);
    assert.deepStrictEqual(arg0, [6, 6, 5, 6, 3, 8]);
}
