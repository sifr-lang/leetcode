//https://leetcode.com/problems/online-stock-span/
class StockSpanner {
    constructor() {
        this.stack = [];
    }

    // Time O(1) | Space O(1)
    isEmpty() {
        return this.stack.length === 0;
    }

    // Time O(1) | Space O(1)
    peek() {
        return this.isEmpty() ? null : this.stack[this.stack.length - 1];
    }

    // Time O(1) | Space O(1)
    push(val) {
        return this.stack.push(val);
    }

    // Time O(1) | Space O(1)
    pop() {
        return this.stack.pop();
    }

    // Time O(n) | Space O(1)
    next(price) {
        let currunt = 1;
        while (this.peek() && this.peek()[0] <= price) {
            currunt += this.pop()[1];
        }
        this.push([price, currunt]);
        return this.peek()[1];
    }
}

module.exports = { StockSpanner };

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
    let obj = new StockSpanner();
    assert.deepStrictEqual(obj.next(100), 1);
    assert.deepStrictEqual(obj.next(80), 1);
    assert.deepStrictEqual(obj.next(60), 1);
    assert.deepStrictEqual(obj.next(70), 2);
    assert.deepStrictEqual(obj.next(60), 1);
    assert.deepStrictEqual(obj.next(75), 4);
    assert.deepStrictEqual(obj.next(85), 6);
}
