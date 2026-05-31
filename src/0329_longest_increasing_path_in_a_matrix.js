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
 * Time O(2^(N + M)) | Space O(N * M)
 * https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = (matrix, maxPath = 0) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(N) */
        for (let col = 0; col < cols; col++) {
            /* Time O(M) */
            const path = dfs(
                matrix,
                row,
                rows,
                col,
                cols,
            ); /* Time O(2^(N + M)) | Space O(HEIGHT) */

            maxPath = Math.max(maxPath, path);
        }
    }

    return maxPath;
};

var dfs = (matrix, row, rows, col, cols, ans = 0) => {
    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        /* Time O(4) */
        const path = dfs(
            matrix,
            _row,
            rows,
            _col,
            cols,
        ); /* Time O(2^(N + M)) | Space O(HEIGHT) */

        ans = Math.max(ans, path);
    }

    ans += 1;
    return ans;
};

var getNeighbors = (row, rows, col, cols) =>
    [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ]
        .map(([_row, _col]) => [row + _row, col + _col])
        .filter(
            ([_row, _col]) =>
                0 <= _row && _row < rows && 0 <= _col && _col < cols,
        );

/**
 * DP - Top Down
 * Matrix - Memoization
 * Time O(N * M) | Space O(N * M)
 * https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = (matrix, maxPath = 0, memo = initMemo(matrix)) => {
    const [rows, cols] = [matrix.length, matrix[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(N) */
        for (let col = 0; col < cols; col++) {
            /* Time O(M) */
            const path =
                /* Time O(N * M) | Space O((N * M) + HEIGHT) */
                search(matrix, row, rows, col, cols, memo);

            maxPath = Math.max(maxPath, path);
        }
    }

    return maxPath;
};

var initMemo = (matrix) =>
    new Array(matrix.length)
        .fill() /* Time O(N) | Space O(N)*/
        .map(() =>
            new Array(matrix[0].length).fill(0),
        ); /* Time O(M) | Space O(M)*/

const search = (matrix, row, rows, col, cols, memo) => {
    const hasSeen = memo[row][col] !== 0;
    if (hasSeen) return memo[row][col];

    return dfs(
        matrix,
        row,
        rows,
        col,
        cols,
        memo,
    ); /* Time O(N * M) | Space O((N * M) + HEIGHT) */
};

var dfs = (matrix, row, rows, col, cols, memo) => {
    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        /* Time O(4) */
        const [parent, node] = [matrix[row][col], matrix[_row][_col]];

        const isLess = node <= parent;
        if (isLess) continue;

        const path = search(
            matrix,
            _row,
            rows,
            _col,
            cols,
            memo,
        ); /* Time O(N * M) | Space O(HEIGHT) */

        memo[row][col] = Math.max(memo[row][col], path);
    }

    memo[row][col] += 1; /*               | Space O(N * M) */
    return memo[row][col];
};

var getNeighbors = (row, rows, col, cols) =>
    [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ]
        .map(([_row, _col]) => [row + _row, col + _col])
        .filter(
            ([_row, _col]) =>
                0 <= _row && _row < rows && 0 <= _col && _col < cols,
        );

/**
 * Topological Sort
 * Matrix - Graph
 * Matrix - In-Degree
 * Queue - BFS
 * Time O(N * M) | Space O(N * M)
 * https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = (matrix) => {
    const { graph, indegree, sources } =
        /* Time O(N * M) | Space O(N * M) */
        buildGraph(matrix);

    findSources(graph, indegree, sources); /* Time O(N * M) | Space O(N * M) */

    return bfs(
        graph,
        indegree,
        sources,
    ); /* Time O((N * M) + WIDTH) | Space O((N * M) + WIDTH) */
};

const initGraph = (rows, cols) => ({
    graph: new Array(rows + 2)
        .fill() /* Time O(N) | Space O(N) */
        .map(() => new Array(cols + 2).fill(0)) /* Time O(M) | Space O(M) */,
    indegree: new Array(rows + 2)
        .fill() /* Time O(N) | Space O(N) */
        .map(() => new Array(cols + 2).fill(0)) /* Time O(M) | Space O(M) */,
    sources: new Queue(),
});

var buildGraph = (matrix) => {
    const [rows, cols] = [matrix.length, matrix[0].length];
    const { graph, indegree, sources } =
        /* Time O(N * M) | Space O(N * M) */
        initGraph(rows, cols);

    for (let row = 1; row < rows + 1; row++) {
        /* Time O(N) */
        graph[row] = [
            0,
            ...matrix[row - 1],
            0,
        ]; /*           | Space O(N * M) */
    }

    for (let row = 1; row <= rows; row++) {
        /* Time O(N) */
        for (let col = 1; col <= cols; col++) {
            /* Time O(M) */
            for (const [_row, _col] of getNeighbors(row, col)) {
                /* Time O(4) */
                const isSink = graph[row][col] < graph[_row][_col];
                if (isSink)
                    indegree[row][col] += 1; /*       | Space O(N * M) */
            }
        }
    }

    return { graph, indegree, sources };
};

var getNeighbors = (row, col) =>
    [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
    ].map(([_row, _col]) => [row + _row, col + _col]);

var findSources = (graph, indegree, sources) => {
    const [rows, cols] = [graph.length, graph[0].length];

    for (let row = 1; row < rows - 1; ++row) {
        /* Time O(N) */
        for (let col = 1; col < cols - 1; ++col) {
            /* Time O(M) */
            const isSource = indegree[row][col] === 0;
            if (isSource) sources.enqueue([row, col]); /* Space O(N * M) */
        }
    }
};

const bfs = (graph, indegree, sources, path = 0) => {
    while (!sources.isEmpty()) {
        /* Time(N * M) */
        for (let level = sources.size() - 1; 0 <= level; level--) {
            /* Time(WIDTH) */
            checkNeighbors(
                graph,
                indegree,
                sources,
            ); /* Space((N * M) + WIDTH) */
        }

        path += 1;
    }

    return path;
};

const checkNeighbors = (graph, indegree, sources) => {
    const [row, col] = sources.dequeue();

    for (const [_row, _col] of getNeighbors(row, col)) {
        const canDisconnect = graph[_row][_col] < graph[row][col];
        if (!canDisconnect) continue;

        indegree[_row][_col] -= 1; /* Space O(N * M) */

        const isSource = indegree[_row][_col] === 0;
        if (isSource) sources.enqueue([_row, _col]); /* Space O(WIDTH) */
    }
};

var longestIncreasingPath = (matrix) => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const dp = new Map();

    const dfs = (r, c, prevVal) => {
        if (r < 0 || r === rows || c < 0 || c === cols || matrix[r][c] <= prevVal) {
            return 0;
        }
        const key = `${r},${c}`;
        if (dp.has(key)) {
            return dp.get(key);
        }

        let res = 1;
        res = Math.max(res, 1 + dfs(r + 1, c, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r - 1, c, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r, c + 1, matrix[r][c]));
        res = Math.max(res, 1 + dfs(r, c - 1, matrix[r][c]));
        dp.set(key, res);
        return res;
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, -1);
        }
    }
    return Math.max(...dp.values());
};

module.exports = { longestIncreasingPath };

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
    assert.deepStrictEqual(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]), 4);
    assert.deepStrictEqual(longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]), 4);
    assert.deepStrictEqual(longestIncreasingPath([[1]]), 1);
}
