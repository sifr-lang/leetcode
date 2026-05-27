from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def nums(size: int) -> list[int]:
    return [((index * 37) % 997) + 1 for index in range(size)]


def signed_nums(size: int) -> list[int]:
    return [((index % 7) - 3) for index in range(size)]


def alternating_nums(size: int) -> list[int]:
    return [1 if index % 2 == 0 else 3 for index in range(size)]


def generate_input(problem_id: str, size: int) -> str:
    if problem_id in ("0053_maximum_subarray", "0918_maximum_sum_circular_subarray"):
        return join(signed_nums(size))
    if problem_id == "0978_longest_turbulent_subarray":
        return join(alternating_nums(size))
    if problem_id in ("0055_jump_game", "0045_jump_game_ii"):
        return join([1 for _ in range(size)])
    if problem_id == "0134_gas_station":
        return f"{size} " + join([2 for _ in range(size)] + [1 for _ in range(size)])
    if problem_id == "0846_hand_of_straights":
        return "5 " + join(list(range(size)))
    if problem_id == "1423_maximum_points_you_can_obtain_from_cards":
        return f"{max(1, size // 2)} " + join(nums(size))
    if problem_id == "1899_merge_triplets_to_form_target_triplet":
        triplets: list[int] = []
        patterns = ([7, 1, 1], [1, 7, 1], [1, 1, 7])
        for index in range(size):
            triplets.extend(patterns[index % len(patterns)])
        return f"7 7 7 {size} 3 " + join(triplets)
    if problem_id == "0763_partition_labels":
        return ("a" * size) + "\n"
    if problem_id == "0678_valid_parenthesis_string":
        return ("*" * size) + "\n"
    if problem_id == "1029_two_city_scheduling":
        rows = size if size % 2 == 0 else size + 1
        values: list[int] = []
        for index in range(rows):
            values.extend([100 + (index % 97), 1 + (index % 89)])
        return f"{rows} 2 " + join(values)
    raise ValueError(f"missing case generator for {problem_id}")
