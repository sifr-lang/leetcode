var removeStars = function (s) {
    if (!s.length) return '';

    const result = [];

    for (let char of s) {
        if (char == '*') result.pop();
        else result.push(char);
    }
    return result.join('');
};
// Time Complexity: O(n)
// Space Complexity: O(n)

module.exports = { removeStars };

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
    assert.deepStrictEqual(removeStars("leet**cod*e"), "lecoe");
}
