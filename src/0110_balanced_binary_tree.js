/**
 * https://leetcode.com/problems/balanced-binary-tree/
 * TIme O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
    const isBaseCase = root === null;
    if (isBaseCase) return true;
    if (!isAcceptableHeight(root)) return false;
    if (!isChildBalanced(root)) return false;

    return true;
};

const isChildBalanced = (root) => {
    const left = isBalanced(root.left);
    const right = isBalanced(root.right);

    return left && right;
};

const isAcceptableHeight = (root) => {
    const left = getHeight(root.left);
    const right = getHeight(root.right);

    const difference = Math.abs(left - right);

    return difference <= 1;
};

const getHeight = (root) => {
    const isBaseCase = root === null;
    if (isBaseCase) return 0;

    return dfs(root);
};

var dfs = (root) => {
    const left = getHeight(root.left);
    const right = getHeight(root.right);

    const height = Math.max(left, right);

    return height + 1;
};

/**
 * https://leetcode.com/problems/balanced-binary-tree/
 * TIme O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function (root) {
    const [_height, _isBalanced] = isRootBalanced(root);

    return _isBalanced;
};

var isRootBalanced = (root) => {
    const isBaseCase = root === null;
    if (isBaseCase) return [-1, true];

    return dfs(root);
};

var dfs = (root) => {
    const [left, isLeftBalanced] = isRootBalanced(root.left);
    const [right, isRightBalanced] = isRootBalanced(root.right);
    const [height, difference] = [
        Math.max(left, right),
        Math.abs(left - right),
    ];

    const isAcceptableHeight = difference <= 1;
    const _isBalanced = isLeftBalanced && isRightBalanced;

    const _isRootBalanced = _isBalanced && isAcceptableHeight;

    return [height + 1, _isRootBalanced];
};

module.exports = { isBalanced };

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
    assert.deepStrictEqual(isBalanced(new TreeNode(3, new TreeNode(9, null, null), new TreeNode(20, new TreeNode(15, null, null), new TreeNode(7, null, null)))), true);
    assert.deepStrictEqual(isBalanced(new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4, null, null), new TreeNode(4, null, null)), new TreeNode(3, null, null)), new TreeNode(2, null, null))), false);
    assert.deepStrictEqual(isBalanced(null), true);
}
