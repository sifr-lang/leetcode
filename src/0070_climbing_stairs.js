function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1;
    let b = 2;
    for (let i = 3; i <= n; i++) {
        const temp = b;
        b = a + b;
        a = temp;
    }
    return b;
}

module.exports = { climbStairs };

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
    assert.deepStrictEqual(climbStairs(1), 1);
    assert.deepStrictEqual(climbStairs(2), 2);
    assert.deepStrictEqual(climbStairs(3), 3);
    assert.deepStrictEqual(climbStairs(5), 8);
    assert.deepStrictEqual(climbStairs(10), 89);
}
