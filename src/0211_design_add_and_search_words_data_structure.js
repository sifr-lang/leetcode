/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */

class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
    }
}

class WordDictionary {
    constructor() {
        this.root = new TrieNode();
    }

    /* Time O(N) | Space O(N) */
    addWord(word, node = this.root) {
        for (const char of word) {
            const child = node.children[char] || new TrieNode();

            node.children[char] = child;

            node = child;
        }

        node.isWord = true;
    }

    /* Time O(N) | Space O(N) */
    search(word) {
        return this.dfs(word, this.root, 0);
    }

    dfs(word, node, level) {
        if (!node) return false;

        const isWord = level === word.length;
        if (isWord) return node.isWord;

        const isWildCard = word[level] === '.';
        if (isWildCard) return this.hasWildCard(word, node, level);

        return this.dfs(word, node.children[word[level]], level + 1);
    }

    hasWildCard(word, node, level) {
        for (const char of Object.keys(node.children)) {
            const child = node.children[char];

            const hasWord = this.dfs(word, child, level + 1);
            if (hasWord) return true;
        }

        return false;
    }
}

module.exports = { WordDictionary };

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
    let obj = new WordDictionary();
    obj.addWord("bad");
    obj.addWord("dad");
    obj.addWord("mad");
    assert.deepStrictEqual(obj.search("pad"), false);
    assert.deepStrictEqual(obj.search("bad"), true);
    assert.deepStrictEqual(obj.search(".ad"), true);
    assert.deepStrictEqual(obj.search("b.."), true);
}
