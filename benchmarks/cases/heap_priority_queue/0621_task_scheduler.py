from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    tasks = [chr(ord("A") + (i % 6)) for i in range(size)]
    return "2\n" + " ".join(tasks) + "\n"
