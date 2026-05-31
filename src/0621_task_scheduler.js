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
 * https://leetcode.com/problems/task-scheduler/
 * Time O(N * log(N)) | Space O(N)
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function (tasks, n) {
    const frequencyMap = getFrequencyMap(tasks);
    const maxHeap = getMaxHeap(frequencyMap);

    return getMinimumCpuIntervals(maxHeap, n);
};

var getFrequencyMap = (tasks, frequencyMap = new Array(26).fill(0)) => {
    for (const task of tasks) {
        const index = task.charCodeAt(0) - 'A'.charCodeAt(0);

        frequencyMap[index]++;
    }

    return frequencyMap;
};

const getMaxHeap = (frequencyMap, maxHeap = new MaxPriorityQueue()) => {
    for (const frequency of frequencyMap) {
        const hasFrequency = 0 < frequency;
        if (hasFrequency) maxHeap.enqueue(frequency);
    }

    return maxHeap;
};

const getMinimumCpuIntervals = (maxHeap, n, cpuIntervals = [0]) => {
    while (!maxHeap.isEmpty()) {
        const { iterations, coolingPeriodQueue } = execute(
            n,
            maxHeap,
            cpuIntervals,
        );

        reQueueCoolingPeriod(coolingPeriodQueue, maxHeap);

        if (!maxHeap.isEmpty()) cpuIntervals[0] += iterations;
    }

    return cpuIntervals[0];
};

const execute = (
    n,
    maxHeap,
    cpuIntervals,
    iterations = n + 1,
    coolingPeriodQueue = new Queue(),
) => {
    while (0 < iterations && !maxHeap.isEmpty()) {
        const frequency = maxHeap.dequeue().element;

        const hasFrequency = 0 < frequency - 1;
        if (hasFrequency) coolingPeriodQueue.enqueue(frequency - 1);

        cpuIntervals[0]++;
        iterations--;
    }

    return { iterations, coolingPeriodQueue };
};

const reQueueCoolingPeriod = (coolingPeriodQueue, maxHeap) => {
    while (!coolingPeriodQueue.isEmpty()) {
        maxHeap.enqueue(coolingPeriodQueue.dequeue());
    }
};

/**
 * https://leetcode.com/problems/task-scheduler/
 * Time O(N) | Space O(1)
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function (tasks, n) {
    const frequencyMap = getFrequencyMap(tasks);
    const maxFrequency = getMaxFrequency(frequencyMap);
    const mostFrequentTask = getMostFrequentTask(frequencyMap, maxFrequency);
    const interval = (maxFrequency - 1) * (n + 1) + mostFrequentTask;

    return Math.max(tasks.length, interval);
};

var getFrequencyMap = (tasks, frequencyMap = new Array(26).fill(0)) => {
    for (const task of tasks) {
        const index = task.charCodeAt(0) - 'A'.charCodeAt(0);

        frequencyMap[index]++;
    }

    return frequencyMap;
};

const getMaxFrequency = (frequencyMap, maxFrequency = 0) => {
    for (const frequency of frequencyMap) {
        maxFrequency = Math.max(maxFrequency, frequency);
    }

    return maxFrequency;
};

const getMostFrequentTask = (
    frequencyMap,
    maxFrequency,
    mostFrequentTask = 0,
) => {
    for (const frequency of frequencyMap) {
        const isSame = frequency === maxFrequency;
        if (isSame) mostFrequentTask++;
    }

    return mostFrequentTask;
};

module.exports = { leastInterval };

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
    assert.deepStrictEqual(leastInterval(["A", "A", "A", "B", "B", "B"], 2), 8);
    assert.deepStrictEqual(leastInterval(["A", "C", "A", "B", "D", "B"], 1), 6);
    assert.deepStrictEqual(leastInterval(["A", "A", "A", "B", "B", "B"], 3), 10);
}
