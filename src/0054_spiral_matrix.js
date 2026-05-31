function spiralOrder(matrix) {
    const res = [];
    let left = 0;
    let right = matrix[0].length;
    let top = 0;
    let bottom = matrix.length;
    while (left < right && top < bottom) {
        for (let i = left; i < right; i++) res.push(matrix[top][i]);
        top++;
        for (let i = top; i < bottom; i++) res.push(matrix[i][right - 1]);
        right--;
        if (!(left < right && top < bottom)) break;
        for (let i = right - 1; i >= left; i--) res.push(matrix[bottom - 1][i]);
        bottom--;
        for (let i = bottom - 1; i >= top; i--) res.push(matrix[i][left]);
        left++;
    }
    return res;
}

module.exports = { spiralOrder };

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
    assert.deepStrictEqual(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
}
