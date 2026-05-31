/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
const asteroidCollision = (asteroids) => {
    let stack = [];

    for (asteroid of asteroids) {
        while (stack.length != 0 && asteroid < 0 && stack.at(-1) > 0) {
            let diff = asteroid + stack.at(-1);

            if (diff < 0) {
                stack.pop();
            } else if (diff > 0) {
                asteroid = 0;
            } else {
                asteroid = 0;
                stack.pop();
            }
        }

        if (asteroid) {
            stack.push(asteroid);
        }
    }

    return stack;
};

module.exports = { asteroidCollision };

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
    assert.deepStrictEqual(asteroidCollision([5, 10, (-5)]), [5, 10]);
    assert.deepStrictEqual(asteroidCollision([8, (-8)]), []);
    assert.deepStrictEqual(asteroidCollision([10, 2, (-5)]), [10]);
}
