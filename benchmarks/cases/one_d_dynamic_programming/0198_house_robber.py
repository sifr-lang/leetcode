from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    return " ".join(str((i * 13) % 1000) for i in range(size)) + "\n"
