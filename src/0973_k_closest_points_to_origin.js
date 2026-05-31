function kClosest(points, k) {
    const heap = [];
    for (const [x, y] of points) {
        heap.push([x * x + y * y, x, y]);
    }
    heapify(heap, tupleLess);
    const res = [];
    for (let i = 0; i < k; i++) {
        const [, x, y] = heappop(heap, tupleLess);
        res.push([x, y]);
    }
    return res;
}

function tupleLess(a, b) {
    return a[0] < b[0] || (a[0] === b[0] && (a[1] < b[1] || (a[1] === b[1] && a[2] < b[2])));
}

function heapify(heap, less) {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
        siftDown(heap, i, less);
    }
}

function heappop(heap, less) {
    const result = heap[0];
    const item = heap.pop();
    if (heap.length > 0) {
        heap[0] = item;
        siftDown(heap, 0, less);
    }
    return result;
}

function siftDown(heap, index, less) {
    while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < heap.length && less(heap[left], heap[smallest])) {
            smallest = left;
        }
        if (right < heap.length && less(heap[right], heap[smallest])) {
            smallest = right;
        }
        if (smallest === index) {
            break;
        }
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
    }
}

module.exports = { kClosest };

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
    assert.deepStrictEqual(kClosest([[1, 3], [(-2), 2]], 1), [[(-2), 2]]);
    assert.deepStrictEqual(kClosest([[3, 3], [5, (-1)], [(-2), 4]], 2), [[3, 3], [(-2), 4]]);
}
