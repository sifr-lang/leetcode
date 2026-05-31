function bestClosingTime(customers) {
    let curPenalty = 0;
    let res = 0;
    let minPenalty = 0;
    for (let i = 0; i < customers.length; i++) {
        if (customers[i] === 'Y') {
            curPenalty -= 1;
            if (curPenalty < minPenalty) {
                res = i + 1;
                curPenalty = minPenalty;
            }
        } else {
            curPenalty += 1;
        }
    }
    return res;
}

module.exports = { bestClosingTime };

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
    assert.deepStrictEqual(bestClosingTime("YYNY"), 2);
    assert.deepStrictEqual(bestClosingTime("NNNNN"), 0);
}
