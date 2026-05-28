from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"cases={size:07d}"


def make_palindrome_value(seed: int) -> int:
    text = str((seed % 90_000) + 10_000)
    return int(text + text[::-1])


def make_cases(size: int) -> list[int]:
    cases: list[int] = []
    for index in range(size):
        kind = index % 6
        if kind == 0:
            cases.append(make_palindrome_value(index))
        elif kind == 1:
            cases.append(-make_palindrome_value(index))
        elif kind == 2:
            cases.append((index * 37) + 10)
        elif kind == 3:
            cases.append(0)
        elif kind == 4:
            cases.append(123_454_321)
        else:
            cases.append(2_147_483_647 - (index % 1_000))
    return cases


def generate_input(size: int) -> str:
    cases = make_cases(size)
    return "\n".join(str(value) for value in cases) + "\n"
