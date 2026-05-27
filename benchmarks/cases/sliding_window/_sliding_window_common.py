from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def token_string(size: int, alphabet: str = "abcdefghijklmnopqrstuvwxyz") -> str:
    return "".join(alphabet[index % len(alphabet)] for index in range(size))


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0121_best_time_to_buy_and_sell_stock":
        return join([(index * 37) % 1000 + (index // 100) for index in range(size)])
    if problem_id == "0219_contains_duplicate_ii":
        values = list(range(max(1, size - 1))) + [max(0, size - 2)]
        return "2 " + join(values)
    if problem_id == "1343_number_of_sub_arrays_of_size_k_and_average_greater_than_or_equal_to_threshold":
        k = max(1, min(size, size // 20))
        threshold = 50
        values = [75 if index % 3 else 25 for index in range(size)]
        return f"{k} {threshold} " + join(values)
    if problem_id == "0003_longest_substring_without_repeating_characters":
        return token_string(size, "abcdefghijklmnopqrstuvwxyz") + "\n"
    if problem_id == "0424_longest_repeating_character_replacement":
        return str(max(1, size // 20)) + " " + token_string(size, "AABBC") + "\n"
    if problem_id == "0567_permutation_in_string":
        needle = "abcde"
        haystack = token_string(max(0, size - len(needle)), "fghij") + needle
        return needle + " " + haystack + "\n"
    if problem_id == "1838_frequency_of_the_most_frequent_element":
        values = [(index * 7) % 1000 for index in range(size)]
        return str(max(1, size // 5)) + " " + join(values)
    if problem_id == "0904_fruit_into_baskets":
        return join([index % 3 for index in range(size)])
    if problem_id == "1456_maximum_number_of_vowels_in_a_substring_of_given_length":
        return str(max(1, min(size, size // 10))) + " " + token_string(size, "aeioubcdfg") + "\n"
    if problem_id == "1888_minimum_number_of_flips_to_make_the_binary_string_alternating":
        return token_string(size, "001011") + "\n"
    if problem_id == "0209_minimum_size_subarray_sum":
        values = [(index % 9) + 1 for index in range(size)]
        return str(max(1, size // 3)) + " " + join(values)
    if problem_id == "0658_find_k_closest_elements":
        k = max(1, min(size, size // 10))
        x = size // 2
        values = list(range(size))
        return f"{k} {x} " + join(values)
    if problem_id == "1658_minimum_operations_to_reduce_x_to_zero":
        values = [(index % 5) + 1 for index in range(size)]
        x = sum(values[: max(1, size // 20)])
        return str(x) + " " + join(values)
    if problem_id == "0076_minimum_window_substring":
        target = "abcde"
        source = token_string(max(0, size - len(target)), "xyz") + target
        return source + " " + target + "\n"
    if problem_id == "0239_sliding_window_maximum":
        k = max(1, min(size, size // 20))
        values = [(index * 37) % 1000 for index in range(size)]
        return str(k) + " " + join(values)
    raise ValueError(f"missing case generator for {problem_id}")
