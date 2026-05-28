from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0078_subsets":
        return join(list(range(size)))
    if problem_id == "0039_combination_sum":
        candidates = [2, 3, 5, 7, 11, 13]
        return str(size) + " " + join(candidates)
    if problem_id == "0077_combinations":
        return f"{size} 3\n"
    if problem_id == "0046_permutations":
        return join(list(range(size)))
    if problem_id == "0090_subsets_ii":
        return join([index // 2 for index in range(size)])
    if problem_id == "0040_combination_sum_ii":
        candidates = [((index * 3) % 11) + 1 for index in range(size)]
        return str(size) + " " + join(candidates)
    if problem_id == "0047_permutations_ii":
        return join([index // 3 for index in range(size)])
    if problem_id == "0079_word_search":
        rows = max(2, size)
        cols = max(2, size)
        board = ["A" for _ in range(rows * cols)]
        word = "A" * min(size, rows * cols)
        return f"{word} {rows} {cols} " + join(board)
    if problem_id == "0131_palindrome_partitioning":
        return ("a" * size) + "\n"
    if problem_id == "0017_letter_combinations_of_a_phone_number":
        digits = "23456789"
        return "".join(digits[index % len(digits)] for index in range(size)) + "\n"
    if problem_id == "0473_matchsticks_to_square":
        adjusted = size + (-size % 4)
        return join([1 for _ in range(adjusted)])
    if problem_id == "1849_splitting_a_string_into_descending_consecutive_values":
        parts = [str(value) for value in range(size, max(size - 8, 0), -1)]
        return "".join(parts) + "\n"
    if problem_id == "1980_find_unique_binary_string":
        rows = []
        for index in range(size):
            chars = ["0" for _ in range(size)]
            chars[index] = "1"
            rows.append("".join(chars))
        return join(rows)
    if problem_id == "1239_maximum_length_of_a_concatenated_string_with_unique_characters":
        alphabet = "abcdefghijklmnopqrstuvwxyz"
        return join([alphabet[index] for index in range(size)])
    if problem_id == "0698_partition_to_k_equal_sum_subsets":
        adjusted = size + (-size % 4)
        return "4 " + join([1 for _ in range(adjusted)])
    if problem_id == "0051_n_queens":
        return f"{size}\n"
    if problem_id == "0052_n_queens_ii":
        return f"{size}\n"
    raise ValueError(f"missing case generator for {problem_id}")
