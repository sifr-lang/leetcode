/**
 * @param {number[]} arr
 * @param {number} k
 * @param {number} x
 * @return {number[]}
 */
var findClosestElements = function (arr, k, x) {
    let [leftPtr, rightPtr] = [0, arr.length - k];
    while (leftPtr < rightPtr) {
        /*  This is basically rightPtr+leftPtr/2 written differently to
            avoid any overflow incase it happens.
        */
        let mid = parseInt(rightPtr + (leftPtr - rightPtr) / 2);

        if (x - arr[mid] > arr[mid + k] - x) {
            leftPtr = mid + 1;
        } else {
            rightPtr = mid;
        }
    }
    return arr.slice(leftPtr, leftPtr + k);
};

module.exports = { findClosestElements };

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
    assert.deepStrictEqual(findClosestElements([1, 2, 3, 4, 5], 4, 3), [1, 2, 3, 4]);
}
