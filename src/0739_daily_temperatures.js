/**
 * https://leetcode.com/problems/daily-temperatures
 * Time O(N) | Space O(N) - result array will always count as extra space
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temp) {
    let res = new Array(temp.length).fill(0);
    let stack = [];

    for (let i = 0; i < temp.length; i++) {
        while (stack.length && temp[i] > temp[stack[stack.length - 1]]) {
            let idx = stack.pop();
            res[idx] = i - idx;
        }
        stack.push(i);
    }
    return res;
};

/**
 * https://leetcode.com/problems/daily-temperatures
 * Time O(N) | Space O(N)
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures, stack = []) {
    const days = Array(temperatures.length).fill(0);

    for (let day = 0; day < temperatures.length; day++) {
        /* Time O(N + N) */
        while (canShrink(stack, temperatures, day)) {
            /* Time O(N + N) */
            const prevColdDay = stack.pop();
            const daysToWait = day - prevColdDay;

            days[prevColdDay] = daysToWait; /* Ignore Space O(N) */
        }

        stack.push(day); /* Space O(N) */
    }

    return days;
};

const canShrink = (stack, temperatures, day) => {
    const previousDay = stack[stack.length - 1];
    const [prevTemperature, currTemperature] = [
        temperatures[previousDay],
        temperatures[day],
    ];
    const isWarmer = prevTemperature < currTemperature;

    return stack.length && isWarmer;
};

/**
 * https://leetcode.com/problems/daily-temperatures
 * Time O(N) | Space O(1)
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures, hottest = 0) {
    const res = new Array(temperatures.length).fill(0);
    const stack = [];

    for (let i = 0; i < temperatures.length; i++) {
        const t = temperatures[i];
        while (stack.length && t > stack[stack.length - 1][0]) {
            const [, stackInd] = stack.pop();
            res[stackInd] = i - stackInd;
        }
        stack.push([t, i]);
    }

    return res;
};

const search = (temperatures, day, temperature, days, dayCount = 1) => {
    const isHotter = () => temperatures[day + dayCount] <= temperature;
    while (isHotter()) dayCount += days[day + dayCount]; /* Time O(N + N) */

    days[day] = dayCount; /* Ignore Space O(N) */
};

module.exports = { dailyTemperatures };

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
    assert.deepStrictEqual(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
}
