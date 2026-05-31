
# LeetCode 36: Valid Sudoku
# Python version

def _digit_mask(value: str) -> int:
    if value == "1":
        return 1
    if value == "2":
        return 2
    if value == "3":
        return 4
    if value == "4":
        return 8
    if value == "5":
        return 16
    if value == "6":
        return 32
    if value == "7":
        return 64
    if value == "8":
        return 128
    if value == "9":
        return 256
    return 0

def isValidSudoku(board: list[list[str]]) -> bool:
    cols = [0] * 9
    rows = [0] * 9
    squares = [0] * 9

    for r in range(9):
        for c in range(9):
            mask = _digit_mask(board[r][c])
            if mask == 0:
                continue
            square = (r // 3) * 3 + (c // 3)
            if rows[r] & mask != 0 or cols[c] & mask != 0 or squares[square] & mask != 0:
                return False
            rows[r] = rows[r] | mask
            cols[c] = cols[c] | mask
            squares[square] = squares[square] | mask

    return True



def main():
    valid_board = [
        ["5", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ]
    invalid_board = [
        ["8", "3", ".", ".", "7", ".", ".", ".", "."],
        ["6", ".", ".", "1", "9", "5", ".", ".", "."],
        [".", "9", "8", ".", ".", ".", ".", "6", "."],
        ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
        ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
        ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
        [".", "6", ".", ".", ".", ".", "2", "8", "."],
        [".", ".", ".", "4", "1", "9", ".", ".", "5"],
        [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ]
    assert isValidSudoku(valid_board) is True
    assert isValidSudoku(invalid_board) is False

if __name__ == "__main__":
    main()
