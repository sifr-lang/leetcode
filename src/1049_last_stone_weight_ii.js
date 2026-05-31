function lastStoneWeightII(stones) {
    const stoneSum = stones.reduce((total, value) => total + value, 0);
    const target = Math.ceil(stoneSum / 2);
    const dp = new Map();
    const dfs = (i, total) => {
        if (total >= target || i === stones.length) return Math.abs(total - (stoneSum - total));
        const key = `${i},${total}`;
        if (dp.has(key)) return dp.get(key);
        const value = Math.min(dfs(i + 1, total), dfs(i + 1, total + stones[i]));
        dp.set(key, value);
        return value;
    };
    return dfs(0, 0);
}

module.exports = { lastStoneWeightII };

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
    assert.deepStrictEqual(lastStoneWeightII([2, 7, 4, 1, 8, 1]), 1);
}
