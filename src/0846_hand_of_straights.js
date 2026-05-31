/**
 * https://leetcode.com/problems/hand-of-straights/
 * Time O(N * K) | Space O(N)
 * @param {number[]} hand
 * @param {number} groupSize
 * @return {boolean}
 */
var isNStraightHand = function (hand, groupSize, count = new Map()) {
    const map = getFrequencyMap(hand); /* Time O(N) | Space O(N) */
    const sortUniqHand =
        getUniqueHand(hand); /* Time O(N * Log(N)) | Space O(N) */

    return search(groupSize, map, sortUniqHand); /* Time O(N * K) */
};

const getFrequencyMap = (hand, map = new Map()) => {
    for (const _hand of hand) {
        /* Time O(N) */
        const val = (map.get(_hand) || 0) + 1;

        map.set(_hand, val); /* Space O(N) */
    }

    return map;
};

const getUniqueHand = (hand) =>
    [...new Set(hand)] /* Time O(N) | Space O(N) */
        .sort(
            (a, b) => b - a,
        ); /* Time O(N * Log(N)) | Space HeapSort O(1) | Space QuickSort O(log(N)) */

const search = (groupSize, map, sortUniqHand) => {
    while (sortUniqHand.length) {
        /* Time O(N) */
        const smallest = sortUniqHand[sortUniqHand.length - 1];

        for (let i = smallest; i < smallest + groupSize; i++) {
            /* Time O(K) */
            if (!map.has(i)) return false;

            const val = map.get(i) - 1;

            map.set(i, val);

            let isEqual = map.get(i) === 0;
            if (!isEqual) continue;

            isEqual = i === sortUniqHand[sortUniqHand.length - 1];
            if (!isEqual) return false;

            sortUniqHand.pop();
        }
    }

    return true;
};

var isNStraightHand = function (hand, groupSize) {
    if (hand.length % groupSize) return false;

    const count = new Map();
    for (const n of hand) count.set(n, 1 + (count.get(n) || 0));

    const minH = Array.from(count.keys());
    heapify(minH);
    while (minH.length) {
        const first = minH[0];
        for (let i = first; i < first + groupSize; i++) {
            if (!count.has(i)) return false;
            count.set(i, count.get(i) - 1);
            if (count.get(i) === 0) {
                if (i !== minH[0]) return false;
                heappop(minH);
            }
        }
    }
    return true;
};

function heapify(heap) {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) siftDown(heap, i);
}

function heappop(heap) {
    const result = heap[0];
    const item = heap.pop();
    if (heap.length) {
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
        if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
        if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
        if (smallest === index) break;
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
    }
}

module.exports = { isNStraightHand };

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
    assert.deepStrictEqual(isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3), true);
    assert.deepStrictEqual(isNStraightHand([1, 2, 3, 4, 5], 4), false);
}
