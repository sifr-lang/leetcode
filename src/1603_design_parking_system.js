/**
 * https://leetcode.com/problems/design-parking-system/
 * @class ParkingSystem
 * @param {number} big
 * @param {number} medium
 * @param {number} small
 */
class ParkingSystem {
    constructor(big, medium, small) {
        this.isBigRemaining = big;
        this.isMediumRemaining = medium;
        this.isSmallRemaining = small;
    }

    /**
     * Time O(1) | Space O(1)
     * @param {number} carType
     * @return {boolean}
     */
    addCar(carType) {
        const isBigCarAvailable = carType === 1 && this.isBigRemaining > 0;
        if (isBigCarAvailable) {
            this.isBigRemaining -= 1;
            return true;
        }
        const isMediumCarAvailable =
            carType === 2 && this.isMediumRemaining > 0;
        if (isMediumCarAvailable) {
            this.isMediumRemaining -= 1;
            return true;
        }
        const isSmallCarAvailable = carType === 3 && this.isSmallRemaining > 0;
        if (isSmallCarAvailable) {
            this.isSmallRemaining -= 1;
            return true;
        }
        return false;
    }
}

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * var obj = new ParkingSystem(big, medium, small)
 * var param_1 = obj.addCar(carType)
 */

module.exports = { ParkingSystem };

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
    let obj = new ParkingSystem(1, 1, 0);
    assert.deepStrictEqual(obj.addCar(1), true);
    assert.deepStrictEqual(obj.addCar(2), true);
    assert.deepStrictEqual(obj.addCar(3), false);
    assert.deepStrictEqual(obj.addCar(1), false);
}
