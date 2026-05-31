/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function (nums) {
    let largest = nums
        .map((n) => n.toString())
        .sort((x, y) => y + x - (x + y))
        .join('');
    return largest[0] === '0' ? '0' : largest;
};

module.exports = { largestNumber };

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
    assert.deepStrictEqual(largestNumber([10, 2]), "210");
    assert.deepStrictEqual(largestNumber([3, 30, 34, 5, 9]), "9534330");
}
