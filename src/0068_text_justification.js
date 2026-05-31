function fullJustify(words, maxWidth) {
    const res = [];
    let line = [];
    let length = 0;
    let i = 0;
    while (i < words.length) {
        if (length + line.length + words[i].length > maxWidth) {
            let extraSpace = maxWidth - length;
            const wordCnt = line.length - 1;
            const spaces = Math.floor(extraSpace / Math.max(1, wordCnt));
            let remainder = extraSpace % Math.max(1, wordCnt);
            for (let j = 0; j < Math.max(1, line.length - 1); j++) {
                line[j] += ' '.repeat(spaces);
                if (remainder) {
                    line[j] += ' ';
                    remainder--;
                }
            }
            res.push(line.join(''));
            line = [];
            length = 0;
        }
        line.push(words[i]);
        length += words[i].length;
        i++;
    }
    const lastLine = line.join(' ');
    res.push(lastLine + ' '.repeat(maxWidth - lastLine.length));
    return res;
}

module.exports = { fullJustify };

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
    assert.deepStrictEqual(fullJustify(["This", "is", "an", "example", "of", "text", "justification."], 16), ["This    is    an", "example  of text", "justification.  "]);
    assert.deepStrictEqual(fullJustify(["What", "must", "be", "acknowledgment", "shall", "be"], 16), ["What   must   be", "acknowledgment  ", "shall be        "]);
    assert.deepStrictEqual(fullJustify(["Science", "is", "what", "we", "understand", "well", "enough", "to", "explain", "to", "a", "computer.", "Art", "is", "everything", "else", "we", "do"], 20), ["Science  is  what we", "understand      well", "enough to explain to", "a  computer.  Art is", "everything  else  we", "do                  "]);
}
