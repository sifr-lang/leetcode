function choice(values) { return values[0]; }
function lastValue(values) { return values[values.length - 1]; }
class RandomizedSet {
    constructor() { this.index_map = new Map(); this.values = []; }
    insert(val) {
        if ((this.index_map.get(val) ?? -1) !== -1) return false;
        this.index_map.set(val, this.values.length);
        this.values.push(val);
        return true;
    }
    remove(val) {
        const idx = this.index_map.get(val) ?? -1;
        if (idx === -1) return false;
        const lastElement = lastValue(this.values);
        this.values[idx] = lastElement;
        this.index_map.set(lastElement, idx);
        this.values.pop();
        this.index_map.set(val, -1);
        return true;
    }
    getRandom() { return choice(this.values); }
}

module.exports = { RandomizedSet };

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
    let randomized_set = new RandomizedSet();
    assert.deepStrictEqual(randomized_set.insert(1), true);
    assert.deepStrictEqual(randomized_set.remove(2), false);
    assert.deepStrictEqual(randomized_set.insert(2), true);
    assert.deepStrictEqual(randomized_set.getRandom(), 1);
    assert.deepStrictEqual(randomized_set.remove(1), true);
    assert.deepStrictEqual(randomized_set.insert(2), false);
    assert.deepStrictEqual(randomized_set.getRandom(), 2);
}
