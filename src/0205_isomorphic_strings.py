
# LeetCode 205: Isomorphic Strings
# Python version

def _alpha_index(value: str) -> int:
    if value == "a":
        return 0
    if value == "b":
        return 1
    if value == "c":
        return 2
    if value == "d":
        return 3
    if value == "e":
        return 4
    if value == "f":
        return 5
    if value == "g":
        return 6
    if value == "h":
        return 7
    if value == "i":
        return 8
    if value == "j":
        return 9
    if value == "k":
        return 10
    if value == "l":
        return 11
    if value == "m":
        return 12
    if value == "n":
        return 13
    if value == "o":
        return 14
    if value == "p":
        return 15
    if value == "q":
        return 16
    if value == "r":
        return 17
    if value == "s":
        return 18
    if value == "t":
        return 19
    if value == "u":
        return 20
    if value == "v":
        return 21
    if value == "w":
        return 22
    if value == "x":
        return 23
    if value == "y":
        return 24
    if value == "z":
        return 25
    return -1

def isIsomorphic(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False

    map_st = [-1] * 26
    map_ts = [-1] * 26

    for index in range(len(s)):
        left = _alpha_index(s[index])
        right = _alpha_index(t[index])
        if left < 0 or right < 0:
            return False
        if map_st[left] != -1 and map_st[left] != right:
            return False
        if map_ts[right] != -1 and map_ts[right] != left:
            return False
        map_st[left] = right
        map_ts[right] = left

    return True


def main():
    assert isIsomorphic("egg", "add") == True
    assert isIsomorphic("foo", "bar") == False

if __name__ == "__main__":
    main()
