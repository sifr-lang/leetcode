/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
    let startIndex = 0;
    const pMap = new Map();
    const sMap = new Map();
    const res = [];

    for (const char of p) {
        pMap.set(char, 1 + (pMap.get(char) || 0));
    }

    for (let i = 0; i < s.length; i++) {
        sMap.set(s[i], 1 + (sMap.get(s[i]) || 0));

        if (i >= p.length - 1) {
            if (mapsEqual(sMap, pMap)) {
                res.push(startIndex);
            }
            if (sMap.has(s[startIndex])) {
                sMap.set(s[startIndex], sMap.get(s[startIndex]) - 1);
                if (sMap.get(s[startIndex]) === 0) {
                    sMap.delete(s[startIndex]);
                }
            }
            startIndex += 1;
        }
    }
    return res;
};

function mapsEqual(left, right) {
    if (left.size !== right.size) {
        return false;
    }
    for (const [key, value] of left) {
        if (right.get(key) !== value) {
            return false;
        }
    }
    return true;
}

module.exports = { findAnagrams };

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
    assert.deepStrictEqual(findAnagrams("cbaebabacd", "abc"), [0, 6]);
    assert.deepStrictEqual(findAnagrams("abab", "ab"), [0, 1, 2]);
}
