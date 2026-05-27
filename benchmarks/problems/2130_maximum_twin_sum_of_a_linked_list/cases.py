from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    even = size if size % 2 == 0 else size + 1
    return " ".join(str((i * 17) % 10000) for i in range(even)) + "\n"
