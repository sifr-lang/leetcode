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
 * https://leetcode.com/problems/number-of-islands/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid, connectedComponents = 0) {
    const [rows, cols] = [grid.length, grid[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isIsland = grid[row][col] === '1';
            if (isIsland) connectedComponents++;

            dfs(grid, row, rows, col, cols); /* Space O(ROWS * COLS) */
        }
    }

    return connectedComponents;
};

const dfs = (grid, row, rows, col, cols) => {
    const isBaseCase = grid[row][col] === '0';
    if (isBaseCase) return;

    grid[row][col] = '0';

    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        dfs(grid, _row, rows, _col, cols); /* Space O(ROWS * COLS) */
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

/**
 * https://leetcode.com/problems/number-of-islands/
 * Time O(ROWS * COLS) | Space O(MIN(ROWS,COLS))
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid, connectedComponents = 0) {
    const [rows, cols] = [grid.length, grid[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isIsland = grid[row][col] === '1';
            if (isIsland) connectedComponents++;

            bfs(
                grid,
                rows,
                cols,
                new Queue([[row, col]]),
            ); /* Space O(MIN(ROWS,COLS)) */
        }
    }

    return connectedComponents;
};

const bfs = (grid, rows, cols, queue) => {
    while (!queue.isEmpty()) {
        for (let i = queue.size() - 1; 0 <= i; i--) {
            /* Time O(WIDTH) */
            const [row, col] = queue.dequeue();

            const isWater = grid[row][col] === '0';
            if (isWater) continue;

            grid[row][col] = '0';

            for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
                queue.enqueue([_row, _col]); /* Space O(MIN(ROWS,COLS)) */
            }
        }
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

/**
 * https://leetcode.com/problems/number-of-islands/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    const unionFind = new UnionFind(
        grid,
    ); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */

    searchGrid(grid, unionFind); /* Time O(ROWS * COLS) */

    return unionFind.connectedComponents;
};

var searchGrid = (grid, unionFind) => {
    const [rows, cols] = [grid.length, grid[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isWater = grid[row][col] === '0';
            if (isWater) continue;

            grid[row][col] = '0';

            searchRows(unionFind, grid, row, rows, col, cols);
            searchCols(unionFind, grid, row, rows, col, cols);
        }
    }
};

const searchRows = (unionFind, grid, row, rows, col, cols) =>
    [1, -1]
        .map((_row) => row + _row)
        .filter((_row) => isInBound(_row, rows) && isIsland(grid[_row][col]))
        .map((_row) => [index(row, cols, col), index(_row, cols, col)])
        .forEach(([x, y]) => unionFind.union(x, y));

const isInBound = (val, vals) => 0 <= val && val < vals;
const isIsland = (cell) => cell === '1';
const index = (row, cols, col) => row * cols + col;

const searchCols = (unionFind, grid, row, rows, col, cols) =>
    [1, -1]
        .map((_col) => col + _col)
        .filter((_col) => isInBound(_col, cols) && isIsland(grid[row][_col]))
        .map((_col) => [index(row, cols, col), index(row, cols, _col)])
        .forEach(([x, y]) => unionFind.union(x, y));

class UnionFind {
    constructor(grid) {
        const [rows, cols] = [grid.length, grid[0].length];

        this.connectedComponents = 0;
        this.grid = grid;
        this.rows = rows;
        this.cols = cols;
        this.parent = new Array(rows * cols).fill(0);
        this.rank = new Array(rows * cols).fill(0);

        this.findIslands();
    }

    findIslands({ grid, rows, cols, parent } = this) {
        for (let row = 0; row < rows; row++) {
            /* Time O(ROWS) */
            for (let col = 0; col < cols; col++) {
                /* Time O(COLS) */
                const isWater = grid[row][col] === '0';
                if (isWater) continue;

                const index = row * cols + col;

                parent[index] = index; /* Space O(ROWS * COLS) */
                this.connectedComponents++;
            }
        }
    }

    find(index, { parent } = this) {
        const isEqual = () => parent[index] === index;
        while (!isEqual()) {
            index = parent[index];
        }

        return parent[index];
    }

    union(x, y, { parent, rank } = this) {
        const [rootX, rootY] = [this.find(x), this.find(y)];

        const hasCycle = rootX === rootY;
        if (hasCycle) return;

        this.connectedComponents--;

        const isXGreater = rank[rootY] < rank[rootX];
        if (isXGreater) return (parent[rootY] = rootX);

        const isYGreater = rank[rootX] < rank[rootY];
        if (isYGreater) return (parent[rootX] = rootY);

        parent[rootY] = rootX; /* Space O(ROWS * COLS) */
        rank[rootX]++; /* Space O(ROWS * COLS) */
    }
}

var numIslands = function (grid) {
    if (!grid || !grid[0]) {
        return 0;
    }

    let islands = 0;
    const visit = new Set();
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    const dfs = (r, c) => {
        const key = `${r},${c}`;
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0' || visit.has(key)) {
            return;
        }
        visit.add(key);
        for (const [dr, dc] of directions) {
            dfs(r + dr, c + dc);
        }
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const key = `${r},${c}`;
            if (grid[r][c] === '1' && !visit.has(key)) {
                islands += 1;
                dfs(r, c);
            }
        }
    }
    return islands;
};

module.exports = { numIslands };

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
    assert.deepStrictEqual(numIslands([["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]), 1);
    assert.deepStrictEqual(numIslands([["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]), 3);
}
