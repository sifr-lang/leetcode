/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxFrequency = function (nums, k) {
    const sortedNums = nums.sort((a, b) => a - b);

    let maxLength = 0;

    let currentSum = 0;
    let leftWindow = 0;
    for (let rightWindow = 0; rightWindow < sortedNums.length; rightWindow++) {
        const currentLength = rightWindow - leftWindow + 1;
        const rightNum = sortedNums[rightWindow];
        currentSum += rightNum;

        if (currentSum + k >= rightNum * currentLength) {
            maxLength = currentLength;
        } else {
            const leftNum = sortedNums[leftWindow];
            currentSum -= leftNum;
            leftWindow++;
        }
    }
    return maxLength;
};

module.exports = { maxFrequency };

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
    assert.deepStrictEqual(maxFrequency([1, 2, 4], 5), 3);
    assert.deepStrictEqual(maxFrequency([1, 4, 8, 13], 5), 2);
    assert.deepStrictEqual(maxFrequency([3, 9, 6], 2), 1);
}
