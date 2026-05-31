# LeetCode 1189: Maximum Number Of Balloons
# Python version

def maxNumberOfBalloons(text: str) -> int:
    b = 0
    a = 0
    l = 0
    o = 0
    n = 0
    for ch in text:
        if ch == "b":
            b += 1
        elif ch == "a":
            a += 1
        elif ch == "l":
            l += 1
        elif ch == "o":
            o += 1
        elif ch == "n":
            n += 1

    res = min(b, a)
    res = min(res, l // 2)
    res = min(res, o // 2)
    res = min(res, n)
    return res



def main():
    assert maxNumberOfBalloons('nlaebolko') == 1
    assert maxNumberOfBalloons('loonbalxballpoon') == 2
    assert maxNumberOfBalloons('leetcode') == 0

if __name__ == "__main__":
    main()
