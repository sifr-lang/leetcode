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
 * https://leetcode.com/problems/alien-dictionary/
 * @param {string[]} words
 * @return {string}
 */
var alienOrder = function (words) {
    const { graph, frequencyMap, queue, buffer } = buildGraph(words);

    if (!canBuildGraph(words, graph, frequencyMap)) return '';

    queueSources(queue, frequencyMap);
    bfs(queue, frequencyMap, graph, buffer);

    return frequencyMap.size <= buffer.length ? buffer.join('') : '';
};

var initGraph = () => ({
    graph: new Map(),
    frequencyMap: new Map(),
    queue: new Queue(),
    buffer: [],
});

var buildGraph = (words) => {
    const { graph, frequencyMap, queue, buffer } = initGraph();

    for (const word of words) {
        for (const char of word) {
            frequencyMap.set(char, 0);
            graph.set(char, []);
        }
    }

    return { graph, frequencyMap, queue, buffer };
};

var canBuildGraph = (words, graph, frequencyMap) => {
    for (let index = 0; index < words.length - 1; index++) {
        const [word1, word2] = [words[index], words[index + 1]];
        const minLength = Math.min(word1.length, word2.length);

        const isWord1Longer = word2.length < word1.length;
        const isPrefix = isWord1Longer && word1.startsWith(word2);

        if (isPrefix) return false;

        for (let j = 0; j < minLength; j++) {
            const [char1, char2] = [word1[j], word2[j]];

            const isEqual = char1 === char2;
            if (isEqual) continue;

            graph.get(char1).push(char2);
            frequencyMap.set(char2, frequencyMap.get(char2) + 1);

            break;
        }
    }

    return true;
};

const bfs = (queue, frequencyMap, graph, buffer) => {
    while (!queue.isEmpty()) {
        for (let level = queue.size() - 1; 0 <= level; level--) {
            checkNeighbors(queue, frequencyMap, graph, buffer);
        }
    }
};

var checkNeighbors = (queue, frequencyMap, graph, buffer) => {
    const char = queue.dequeue();

    buffer.push(char);

    for (const next of graph.get(char)) {
        const value = frequencyMap.get(next) - 1;

        frequencyMap.set(next, value);

        const isEmpty = frequencyMap.get(next) === 0;
        if (!isEmpty) continue;

        queue.enqueue(next);
    }
};

const queueSources = (queue, frequencyMap) => {
    for (const [key, value] of frequencyMap) {
        const isEmpty = frequencyMap.get(key) === 0;
        if (!isEmpty) continue;

        queue.enqueue(key);
    }
};

/**
 * DFS
 * https://leetcode.com/problems/alien-dictionary/
 * @param {string[]} words
 * @return {string}
 */
var alienOrder = function (words) {
    const { graph, seen, buffer } = buildGraph(words);

    if (!canBuildGraph(words, graph)) return '';

    for (const [char] of graph) {
        if (!dfs(char, graph, seen, buffer)) return '';
    }

    return buffer.reverse().join('');
};

var initGraph = () => ({
    graph: new Map(),
    seen: new Map(),
    buffer: [],
});

var buildGraph = (words) => {
    const { graph, seen, buffer } = initGraph();

    for (const word of words) {
        for (const char of word) {
            graph.set(char, []);
        }
    }

    return { graph, seen, buffer };
};

var canBuildGraph = (words, graph) => {
    for (let index = 0; index < words.length - 1; index++) {
        const [word1, word2] = [words[index], words[index + 1]];
        const minLength = Math.min(word1.length, word2.length);

        const isWord1Longer = word2.length < word1.length;
        const isPrefix = isWord1Longer && word1.startsWith(word2);

        if (isPrefix) return false;

        for (let j = 0; j < minLength; j++) {
            const [char1, char2] = [word1[j], word2[j]];

            const isEqual = char1 === char2;
            if (isEqual) continue;

            graph.get(char1).push(char2);

            break;
        }
    }

    return true;
};

const dfs = (char, graph, seen, buffer) => {
    if (seen.has(char)) return seen.get(char);

    if (!backTrack(char, graph, seen, buffer)) return false;

    buffer.push(char);

    return true;
};

const backTrack = (char, graph, seen, buffer) => {
    seen.set(char, false);
    for (const neighbor of graph.get(char)) {
        if (!dfs(neighbor, graph, seen, buffer)) return false;
    }
    seen.set(char, true);

    return true;
};

module.exports = { alienOrder };

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
    assert.deepStrictEqual(alienOrder(["wrt", "wrf", "er", "ett", "rftt"]), "wertf");
    assert.deepStrictEqual(alienOrder(["z", "x"]), "zx");
    assert.deepStrictEqual(alienOrder(["z", "x", "z"]), "");
}
