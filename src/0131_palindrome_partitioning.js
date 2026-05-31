/**
 * https://leetcode.com/problems/palindrome-partitioning/
 * Time O(N * 2^N) | Space O(N^2)
 * @param {string} s
 * @return {string[][]}
 */
function partition(s, left = 0, _partition = [], partitions = []) {
    const isBaseCase = s.length <= left;
    if (isBaseCase) {
        if (_partition.length) partitions.push(_partition.slice());

        return partitions;
    }

    for (let right = left; right < s.length; right++) {
        if (!isPalindrome(s, left, right)) continue;

        backTrack(s, left, right, _partition, partitions);
    }

    return partitions;
}

const backTrack = (s, left, right, _partition, partitions) => {
    _partition.push(s.slice(left, right + 1));
    partition(s, right + 1, _partition, partitions);
    _partition.pop();
};

const isPalindrome = (str, left, right) => {
    while (left < right) {
        const isSame = str[left] === str[right];
        if (!isSame) return false;

        left++;
        right--;
    }

    return true;
};

module.exports = { partition };

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
    assert.deepStrictEqual(partition("aab"), [["a", "a", "b"], ["aa", "b"]]);
}
