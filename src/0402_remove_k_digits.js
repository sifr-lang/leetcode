/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function (num, k) {
    let stack = [];
    for (ch of num) {
        while (k > 0 && stack.length > 0 && stack.at(-1) > ch) {
            k--;
            stack.pop();
        }
        stack.push(ch);
    }

    let x = 0;
    while (true) {
        if (stack[x] !== '0') {
            break;
        }
        x++;
    }
    stack = stack.slice(x, stack.length - k);
    let res = stack.join('');
    return res ? res : '0';
};

module.exports = { removeKdigits };

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
    assert.deepStrictEqual(removeKdigits("1432219", 3), "1219");
    assert.deepStrictEqual(removeKdigits("10200", 1), "200");
    assert.deepStrictEqual(removeKdigits("10", 2), "0");
}
