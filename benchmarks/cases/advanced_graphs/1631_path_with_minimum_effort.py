from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    grid = [[(r * 17 + c * 31) % 1000 for c in range(size)] for r in range(size)]
    return f"{size} {size}\n" + " ".join(str(cell) for row in grid for cell in row) + "\n"
