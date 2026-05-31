/**
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/valid-parentheses/
 * @param {string} s
 * @return {boolean}
 */
var isValid = (s, stack = []) => {
    for (const bracket of s.split('')) {
        /* Time O(N) */
        const isParenthesis = bracket === '(';
        if (isParenthesis) stack.push(')'); /* Space O(N) */

        const isCurlyBrace = bracket === '{';
        if (isCurlyBrace) stack.push('}'); /* Space O(N) */

        const isSquareBracket = bracket === '[';
        if (isSquareBracket) stack.push(']'); /* Space O(N) */

        const isOpenPair = isParenthesis || isCurlyBrace || isSquareBracket;
        if (isOpenPair) continue;

        const isEmpty = !stack.length;
        const isWrongPair = stack.pop() !== bracket;
        const isInvalid = isEmpty || isWrongPair;
        if (isInvalid) return false;
    }

    return stack.length === 0;
};

/**
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/valid-parentheses/
 * @param {string} s
 * @return {boolean}
 */
var isValid = (s, stack = []) => {
    const map = {
        '}': '{',
        ']': '[',
        ')': '(',
    };

    for (const char of s) {
        /* Time O(N) */
        const isBracket = char in map;
        if (!isBracket) {
            stack.push(char);
            continue;
        } /* Space O(N) */

        const isEqual = stack[stack.length - 1] === map[char];
        if (isEqual) {
            stack.pop();
            continue;
        }

        return false;
    }

    return stack.length === 0;
};

module.exports = { isValid };

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
    assert.deepStrictEqual(isValid("()"), true);
    assert.deepStrictEqual(isValid("()[]{}"), true);
    assert.deepStrictEqual(isValid("(]"), false);
}
