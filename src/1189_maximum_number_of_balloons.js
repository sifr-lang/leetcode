// problem link https://leetcode.com/problems/maximum-number-of-balloons
// time complexity O(n)
// space complexity O(n)

var maxNumberOfBalloons = function (text) {
    const balloonCach = {};
    const ballonSet = new Set(text.split(''));

    for (const char of text) {
        if (!ballonSet.has(char)) continue;

        const count = (balloonCach[char] ?? 0) + 1;
        balloonCach[char] = count;
    }

    let min = Math.min(
        balloonCach['b'],
        balloonCach['a'],
        balloonCach['n'],
        Math.floor(balloonCach['l'] / 2),
        Math.floor(balloonCach['o'] / 2),
    );

    return min ? min : 0;
};

module.exports = { maxNumberOfBalloons };

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
    assert.deepStrictEqual(maxNumberOfBalloons("nlaebolko"), 1);
    assert.deepStrictEqual(maxNumberOfBalloons("loonbalxballpoon"), 2);
    assert.deepStrictEqual(maxNumberOfBalloons("leetcode"), 0);
}
