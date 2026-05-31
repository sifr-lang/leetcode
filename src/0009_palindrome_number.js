/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
    // Creates array from int characters
    // 121 -> [1,2,1]
    let arr = Array.from(String(x), Number);

    // Uses two pointer
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== arr[arr.length - 1 - i]) {
            return false;
        }
    }

    return true;
};

// Runtime: 302 ms, faster than 40.50% of JavaScript online submissions for Palindrome Number.
// Memory Usage: 51.8 MB, less than 8.36% of JavaScript online submissions for Palindrome Number.

/**
 * Reverse Integer Using Modulo
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/palindrome-number/
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
    if (x < 0) return false;

    const inputX = x;
    let revX = 0;

    while (x > 0) {
        revX += x % 10;
        x = Math.floor(x / 10);

        if (x > 0) revX *= 10;
    }

    return revX === inputX;
};

module.exports = { isPalindrome };

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
    assert.deepStrictEqual(isPalindrome(121), true);
    assert.deepStrictEqual(isPalindrome((-121)), false);
    assert.deepStrictEqual(isPalindrome(10), false);
    assert.deepStrictEqual(isPalindrome(0), true);
    assert.deepStrictEqual(isPalindrome(12321), true);
}
