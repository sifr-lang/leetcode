function maxLength(arr) {
    const charSet = new Set();
    const overlap = (setValue, s) => {
        const counts = new Map();
        for (const c of setValue) counts.set(c, (counts.get(c) || 0) + 1);
        for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);
        for (const value of counts.values()) {
            if (value > 1) return true;
        }
        return false;
    };
    const backtrack = (i) => {
        if (i === arr.length) return charSet.size;
        let res = 0;
        if (!overlap(charSet, arr[i])) {
            for (const c of arr[i]) charSet.add(c);
            res = backtrack(i + 1);
            for (const c of arr[i]) charSet.delete(c);
        }
        return Math.max(res, backtrack(i + 1));
    };
    return backtrack(0);
}

module.exports = { maxLength };

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
    assert.deepStrictEqual(maxLength(["un", "iq", "ue"]), 4);
    assert.deepStrictEqual(maxLength(["cha", "r", "act", "ers"]), 6);
    assert.deepStrictEqual(maxLength(["abcdefghijklmnopqrstuvwxyz"]), 26);
}
