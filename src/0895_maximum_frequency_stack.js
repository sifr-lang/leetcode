class FreqStack {
    constructor() {
        this.cnt = {};
        this.maxCnt = 0;
        this.stacks = {};
    }

    push(val) {
        let valCnt = 1 + (this.cnt[val] || 0);
        this.cnt[val] = valCnt;

        if (valCnt > this.maxCnt) {
            this.maxCnt = valCnt;
            this.stacks[valCnt] = [];
        }
        this.stacks[valCnt].push(val);
    }

    pop() {
        let res = this.stacks[this.maxCnt].pop();
        this.cnt[res] -= 1;

        if (this.stacks[this.maxCnt].length == 0) {
            this.maxCnt -= 1;
        }

        return res;
    }
}

module.exports = { FreqStack };

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
    let obj = new FreqStack();
    obj.push(5);
    obj.push(7);
    obj.push(5);
    obj.push(7);
    obj.push(4);
    obj.push(5);
    assert.deepStrictEqual(obj.pop(), 5);
    assert.deepStrictEqual(obj.pop(), 7);
    assert.deepStrictEqual(obj.pop(), 5);
    assert.deepStrictEqual(obj.pop(), 4);
}
