/**
 * Sorting
 * Time O(n*log(n)) | Space O(1)
 * https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/
 * @param {string[]} nums
 * @param {number} k
 * @return {string}
 */
var kthLargestNumber = function (nums, k) {
    const maxHeap = nums.map((n) => -BigInt(n));
    heapify(maxHeap);
    while (k > 1) {
        heappop(maxHeap);
        k -= 1;
    }
    return String(-maxHeap[0]);
};

function heapify(heap) {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
        siftDown(heap, i);
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

module.exports = { kthLargestNumber };

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
    assert.deepStrictEqual(kthLargestNumber(["3", "6", "7", "10"], 4), "3");
    assert.deepStrictEqual(kthLargestNumber(["2", "21", "12", "1"], 3), "2");
    assert.deepStrictEqual(kthLargestNumber(["0", "0"], 2), "0");
}
