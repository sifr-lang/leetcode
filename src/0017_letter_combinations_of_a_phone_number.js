/**
 * https://leetcode.com/problems/letter-combinations-of-a-phone-number/
 * Time O(N * 4^N) | Space O(N)
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (
    digits,
    combination = [],
    combinations = [],
) {
    const isBaseCase = !digits;
    if (isBaseCase) {
        if (combination.length) combinations.push(combination.join(''));

        return combinations;
    }

    const letters = phoneButtons[digits[0]];

    for (const char of letters) {
        backTrack(digits, char, combination, combinations);
    }

    return combinations;
};

const backTrack = (digits, char, combination, combinations) => {
    combination.push(char);
    letterCombinations(digits.slice(1), combination, combinations);
    combination.pop();
};

const phoneButtons = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['q', 'p', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z'],
};

module.exports = { letterCombinations };

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
    assert.deepStrictEqual(letterCombinations("23"), ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]);
}
