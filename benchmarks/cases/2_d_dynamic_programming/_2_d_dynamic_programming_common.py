from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def matrix(size: int, value: object) -> list[object]:
    return [value for _ in range(size * size)]


def corridor_grid(size: int) -> list[int]:
    values = [1 for _ in range(size * size)]
    for col in range(size):
        values[col] = 0
    for row in range(size):
        values[row * size + size - 1] = 0
    return values


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0062_unique_paths":
        return f"{size} {size}\n"
    if problem_id == "0063_unique_paths_ii":
        return f"{size} {size} " + join(corridor_grid(size))
    if problem_id == "1143_longest_common_subsequence":
        return ("a" * size) + " " + ("b" * size) + "\n"
    if problem_id == "0516_longest_palindromic_subsequence":
        return ("a" * size) + "\n"
    if problem_id == "1049_last_stone_weight_ii":
        return join([1 for _ in range(size)])
    if problem_id == "0309_best_time_to_buy_and_sell_stock_with_cooldown":
        return join([((index * 37) % 997) + 1 for index in range(size)])
    if problem_id == "0518_coin_change_ii":
        return f"{size} 1\n"
    if problem_id == "0494_target_sum":
        return f"{size + 1} " + join([1 for _ in range(size)])
    if problem_id == "0097_interleaving_string":
        return ("a" * size) + " " + ("b" * size) + " " + ("ab" * size) + "\n"
    if problem_id == "0064_minimum_path_sum":
        return f"{size} {size} " + join(matrix(size, 1))
    if problem_id == "0329_longest_increasing_path_in_a_matrix":
        return f"{size} {size} " + join(matrix(size, 1))
    if problem_id == "0221_maximal_square":
        return f"{size} {size} " + join(matrix(size, "1"))
    if problem_id == "0474_ones_and_zeroes":
        return f"{size // 2} {size // 2} " + join(["0" if index % 2 == 0 else "1" for index in range(size)])
    if problem_id == "0115_distinct_subsequences":
        return ("a" * size) + " " + ("b" * max(1, size // 2)) + "\n"
    if problem_id == "0072_edit_distance":
        return ("a" * size) + " " + ("b" * size) + "\n"
    if problem_id == "1220_count_vowels_permutation":
        return f"{size}\n"
    if problem_id == "0312_burst_balloons":
        return join([1 for _ in range(size)])
    if problem_id == "0010_regular_expression_matching":
        return ("a" * size) + " " + ("a" * size) + "\n"
    raise ValueError(f"missing case generator for {problem_id}")
