function decodeString(s) {
    const stack = [];
    for (const char of s) {
        if (char !== ']') {
            stack.push(char);
        } else {
            let subStr = '';
            while (stack[stack.length - 1] !== '[') subStr = stack.pop() + subStr;
            stack.pop();
            let multiplier = '';
            while (stack.length && /\d/.test(stack[stack.length - 1])) multiplier = stack.pop() + multiplier;
            stack.push(subStr.repeat(Number(multiplier)));
        }
    }
    return stack.join('');
}

module.exports = { decodeString };

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
    assert.deepStrictEqual(decodeString("3[a]2[bc]"), "aaabcbc");
    assert.deepStrictEqual(decodeString("3[a2[c]]"), "accaccacc");
}
