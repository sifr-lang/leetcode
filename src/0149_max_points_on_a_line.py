# LeetCode 149: Max Points On A Line
# Python version

def _gcd(a: int, b: int) -> int:
    a = abs(a)
    b = abs(b)
    while b != 0:
        a, b = b, a % b
    return a if a != 0 else 1

def _slope_key(dx: int, dy: int) -> tuple[int, int]:
    if dx == 0:
        return (1, 0)
    if dy == 0:
        return (0, 1)
    if dx < 0:
        dx = -dx
        dy = -dy
    g = _gcd(dy, dx)
    return (dy // g, dx // g)

def maxPoints(points: list[list[int]]) -> int:
    # 1. For each pt determine if it lies on the longest line
    # 2. Count all pts with same slope
    # 3. Update result with max

    res = 1
    for i in range(len(points)):
        p1 = points[i]
        count = {}
        for j in range(i + 1, len(points)):
            p2 = points[j]
            key = _slope_key(p2[0] - p1[0], p2[1] - p1[1])
            next_count = count.get(key, 0) + 1
            count[key] = next_count
            res = max(res, next_count + 1)
    return res



def main():
    assert maxPoints([[1, 1], [2, 2], [3, 3]]) == 3
    assert maxPoints([[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]) == 4

if __name__ == "__main__":
    main()
