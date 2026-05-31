/**
 * Reverse - Space O(1)
 * Time O(N) | Space O(N)
 * https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/
 * @param {number[]} arr
 * @return {number[]}
 */
var replaceElements = (arr, max = -1, ans = [ -1 ]) => {
    arr = arr.reverse();                          /* Time O(N) */

    for (let i = 0; (i < (arr.length - 1)); i++) {/* Time O(N) */
        max = Math.max(max, arr[i]);
        ans[(i + 1)] = max;                           /* Space O(N) */
    }

    return ans.reverse();                         /* Time O(N) */
};

/**
 * Backward - In-Place
 * Time O(N) | Space O(1)
 * https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/
 * @param {number[]} arr
 * @return {number[]}
 */
var replaceElements = (arr, max = -1) => {
     for (let i = (arr.length - 1); (0 <= i); i--) {/* Time O(N) */
         const num = arr[i];

         arr[i] = max;
         max = Math.max(max, num);
     }

     return arr;
};
//  This is brute force with O(n^2). Just for reference's sake.
// submission link: https://leetcode.com/problems/replace-elements-with-greatest-element-on-right-side/submissions/844439163/
var replaceElementsBrute = function(arr) {

    for(let i = 0; i < arr.length; i++) {
        arr[i] = biggestElement(i, arr);
    }

    arr[arr.length - 1] = -1;
    return arr;
};

function biggestElement(index, arr) {

    let biggest = 0;
    for(let i = index + 1; i < arr.length; i++) {
        biggest = Math.max(biggest, arr[i]);
    }

    return biggest;
}

module.exports = { replaceElements };

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
    assert.deepStrictEqual(replaceElements([17, 18, 5, 4, 6, 1]), [18, 6, 6, 6, 1, (-1)]);
}
