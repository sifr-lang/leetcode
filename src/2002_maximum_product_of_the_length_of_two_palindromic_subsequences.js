/**
 * @param {string} s
 * @return {number}
 * Time Complexity: O(2^N)
 * Space Complexity: O(2^N)
 */
var maxProduct = function (s) {
    const N = s.length;
    const first = new Array(1 << N).fill(0),
        last = new Array(1 << N).fill(0);
    for (let i = 0; i < N; i++) {
        for (let j = 1 << i; j < 1 << (i + 1); j++) {
            first[j] = i;
        }
    }
    for (let i = 0; i < N; i++) {
        for (let j = 1 << i; j < 1 << N; j += 1 << (i + 1)) {
            last[j] = i;
        }
    }
    const dp = Memo((m) => {
        if ((m & (m - 1)) === 0) {
            return m != 0;
        }
        const l = last[m],
            f = first[m];
        const lb = 1 << l,
            fb = 1 << f;
        return Math.max(
            dp(m - lb),
            dp(m - fb),
            dp(m - lb - fb) + (s[l] == s[f]) * 2,
        );
    });
    let ans = 0;
    for (let m = 1; m < 1 << N; m++) {
        ans = Math.max(ans, dp(m) * dp((1 << N) - 1 - m));
    }
    return ans;
};

var Memo = (func) => {
    const map = new Map();
    var wrapper = (m) => {
        if (!map.get(m)) {
            map.set(m, func(m));
        }
        return map.get(m);
    };
    return wrapper;
};

module.exports = { maxProduct };

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
    assert.deepStrictEqual(maxProduct("leetcodecom"), 9);
    assert.deepStrictEqual(maxProduct("bb"), 1);
    assert.deepStrictEqual(maxProduct("accbcaxxcxx"), 25);
}
