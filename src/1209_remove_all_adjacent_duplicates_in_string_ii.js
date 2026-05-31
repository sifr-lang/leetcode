/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var removeDuplicates = function (s, k) {
    const stack = []; // [char, count];

    for (const c of s) {
        if (stack.length !== 0 && stack[stack.length - 1][0] === c) {
            stack[stack.length - 1][1]++;
        } else {
            stack.push([c, 1]);
        }

        if (stack[stack.length - 1][1] === k) {
            stack.pop();
        }
    }

    return stack.reduce((res, el) => (res += el[0].repeat(el[1])), '');
};

module.exports = { removeDuplicates };

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
    assert.deepStrictEqual(removeDuplicates("abcd", 2), "abcd");
    assert.deepStrictEqual(removeDuplicates("deeedbbcccbdaa", 3), "aa");
}
