from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    grid = [[1 for _ in range(size)] for _ in range(size)]
    grid[0][0] = 2
    for i in range(0, size, 11):
        grid[i][size - 1] = 0
    return f"{size} {size}\n" + " ".join(str(cell) for row in grid for cell in row) + "\n"
