/**
 * Time O(N^2) | Space O(N)
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    let pre = strs[0];

    for (let word of strs) {
        for (let i = pre.length - 1; i >= 0; i--) {
            if (pre[i] !== word[i]) {
                pre = pre.slice(0, i);
            }
        }
    }

    return pre;
};

module.exports = { longestCommonPrefix };

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
    assert.deepStrictEqual(longestCommonPrefix(["flower", "flow", "flight"]), "fl");
    assert.deepStrictEqual(longestCommonPrefix(["dog", "racecar", "car"]), "");
    assert.deepStrictEqual(longestCommonPrefix(["interspecies", "interstellar", "interstate"]), "inters");
    assert.deepStrictEqual(longestCommonPrefix(["a"]), "a");
}
