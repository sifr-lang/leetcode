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
 * https://leetcode.com/problems/word-ladder/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function (beginWord, endWord, wordList) {
    if (!wordList.includes(endWord)) {
        return 0;
    }

    const nei = new Map();
    wordList.push(beginWord);
    for (const word of wordList) {
        for (let j = 0; j < word.length; j++) {
            const pattern = word.slice(0, j) + '*' + word.slice(j + 1);
            if (!nei.has(pattern)) {
                nei.set(pattern, []);
            }
            nei.get(pattern).push(word);
        }
    }

    const visit = new Set([beginWord]);
    const q = [beginWord];
    let head = 0;
    let res = 1;
    while (head < q.length) {
        const length = q.length - head;
        for (let i = 0; i < length; i++) {
            const word = q[head++];
            if (word === endWord) {
                return res;
            }
            for (let j = 0; j < word.length; j++) {
                const pattern = word.slice(0, j) + '*' + word.slice(j + 1);
                for (const neiWord of nei.get(pattern)) {
                    if (!visit.has(neiWord)) {
                        visit.add(neiWord);
                        q.push(neiWord);
                    }
                }
            }
        }
        res += 1;
    }
    return 0;
};

const bfs = (queue, wordSet, seen, endWord) => {
    while (!queue.isEmpty()) {
        for (let i = queue.size() - 1; 0 <= i; i--) {
            const [word, depth] = queue.dequeue();

            const isTarget = word === endWord;
            if (isTarget) return depth;

            transform(queue, wordSet, seen, word, depth);
        }
    }

    return 0;
};

const transform = (queue, wordSet, seen, word, depth) => {
    for (const index in word) {
        for (const char of 'abcdefghijklmnopqrstuvwxyz') {
            const neighbor = getNeighbor(word, index, char);

            const hasSeen = !wordSet.has(neighbor) || seen.has(neighbor);
            if (hasSeen) continue;

            queue.enqueue([neighbor, depth + 1]);
            seen.add(neighbor);
        }
    }
};

const getNeighbor = (word, index, char) => {
    const neighbor = word.split('');

    neighbor[index] = char;

    return neighbor.join('');
};

module.exports = { ladderLength };

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
    assert.deepStrictEqual(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log", "cog"]), 5);
    assert.deepStrictEqual(ladderLength("hit", "cog", ["hot", "dot", "dog", "lot", "log"]), 0);
}
