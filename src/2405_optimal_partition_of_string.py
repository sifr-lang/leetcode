
# LeetCode 2405: Optimal Partition Of String
# Python version

def partitionString(s: str) -> int:
    count = 1
    seen = 0
    for ch in s:
        mask = 1 << (ord(ch) - ord("a"))
        if seen & mask:
            count += 1
            seen = 0
        seen |= mask
    return count



def main():
    assert partitionString("abacbc") == 3
    assert partitionString("ssssss") == 6

if __name__ == "__main__":
    main()
