
# LeetCode 221: Maximal Square
# Python version

def maximalSquare(matrix: list[list[str]]) -> int:
    if not matrix or not matrix[0]:
        return 0

    rows, cols = len(matrix), len(matrix[0])
    prev = [0] * (cols + 1)
    best = 0

    for r in range(rows - 1, -1, -1):
        curr = [0] * (cols + 1)
        for c in range(cols - 1, -1, -1):
            if matrix[r][c] == "1":
                curr[c] = 1 + min(prev[c], curr[c + 1], prev[c + 1])
                best = max(best, curr[c])
        prev = curr

    return best * best



def main():
    assert maximalSquare([['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]) == 4
    assert maximalSquare([['0', '1'], ['1', '0']]) == 1
    assert maximalSquare([['0']]) == 0

if __name__ == "__main__":
    main()
