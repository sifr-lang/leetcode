/**
 * @param {string[]} deadends
 * @param {string} target
 * @return {number}
 */
var openLock = function (deadends, target) {
    if (deadends.includes('0000')) {
        return -1;
    }

    const q = [['0000', 0]];
    let head = 0;
    const visit = new Set(deadends);

    while (head < q.length) {
        const [wheel, turns] = q[head++];
        if (wheel === target) {
            return turns;
        }
        for (const child of children(wheel)) {
            if (!visit.has(child)) {
                visit.add(child);
                q.push([child, turns + 1]);
            }
        }
    }
    return -1;
};

function children(wheel) {
    const res = [];
    for (let i = 0; i < 4; i++) {
        let digit = String((Number(wheel[i]) + 1) % 10);
        res.push(wheel.slice(0, i) + digit + wheel.slice(i + 1));
        digit = String((Number(wheel[i]) + 10 - 1) % 10);
        res.push(wheel.slice(0, i) + digit + wheel.slice(i + 1));
    }
    return res;
}

module.exports = { openLock };

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
    assert.deepStrictEqual(openLock(["0201", "0101", "0102", "1212", "2002"], "0202"), 6);
    assert.deepStrictEqual(openLock(["8888"], "0009"), 1);
    assert.deepStrictEqual(openLock(["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888"), (-1));
}
