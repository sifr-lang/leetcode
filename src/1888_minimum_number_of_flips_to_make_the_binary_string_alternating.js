/**
 * https://leetcode.com/problems/minimum-number-of-flips-to-make-the-binary-string-alternating/
 * Time O(n), Space O(1)
 * @param {string} s
 * @return {number}
 */
var minFlips = (s) => {
    const n = s.length;
    s = s + s;
    let alt1 = '';
    let alt2 = '';

    for (let i = 0; i < s.length; i++) {
        alt1 += i % 2 === 0 ? '0' : '1';
        alt2 += i % 2 === 0 ? '1' : '0';
    }

    let res = Infinity;
    let diff1 = 0;
    let diff2 = 0;
    let l = 0;
    for (let r = 0; r < s.length; r++) {
        if (s[r] !== alt1[r]) {
            diff1 += 1;
        }
        if (s[r] !== alt2[r]) {
            diff2 += 1;
        }
        if (r - l + 1 > n) {
            if (s[l] !== alt1[l]) {
                diff1 -= 1;
            }
            if (s[l] !== alt2[l]) {
                diff2 -= 1;
            }
            l += 1;
        }
        if (r - l + 1 === n) {
            res = Math.min(res, diff1, diff2);
        }
    }
    return res;
};

module.exports = { minFlips };

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
    assert.deepStrictEqual(minFlips("111000"), 2);
    assert.deepStrictEqual(minFlips("010"), 0);
    assert.deepStrictEqual(minFlips("1110"), 1);
}
