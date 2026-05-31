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
 * https://leetcode.com/problems/max-area-of-island
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid, maxArea = 0) {
    const [rows, cols] = [grid.length, grid[0].length];
    const seen = new Array(rows).fill().map(() => new Array(cols));

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const area = getArea(
                grid,
                row,
                rows,
                col,
                cols,
                seen,
            ); /* Space O(ROWS * COLS) */

            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
};

var getArea = (grid, row, rows, col, cols, seen) => {
    const isBaseCase = grid[row][col] === 0;
    if (isBaseCase) return 0;

    if (seen[row][col]) return 0;
    seen[row][col] = true; /* Space O(ROWS * COLS) */

    return dfs(grid, row, rows, col, cols, seen) + 1; /* Space O(ROWS * COLS) */
};

const dfs = (grid, row, rows, col, cols, seen, area = 0) => {
    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        area += getArea(grid, _row, rows, _col, cols, seen);
    }

    return area;
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
 * https://leetcode.com/problems/number-of-islands/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {character[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = (grid, maxArea = 0) => {
    const [rows, cols] = [grid.length, grid[0].length];
    const seen = new Array(rows).fill().map(() => new Array(cols));

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isBaseCase = grid[row][col] === 0;
            if (isBaseCase) continue;

            if (seen[row][col]) continue;
            seen[row][col] = true; /* Space O(ROWS * COLS) */

            const area = getArea(
                new Queue([[row, col]]),
                grid,
                seen,
            ); /* Space O(ROWS * COLS) */

            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
};

var getArea = (queue, grid, seen, area = 0) => {
    const [rows, cols] = [grid.length, grid[0].length];

    while (!queue.isEmpty()) {
        for (let i = queue.size() - 1; 0 <= i; i--) {
            /* Time O(WIDTH) */
            const [row, col] = queue.dequeue();

            for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
                const isBaseCase = grid[_row][_col] === 0;
                if (isBaseCase) continue;

                if (seen[_row][_col]) continue;
                seen[_row][_col] = true; /* Space O(ROWS * COLS) */

                queue.enqueue([_row, _col]); /* Space O(HEIGHT) */
            }

            area++;
        }
    }

    return area;
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

var maxAreaOfIsland = function (grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visit = new Set();

    const dfs = (r, c) => {
        const key = `${r},${c}`;
        if (r < 0 || r === rows || c < 0 || c === cols || grid[r][c] === 0 || visit.has(key)) {
            return 0;
        }
        visit.add(key);
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    };

    let area = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            area = Math.max(area, dfs(r, c));
        }
    }
    return area;
};

module.exports = { maxAreaOfIsland };

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
    assert.deepStrictEqual(maxAreaOfIsland([[0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]]), 6);
    assert.deepStrictEqual(maxAreaOfIsland([[0, 0, 0, 0, 0, 0, 0, 0]]), 0);
}
