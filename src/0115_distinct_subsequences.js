/**
 * DP - Top Down
 * Matrix - Memoization
 * Time O(N * M) | Space (N * M)
 * https://leetcode.com/problems/distinct-subsequences/
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = (s, t, i = 0, j = 0, memo = initMemo(s, t)) => {
    const isBaseCase1 = s.length < t.length;
    if (isBaseCase1) return 0;

    const isBaseCase2 = j === t.length;
    if (isBaseCase2) return 1;

    const isBaseCase3 = i === s.length;
    if (isBaseCase3) return 0;

    const hasSeen = memo[i][j] !== null;
    if (hasSeen) return memo[i][j];

    return dfs(
        s,
        t,
        i,
        j,
        memo,
    ); /* Time O(N * M) | Space O((N * M) + HEIGHT) */
};

var initMemo = (s, t) =>
    new Array(s.length).fill().map(() => new Array(t.length).fill(null));

var dfs = (s, t, i, j, memo) => {
    const left = numDistinct(
        s,
        t,
        i + 1,
        j,
        memo,
    ); /* Time O(N * M) | Space O(HEIGHT) */

    const isEqual = s[i] === t[j];

    const right = isEqual
        ? numDistinct(
              s,
              t,
              i + 1,
              j + 1,
              memo,
          ) /* Time O(N * M) | Space O(HEIGHT) */
        : 0;

    memo[i][j] = left + right; /*               | Space O(N * M) */
    return memo[i][j];
};

/**
 * DP - Bottom Up
 * Matrix - Tabulation
 * Time O(N * M) | Space (N * M)
 * https://leetcode.com/problems/distinct-subsequences/
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = (s, t) => {
    const tabu = initTabu(s, t); /* Time O(N * M) | Space O(N * M) */

    search(s, t, tabu); /* Time O(N * M) | Space O(N * M) */

    return tabu[0][0];
};

var initTabu = (s, t) => {
    const tabu = new Array(s.length + 1)
        .fill() /* Time O(N) | Space O(N) */
        .map(() => new Array(t.length + 1)); /* Time O(M) | Space O(M) */

    tabu[s.length].fill(0); /*           | Space O(N * M) */

    for (let r = 0; r <= s.length; ++r) {
        /* Time O(N) */
        tabu[r][t.length] = 1; /*       | Space O(N * M) */
    }

    return tabu;
};

var search = (s, t, tabu) => {
    for (let r = s.length - 1; 0 <= r; r--) {
        /* Time O(N) */
        for (let c = t.length - 1; 0 <= c; c--) {
            /* Time O(M) */
            const left = tabu[r + 1][c];

            const isEqual = s[r] === t[c];

            const right = isEqual ? tabu[r + 1][c + 1] : 0;

            tabu[r][c] = left + right; /* Space O(N * M) */
        }
    }
};

/**
 * DP - Bottom Up
 * Matrix - Tabulation
 * Time O(N * M) | Space O(M)
 * https://leetcode.com/problems/distinct-subsequences/
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = (s, t) => {
    const tabu = initTabu(t); /* Time O(M) | Space O(M) */

    search(s, t, tabu); /* Time O(N * M) | Space O(M) */

    return tabu[0];
};

var initTabu = (t) => new Array(t.length).fill(0); /* Time O(M) | Space O(M) */

var search = (s, t, tabu) => {
    for (let row = s.length - 1; 0 <= row; row--) {
        /* Time O(N) */
        let prev = 1;

        for (let col = t.length - 1; 0 <= col; col--) {
            /* Time O(M) */
            const curr = tabu[col];

            const isEqual = s[row] === t[col];
            if (isEqual) tabu[col] += prev; /* Space O(M) */

            prev = curr;
        }
    }
};

var numDistinct = (s, t) => {
    const cache = new Map();

    for (let i = 0; i < s.length + 1; i++) {
        cache.set(`${i},${t.length}`, 1);
    }
    for (let j = 0; j < t.length; j++) {
        cache.set(`${s.length},${j}`, 0);
    }

    for (let i = s.length - 1; i >= 0; i--) {
        for (let j = t.length - 1; j >= 0; j--) {
            if (s[i] === t[j]) {
                cache.set(`${i},${j}`, cache.get(`${i + 1},${j + 1}`) + cache.get(`${i + 1},${j}`));
            } else {
                cache.set(`${i},${j}`, cache.get(`${i + 1},${j}`));
            }
        }
    }
    return cache.get('0,0');
};

module.exports = { numDistinct };

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
    assert.deepStrictEqual(numDistinct("rabbbit", "rabbit"), 3);
    assert.deepStrictEqual(numDistinct("babgbag", "bag"), 5);
}
