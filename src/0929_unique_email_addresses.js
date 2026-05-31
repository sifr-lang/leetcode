/**
 * Built-in Functions Solution
 * Hash Set - Unique Emails
 * Time O(N * K) | Space O(N)
 * https://leetcode.com/problems/unique-email-addresses
 * @param {string[]} emails
 * @return {number}
 */
var numUniqueEmails = function (emails) {
    const valid = emails.map((email) => {
        const [local, domain] = email.split('@');
        return local.split('+').shift().split('.').join('') + '@' + domain;
    });

    return new Set(valid).size;
};

/**
 * Manual Solution
 * Hash Set - Unique Emails
 * Time O(N * K) | Space O(N)
 * https://leetcode.com/problems/unique-email-addresses
 * @param {string[]} emails
 * @return {number}
 */
var numUniqueEmails = function (emails) {
    const uniqEmails = new Set();

    for (let email of emails) {
        let cleanEmail = '';
        for (let i = 0; i < email.length; i++) {
            if (email[i] === '@') {
                cleanEmail += email.slice(i);
                break;
            } else if (email[i] === '+') {
                while (email[i] !== '@') i++;
                cleanEmail += email.slice(i);
                break;
            } else if (email[i] !== '.') {
                cleanEmail += email[i];
            }
        }

        uniqEmails.add(cleanEmail);
    }

    return uniqEmails.size;
};

module.exports = { numUniqueEmails };

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
    assert.deepStrictEqual(numUniqueEmails(["test.email+alex@leetcode.com", "test.e.mail+bob.cathy@leetcode.com", "testemail+david@lee.tcode.com"]), 2);
    assert.deepStrictEqual(numUniqueEmails(["a@leetcode.com", "b@leetcode.com", "c@leetcode.com"]), 3);
}
