from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    return str(size // 2) + "\n" + " ".join(str(i * 2) for i in range(size)) + "\n"
