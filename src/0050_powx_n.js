function myPow(x, n) {
    const helper = (value, power) => {
        if (value === 0) return 0;
        if (power === 0) return 1;
        const res = helper(value * value, Math.floor(power / 2));
        return power % 2 ? value * res : res;
    };
    const res = helper(x, Math.abs(n));
    return n >= 0 ? res : 1 / res;
}

module.exports = { myPow };

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
    assert.deepStrictEqual(myPow(2.0, 10), 1024.0);
    assert.deepStrictEqual(myPow(2.0, (-2)), 0.25);
}
