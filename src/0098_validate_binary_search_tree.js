/**
 * https://leetcode.com/problems/validate-binary-search-tree/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root, min = -Infinity, max = Infinity) {
    const isBaseCase = root === null;
    if (isBaseCase) return true;

    const isInvalid = root.val <= min || max <= root.val;
    if (isInvalid) return false;

    return dfs(root, min, max);
};

const dfs = (root, min, max) => {
    const left = isValidBST(root.left, min, root.val);
    const right = isValidBST(root.right, root.val, max);

    return left && right;
};
// TODO
/**
 * https://leetcode.com/problems/validate-binary-search-tree/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root, prev = [null]) {
    const isBaseCase = root === null;
    if (isBaseCase) return true;

    if (!isValidBST(root.left, prev)) return false;

    const isInvalid = prev[0] !== null && root.val <= prev[0];
    if (isInvalid) return false;

    prev[0] = root.val;

    return isValidBST(root.right, prev);
};

/**
 * https://leetcode.com/problems/validate-binary-search-tree/
 * Time O(N) | Space O(H)
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root, stack = []) {
    let prev = null;

    while (stack.length || root) {
        moveLeft(stack, root);
        root = stack.pop();

        const isInvalid = prev && root.val <= prev.val;
        if (isInvalid) return false;

        prev = root;
        root = root.right;
    }

    return true;
};

const moveLeft = (stack, root) => {
    while (root) {
        stack.push(root);
        root = root.left;
    }
};

var isValidBST = function (root) {
    const valid = (node, left, right) => {
        if (!node) {
            return true;
        }
        if (!(left < node.val && node.val < right)) {
            return false;
        }
        return valid(node.left, left, node.val) && valid(node.right, node.val, right);
    };
    return valid(root, -Infinity, Infinity);
};

module.exports = { isValidBST };

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
    assert.deepStrictEqual(isValidBST(new TreeNode(2, new TreeNode(1, null, null), new TreeNode(3, null, null))), true);
    assert.deepStrictEqual(isValidBST(new TreeNode(5, new TreeNode(1, null, null), new TreeNode(4, new TreeNode(3, null, null), new TreeNode(6, null, null)))), false);
}
