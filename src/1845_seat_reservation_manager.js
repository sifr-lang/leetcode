class SeatManager {
    constructor(n) {
        this.seats = Array.from({ length: n }, (_, i) => i + 1);
    }
    reserve() {
        return heappop(this.seats);
    }
    unreserve(seatNumber) {
        heappush(this.seats, seatNumber);
    }
}

function heappush(heap, item) {
    heap.push(item);
    let index = heap.length - 1;
    while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (heap[parent] <= heap[index]) {
            break;
        }
        [heap[parent], heap[index]] = [heap[index], heap[parent]];
        index = parent;
    }
}

function heappop(heap) {
    const result = heap[0];
    const item = heap.pop();
    if (heap.length > 0) {
        heap[0] = item;
        siftDown(heap, 0);
    }
    return result;
}

function siftDown(heap, index) {
    while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < heap.length && heap[left] < heap[smallest]) {
            smallest = left;
        }
        if (right < heap.length && heap[right] < heap[smallest]) {
            smallest = right;
        }
        if (smallest === index) {
            break;
        }
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
    }
}

module.exports = { SeatManager };

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
    let obj = new SeatManager(5);
    assert.deepStrictEqual(obj.reserve(), 1);
    assert.deepStrictEqual(obj.reserve(), 2);
    obj.unreserve(2);
    assert.deepStrictEqual(obj.reserve(), 2);
    assert.deepStrictEqual(obj.reserve(), 3);
    assert.deepStrictEqual(obj.reserve(), 4);
    assert.deepStrictEqual(obj.reserve(), 5);
    obj.unreserve(5);
}
