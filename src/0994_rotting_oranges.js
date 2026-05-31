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
 * https://leetcode.com/problems/rotting-oranges/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid) {
    const { queue, orangeCount } = searchGrid(grid); /* Time O(ROWS * COLS) */
    const { rottenCount, minutes } = bfs(grid, queue);

    const isEqual = orangeCount === rottenCount;
    return isEqual ? minutes : -1;
};

const searchGrid = (grid, orangeCount = 0, queue = new Queue([])) => {
    const [rows, cols] = [grid.length, grid[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isEmpty = grid[row][col] === 0;
            if (!isEmpty) orangeCount++;

            const isRotten = grid[row][col] === 2;
            if (isRotten) queue.enqueue([row, col]); /* Space O(ROWS * COLS) */
        }
    }

    return { queue, orangeCount };
};

const bfs = (grid, queue, rottenCount = 0, minutes = 0) => {
    while (!queue.isEmpty()) {
        rottenCount += queue.size();

        for (let i = queue.size() - 1; 0 <= i; i--) {
            /* Time O(WIDTH) */
            expireFresh(grid, queue);
        }

        if (queue.size()) minutes++;
    }

    return { rottenCount, minutes };
};

var expireFresh = (grid, queue) => {
    const [rows, cols] = [grid.length, grid[0].length];
    const [row, col] = queue.dequeue();

    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        const isFresh = grid[_row][_col] === 1;
        if (!isFresh) continue;

        grid[_row][_col] = 2;
        queue.enqueue([_row, _col]); /* Space O(ROWS * COLS) */
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
 * https://leetcode.com/problems/rotting-oranges/
 * Time O((ROWS * COLS)^2) | Space O(1)
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function (grid, minutes = 2) {
    while (expireFresh(grid, minutes)) minutes++; /* Time O((ROWS * COLS)^2) */

    return !hasFresh(grid) /* Time O(ROWS * COLS) */ ? minutes - 2 : -1;
};

var expireFresh = (grid, minutes, toBeContinued = false) => {
    const [rows, cols] = [grid.length, grid[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isEqual = grid[row][col] === minutes;
            if (!isEqual) continue;

            for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
                const isFresh = grid[_row][_col] === 1;
                if (!isFresh) continue;

                grid[_row][_col] = minutes + 1;
                toBeContinued = true;
            }
        }
    }

    return toBeContinued;
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

const hasFresh = (grid) => {
    for (const row of grid) {
        /* Time O(ROWS) */
        for (const cell of row) {
            /* Time O(COLS) */
            const isFresh = cell === 1;
            if (isFresh) return true;
        }
    }

    return false;
};

var orangesRotting = function (grid) {
    const q = [];
    let head = 0;
    let fresh = 0;
    let time = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] === 1) {
                fresh += 1;
            }
            if (grid[r][c] === 2) {
                q.push([r, c]);
            }
        }
    }

    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (fresh > 0 && head < q.length) {
        const length = q.length - head;
        for (let i = 0; i < length; i++) {
            const [r, c] = q[head++];

            for (const [dr, dc] of directions) {
                const row = r + dr;
                const col = c + dc;
                if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && grid[row][col] === 1) {
                    grid[row][col] = 2;
                    q.push([row, col]);
                    fresh -= 1;
                }
            }
        }
        time += 1;
    }
    return fresh === 0 ? time : -1;
};

module.exports = { orangesRotting };

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
    assert.deepStrictEqual(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
    assert.deepStrictEqual(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), (-1));
    assert.deepStrictEqual(orangesRotting([[0, 2]]), 0);
}
