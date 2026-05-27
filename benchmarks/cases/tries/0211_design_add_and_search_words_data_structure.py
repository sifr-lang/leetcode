from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"ops={size:07d}"

def word(index: int) -> str:
    return chr(ord("a") + index % 26) + chr(ord("a") + (index // 26) % 26) + chr(ord("a") + (index // 676) % 26)

def generate_input(size: int) -> str:
    lines = []
    for i in range(size):
        w = word(i)
        lines.append(f"addWord {w}")
        lines.append(f"search {w}")
        lines.append(f"search .{w[1:]}")
    return "\n".join(lines) + "\n"
