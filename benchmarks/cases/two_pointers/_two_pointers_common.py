from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def ints(size: int, mod: int = 1000) -> list[int]:
    return [((index * 37) % mod) - (mod // 2) for index in range(size)]


def token_string(size: int, alphabet: str = "abcdefghijklmnopqrstuvwxyz") -> str:
    return "".join(alphabet[index % len(alphabet)] for index in range(size))


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0125_valid_palindrome":
        half = token_string(max(1, size // 2), "abcd1234")
        return (half + half[::-1])[:size] + "\n"
    if problem_id == "0680_valid_palindrome_ii":
        half = token_string(max(1, size // 2), "abcdef")
        text = half + "x" + half[::-1]
        return text[:size] + "\n"
    if problem_id == "1984_minimum_difference_between_highest_and_lowest_of_k_scores":
        k = max(2, min(size, size // 10))
        values = [(index * 53) % max(10, size * 2) for index in range(size)]
        return str(k) + " " + join(values)
    if problem_id == "1768_merge_strings_alternately":
        left = token_string(max(1, size // 2), "abcde")
        right = token_string(max(1, size - len(left)), "vwxyz")
        return left + " " + right + "\n"
    if problem_id == "0344_reverse_string":
        return join(list(token_string(size, "abcdef")))
    if problem_id == "0088_merge_sorted_array":
        m = max(1, size // 2)
        n = max(1, size - m)
        nums1_values = list(range(0, m * 2, 2)) + [0] * n
        nums2_values = list(range(1, n * 2, 2))
        total = m + n
        return f"{m} {n} {total} " + join(nums1_values + nums2_values)
    if problem_id == "0283_move_zeroes":
        return join([0 if index % 5 == 0 else index % 97 for index in range(size)])
    if problem_id == "0026_remove_duplicates_from_sorted_array":
        return join([index // 3 for index in range(size)])
    if problem_id == "0080_remove_duplicates_from_sorted_array_ii":
        return join([index // 4 for index in range(size)])
    if problem_id == "0167_two_sum_ii_input_array_is_sorted":
        values = list(range(1, size + 1))
        target = values[0] + values[-1]
        return str(target) + " " + join(values)
    if problem_id == "0015_3sum":
        values = [((index % 51) - 25) for index in range(size)]
        return join(values)
    if problem_id == "0018_4sum":
        values = [((index % 31) - 15) for index in range(size)]
        return "0 " + join(values)
    if problem_id == "0011_container_with_most_water":
        return join([(index * 17) % 1000 + 1 for index in range(size)])
    if problem_id == "1498_number_of_subsequences_that_satisfy_the_given_sum_condition":
        values = [(index * 17) % 1000 + 2 for index in range(size)]
        return "1 " + join(values)
    if problem_id == "0189_rotate_array":
        return str(max(1, size // 3)) + " " + join(list(range(size)))
    if problem_id == "1968_array_with_elements_not_equal_to_average_of_neighbors":
        return join(ints(size, max(10, size * 2)))
    if problem_id == "0881_boats_to_save_people":
        values = [(index % 90) + 10 for index in range(size)]
        return "100 " + join(values)
    if problem_id == "0042_trapping_rain_water":
        return join([(index * 7) % 20 for index in range(size)])
    raise ValueError(f"missing case generator for {problem_id}")
