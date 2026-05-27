from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    pattern = ["5", "2", "+", "D", "C"]
    ops = [pattern[i % len(pattern)] for i in range(size)]
    return " ".join(ops) + "\n"
