function check(arr) {
    let temp = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== temp) {
            return false;
        }
    }
    return true;
}

/**
 * @param {number[]} matchsticks
 * @return {boolean}
 */
var makesquare = function (matchsticks) {
    let sides = new Array(4).fill(0),
        ans = false,
        size = 0;

    for (let i = 0; i < matchsticks.length; i++) {
        size += matchsticks[i];
    }
    let max_size = size / 4;
    if (max_size - Math.floor(max_size) !== 0) return false;

    matchsticks = matchsticks.sort((a, b) => b - a);

    function backtrack(i) {
        if (ans) return;
        if (i >= matchsticks.length) {
            if (check(sides)) {
                ans = true;
            }
            return;
        }
        for (let j = 0; j < 4; j++) {
            if (sides[j] + matchsticks[i] > max_size) {
                continue;
            }
            sides[j] += matchsticks[i];

            backtrack(i + 1);
            sides[j] -= matchsticks[i];
        }
    }
    backtrack(0);

    return ans;
};

module.exports = { makesquare };

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
    assert.deepStrictEqual(makesquare([1, 1, 2, 2, 2]), true);
    assert.deepStrictEqual(makesquare([3, 3, 3, 3, 4]), false);
}
