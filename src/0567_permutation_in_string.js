/**
 * https://leetcode.com/problems/permutation-in-string/
 * Time O(N + (M - N)) | Space O(1)
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = (s1, s2) => {
    const isInvalid = s2.length < s1.length;
    if (isInvalid) return false;

    let [left, right] = [0, 0];
    const [s1FrequencyMap, s2FrequencyMap] = getFrequencyMaps(s1);

    while (right < s2.length) {
        addRightFrequency(s2, right, s2FrequencyMap);

        const window = right - left + 1;
        const isPermutation =
            window === s1.length && isSame(s1FrequencyMap, s2FrequencyMap);
        if (isPermutation) return true;

        const canSlide = s1.length <= window;
        if (canSlide) {
            subtractLeftFrequency(s2, left, s2FrequencyMap);
            left++;
        }

        right++;
    }

    return false;
};

const getFrequencyMaps = (s1) => {
    const [s1FrequencyMap, s2FrequencyMap] = new Array(2)
        .fill()
        .map(() => new Array(26).fill(0));

    for (const char of s1) s1FrequencyMap[getCode(char)]++;

    return [s1FrequencyMap, s2FrequencyMap];
};

const getCode = (char) => char.charCodeAt(0) - 'a'.charCodeAt(0);

const addRightFrequency = (s, right, frequencyMap) => {
    const char = s[right];
    const index = getCode(char);

    frequencyMap[index]++;

    return frequencyMap[index];
};

const subtractLeftFrequency = (s, left, frequencyMap) => {
    const char = s[left];
    const index = getCode(char);

    frequencyMap[index]--;

    return frequencyMap[index];
};

const isSame = (a, b) => {
    for (let i = 0; i < 26; i++) {
        const isMatch = a[i] === b[i];
        if (!isMatch) return false;
    }

    return true;
};

//////////////////////////////////////////////////////////////////////////////
// Static Sliding Window
// Time: Theta(l1 + l2) O(l1 + l2)  Space: Theta(1) O(1)
// Highest performing solution. Simply builds a map of the character counts
// for `s1` and `s1.length` of `s2` whose characters are within `s1`, updates
// the `s2` character map as it slides from the beginning of `s2` to the end
// of `s2`, and returns upon verifying a match between the `s1` and `s2`
// character maps.
//////////////////////////////////////////////////////////////////////////////

/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function checkInclusion(s1, s2) {
    if (s1.length > s2.length) {
        return false;
    }

    const s1Chars = Object.create(null);
    const s2Chars = Object.create(null);

    for (const ch of s1) {
        if (!(ch in s1Chars)) {
            s1Chars[ch] = 0;
            s2Chars[ch] = 0;
        }
        ++s1Chars[ch];
    }

    for (let i = 0; i < s1.length; ++i) {
        const ch = s2[i];
        if (ch in s1Chars) {
            ++s2Chars[ch];
        }
    }

    let matches = 0;
    let matched = 0;

    for (const ch in s1Chars) {
        if (s1Chars[ch] === s2Chars[ch]) {
            ++matches;
        }
        ++matched;
    }

    const last = s2.length - s1.length;

    for (let i = 0; i < last; ++i) {
        if (matches === matched) {
            return true;
        }

        const ch1 = s2[i];
        const ch2 = s2[i + s1.length];

        if (ch1 in s1Chars) {
            if (s1Chars[ch1] === s2Chars[ch1]--) {
                --matches;
            } else if (s1Chars[ch1] === s2Chars[ch1]) {
                ++matches;
            }
        }

        if (ch2 in s1Chars) {
            if (s1Chars[ch2] === s2Chars[ch2]++) {
                --matches;
            } else if (s1Chars[ch2] === s2Chars[ch2]) {
                ++matches;
            }
        }
    }

    return matches === matched;
}

//////////////////////////////////////////////////////////////////////////////
// Optimized Backtracking
// Time: Theta(l1 + l2) O(l1 + l2^2)  Space: Theta(l1) O(l1)
// This solution passes the tests, but it is much slower than other passing
// solutions. At each possible beginning character of `s1` within `s2` a fresh
// map is created and a second pointer increments until it either matches `s1`
// or fails and moves the first and second pointer to the next available
// matching index.
//////////////////////////////////////////////////////////////////////////////

/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
function checkInclusion(s1, s2) {
    if (s1.length > s2.length) {
        return false;
    }

    const s1Chars = Object.create(null);

    for (const ch of s1) {
        if (!(ch in s1Chars)) {
            s1Chars[ch] = 0;
        }
        ++s1Chars[ch];
    }

    const last = s2.length - s1.length;
    let i = 0;

    while (i <= last) {
        while (i <= last && !(s2[i] in s1Chars)) {
            ++i;
        }

        if (i > last) {
            return false;
        }

        const subChars = Object.create(null);
        let j = i;

        while (j < s2.length && s2[j] in s1Chars) {
            const ch = s2[j];

            if (!(ch in subChars)) {
                subChars[ch] = 0;
            }
            ++subChars[ch];

            if (subChars[ch] > s1Chars[ch]) {
                break;
            }

            ++j;
        }

        if (s1.length === j - i) {
            return true;
        }

        if (j < s2.length && s2[j] in s1Chars) {
            while (s2[i] !== s2[j]) {
                ++i;
            }
            ++i;
        } else {
            i = j;
        }
    }

    return false;
}

var checkInclusion = (s1, s2) => {
    if (s1.length > s2.length) {
        return false;
    }

    const s1Count = new Array(26).fill(0);
    const s2Count = new Array(26).fill(0);
    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97] += 1;
        s2Count[s2.charCodeAt(i) - 97] += 1;
    }

    let matches = 0;
    for (let i = 0; i < 26; i++) {
        matches += s1Count[i] === s2Count[i] ? 1 : 0;
    }

    let l = 0;
    for (let r = s1.length; r < s2.length; r++) {
        if (matches === 26) {
            return true;
        }

        let index = s2.charCodeAt(r) - 97;
        s2Count[index] += 1;
        if (s1Count[index] === s2Count[index]) {
            matches += 1;
        } else if (s1Count[index] + 1 === s2Count[index]) {
            matches -= 1;
        }

        index = s2.charCodeAt(l) - 97;
        s2Count[index] -= 1;
        if (s1Count[index] === s2Count[index]) {
            matches += 1;
        } else if (s1Count[index] - 1 === s2Count[index]) {
            matches -= 1;
        }
        l += 1;
    }
    return matches === 26;
};

module.exports = { checkInclusion };

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
    assert.deepStrictEqual(checkInclusion("ab", "eidbaooo"), true);
    assert.deepStrictEqual(checkInclusion("ab", "eidboaoo"), false);
}
