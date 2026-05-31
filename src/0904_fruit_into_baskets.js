/**
 * @param {number[]} fruits
 * @return {number}
 */
var totalFruit = function (fruits) {
    let count = new Map();
    let [left, total, res] = [0, 0, 0];

    for (fruit of fruits) {
        count.set(fruit, (count.get(fruit) || 0) + 1);
        total++;

        while (count.size > 2) {
            let f = fruits[left];
            count.set(f, count.get(f) - 1);
            total -= 1;
            left += 1;
            if (!count.get(f)) {
                count.delete(f);
            }
        }
        res = Math.max(res, total);
    }

    return res;
};

module.exports = { totalFruit };

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
    assert.deepStrictEqual(totalFruit([1, 2, 1]), 3);
    assert.deepStrictEqual(totalFruit([0, 1, 2, 2]), 3);
    assert.deepStrictEqual(totalFruit([1, 2, 3, 2, 2]), 4);
}
