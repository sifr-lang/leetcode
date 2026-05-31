function walls_and_gates(rooms) {
    const rows = rooms.length;
    const cols = rooms[0].length;
    const visit = new Set();
    const q = [];
    let head = 0;
    const addRooms = (r, c) => {
        const key = `${r},${c}`;
        if (Math.min(r, c) < 0 || r === rows || c === cols || visit.has(key) || rooms[r][c] === -1) return;
        visit.add(key);
        q.push([r, c]);
    };
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (rooms[r][c] === 0) {
                q.push([r, c]);
                visit.add(`${r},${c}`);
            }
        }
    }
    let dist = 0;
    while (head < q.length) {
        const levelEnd = q.length;
        for (; head < levelEnd; head++) {
            const [r, c] = q[head];
            rooms[r][c] = dist;
            addRooms(r + 1, c);
            addRooms(r - 1, c);
            addRooms(r, c + 1);
            addRooms(r, c - 1);
        }
        dist++;
    }
}

module.exports = { walls_and_gates };

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
    let arg0 = [[2147483647, (-1), 0, 2147483647], [2147483647, 2147483647, 2147483647, (-1)], [2147483647, (-1), 2147483647, (-1)], [0, (-1), 2147483647, 2147483647]];
    let _result = walls_and_gates(arg0);
    assert.deepStrictEqual(arg0, [[3, (-1), 0, 1], [2, 2, 1, (-1)], [1, (-1), 2, (-1)], [0, (-1), 3, 4]]);
    arg0 = [[(-1)]];
    _result = walls_and_gates(arg0);
    assert.deepStrictEqual(arg0, [[(-1)]]);
}
