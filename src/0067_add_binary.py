
# LeetCode 67: Add Binary
# Python version

def addBinary(a: str, b: str) -> str:
    res = ""
    carry = 0

    i = len(a) - 1
    j = len(b) - 1
    while i >= 0 or j >= 0:
        bitA = 1 if i >= 0 and a[i] == "1" else 0
        bitB = 1 if j >= 0 and b[j] == "1" else 0

        total = bitA + bitB + carry
        char = str(total % 2)
        res = char + res
        carry = total // 2
        i -= 1
        j -= 1

    if carry:
        res = "1" + res

    return res



def main():
    assert addBinary("11", "1") == '100'
    assert addBinary("1010", "1011") == '10101'

if __name__ == "__main__":
    main()
