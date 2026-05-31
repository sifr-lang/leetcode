function subsetsWithDup(nums) {
    const res = [];
    nums.sort((a, b) => a - b);
    const backtrack = (i, subset) => {
        if (i === nums.length) {
            res.push(subset.slice());
            return;
        }
        subset.push(nums[i]);
        backtrack(i + 1, subset);
        subset.pop();
        while (i + 1 < nums.length && nums[i] === nums[i + 1]) i++;
        backtrack(i + 1, subset);
    };
    backtrack(0, []);
    return res;
}

module.exports = { subsetsWithDup };

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
    assert.deepStrictEqual(subsetsWithDup([1, 2, 2]), [[1, 2, 2], [1, 2], [1], [2, 2], [2], []]);
}
