/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} threshold
 * @return {number}
 */
var numOfSubarrays = function (arr, k, threshold) {
    if (arr.length < k) return 0;
    let count = 0;
    let sum = 0;
    let L = 0;
    for (let R = 0; R < arr.length; R++) {
        sum += arr[R];
        if (R - L + 1 === k) {
            if (sum / k >= threshold) count += 1;
            sum -= arr[L];
            L += 1;
        }
    }
    return count;
};

module.exports = { numOfSubarrays };

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
    assert.deepStrictEqual(numOfSubarrays([2, 1, 5, 6, 0, 9, 8], 3, 4), 3);
}
