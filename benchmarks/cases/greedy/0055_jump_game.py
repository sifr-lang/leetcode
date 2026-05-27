from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    values = [3 for _ in range(size)]
    values[-1] = 0
    return " ".join(str(v) for v in values) + "\n"
