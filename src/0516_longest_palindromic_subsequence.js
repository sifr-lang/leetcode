function longestPalindromeSubseq(s) {
    const t = s.split('').reverse().join('');
    const memo = new Map();
    const lcs = (i, j) => {
        if (i === s.length || j === t.length) return 0;
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        let ans;
        if (s[i] === t[j]) {
            ans = 1 + lcs(i + 1, j + 1);
        } else {
            ans = Math.max(lcs(i + 1, j), lcs(i, j + 1));
        }
        memo.set(key, ans);
        return ans;
    };
    return lcs(0, 0);
}

module.exports = { longestPalindromeSubseq };

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
    assert.deepStrictEqual(longestPalindromeSubseq("bbbab"), 4);
    assert.deepStrictEqual(longestPalindromeSubseq("cbbd"), 2);
}
