const PICK = 6;
function guess(num) {
    if (num === PICK) return 0;
    if (num < PICK) return 1;
    return -1;
}
function guessNumber(n) {
    let low = 1;
    let high = n;
    while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const myGuess = guess(mid);
        if (myGuess === 1) low = mid + 1;
        else if (myGuess === -1) high = mid - 1;
        else return mid;
    }
    return -1;
}

module.exports = { guessNumber };

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
    assert.deepStrictEqual(guessNumber(10), 6);
    assert.deepStrictEqual(guessNumber(6), 6);
}
