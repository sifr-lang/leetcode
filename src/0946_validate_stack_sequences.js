function validateStackSequences(pushed, popped) {
    let i = 0;
    const stack = [];
    for (const n of pushed) {
        stack.push(n);
        while (i < popped.length && stack.length && popped[i] === stack[stack.length - 1]) {
            stack.pop();
            i++;
        }
    }
    return stack.length === 0;
}

module.exports = { validateStackSequences };

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
    assert.deepStrictEqual(validateStackSequences([1, 2, 3, 4, 5], [4, 5, 3, 2, 1]), true);
    assert.deepStrictEqual(validateStackSequences([1, 2, 3, 4, 5], [4, 3, 5, 1, 2]), false);
}
