from __future__ import annotations

def fixture_stem(size: int) -> str:
    return f"n={size:07d}"

def generate_input(size: int) -> str:
    pairs = max(1, size // 2)
    values = []
    for i in range(pairs):
        values.extend([i, i])
    values.append(987654321)
    return " ".join(str(v) for v in values) + "\n"
