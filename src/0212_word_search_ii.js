/**
 * @param {character[][]} board
 * @param {string[]} words
 * Time O((ROWS * COLS) * (4 * (3 ^ (WORDS - 1)))) | Space O(N)
 * @return {string[]}
 */
var findWords = function (board, words) {
    const root = new TrieNode();
    for (const word of words) {
        root.addWord(word);
    }

    const rows = board.length;
    const cols = board[0].length;
    const res = new Set();
    const visit = new Set();

    const dfs = (r, c, node, word) => {
        const key = r * cols + c;
        if (
            r < 0 ||
            r >= rows ||
            c < 0 ||
            c >= cols ||
            !(board[r][c] in node.children) ||
            node.children[board[r][c]].refs < 1 ||
            visit.has(key)
        ) {
            return;
        }

        visit.add(key);
        node = node.children[board[r][c]];
        word += board[r][c];
        if (node.isWord) {
            node.isWord = false;
            res.add(word);
            root.removeWord(word);
        }

        dfs(r + 1, c, node, word);
        dfs(r - 1, c, node, word);
        dfs(r, c + 1, node, word);
        dfs(r, c - 1, node, word);
        visit.delete(key);
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            dfs(r, c, root, '');
        }
    }

    return Array.from(res);
};

class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
        this.refs = 0;
    }
    addWord(word) {
        let cur = this;
        cur.refs += 1;
        for (const char of word) {
            if (!(char in cur.children)) {
                cur.children[char] = new TrieNode();
            }
            cur = cur.children[char];
            cur.refs += 1;
        }
        cur.isWord = true;
    }
    removeWord(word) {
        let cur = this;
        cur.refs -= 1;
        for (const char of word) {
            if (char in cur.children) {
                cur = cur.children[char];
                cur.refs -= 1;
            }
        }
    }
}

module.exports = { findWords };

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
    assert.deepStrictEqual(sorted(findWords([["o", "a", "a", "n"], ["e", "t", "a", "e"], ["i", "h", "k", "r"], ["i", "f", "l", "v"]], ["oath", "pea", "eat", "rain"])), ["eat", "oath"]);
    assert.deepStrictEqual(sorted(findWords([["a", "b"], ["c", "d"]], ["abcb"])), []);
}
