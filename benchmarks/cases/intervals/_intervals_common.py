from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def disjoint_intervals(size: int) -> list[int]:
    values: list[int] = []
    for index in range(size):
        start = index * 3
        values.extend([start, start + 1])
    return values


def overlapping_intervals(size: int) -> list[int]:
    values: list[int] = []
    for index in range(size):
        values.extend([index, index + 2])
    return values


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0057_insert_interval":
        return f"{size * 3 + 1} {size * 3 + 2} {size} 2 " + join(disjoint_intervals(size))
    if problem_id == "0056_merge_intervals":
        return f"{size} 2 " + join(overlapping_intervals(size))
    if problem_id == "0435_non_overlapping_intervals":
        return f"{size} 2 " + join(overlapping_intervals(size))
    if problem_id == "0252_meeting_rooms":
        return f"{size} 2 " + join(disjoint_intervals(size))
    if problem_id == "0253_meeting_rooms":
        return f"{size} 2 " + join(overlapping_intervals(size))
    if problem_id == "1288_remove_covered_intervals":
        return f"{size} 2 " + join([[0, size * 3][column] for _ in range(size) for column in range(2)])
    if problem_id == "1851_minimum_interval_to_include_each_query":
        intervals = disjoint_intervals(size)
        queries = [index * 3 for index in range(size)]
        return f"{size} 2 " + join(intervals + queries)
    raise ValueError(f"missing case generator for {problem_id}")
