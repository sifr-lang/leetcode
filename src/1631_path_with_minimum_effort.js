class MinHeap {
    constructor() { this.items = []; }
    push(item) { this.items.push(item); this.bubbleUp(this.items.length - 1); }
    pop() {
        if (this.items.length === 1) return this.items.pop();
        const value = this.items[0];
        this.items[0] = this.items.pop();
        this.bubbleDown(0);
        return value;
    }
    get length() { return this.items.length; }
    bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.items[parent][0] <= this.items[index][0]) break;
            [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
            index = parent;
        }
    }
    bubbleDown(index) {
        while (true) {
            let smallest = index;
            const left = index * 2 + 1;
            const right = index * 2 + 2;
            if (left < this.items.length && this.items[left][0] < this.items[smallest][0]) smallest = left;
            if (right < this.items.length && this.items[right][0] < this.items[smallest][0]) smallest = right;
            if (smallest === index) break;
            [this.items[smallest], this.items[index]] = [this.items[index], this.items[smallest]];
            index = smallest;
        }
    }
}

function minimumEffortPath(heights) {
    const m = heights.length;
    const n = heights[0].length;
    const efforts = Array.from({ length: m }, () => Array(n).fill(Infinity));
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const pq = new MinHeap();
    efforts[0][0] = 0;
    pq.push([0, 0, 0]);
    while (pq.length) {
        const [curEffort, i, j] = pq.pop();
        if (i === m - 1 && j === n - 1) return curEffort;
        for (const [dx, dy] of directions) {
            const x = i + dx;
            const y = j + dy;
            if (x >= 0 && x < m && y >= 0 && y < n) {
                const newEffort = Math.max(Math.abs(heights[x][y] - heights[i][j]), curEffort);
                if (newEffort < efforts[x][y]) {
                    efforts[x][y] = newEffort;
                    pq.push([newEffort, x, y]);
                }
            }
        }
    }
    return efforts[m - 1][n - 1];
}

module.exports = { minimumEffortPath };

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
    assert.deepStrictEqual(minimumEffortPath([[1, 2, 2], [3, 8, 2], [5, 3, 5]]), 2);
    assert.deepStrictEqual(minimumEffortPath([[1, 2, 3], [3, 8, 4], [5, 3, 5]]), 1);
    assert.deepStrictEqual(minimumEffortPath([[1, 2, 1, 1, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 1]]), 0);
}
