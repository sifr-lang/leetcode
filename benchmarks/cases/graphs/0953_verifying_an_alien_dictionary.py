from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    words = ["a" + "a" * (i % 8) + chr(ord("a") + (i % 26)) for i in range(size)]
    words.sort()
    return "abcdefghijklmnopqrstuvwxyz\n" + " ".join(words) + "\n"
