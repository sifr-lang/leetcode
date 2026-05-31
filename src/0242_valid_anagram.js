/**
 * Sort - HeapSort Space O(1) | QuickSort Space O(log(N))
 * Time O(N * logN) | Space O(N)
 * https://leetcode.com/problems/valid-anagram/
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = (s, t) => {
    const isEqual = s.length === t.length;
    if (!isEqual) return false;

    return reorder(s) === reorder(t); /* Time O(N * logN) | Space O(N) */
};

const reorder = (str) =>
    str
        .split('') /* Time O(N)          | Space O(N) */
        .sort((a, b) =>
            a.localeCompare(b),
        ) /* Time O(N * log(N)) | Space O(1 || log(N)) */
        .join(''); /* Time O(N)          | Space O(N) */

/**
 * Hash Map - Frequency Counter
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/valid-anagram/
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = (s, t, map = new Map()) => {
    const isEqual = s.length === t.length;
    if (!isEqual) return false;

    addFrequency(s, map); /* Time O(N) | Space O(1) */
    subtractFrequency(t, map); /* Time O(N) | Space O(1) */

    return checkFrequency(map); /* Time O(N) */
};

const addFrequency = (str, map) => {
    for (const char of str) {
        /* Time O(N) */
        const count = (map.get(char) || 0) + 1;

        map.set(char, count); /* Space O(1) */
    }
};

const subtractFrequency = (str, map) => {
    for (const char of str) {
        /* Time O(N) */
        if (!map.has(char)) continue;

        const count = map.get(char) - 1;

        map.set(char, count); /* Space O(1) */
    }
};

const checkFrequency = (map) => {
    for (const [char, count] of map) {
        /* Time O(N) */
        const isEmpty = count === 0;
        if (!isEmpty) return false;
    }

    return true;
};

module.exports = { isAnagram };

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
    assert.deepStrictEqual(isAnagram("anagram", "nagaram"), true);
    assert.deepStrictEqual(isAnagram("rat", "car"), false);
}
