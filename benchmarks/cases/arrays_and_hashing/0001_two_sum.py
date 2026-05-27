from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def make_case(size: int) -> tuple[list[int], int]:
    if size < 2:
        raise ValueError("two_sum benchmark size must be at least 2")
    nums = [(index * 2) + 1 for index in range(size - 2)]
    nums.extend([1_000_000_000, 1_000_000_001])
    return nums, 2_000_000_001


def generate_input(size: int) -> str:
    nums, target = make_case(size)
    return f"{target}\n{' '.join(str(value) for value in nums)}\n"
