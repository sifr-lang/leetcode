class Queue {
    constructor(items = []) { this.items = items.slice(); this.head = 0; }
    enqueue(value) { this.items.push(value); }
    dequeue() { return this.items[this.head++]; }
    isEmpty() { return this.head >= this.items.length; }
    size() { return this.items.length - this.head; }
}

class PriorityQueue {
    constructor(options = {}, direction = 1) {
        this.items = [];
        this.priority = typeof options.priority === 'function' ? options.priority : null;
        this.compare = typeof options.compare === 'function' ? options.compare : null;
        this.direction = direction;
    }
    enqueue(element, priority = undefined) {
        const item = { element, priority: priority !== undefined ? priority : (this.priority ? this.priority(element) : element) };
        this.items.push(item);
        this.bubbleUp(this.items.length - 1);
    }
    dequeue() {
        if (this.items.length === 0) return undefined;
        const item = this.items[0];
        const last = this.items.pop();
        if (this.items.length > 0) {
            this.items[0] = last;
            this.sinkDown(0);
        }
        return this.wrap(item);
    }
    front() { return this.wrap(this.items[0]); }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
    bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (!this.less(this.items[index], this.items[parent])) break;
            [this.items[index], this.items[parent]] = [this.items[parent], this.items[index]];
            index = parent;
        }
    }
    sinkDown(index) {
        while (true) {
            const left = index * 2 + 1;
            const right = left + 1;
            let smallest = index;
            if (left < this.items.length && this.less(this.items[left], this.items[smallest])) smallest = left;
            if (right < this.items.length && this.less(this.items[right], this.items[smallest])) smallest = right;
            if (smallest === index) break;
            [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
            index = smallest;
        }
    }
    less(a, b) { return this.compareItems(a, b) < 0; }
    compareItems(a, b) {
        if (this.compare) return this.compare(a.element, b.element);
        return this.direction * (a.priority - b.priority);
    }
    wrap(item) {
        if (!item) return undefined;
        const value = item.element;
        if (value !== null && typeof value === 'object') {
            if (!Object.prototype.hasOwnProperty.call(value, 'element')) Object.defineProperty(value, 'element', { value, configurable: true });
            if (!Object.prototype.hasOwnProperty.call(value, 'priority')) Object.defineProperty(value, 'priority', { value: item.priority, configurable: true });
            return value;
        }
        return {
            element: value,
            priority: item.priority,
            valueOf() { return value; },
            toString() { return String(value); },
            [Symbol.iterator]: function* iterator() { yield value; },
        };
    }
}

class MinPriorityQueue extends PriorityQueue {
    constructor(options = {}) { super(options, 1); }
}

class MaxPriorityQueue extends PriorityQueue {
    constructor(options = {}) { super(options, -1); }
}

/**
 * BFS
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = (root) => {
    const isEdgeBase = root === null;
    if (isEdgeBase) return [];

    return search(root); /* Time O(N) | Space O(N) */
};

var search = (root, isZigZag = true, order = []) => {
    const queue = new Queue([root]);

    while (!queue.isEmpty()) {
        /* Time O(N) */
        const levels = [];

        bfs(queue, isZigZag, levels); /* Time O(WIDTH) | Space O(WIDTH) */
        order.push(levels); /*                 Space O(N) */
        isZigZag = !isZigZag;
    }

    return order;
};

const bfs = (queue, isZigZag, levels) => {
    for (let level = queue.size(); 0 < level; level--) {
        /* Time O(WIDTH) */
        const { left, val, right } = queue.dequeue();

        if (left) queue.enqueue(left); /* Space O(WIDTH) */
        if (right) queue.enqueue(right); /* Space O(WIDTH) */

        levels.push(val); /* Space O(N) */
    }

    if (!isZigZag) levels.reverse();
};

var zigzagLevelOrder = (root) => {
    if (root === null) {
        return [];
    }
    const result = [];
    let zigzagDirection = 1;
    const q = [root];
    while (q.length) {
        const level = [];
        const queueLength = q.length;
        for (let i = 0; i < queueLength; i++) {
            const node = q.shift();
            level.push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
        result.push(zigzagDirection === 1 ? level.slice() : level.slice().reverse());
        zigzagDirection *= -1;
    }
    return result;
};

module.exports = { zigzagLevelOrder };

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
    assert.deepStrictEqual(zigzagLevelOrder(new TreeNode(3, new TreeNode(9, null, null), new TreeNode(20, new TreeNode(15, null, null), new TreeNode(7, null, null)))), [[3], [20, 9], [15, 7]]);
    assert.deepStrictEqual(zigzagLevelOrder(new TreeNode(1, null, null)), [[1]]);
    assert.deepStrictEqual(zigzagLevelOrder(null), []);
}
