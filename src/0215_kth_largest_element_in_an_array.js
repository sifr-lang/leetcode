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
 * https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Time O(N * log(N)) | Space O(K)
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
    return nums
        .sort((a, b) => a - b)
        .reverse()
        .slice(k - 1)
        .shift();
};

/**
 * https://leetcode.com/problems/kth-largest-element-in-an-array/
 * Time O(N * log(K)) | Space O(K)
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
    const pivot = nums[Math.floor(Math.random() * nums.length)];
    const left = [];
    const mid = [];
    const right = [];

    for (const num of nums) {
        if (num > pivot) {
            left.push(num);
        } else if (num === pivot) {
            mid.push(num);
        } else {
            right.push(num);
        }
    }

    if (k <= left.length) {
        return findKthLargest(left, k);
    }
    if (k > left.length + mid.length) {
        return findKthLargest(right, k - mid.length - left.length);
    }
    return mid[0];
};

module.exports = { findKthLargest };

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
    assert.deepStrictEqual(findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
    assert.deepStrictEqual(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
}
