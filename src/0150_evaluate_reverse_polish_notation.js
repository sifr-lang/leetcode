/**
 * https://leetcode.com/problems/evaluate-reverse-polish-notation
 * Time O(N^2) | Space(1)
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function (tokens, index = 0) {
    while (1 < tokens.length) {
        /* Time O(N) */
        const isOperation = () => tokens[index] in OPERATORS;
        while (!isOperation()) index++; /* Time O(N) */

        const value = performOperation(tokens, index);

        tokens[index] = value;
        tokens.splice(index - 2, 2); /* Time O(N) */
        index--;
    }

    return tokens[0];
};

var OPERATORS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
};

var performOperation = (tokens, index) => {
    const [rightNum, leftNum] = [
        Number(tokens[index - 1]),
        Number(tokens[index - 2]),
    ];
    const operation = OPERATORS[tokens[index]];

    return operation(leftNum, rightNum);
};

/**
 * https://leetcode.com/problems/evaluate-reverse-polish-notation
 * Time O(N) | Space(N)
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function (tokens, stack = []) {
    for (const char of tokens) {
        /* Time O(N) */
        const isOperation = char in OPERATORS;
        if (isOperation) {
            const value = performOperation(char, stack);

            stack.push(value); /* Space O(N) */

            continue;
        }

        stack.push(Number(char)); /* Space O(N) */
    }

    return stack.pop();
};

var OPERATORS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
};

var performOperation = (char, stack) => {
    const [rightNum, leftNum] = [stack.pop(), stack.pop()];
    const operation = OPERATORS[char];

    return operation(leftNum, rightNum);
};

module.exports = { evalRPN };

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
    assert.deepStrictEqual(evalRPN(["2", "1", "+", "3", "*"]), 9);
}
