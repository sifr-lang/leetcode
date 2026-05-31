/**
 * Sort - HeapSort Space O(1) | QuickSort Space O(log(K))
 * Hash Map - Adjacency List
 * Time O(N * (K * log(K))) | Space O(N * K)
 * https://leetcode.com/problems/group-anagrams/
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = (words, map = new Map()) => {
    if (!words.length) return [];

    groupWords(words, map); /* Time O(N * (K * log(K)) | Space O(N * K) */

    return [...map.values()]; /* Time O(N)               | Space O(N * K) */
};

var groupWords = (words, map) => {
    for (const original of words) {
        /* Time O(N) */
        const sorted = reorder(original); /* Time O(K * log(K)) | Space O(K) */
        const values = map.get(sorted) || [];

        values.push(original); /*                    | Space O(N) */
        map.set(sorted, values); /*                    | Space O(N * K) */
    }
};

const reorder = (str) =>
    str
        .split('') /* Time O(K)          | Space O(K) */
        .sort((a, b) =>
            a.localeCompare(b),
        ) /* Time O(K * log(K)) | Space O(1 || log(K)) */
        .join(''); /* Time O(K)          | Space O(K) */

/**
 * Hash Map
 * Time O(N * K) | Space O(N * K)
 * https://leetcode.com/problems/group-anagrams/
 * @param {string[]} words
 * @return {string[][]}
 */
var groupAnagrams = (words, map = new Map()) => {
    if (!words.length) return [];

    groupWords(words, map); /* Time O(N * K) | Space O(N * K) */

    return [...map.values()]; /* Time O(N)     | Space O(N * K) */
};

var groupWords = (words, map) => {
    for (const original of words) {
        /* Time O(N) */
        const hash = getHash(original); /* Time O(K) | Space O(1) */
        const values = map.get(hash) || [];

        values.push(original); /*           | Space O(N) */
        map.set(hash, values); /*           | Space O(N * K) */
    }
};

const getHash = (word) => {
    const frequency = new Array(26).fill(0);

    for (const char of word) {
        /* Time O(K) */
        const charCode = getCode(char); /* Time O(1) | Space (1) */

        frequency[charCode]++; /*           | Space O(1) */
    }

    return buildHash(frequency);
};

const getCode = (char) => char.charCodeAt(0) - 'a'.charCodeAt(0);

const buildHash = (frequency) => frequency.toString();

module.exports = { groupAnagrams };

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
    function normalizeGroups(groups) {
        return groups
            .map((group) => group.slice().sort())
            .sort((a, b) => a.join('\u0000').localeCompare(b.join('\u0000')));
    }
    assert.deepStrictEqual(normalizeGroups(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])), normalizeGroups([["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]));
    assert.deepStrictEqual(normalizeGroups(groupAnagrams([""])), normalizeGroups([[""]]));
    assert.deepStrictEqual(normalizeGroups(groupAnagrams(["a"])), normalizeGroups([["a"]]));
}
