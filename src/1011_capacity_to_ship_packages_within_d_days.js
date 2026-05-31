function shipWithinDays(weights, days) {
    let l = Math.max(...weights);
    let r = weights.reduce((sum, value) => sum + value, 0);
    let minCap = r;
    const canShip = (cap) => {
        let ships = 1;
        let curCap = cap;
        for (const w of weights) {
            if (curCap - w < 0) {
                ships++;
                curCap = cap;
            }
            curCap -= w;
        }
        return ships <= days;
    };
    while (l <= r) {
        const cap = Math.floor((l + r) / 2);
        if (canShip(cap)) {
            minCap = Math.min(minCap, cap);
            r = cap - 1;
        } else {
            l = cap + 1;
        }
    }
    return minCap;
}

module.exports = { shipWithinDays };

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
    assert.deepStrictEqual(shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
}
