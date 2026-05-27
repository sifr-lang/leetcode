from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    values = [(i * 37) % 10000 for i in range(size)]
    return " ".join(str(v) for v in values) + "\n"
