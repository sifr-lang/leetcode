from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    points = [[(i * 37) % 10000, (i * 91) % 10000] for i in range(size)]
    return f"{size} 2\n" + " ".join(str(v) for row in points for v in row) + "\n"
