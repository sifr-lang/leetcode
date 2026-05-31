class BrowserHistory {
    constructor(homepage) {
        this.history = [homepage];
        this.current = 0;
    }

    /**
     * @param {string} url
     * @return {void}
     */

    visit(url) {
        this.history[++this.current] = url;
        this.history.length = this.current + 1;
    }

    /**
     * @param {number} steps
     * @return {string}
     */
    back(steps) {
        this.current = Math.max(this.current - steps, 0);
        return this.history[this.current];
    }

    /**
     * @param {number} steps
     * @return {string}
     */
    forward(steps) {
        this.current = Math.min(this.current + steps, this.history.length - 1);
        return this.history[this.current];
    }
}

module.exports = { BrowserHistory };

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
    let obj = new BrowserHistory("leetcode.com");
    obj.visit("google.com");
    obj.visit("facebook.com");
    obj.visit("youtube.com");
    assert.deepStrictEqual(obj.back(1), "facebook.com");
    assert.deepStrictEqual(obj.back(1), "google.com");
    assert.deepStrictEqual(obj.forward(1), "facebook.com");
    obj.visit("linkedin.com");
    assert.deepStrictEqual(obj.forward(2), "linkedin.com");
    assert.deepStrictEqual(obj.back(2), "google.com");
    assert.deepStrictEqual(obj.back(7), "leetcode.com");
}
