
# LeetCode 567: Permutation In String
# Python version

def alphaIndex(ch: str) -> int:
    if ch == "a":
        return 0
    if ch == "b":
        return 1
    if ch == "c":
        return 2
    if ch == "d":
        return 3
    if ch == "e":
        return 4
    if ch == "f":
        return 5
    if ch == "g":
        return 6
    if ch == "h":
        return 7
    if ch == "i":
        return 8
    if ch == "j":
        return 9
    if ch == "k":
        return 10
    if ch == "l":
        return 11
    if ch == "m":
        return 12
    if ch == "n":
        return 13
    if ch == "o":
        return 14
    if ch == "p":
        return 15
    if ch == "q":
        return 16
    if ch == "r":
        return 17
    if ch == "s":
        return 18
    if ch == "t":
        return 19
    if ch == "u":
        return 20
    if ch == "v":
        return 21
    if ch == "w":
        return 22
    if ch == "x":
        return 23
    if ch == "y":
        return 24
    return 25

def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False

    s1Count, s2Count = [0] * 26, [0] * 26
    for i in range(len(s1)):
        s1Count[alphaIndex(s1[i])] += 1
        s2Count[alphaIndex(s2[i])] += 1

    matches = 0
    for i in range(26):
        matches += 1 if s1Count[i] == s2Count[i] else 0

    l = 0
    for r in range(len(s1), len(s2)):
        if matches == 26:
            return True

        index = alphaIndex(s2[r])
        s2Count[index] += 1
        if s1Count[index] == s2Count[index]:
            matches += 1
        elif s1Count[index] + 1 == s2Count[index]:
            matches -= 1

        index = alphaIndex(s2[l])
        s2Count[index] -= 1
        if s1Count[index] == s2Count[index]:
            matches += 1
        elif s1Count[index] - 1 == s2Count[index]:
            matches -= 1
        l += 1
    return matches == 26



def main():
    assert checkInclusion("ab", "eidbaooo") == True
    assert checkInclusion("ab", "eidboaoo") == False

if __name__ == "__main__":
    main()
