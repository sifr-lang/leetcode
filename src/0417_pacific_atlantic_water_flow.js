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
 * https://leetcode.com/problems/pacific-atlantic-water-flow/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
    const [pacificReachable, atlanticReachable] =
        search(heights); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */

    return searchGrid(
        heights,
        pacificReachable,
        atlanticReachable,
    ); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
};

var search = (heights) => {
    const [rows, cols] = [heights.length, heights[0].length];
    const [pacificReachable, atlanticReachable] = [
        getMatrix(rows, cols),
        getMatrix(rows, cols),
    ]; /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */

    searchRows(heights, rows, cols, pacificReachable, atlanticReachable);
    searchCols(heights, rows, cols, pacificReachable, atlanticReachable);

    return [pacificReachable, atlanticReachable];
};

var getMatrix = (rows, cols) =>
    new Array(rows)
        .fill() /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
        .map(() => new Array(cols).fill(false));

var searchRows = (heights, rows, cols, pacificReachable, atlanticReachable) => {
    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        const [pacificStart, atlanticStart] = [0, cols - 1];

        dfs(
            row,
            pacificStart,
            rows,
            cols,
            pacificReachable,
            heights,
        ); /* Space O(ROWS * COLS) */
        dfs(
            row,
            atlanticStart,
            rows,
            cols,
            atlanticReachable,
            heights,
        ); /* Space O(ROWS * COLS) */
    }
};

var searchCols = (heights, rows, cols, pacificReachable, atlanticReachable) => {
    for (let col = 0; col < cols; col++) {
        /* Time O(COLS) */
        const [pacificStart, atlanticStart] = [0, rows - 1];

        dfs(
            pacificStart,
            col,
            rows,
            cols,
            pacificReachable,
            heights,
        ); /* Space O(ROWS * COLS) */
        dfs(
            atlanticStart,
            col,
            rows,
            cols,
            atlanticReachable,
            heights,
        ); /* Space O(ROWS * COLS) */
    }
};

const dfs = (row, col, rows, cols, isReachable, heights) => {
    isReachable[row][col] = true;

    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        if (isReachable[_row][_col]) continue;

        const isLower = heights[_row][_col] < heights[row][col];
        if (isLower) continue;

        dfs(
            _row,
            _col,
            rows,
            cols,
            isReachable,
            heights,
        ); /* Space O(ROWS * COLS) */
    }
};

var searchGrid = (
    heights,
    pacificReachable,
    atlanticReachable,
    intersection = [],
) => {
    const [rows, cols] = [heights.length, heights[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isReachable =
                pacificReachable[row][col] && atlanticReachable[row][col];
            if (!isReachable) continue;

            intersection.push([row, col]); /* Space O(ROWS * COLS) */
        }
    }

    return intersection;
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
 * https://leetcode.com/problems/pacific-atlantic-water-flow/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
    const [pacificQueue, atlanticQueue] =
        search(heights); /* Time O(ROWS + COLS) | Space O(ROWS + COLS) */
    const [pacificReachable, atlanticReachable] = [
        bfs(heights, pacificQueue),
        bfs(heights, atlanticQueue),
    ]; /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */

    return getIntersection(
        heights,
        pacificReachable,
        atlanticReachable,
    ); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
};

var search = (
    heights,
    pacificQueue = new Queue([]),
    atlanticQueue = new Queue([]),
) => {
    searchRows(heights, pacificQueue, atlanticQueue);
    searchCols(heights, pacificQueue, atlanticQueue);

    return [pacificQueue, atlanticQueue];
};

var searchRows = (heights, pacificQueue, atlanticQueue) => {
    const [rows, cols] = [heights.length, heights[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        pacificQueue.enqueue([row, 0]); /* Space O(ROWS) */
        atlanticQueue.enqueue([row, cols - 1]); /* Space O(ROWS) */
    }
};

var searchCols = (heights, pacificQueue, atlanticQueue) => {
    const [rows, cols] = [heights.length, heights[0].length];

    for (let col = 0; col < cols; col++) {
        /* Time O(COLS) */
        pacificQueue.enqueue([0, col]); /* Space O(COLS) */
        atlanticQueue.enqueue([rows - 1, col]); /* Space O(COLS) */
    }
};

const bfs = (heights, queue) => {
    const [rows, cols] = [heights.length, heights[0].length];
    const isReachable = getMatrix(
        rows,
        cols,
    ); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */

    while (!queue.isEmpty()) {
        for (let i = queue.size() - 1; 0 <= i; i--) {
            /*                     | Space O(WIDTH) */
            const [row, col] = queue.dequeue();

            checkNeighbor(heights, row, rows, col, cols, isReachable, queue);
        }
    }

    return isReachable;
};

var getMatrix = (rows, cols) =>
    new Array(rows)
        .fill() /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
        .map(() => new Array(cols).fill(false));

var checkNeighbor = (heights, row, rows, col, cols, isReachable, queue) => {
    isReachable[row][col] = true;

    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        if (isReachable[_row][_col]) continue;

        const isLower = heights[_row][_col] < heights[row][col];
        if (isLower) continue;

        queue.enqueue([_row, _col]);
    }
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

const getIntersection = (
    heights,
    pacificReachable,
    atlanticReachable,
    intersection = [],
) => {
    const [rows, cols] = [heights.length, heights[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isReachable =
                pacificReachable[row][col] && atlanticReachable[row][col];
            if (!isReachable) continue;

            intersection.push([row, col]); /* Space O(ROWS * COLS) */
        }
    }

    return intersection;
};

module.exports = { pacificAtlantic };

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
    assert.deepStrictEqual(pacificAtlantic([[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]), [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]);
    assert.deepStrictEqual(pacificAtlantic([[1]]), [[0, 0]]);
}
