/**
 * https://leetcode.com/problems/design-twitter/
 * Your Twitter object will be instantiated and called as such:
 * var obj = new Twitter()
 * obj.postTweet(userId,tweetId)
 * var param_2 = obj.getNewsFeed(userId)
 * obj.follow(followerId,followeeId)
 * obj.unfollow(followerId,followeeId)
 */
class Twitter {
    constructor() {
        this.count = 0;
        this.tweetMap = new Map();
        this.followMap = new Map();
    }

    postTweet(userId, tweetId) {
        if (!this.tweetMap.has(userId)) {
            this.tweetMap.set(userId, []);
        }
        this.tweetMap.get(userId).push([this.count, tweetId]);
        this.count -= 1;
    }

    getNewsFeed(userId) {
        const res = [];
        const minHeap = [];
        if (!this.followMap.has(userId)) {
            this.followMap.set(userId, new Set());
        }
        this.followMap.get(userId).add(userId);

        for (const followeeId of this.followMap.get(userId)) {
            if (this.tweetMap.has(followeeId)) {
                const index = this.tweetMap.get(followeeId).length - 1;
                const [count, tweetId] = this.tweetMap.get(followeeId)[index];
                heappush(minHeap, [count, tweetId, followeeId, index - 1]);
            }
        }

        while (minHeap.length && res.length < 10) {
            const [count, tweetId, followeeId, index] = heappop(minHeap);
            res.push(tweetId);
            if (index >= 0) {
                const [nextCount, nextTweetId] = this.tweetMap.get(followeeId)[index];
                heappush(minHeap, [nextCount, nextTweetId, followeeId, index - 1]);
            }
        }
        return res;
    }

    follow(followerId, followeeId) {
        if (!this.followMap.has(followerId)) {
            this.followMap.set(followerId, new Set());
        }

        this.followMap.get(followerId).add(followeeId);
    }

    unfollow(followerId, followeeId) {
        if (this.followMap.has(followerId)) {
            this.followMap.get(followerId).delete(followeeId);
        }
    }
}

function heapLess(a, b) {
    return a[0] < b[0];
}

function heappush(heap, item) {
    heap.push(item);
    let index = heap.length - 1;
    while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (!heapLess(heap[index], heap[parent])) {
            break;
        }
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
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
        if (left < heap.length && heapLess(heap[left], heap[smallest])) {
            smallest = left;
        }
        if (right < heap.length && heapLess(heap[right], heap[smallest])) {
            smallest = right;
        }
        if (smallest === index) {
            break;
        }
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
    }
}

module.exports = { Twitter };

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
    let obj = new Twitter();
    obj.postTweet(1, 5);
    assert.deepStrictEqual(obj.getNewsFeed(1), [5]);
    obj.follow(1, 2);
    obj.postTweet(2, 6);
    assert.deepStrictEqual(obj.getNewsFeed(1), [6, 5]);
    obj.unfollow(1, 2);
    assert.deepStrictEqual(obj.getNewsFeed(1), [5]);
}
