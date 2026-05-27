from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def generate_input(problem_id: str, size: int) -> str:
    generators = {
        "0007_reverse_integer": reverse_integer_input,
        "0067_add_binary": add_binary_input,
        "0136_single_number": single_number_input,
        "0190_reverse_bits": reverse_bits_input,
        "0191_number_of_1_bits": number_of_1_bits_input,
        "0268_missing_number": missing_number_input,
        "0338_counting_bits": counting_bits_input,
        "0371_sum_of_two_integers": sum_of_two_integers_input,
    }
    return generators[problem_id](size)


def reverse_integer_input(size: int) -> str:
    digits = max(1, size)
    value = int("123456789"[: min(digits, 9)])
    return f"{value}\n"


def add_binary_input(size: int) -> str:
    left = "1" * size
    right = ("10" * ((size + 1) // 2))[:size]
    return f"{left} {right}\n"


def single_number_input(size: int) -> str:
    pair_count = max(1, size // 2)
    values = []
    for value in range(pair_count):
        values.extend([value, value])
    values.append(987654321)
    return " ".join(str(value) for value in values) + "\n"


def reverse_bits_input(size: int) -> str:
    return f"{(1 << size) - 1}\n"


def number_of_1_bits_input(size: int) -> str:
    return f"{(1 << size) - 1}\n"


def missing_number_input(size: int) -> str:
    missing = size // 2
    values = [value for value in range(size + 1) if value != missing]
    return " ".join(str(value) for value in values) + "\n"


def counting_bits_input(size: int) -> str:
    return f"{size}\n"


def sum_of_two_integers_input(size: int) -> str:
    return f"{size} {size + 1}\n"
