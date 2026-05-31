/**
 * https://leetcode.com/problems/swim-in-rising-water/
 * @param {number[][]} grid
 * @return {number}
 */
var swimInWater = (grid) => {
    const n = grid.length;
    const visit = new Set(['0,0']);
    const minH = [[grid[0][0], 0, 0]];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (minH.length > 0) {
        const [t, r, c] = heappop(minH);
        if (r === n - 1 && c === n - 1) {
            return t;
        }
        for (const [dr, dc] of directions) {
            const neiR = r + dr;
            const neiC = c + dc;
            const key = `${neiR},${neiC}`;
            if (neiR < 0 || neiC < 0 || neiR === n || neiC === n || visit.has(key)) {
                continue;
            }
            visit.add(key);
            heappush(minH, [Math.max(t, grid[neiR][neiC]), neiR, neiC]);
        }
    }
};

function heapLess(a, b) {
    return a[0] < b[0];
}

function heappush(heap, item) {
    heap.push(item);
    let idx = heap.length - 1;
    while (idx > 0) {
        const parent = Math.floor((idx - 1) / 2);
        if (!heapLess(heap[idx], heap[parent])) {
            break;
        }
        [heap[idx], heap[parent]] = [heap[parent], heap[idx]];
        idx = parent;
    }
}

function heappop(heap) {
    const result = heap[0];
    const item = heap.pop();
    if (heap.length > 0) {
        heap[0] = item;
        let idx = 0;
        while (true) {
            const left = idx * 2 + 1;
            const right = left + 1;
            let smallest = idx;
            if (left < heap.length && heapLess(heap[left], heap[smallest])) {
                smallest = left;
            }
            if (right < heap.length && heapLess(heap[right], heap[smallest])) {
                smallest = right;
            }
            if (smallest === idx) {
                break;
            }
            [heap[idx], heap[smallest]] = [heap[smallest], heap[idx]];
            idx = smallest;
        }
    }
    return result;
}

module.exports = { swimInWater };

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
    assert.deepStrictEqual(swimInWater([[0, 2], [1, 3]]), 3);
    assert.deepStrictEqual(swimInWater([[0, 1, 2, 3, 4], [24, 23, 22, 21, 5], [12, 13, 14, 15, 16], [11, 17, 18, 19, 20], [10, 9, 8, 7, 6]]), 16);
}
