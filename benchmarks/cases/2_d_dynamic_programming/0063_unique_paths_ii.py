from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    grid = [[0 if (r + c) % 17 else 1 for c in range(size)] for r in range(size)]
    grid[0][0] = 0
    grid[-1][-1] = 0
    return f"{size} {size}\n" + " ".join(str(cell) for row in grid for cell in row) + "\n"
