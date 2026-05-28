from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    intervals = [[i, i + 10] for i in range(size)]
    return f"{size} 2\n" + " ".join(str(v) for row in intervals for v in row) + "\n"
