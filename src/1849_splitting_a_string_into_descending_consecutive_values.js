function splitString(s) {
    const dfs = (index, prev) => {
        if (index === s.length) return true;
        for (let j = index; j < s.length; j++) {
            const val = Number(s.slice(index, j + 1));
            if (val + 1 === prev && dfs(j + 1, val)) return true;
        }
        return false;
    };
    for (let i = 0; i < s.length - 1; i++) {
        const val = Number(s.slice(0, i + 1));
        if (dfs(i + 1, val)) return true;
    }
    return false;
}

module.exports = { splitString };

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
    assert.deepStrictEqual(splitString("1234"), false);
    assert.deepStrictEqual(splitString("050043"), true);
}
