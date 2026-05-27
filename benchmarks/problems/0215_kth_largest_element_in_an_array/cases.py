from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    values = [((i * 7919) % 1000003) for i in range(size)]
    return str(max(1, size // 2)) + "\n" + " ".join(str(v) for v in values) + "\n"
