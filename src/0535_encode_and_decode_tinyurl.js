class Codec {
    constructor() {
        this.encodeMap = new Map();
        this.decodeMap = new Map();
        this.base = 'http://tinyurl.com/';
    }
    encode(longUrl) {
        if (!this.encodeMap.has(longUrl)) {
            const shortUrl = this.base + String(this.encodeMap.size + 1);
            this.encodeMap.set(longUrl, shortUrl);
            this.decodeMap.set(shortUrl, longUrl);
        }
        return this.encodeMap.get(longUrl);
    }
    decode(shortUrl) {
        return this.decodeMap.get(shortUrl);
    }
}

module.exports = { Codec };

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
    let codec = new Codec();
    let url = "https://leetcode.com/problems/design-tinyurl";
    let short_url = codec.encode(url);
    assert.deepStrictEqual(short_url, "http://tinyurl.com/1");
    assert.deepStrictEqual(codec.decode(short_url), url);
    assert.deepStrictEqual(codec.encode(url), short_url);
}
