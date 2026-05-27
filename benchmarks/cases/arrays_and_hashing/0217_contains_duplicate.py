from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    values = list(range(max(1, size - 1)))
    values.append(size // 2)
    return " ".join(str(v) for v in values) + "\n"
