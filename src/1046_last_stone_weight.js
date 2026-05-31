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
 * https://leetcode.com/problems/last-stone-weight/
 * Time O(N * log(N)) | Space O(N)
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeight = function (stones) {
    const maxHeap = getMaxHeap(stones)

    shrink(maxHeap)

    return !maxHeap.isEmpty()
        ? maxHeap.front().element
        : 0
};

const getMaxHeap = (stones, maxHeap = new MaxPriorityQueue()) => {
    for (const stone of stones) {
        maxHeap.enqueue(stone)
    }

    return maxHeap
}

const shrink = (maxHeap) => {
    while (1 < maxHeap.size()) {
        const [ x, y ] = [ maxHeap.dequeue().element, maxHeap.dequeue().element ]
        const difference = x - y;

        const isPositive = 0 < difference
        if (isPositive) maxHeap.enqueue(difference);
    }
}

module.exports = { lastStoneWeight };

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
    assert.deepStrictEqual(lastStoneWeight([2, 7, 4, 1, 8, 1]), 1);
    assert.deepStrictEqual(lastStoneWeight([1]), 1);
}
