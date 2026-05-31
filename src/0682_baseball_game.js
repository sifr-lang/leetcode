/**
 * @param {string[]} operations
 * @return {number}
 */
var calPoints = function(operations) {
    let runningSum = 0;
    const stack = [];
    for(const o of operations) {
        if(o === 'C') {
            runningSum -= stack.pop();
            continue;
        }
        if(o === 'D') {
            const val = stack[stack.length - 1] * 2;
            stack.push(val);
            runningSum += val;
            continue;
        }
        if(o === '+') {
            const val = stack[stack.length - 1] + stack[stack.length - 2];
            stack.push(val);
            runningSum += val;
            continue;
        }
        stack.push(+o);
        runningSum += +o;
    }
    return runningSum;
};

module.exports = { calPoints };

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
    assert.deepStrictEqual(calPoints(["5", "2", "C", "D", "+"]), 30);
}
