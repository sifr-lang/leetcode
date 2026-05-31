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
 * Brute Force - DFS
 * Hash Set - Distinct Keys
 * Time O(2^N) | Space O(N)
 * https://leetcode.com/problems/word-break/
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = (s, wordDict) => {
    const wordSet = new Set(wordDict); /* Time O(N)   | Space O(N) */

    return canBreak(s, wordSet); /* Time O(2^N) | Space O(N) */
};

var canBreak = (s, wordSet, start = 0) => {
    const isBaseCase = start === s.length;
    if (isBaseCase) return true;

    return dfs(s, wordSet, start); /* Time O(2^N) | Space O(N) */
};

var dfs = (s, wordSet, start) => {
    for (let end = start + 1; end <= s.length; end++) {
        /* Time O(N) */
        const word = s.slice(start, end); /* Time O(N)   | Space O(N) */

        const _canBreak =
            wordSet.has(word) &&
            canBreak(s, wordSet, end); /* Time O(2^N) | Space O(N) */
        if (_canBreak) return true;
    }

    return false;
};

/**
 * DP - Top Down
 * Array - Memoization
 * Hash Set - Distinct Keys
 * Time O(N^3) | Space O(N)
 * https://leetcode.com/problems/word-break/
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = (s, wordDict) => {
    const wordSet = new Set(wordDict); /* Time O(N)         | Space O(N) */
    const memo = new Array(s.length).fill(
        null,
    ); /*                   | Space O(N) */
    const start = 0;

    return canBreak(
        s,
        wordSet,
        start,
        memo,
    ); /* Time O(N * N * N) | Space O(N) */
};

var canBreak = (s, wordSet, start, memo) => {
    const isBaseCase1 = s.length === start;
    if (isBaseCase1) return true;

    const hasSeen = memo[start] !== null;
    if (hasSeen) return memo[start];

    return dfs(s, wordSet, start, memo); /* Time O(N * N * N) | Space O(N) */
};

var dfs = (s, wordSet, start, memo) => {
    for (let end = start + 1; end <= s.length; end++) {
        /* Time O(N) */
        const word = s.slice(start, end); /* Time O(N) | Space O(N) */

        const _canBreak =
            wordSet.has(word) &&
            canBreak(s, wordSet, end, memo); /* Time O(N * N) */
        if (_canBreak) {
            memo[start] = true;
            return true;
        }
    }

    memo[start] = false;
    return false;
};

/**
 * DP - Bottom Up
 * Array - Tabulation
 * Hash Set - Distinct Keys
 * Time O(N^3) | Space O(N)
 * https://leetcode.com/problems/word-break/
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = (s, wordDict) => {
    const wordSet = new Set(wordDict); /* Time O(N)         | Space O(N) */
    const tabu = initTabu(s); /*                   | Space O(N) */

    canBreak(s, wordSet, tabu); /* Time O(N * N * N) | Space O(N) */

    return tabu[s.length];
};

const initTabu = (s) => {
    const tabu = new Array(s.length + 1).fill(false); /* Space O(N) */

    tabu[0] = true;

    return tabu;
};

var canBreak = (s, wordSet, tabu) => {
    for (let end = 1; end <= s.length; end++) {
        /* Time O(N) */
        checkWord(s, wordSet, end, tabu); /* Time O(N * N) | Space O(N) */
    }
};

var checkWord = (s, wordSet, end, tabu) => {
    for (let start = 0; start < end; start++) {
        /* Time O(N) */
        const word = s.slice(start, end); /* Time O(N) | Space O(N) */

        const canBreak = tabu[start] && wordSet.has(word);
        if (!canBreak) continue;

        tabu[end] = true;

        return;
    }
};

/**
 * Tree Traversal - BFS
 * Queue - Level Order Space O(WIDTH)
 * Hash Set - Distinct Keys
 * Array - Seen
 * Time O(N^3) | Space O(N)
 * https://leetcode.com/problems/word-break/
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
    const dp = new Array(s.length + 1).fill(false);
    dp[s.length] = true;

    for (let i = s.length - 1; i >= 0; i--) {
        for (const w of wordDict) {
            if (i + w.length <= s.length && s.slice(i, i + w.length) === w) {
                dp[i] = dp[i + w.length];
            }
            if (dp[i]) {
                break;
            }
        }
    }

    return dp[0];
};

const bfs = (queue, s, wordSet, seen) => {
    while (!queue.isEmpty()) {
        for (let level = queue.size() - 1; 0 <= level; level--) {
            /* Time O(N) */
            if (canWordBreak(queue, s, wordSet, seen))
                return true; /* Time O(N * N) | Space O(N + WIDTH) */
        }
    }

    return false;
};

var canWordBreak = (queue, s, wordSet, seen) => {
    const start = queue.dequeue();

    const hasSeen = seen[start];
    if (hasSeen) return false;

    if (canBreak(queue, s, start, wordSet))
        return true; /* Time O(N * N) | Space O(N + WIDTH) */

    seen[start] = true; /*               | Space O(N) */
    return false;
};

var canBreak = (queue, s, start, wordSet) => {
    for (let end = start + 1; end <= s.length; end++) {
        /* Time O(N) */
        const word = s.slice(start, end); /* Time O(N) | Space O(N) */

        if (!wordSet.has(word)) continue;

        queue.enqueue(end); /*           | Space O(WIDTH) */

        const _canBreak = end === s.length;
        if (_canBreak) return true;
    }

    return false;
};

module.exports = { wordBreak };

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
    assert.deepStrictEqual(wordBreak("leetcode", ["leet", "code"]), true);
    assert.deepStrictEqual(wordBreak("applepenapple", ["apple", "pen"]), true);
}
