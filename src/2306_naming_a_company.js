/**
 * @param {string[]} ideas
 * @return {number}
 */
var distinctNames = function (ideas) {
    let sets = [];
    for (let i = 0; i < 26; i++) {
        sets[i] = new Set();
    }
    for (let s of ideas) {
        sets[s.charCodeAt(0) - 97].add(s.substring(1));
    }
    let same = [];
    for (let i = 0; i < 26; i++) {
        same[i] = Array(26).fill(0);
    }
    for (let i = 0; i < 26; i++) {
        for (let s of sets[i]) {
            for (let j = i + 1; j < 26; j++) {
                if (sets[j].has(s)) {
                    same[i][j]++;
                }
            }
        }
    }
    let res = 0;
    for (let i = 0; i < 26; i++) {
        for (let j = i + 1; j < 26; j++) {
            res +=
                (sets[i].size - same[i][j]) * (sets[j].size - same[i][j]) * 2;
        }
    }
    return res;
};

module.exports = { distinctNames };

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
    assert.deepStrictEqual(distinctNames(["coffee", "donuts", "time", "toffee"]), 6);
    assert.deepStrictEqual(distinctNames(["lack", "back"]), 0);
}
