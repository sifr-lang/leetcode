function findNumberOfLIS(nums) {
    const dp = new Map();
    let lenLIS = 0;
    let res = 0;
    const dfs = (i) => {
        if (dp.has(i)) return dp.get(i);
        let maxLen = 1;
        let maxCnt = 1;
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[j] > nums[i]) {
                const [length, count] = dfs(j);
                if (length + 1 > maxLen) {
                    maxLen = length + 1;
                    maxCnt = count;
                } else if (length + 1 === maxLen) {
                    maxCnt += count;
                }
            }
        }
        if (maxLen > lenLIS) {
            lenLIS = maxLen;
            res = maxCnt;
        } else if (maxLen === lenLIS) {
            res += maxCnt;
        }
        const value = [maxLen, maxCnt];
        dp.set(i, value);
        return value;
    };
    for (let i = 0; i < nums.length; i++) dfs(i);
    return res;
}

module.exports = { findNumberOfLIS };

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
    assert.deepStrictEqual(findNumberOfLIS([1, 3, 5, 4, 7]), 2);
    assert.deepStrictEqual(findNumberOfLIS([2, 2, 2, 2, 2]), 5);
}
