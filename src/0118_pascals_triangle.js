// link to the problem https://leetcode.com/problems/pascals-triangle/
// the time complexity will basically be the number of elements in pascale tringle. roughly height of tringle * number of honeycomb in each row.
// O(n^2);

var generate = function (numRows) {
    const res = [[1]];

    for (let i = 1; i < numRows; i++) {
        res[i] = [];
        for (let k = 0; k < i + 1; k++) {
            res[i][k] = addPascalValues(res[i - 1][k] || 0, res[i - 1][k - 1] || 0);
        }
    }

    return res;
};

function addPascalValues(left, right) {
    if (typeof left === 'bigint' || typeof right === 'bigint') {
        return normalizePascalValue(toBigInt(left) + toBigInt(right));
    }
    const sum = left + right;
    if (Number.isSafeInteger(sum)) return sum;
    return normalizePascalValue(BigInt(left) + BigInt(right));
}

function toBigInt(value) {
    return typeof value === 'bigint' ? value : BigInt(value);
}

function normalizePascalValue(value) {
    if (value <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(value);
    return value;
}

module.exports = { generate };

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
    assert.deepStrictEqual(generate(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
}
