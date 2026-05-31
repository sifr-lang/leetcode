function findMaxForm(strs, M, N) {
    const dp = new Map();
    const get = (m, n) => dp.get(`${m},${n}`) || 0;
    const set = (m, n, value) => dp.set(`${m},${n}`, value);
    for (const s of strs) {
        let mCnt = 0;
        let nCnt = 0;
        for (const ch of s) {
            if (ch === '0') mCnt++;
            else if (ch === '1') nCnt++;
        }
        for (let m = M; m >= mCnt; m--) {
            for (let n = N; n >= nCnt; n--) {
                set(m, n, Math.max(1 + get(m - mCnt, n - nCnt), get(m, n)));
            }
        }
    }
    return get(M, N);
}

module.exports = { findMaxForm };

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
    assert.deepStrictEqual(findMaxForm(["10", "0001", "111001", "1", "0"], 5, 3), 4);
    assert.deepStrictEqual(findMaxForm(["10", "0", "1"], 1, 1), 2);
}
