from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    half = list(range(max(1, size // 2)))
    values = half + half[::-1]
    return " ".join(str(v) for v in values[:size]) + "\n"
