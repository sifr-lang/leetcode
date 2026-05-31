/**
 * Array - Filter && Clone && Reverse
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/valid-palindrome/
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
    if (!s.length) return true;

    const alphaNumeric = filterAlphaNumeric(s); /* Time O(N) | Space O(N) */
    const reversed = reverse(alphaNumeric); /* Time O(N) | Space O(N) */

    return alphaNumeric === reversed;
};

const filterAlphaNumeric = (
    s,
    nonAlphaNumeric = new RegExp('[^a-z0-9]', 'gi'),
) =>
    s
        .toLowerCase() /* Time O(N) | Space O(N) */
        .replace(nonAlphaNumeric, ''); /* Time O(N) | Space O(N) */

const reverse = (s) =>
    s
        .split('') /* Time O(N) | Space O(N) */
        .reverse() /* Time O(N) | Space O(N) */
        .join(''); /* Time O(N) | Space O(N) */

/**
 * 2 Pointer | Midde Convergence
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/valid-palindrome/
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
    if (s.length <= 1) return true;

    let [left, right] = [0, s.length - 1];
    let leftChar, rightChar;
    while (left < right) {
        leftChar = s[left];
        rightChar = s[right];

        // skip char if non-alphanumeric
        if (!/[a-zA-Z0-9]/.test(leftChar)) {
            left++;
        } else if (!/[a-zA-Z0-9]/.test(rightChar)) {
            right--;
        } else {
            // compare letters
            if (leftChar.toLowerCase() != rightChar.toLowerCase()) {
                return false;
            }
            left++;
            right--;
        }
    }
    return true;
};

/**
 * 2 Pointer | Midde Convergence | No RegEx | No Copying
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/valid-palindrome/
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
    let normalized = '';
    for (const a of s) {
        if (/[a-z0-9]/i.test(a)) {
            normalized += a.toLowerCase();
        }
    }
    return normalized === normalized.split('').reverse().join('');
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
    assert.deepStrictEqual(isPalindrome("A man, a plan, a canal: Panama"), true);
    assert.deepStrictEqual(isPalindrome("race a car"), false);
}
