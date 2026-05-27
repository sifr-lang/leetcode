from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def nums(size: int) -> list[int]:
    return [((index * 37) % 997) + 1 for index in range(size)]


def bounded_nums(size: int) -> list[int]:
    return [(index % 3) - 1 for index in range(size)]


def square_values(size: int) -> list[int]:
    return [((row + col) % 9) + 1 for row in range(size) for col in range(size)]


def generate_input(problem_id: str, size: int) -> str:
    if problem_id in ("0070_climbing_stairs", "1137_n_th_tribonacci_number"):
        return f"{size}\n"
    if problem_id in ("0198_house_robber", "0213_house_robber_ii", "0740_delete_and_earn"):
        return join(nums(size))
    if problem_id == "0746_min_cost_climbing_stairs":
        return join([value % 100 for value in nums(size)])
    if problem_id in ("0005_longest_palindromic_substring", "0647_palindromic_substrings"):
        return ("a" * size) + "\n"
    if problem_id == "0091_decode_ways":
        return ("10" * max(1, size // 2)) + "\n"
    if problem_id == "0322_coin_change":
        return f"{size} " + join([1, 3, 4, 7, 11, 19, 23, 31])
    if problem_id == "0152_maximum_product_subarray":
        return join(bounded_nums(size))
    if problem_id == "0139_word_break":
        return ("a" * size) + " a aa aaa aaaa\n"
    if problem_id == "0300_longest_increasing_subsequence":
        return join(list(range(size, 0, -1)))
    if problem_id == "0416_partition_equal_subset_sum":
        return join([1 for _ in range(size)])
    if problem_id == "0120_triangle":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "0377_combination_sum_iv":
        return f"{size} 1\n"
    if problem_id == "0673_number_of_longest_increasing_subsequence":
        return join(list(range(size, 0, -1)))
    raise ValueError(f"missing case generator for {problem_id}")
