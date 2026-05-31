/**
 * 838. Push Dominoes
 * -----------------------
 * link: https://leetcode.com/problems/push-dominoes/
 *
 * description: follow the rules of dominoes falling physics after one sec.
 *
 * time: O(n^2)
 * space: O(n)
 */

/**
 * @param {string} dominoes
 * @return {string}
 */
var pushDominoes = function (dominoes) {
    const dom = dominoes.split('');
    const q = [];
    let head = 0;
    for (let i = 0; i < dom.length; i++) {
        if (dom[i] !== '.') {
            q.push([i, dom[i]]);
        }
    }

    while (head < q.length) {
        const [i, d] = q[head++];

        if (d === 'L' && i > 0 && dom[i - 1] === '.') {
            q.push([i - 1, 'L']);
            dom[i - 1] = 'L';
        } else if (d === 'R') {
            if (i + 1 < dom.length && dom[i + 1] === '.') {
                if (i + 2 < dom.length && dom[i + 2] === 'L') {
                    head++;
                } else {
                    q.push([i + 1, 'R']);
                    dom[i + 1] = 'R';
                }
            }
        }
    }

    return dom.join('');
};

/**
 * @param {string[]} dominoes
 * @param {number} index
 * @returns {number[]}
 */
var nearestMove = function (dominoes, index) {
    let ans = [-1, -1];

    for (let i = index - 1; i > -1; i--) {
        if (ans[0] === -1 && (dominoes[i] === 'L' || dominoes[i] === 'R')) {
            ans[0] = i;
            break;
        }
    }

    for (let i = index + 1; i < dominoes.length; i++) {
        if (ans[1] === -1 && (dominoes[i] === 'L' || dominoes[i] === 'R')) {
            ans[1] = i;
            break;
        }
    }

    return ans;
};

module.exports = { pushDominoes };

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
    assert.deepStrictEqual(pushDominoes("RR.L"), "RR.L");
    assert.deepStrictEqual(pushDominoes(".L.R...LR..L.."), "LL.RR.LLRRLL..");
}
