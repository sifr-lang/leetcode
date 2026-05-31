
# LeetCode 2001: Number Of Pairs Of Interchangeable Rectangles
# Python version

def _gcd(a: int, b: int) -> int:
    a = abs(a)
    b = abs(b)
    while b != 0:
        a, b = b, a % b
    return a if a != 0 else 1

def interchangeableRectangles(rectangles: list[list[int]]) -> int:
    count = {}
    res = 0

    for w, h in rectangles:
        if h == 0:
            continue
        g = _gcd(w, h)
        key = (w // g, h // g)
        count[key] = 1 + count.get(key, 0)

    for c in count.values():
        res += (c * (c - 1)) // 2

    return res



def main():
    assert interchangeableRectangles([[4, 8], [3, 6], [10, 20], [15, 30]]) == 6
    assert interchangeableRectangles([[4, 5], [7, 8]]) == 0

if __name__ == "__main__":
    main()
