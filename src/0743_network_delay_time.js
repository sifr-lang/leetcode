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
 * Graph - BFS
 * Queue - Space (WIDTH)
 * Array - Greedy
 * https://leetcode.com/problems/network-delay-time/
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = (times, n, k) => {
    const { graph, maxTime, queue } = buildGraph(times, n, k);

    bfs(queue, graph, maxTime, k);

    return checkAns(maxTime);
};

var initGraph = (n, k) => ({
    graph: Array.from({ length: n + 1 })
        .fill()
        .map(() => []),
    maxTime: Array.from({ length: n + 1 }).fill(Infinity),
    queue: new Queue([[k, 0]]),
});

var buildGraph = (times, n, k) => {
    const { graph, maxTime, queue } = initGraph(n, k);

    for (const [src, dst, weight] of times) {
        graph[src].push([dst, weight]);
    }

    maxTime[0] = 0;

    return { graph, maxTime, queue };
};

var bfs = (queue, graph, maxTime) => {
    while (!queue.isEmpty()) {
        for (let level = queue.size() - 1; 0 <= level; level--) {
            checkNeighbors(queue, graph, maxTime);
        }
    }
};

var checkNeighbors = (queue, graph, maxTime) => {
    const [node, time] = queue.dequeue();

    const canUpdate = time < maxTime[node];
    if (!canUpdate) return;

    maxTime[node] = time;

    for (const [dst, weight] of graph[node]) {
        queue.enqueue([dst, weight + time]);
    }
};

var checkAns = (maxTime) => {
    const max = Math.max(...maxTime);

    return max < Infinity ? max : -1;
};

/**
 * https://leetcode.com/problems/network-delay-time/
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = (times, n, k) => {
    const { graph, seen, minHeap } = buildGraph(times, n, k);
    const maxTime = getTime(graph, seen, minHeap);

    return seen.size === n ? maxTime : -1;
};

var initGraph = (n, k) => ({
    graph: Array.from({ length: n + 1 })
        .fill()
        .map(() => []),
    seen: new Set(),
    minHeap: new MinPriorityQueue(),
});

var buildGraph = (times, n, k) => {
    const { graph, seen, minHeap } = initGraph(n, k);

    for (const [src, dst, weight] of times) {
        graph[src].push([dst, weight]);
    }

    minHeap.enqueue([k, 0], 0);

    return { graph, seen, minHeap };
};

const getTime = (graph, seen, minHeap, maxTime = 0) => {
    while (!minHeap.isEmpty()) {
        const [node, cost] = minHeap.dequeue().element;

        if (seen.has(node)) continue;
        seen.add(node);

        maxTime = Math.max(maxTime, cost);
        checkNeighbors(graph, node, cost, seen, minHeap);
    }

    return maxTime;
};

var checkNeighbors = (graph, src, srcCost, seen, minHeap) => {
    for (const [dst, dstCost] of graph[src]) {
        if (seen.has(dst)) continue;

        const cost = dstCost + srcCost;
        const node = [dst, cost];

        minHeap.enqueue(node, cost);
    }
};

module.exports = { networkDelayTime };

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
    assert.deepStrictEqual(networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
    assert.deepStrictEqual(networkDelayTime([[1, 2, 1]], 2, 1), 1);
    assert.deepStrictEqual(networkDelayTime([[1, 2, 1]], 2, 2), (-1));
}
