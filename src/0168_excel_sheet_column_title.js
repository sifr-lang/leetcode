function convertToTitle(columnNumber) {
    let res = '';
    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        res += String.fromCharCode('A'.charCodeAt(0) + remainder);
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return res.split('').reverse().join('');
}

module.exports = { convertToTitle };

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
    assert.deepStrictEqual(convertToTitle(1), "A");
    assert.deepStrictEqual(convertToTitle(28), "AB");
    assert.deepStrictEqual(convertToTitle(701), "ZY");
}
