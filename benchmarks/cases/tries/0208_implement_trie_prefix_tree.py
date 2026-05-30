from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"ops={size:07d}"

def word(index: int) -> str:
    letters = []
    value = index + 1
    while value:
        letters.append(chr(ord("a") + (value % 26)))
        value //= 26
    return "".join(letters)

def generate_input(size: int) -> str:
    lines = ["__init__"]
    for i in range(size):
        w = word(i)
        lines.append(f"insert {w}")
        lines.append(f"search {w}")
        lines.append(f"startsWith {w[:1]}")
    return "\n".join(lines) + "\n"
