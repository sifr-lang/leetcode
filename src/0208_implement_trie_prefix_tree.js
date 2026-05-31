/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */

class TrieNode {
    constructor() {
        this.children = new Array(26).fill(null);
        this.end = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    /* Time O(N) | Space O(N) */
    insert(word, node = this.root) {
        for (const char of word) {
            const i = char.charCodeAt(0) - 'a'.charCodeAt(0);
            if (node.children[i] === null) {
                node.children[i] = new TrieNode();
            }
            node = node.children[i];
        }

        node.end = true;
    }

    /* Time O(N) | Space O(1) */
    search(word, node = this.root) {
        for (const char of word) {
            const i = char.charCodeAt(0) - 'a'.charCodeAt(0);
            if (node.children[i] === null) return false;
            node = node.children[i];
        }

        return node.end;
    }

    /* Time O(N) | Space O(1) */
    startsWith(prefix, node = this.root) {
        for (const char of prefix) {
            const i = char.charCodeAt(0) - 'a'.charCodeAt(0);
            if (node.children[i] === null) return false;
            node = node.children[i];
        }

        return true;
    }
}

module.exports = { Trie };

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
    let obj = new Trie();
    obj.insert("apple");
    assert.deepStrictEqual(obj.search("apple"), true);
    assert.deepStrictEqual(obj.search("app"), false);
    assert.deepStrictEqual(obj.startsWith("app"), true);
    obj.insert("app");
    assert.deepStrictEqual(obj.search("app"), true);
}
