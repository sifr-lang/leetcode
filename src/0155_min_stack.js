class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(val) {
        this.stack.push(val);
        val = Math.min(val, this.minStack.length ? this.minStack[this.minStack.length - 1] : val);
        this.minStack.push(val);
    }
    pop() {
        this.stack.pop();
        this.minStack.pop();
    }
    top() {
        return this.stack[this.stack.length - 1];
    }
    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

module.exports = { MinStack };

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
    let obj = new MinStack();
    obj.push((-2));
    obj.push(0);
    obj.push((-3));
    assert.deepStrictEqual(obj.getMin(), (-3));
    obj.pop();
    assert.deepStrictEqual(obj.top(), 0);
    assert.deepStrictEqual(obj.getMin(), (-2));
}
