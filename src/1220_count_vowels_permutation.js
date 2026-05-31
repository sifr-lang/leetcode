const Memo = new Map();
function countVowelPermutation(n, c = '') {
    const mod = 1000000007n;
    const solve = (remaining, ch) => {
        const key = `${ch},${remaining}`;
        if (Memo.has(key)) return Memo.get(key);
        if (remaining === 1) {
            if (ch === 'a') return 1n;
            if (ch === 'e') return 2n;
            if (ch === 'i') return 4n;
            if (ch === 'o') return 2n;
            if (ch === 'u') return 1n;
            if (ch === '') return 5n;
        }
        let value = 0n;
        if (ch === 'a') value = solve(remaining - 1, 'e');
        else if (ch === 'e') value = solve(remaining - 1, 'a') + solve(remaining - 1, 'i');
        else if (ch === 'i') value = solve(remaining - 1, 'a') + solve(remaining - 1, 'e') + solve(remaining - 1, 'o') + solve(remaining - 1, 'u');
        else if (ch === 'o') value = solve(remaining - 1, 'i') + solve(remaining - 1, 'u');
        else if (ch === 'u') value = solve(remaining - 1, 'a');
        else if (ch === '') value = (solve(remaining - 1, 'a') + solve(remaining - 1, 'e') + solve(remaining - 1, 'i') + solve(remaining - 1, 'o') + solve(remaining - 1, 'u')) % mod;
        Memo.set(key, value);
        return value;
    };
    return Number(solve(n, c) % mod);
}

module.exports = { countVowelPermutation };

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
    assert.deepStrictEqual(countVowelPermutation(1), 5);
    assert.deepStrictEqual(countVowelPermutation(2), 10);
    assert.deepStrictEqual(countVowelPermutation(5), 68);
}
