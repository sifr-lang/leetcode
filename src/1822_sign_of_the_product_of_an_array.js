const arraySign = function (nums) {
    let sign = 1;

    for (const num of nums) {
        if (num == 0) return 0;
        if (num < 0) sign = -1 * sign;
    }

    return sign;
};

module.exports = { arraySign };

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
    assert.deepStrictEqual(arraySign([(-1), (-2), (-3), (-4), 3, 2, 1]), 1);
    assert.deepStrictEqual(arraySign([1, 5, 0, 2, (-3)]), 0);
    assert.deepStrictEqual(arraySign([(-1), 1, (-1), 1, (-1)]), (-1));
}
