var MyStack = function () {
    this.q = new Queue();
};

MyStack.prototype.push = function (x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) {
        this.q.push(this.q.shift());
    }
};

MyStack.prototype.pop = function () {
    return this.q.shift();
};

MyStack.prototype.top = function () {
    return this.q.front();
};

MyStack.prototype.empty = function () {
    return this.q.length === 0;
};

class Queue {
    constructor() {
        this.items = [];
        this.head = 0;
    }

    get length() {
        return this.items.length - this.head;
    }

    push(value) {
        this.items.push(value);
    }

    shift() {
        const value = this.items[this.head];
        this.head++;
        if (this.head > 1024 && this.head * 2 >= this.items.length) {
            this.items = this.items.slice(this.head);
            this.head = 0;
        }
        return value;
    }

    front() {
        return this.items[this.head];
    }
}

module.exports = { MyStack };

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
    let obj = new MyStack();
    obj.push(1);
    obj.push(2);
    assert.deepStrictEqual(obj.top(), 2);
    assert.deepStrictEqual(obj.pop(), 2);
    assert.deepStrictEqual(obj.empty(), false);
}
