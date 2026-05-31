// link to the problem https://leetcode.com/problems/brick-wall
// time coplexity O(n^2) or the number of bricks we have in our input.
// space complexity: whatever the length of the rows happend to be.

var leastBricks = function (wall) {
    const myHash = new Map();

    const width = wall[0].reduce((pre, brick) => {
        return brick + pre;
    }, 0);

    for (let i = 0; i < wall.length; i++) {
        let currentWidth = 0;
        for (let j = 0; j < wall[i].length; j++) {
            currentWidth += wall[i][j];
            myHash.has(currentWidth)
                ? myHash.set(currentWidth, myHash.get(currentWidth) + 1)
                : myHash.set(currentWidth, 1);
        }
    }

    // deleteing total width as this will be the rightmost gap which will always give us false positive.
    myHash.delete(width);

    maxGap = 0;
    for ([key, value] of myHash) {
        maxGap = Math.max(maxGap, value);
    }

    return wall.length - maxGap;
};

module.exports = { leastBricks };

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
    assert.deepStrictEqual(leastBricks([[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]]), 2);
    assert.deepStrictEqual(leastBricks([[1], [1], [1]]), 3);
}
