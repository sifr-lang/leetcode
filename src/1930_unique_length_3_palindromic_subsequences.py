
# LeetCode 1930: Unique Length 3 Palindromic Subsequences
# Python version

def charIndex(ch: str) -> int:
    return ord(ch) - ord("a")

def countPalindromicSubsequence(s: str) -> int:
    count = 0
    chars = set(s)
    for char in chars:
        first,last = s.find(char),s.rfind(char)
        middle = [False] * 26
        i = first + 1
        while i < last:
            middle[charIndex(s[i])] = True
            i += 1
        for seen in middle:
            if seen:
                count += 1
    return count


def main():
    assert countPalindromicSubsequence('aabca') == 3
    assert countPalindromicSubsequence('adc') == 0
    assert countPalindromicSubsequence('bbcbaba') == 4

if __name__ == "__main__":
    main()
