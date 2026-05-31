/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function (s) {
    var lastIndex = {}, // char -> last index in s
        res = [],
        size = 0,
        end = 0;

    for (var i in s) {
        lastIndex[s[i]] = i;
    }

    for (var i in s) {
        var c = s[i];
        size++;
        end = Math.max(end, lastIndex[c]);
        if (i === String(end)) {
            res.push(size);
            size = 0;
        }
    }

    return res;
};

/**
 * https://leetcode.com/problems/partition-labels/
 * Time O(N) | Space(1)
 * @param {string} S
 * @return {number[]}
 */
var partitionLabels = function (S) {
    const lastSeen = getLast(S);

    return getAns(S, lastSeen);
};

const getLast = (S, lastSeen = []) => {
    for (const index in S) {
        /* Time O(N) */
        const code = getCode(S[Number(index)]);

        lastSeen[code] = Number(index); /* Space O(1) */
    }

    return lastSeen;
};

const getCode = (char) => char.charCodeAt(0) - 'a'.charCodeAt(0);

const getAns = (S, lastSeen, left = 0, right = 0, labels = []) => {
    for (const index in S) {
        /* Time O(N) */
        const code = getCode(S[Number(index)]);
        const lastSeenAt = lastSeen[code];

        right = Math.max(right, lastSeenAt);

        const isEqual = Number(index) === right;
        if (!isEqual) continue;

        const placement = Number(index) - left + 1;

        labels.push(placement);
        left = Number(index) + 1;
    }

    return labels;
};

module.exports = { partitionLabels };

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
    assert.deepStrictEqual(partitionLabels("ababcbacadefegdehijhklij"), [9, 7, 8]);
}
