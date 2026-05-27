from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    return str(size - 1) + "\n" + " ".join(str(i) for i in range(size)) + "\n"
