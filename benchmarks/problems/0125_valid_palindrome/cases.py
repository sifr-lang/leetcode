from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    half = "ab" * max(1, size // 4)
    text = half + half[::-1]
    return text[:size] + "\n"
