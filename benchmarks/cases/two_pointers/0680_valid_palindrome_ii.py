from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    half = "abc" * max(1, size // 6)
    text = half + "x" + half[::-1]
    return text[:size] + "\n"
