from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    k = max(1, size // 3)
    values = list(range(size))
    if size > 1:
        values[-1] = values[-2]
    return str(k) + "\n" + " ".join(str(v) for v in values) + "\n"
