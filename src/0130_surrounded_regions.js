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
 * https://leetcode.com/problems/surrounded-regions/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function solve(board) {
    searchRows(board); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
    searchCols(board); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
    searchGrid(board); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
};

var searchRows = (board) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        dfs(board, row, rows, 0, cols); /* Space O(ROWS) */
        dfs(board, row, rows, cols - 1, cols); /* Space O(ROWS) */
    }
};

var searchCols = (board) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let col = 1; col < cols - 1; col++) {
        /* Time O(COLS) */
        dfs(board, 0, rows, col, cols); /* Space O(COLS) */
        dfs(board, rows - 1, rows, col, cols); /* Space O(COLS) */
    }
};

var searchGrid = (board) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isO = board[row][col] === 'O';
            if (isO) board[row][col] = 'X';

            const isStar = board[row][col] === '*';
            if (isStar) board[row][col] = 'O';
        }
    }
};

const dfs = (board, row, rows, col, cols) => {
    const isBaseCase = board[row][col] !== 'O';
    if (isBaseCase) return;

    board[row][col] = '*';

    for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
        dfs(
            board,
            _row,
            rows,
            _col,
            cols,
        ); /* Time O(HEIGHT) | Space O(HEIGHT) */
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
 * https://leetcode.com/problems/surrounded-regions/
 * Time O(ROWS * COLS) | Space O(ROWS * COLS)
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function solve(board, queue = new Queue([])) {
    searchRows(board, queue); /* Time O(ROWS + COLS) | Space O(ROWS + COLS) */
    searchCols(board, queue); /* Time O(ROWS + COLS) | Space O(ROWS + COLS) */
    bfs(board, queue); /* Time O(ROWS * COLS) | Space O(ROWS * COLS) */
    searchGrid(board); /* Time O(ROWS * COLS) */
};

var searchRows = (board, queue) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        queue.enqueue([row, 0]); /* Space O(ROWS) */
        queue.enqueue([row, cols - 1]); /* Space O(ROWS) */
    }
};

var searchCols = (board, queue) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let col = 0; col < cols - 1; col++) {
        /* Time O(COLS) */
        queue.enqueue([0, col]); /* Space O(COLS) */
        queue.enqueue([rows - 1, col]); /* Space O(COLS) */
    }
};

var bfs = (board, queue) => {
    const [rows, cols] = [board.length, board[0].length];

    while (!queue.isEmpty()) {
        for (let i = queue.size() - 1; 0 <= i; i--) {
            /* Time O(WIDTH) */
            const [row, col] = queue.dequeue();

            const isBaseCase = board[row][col] !== 'O';
            if (isBaseCase) continue;

            board[row][col] = '*';

            for (const [_row, _col] of getNeighbors(row, rows, col, cols)) {
                queue.enqueue([_row, _col]); /* Space O(WIDTH) */
            }
        }
    }
};

var searchGrid = (board) => {
    const [rows, cols] = [board.length, board[0].length];

    for (let row = 0; row < rows; row++) {
        /* Time O(ROWS) */
        for (let col = 0; col < cols; col++) {
            /* Time O(COLS) */
            const isO = board[row][col] === 'O';
            if (isO) board[row][col] = 'X';

            const isStar = board[row][col] === '*';
            if (isStar) board[row][col] = 'O';
        }
    }
};

var solve = function solve(board) {
    const rows = board.length;
    const cols = board[0].length;
    const flag = new Set();

    const dfs = (r, c) => {
        const key = `${r},${c}`;
        if (!(r >= 0 && r < rows && c >= 0 && c < cols) || board[r][c] !== 'O' || flag.has(key)) {
            return;
        }
        flag.add(key);
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if ((r === 0 || c === 0 || r === rows - 1 || c === cols - 1) && board[r][c] === 'O') {
                dfs(r, c);
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'O' && !flag.has(`${r},${c}`)) {
                board[r][c] = 'X';
            }
        }
    }
};

module.exports = { solve };

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
    let arg0 = [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]];
    let _result = solve(arg0);
    assert.deepStrictEqual(arg0, [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]]);
    arg0 = [["X"]];
    _result = solve(arg0);
    assert.deepStrictEqual(arg0, [["X"]]);
}
