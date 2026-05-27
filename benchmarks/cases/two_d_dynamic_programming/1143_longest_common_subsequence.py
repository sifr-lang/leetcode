from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    a = ("abcdef" * ((size // 6) + 1))[:size]
    b = ("acebdf" * ((size // 6) + 1))[:size]
    return f"{a} {b}\n"
