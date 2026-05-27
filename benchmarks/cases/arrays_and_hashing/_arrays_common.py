from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def ints(size: int, mod: int = 1000) -> list[int]:
    return [((index * 37) % mod) - (mod // 2) for index in range(size)]


def words(size: int) -> list[str]:
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    return ["w" + alphabet[index % 26] + str(index % 997) for index in range(size)]


def token_string(size: int, alphabet: str = "abcdefghijklmnopqrstuvwxyz") -> str:
    return "".join(alphabet[index % len(alphabet)] for index in range(size))


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def join_counted(values: list[object]) -> str:
    return str(len(values)) + " " + " ".join(str(value) for value in values) + "\n"


def join_matrix(rows: int, cols: int, values: list[object]) -> str:
    return f"{rows} {cols} " + " ".join(str(value) for value in values) + "\n"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0001_two_sum":
        values = [(index * 2) + 1 for index in range(max(0, size - 2))] + [1_000_000_000, 1_000_000_001]
        return str(2_000_000_001) + "\n" + join(values)
    if problem_id == "0217_contains_duplicate":
        values = list(range(max(1, size - 1))) + [size // 2]
        return join(values)
    if problem_id == "0242_valid_anagram":
        s = token_string(size, "abcde")
        return s + " " + "".join(reversed(s)) + "\n"
    if problem_id == "1929_concatenation_of_array":
        return join([index % 100 for index in range(size)])
    if problem_id == "1299_replace_elements_with_greatest_element_on_right_side":
        return join(list(range(size, 0, -1)))
    if problem_id == "0392_is_subsequence":
        s = token_string(max(1, size // 5), "abc")
        t = "x".join(s) + "x"
        return s + " " + t + "\n"
    if problem_id == "0058_length_of_last_word":
        return token_string(size, "abcdef") + "\n"
    if problem_id == "0014_longest_common_prefix":
        return join(["prefix" + str(index) for index in range(size)])
    if problem_id == "0049_group_anagrams":
        base_words = ["eat", "tea", "ate", "tan", "nat", "bat"]
        return join([base_words[index % len(base_words)] for index in range(size)])
    if problem_id == "0118_pascals_triangle":
        return str(size) + "\n"
    if problem_id == "0027_remove_element":
        values = [index % 5 for index in range(size)]
        return "3 " + join(values)
    if problem_id == "0929_unique_email_addresses":
        return join([f"user{index % 100}+tag@leetcode.com" for index in range(size)])
    if problem_id == "0205_isomorphic_strings":
        s = token_string(size, "abc")
        t = token_string(size, "xyz")
        return s + " " + t + "\n"
    if problem_id == "0605_can_place_flowers":
        values = [0 if index % 3 else 1 for index in range(size)]
        return str(max(1, size // 10)) + " " + join(values)
    if problem_id == "0169_majority_element":
        return join(([7] * (size // 2 + 1)) + [index % 13 for index in range(size // 2)])
    if problem_id == "0496_next_greater_element_i":
        n1 = max(1, size // 2)
        nums1 = list(range(n1))
        nums2 = list(range(size))
        return f"{len(nums1)} {len(nums2)} " + join(nums1 + nums2)
    if problem_id == "0724_find_pivot_index":
        left = [1] * (size // 2)
        return join(left + [0] + left)
    if problem_id == "0303_range_sum_query_immutable":
        values = [index % 17 for index in range(size)]
        query_count = max(1, min(100, size))
        lines = ["__init__ " + join_counted(values).strip()]
        for index in range(query_count):
            left = (index * 37) % size
            right = min(size - 1, left + (size // 2))
            lines.append(f"sumRange {left} {right}")
        return "\n".join(lines) + "\n"
    if problem_id == "0448_find_all_numbers_disappeared_in_an_array":
        values = [(index % max(1, size // 2)) + 1 for index in range(size)]
        return join(values)
    if problem_id == "1189_maximum_number_of_balloons":
        return ("balloon" * max(1, size // 7)) + "\n"
    if problem_id == "0290_word_pattern":
        pattern = token_string(max(1, size // 10), "abba")
        sentence = " ".join("dog" if ch in "ab" else "cat" for ch in pattern)
        return pattern + " " + sentence.replace(" ", "_") + "\n"
    if problem_id == "0705_design_hashset":
        lines = ["__init__"]
        for index in range(size):
            value = index % max(1, size // 2)
            if index % 5 == 0:
                lines.append(f"remove {value}")
            elif index % 3 == 0:
                lines.append(f"contains {value}")
            else:
                lines.append(f"add {value}")
        return "\n".join(lines) + "\n"
    if problem_id == "0706_design_hashmap":
        lines = ["__init__"]
        for index in range(size):
            key = index % max(1, size // 2)
            if index % 7 == 0:
                lines.append(f"remove {key}")
            elif index % 3 == 0:
                lines.append(f"get {key}")
            else:
                lines.append(f"put {key} {index}")
        return "\n".join(lines) + "\n"
    if problem_id == "0912_sort_an_array":
        return join(ints(size))
    if problem_id == "0347_top_k_frequent_elements":
        values = [index % 5 for index in range(size)]
        return "5 " + join(values)
    if problem_id == "0238_product_of_array_except_self":
        return join([0 if index % 100 == 0 else (index % 9) + 1 for index in range(size)])
    if problem_id == "0036_valid_sudoku":
        board = list("534678912672195348198342567859761423426853791713924856961537284287419635345286179")
        return "9 9 " + join(board)
    if problem_id == "0271_encode_and_decode_strings":
        return join(words(size))
    if problem_id == "0128_longest_consecutive_sequence":
        return join(list(range(size)))
    if problem_id == "0075_sort_colors":
        return join([index % 3 for index in range(size)])
    if problem_id == "0535_encode_and_decode_tinyurl":
        lines = ["__init__"]
        for index in range(size):
            url = f"https://leetcode.com/problems/problem{index % max(1, size // 2)}"
            lines.append(f"encode {url}")
            if index % 2 == 0:
                lines.append(f"decode http://tinyurl.com/{(index % max(1, size // 2)) + 1}")
        return "\n".join(lines) + "\n"
    if problem_id == "0554_brick_wall":
        rows = max(1, size)
        return f"{rows} 2 " + join([1, 1] * rows)
    if problem_id == "0122_best_time_to_buy_and_sell_stock_ii":
        return join([index % 100 for index in range(size)])
    if problem_id == "0560_subarray_sum_equals_k":
        return "10 " + join([1 if index % 2 == 0 else -1 for index in range(size)])
    if problem_id == "1930_unique_length_3_palindromic_subsequences":
        return token_string(size, "abcdef") + "\n"
    if problem_id == "1963_minimum_number_of_swaps_to_make_the_string_balanced":
        half = max(1, size // 2)
        return ("[" * half + "]" * half) + "\n"
    if problem_id == "2001_number_of_pairs_of_interchangeable_rectangles":
        rows = max(1, size)
        pairs = []
        for index in range(rows):
            pairs.extend([index + 1, (index + 1) * 2])
        return f"{rows} 2 " + join(pairs)
    if problem_id == "2002_maximum_product_of_the_length_of_two_palindromic_subsequences":
        return token_string(size, "ab") + "\n"
    if problem_id == "2017_grid_game":
        cols = max(1, size)
        row1 = list(range(1, cols + 1))
        row2 = list(range(cols, 0, -1))
        return f"2 {cols} " + join(row1 + row2)
    if problem_id == "0438_find_all_anagrams_in_a_string":
        return token_string(size, "abc") + " abc\n"
    if problem_id == "0028_find_the_index_of_the_first_occurrence_in_a_string":
        return token_string(size, "abc") + " cab\n"
    if problem_id == "0280_wiggle_sort":
        return join(ints(size))
    if problem_id == "0179_largest_number":
        return join([index % 10 for index in range(size)])
    if problem_id == "0523_continuous_subarray_sum":
        return "97 " + join([index % 50 for index in range(size)])
    if problem_id == "0838_push_dominoes":
        return token_string(size, "R.L") + "\n"
    if problem_id == "0187_repeated_dna_sequences":
        return token_string(max(20, size), "ACGT") + "\n"
    if problem_id == "0380_insert_delete_getrandom_o1":
        lines = ["__init__"]
        for index in range(size):
            value = index % max(1, size // 2)
            if index == 0:
                lines.append(f"insert {value}")
            elif index % 7 == 0:
                lines.append("getRandom")
            elif index % 5 == 0:
                lines.append(f"remove {value}")
            else:
                lines.append(f"insert {value}")
        return "\n".join(lines) + "\n"
    if problem_id == "1461_check_if_a_string_contains_all_binary_codes_of_size_k":
        return "5 " + token_string(max(32, size), "01") + "\n"
    if problem_id == "0304_range_sum_query_2d_immutable":
        rows = max(1, int(size**0.5))
        cols = max(1, size // rows)
        values = [(index * 7) % 23 for index in range(rows * cols)]
        query_count = max(1, min(100, size))
        lines = ["__init__ " + join_matrix(rows, cols, values).strip()]
        for index in range(query_count):
            row1 = (index * 3) % rows
            col1 = (index * 5) % cols
            row2 = min(rows - 1, row1 + rows // 2)
            col2 = min(cols - 1, col1 + cols // 2)
            lines.append(f"sumRegion {row1} {col1} {row2} {col2}")
        return "\n".join(lines) + "\n"
    if problem_id == "0665_non_decreasing_array":
        values = list(range(size))
        if size > 2:
            values[size // 2] = -1
        return join(values)
    if problem_id == "0041_first_missing_positive":
        return join([index + 2 for index in range(size)])
    if problem_id == "1822_sign_of_the_product_of_an_array":
        return join([(index % 5) + 1 for index in range(size)])
    if problem_id == "2215_find_the_difference_of_two_arrays":
        n1 = size
        n2 = size
        nums1 = list(range(size))
        nums2 = list(range(size // 2, size + size // 2))
        return f"{n1} {n2} " + join(nums1 + nums2)
    if problem_id == "1603_design_parking_system":
        capacity = max(1, size // 3)
        lines = [f"__init__ {capacity} {capacity} {capacity}"]
        for index in range(size):
            lines.append(f"addCar {(index % 3) + 1}")
        return "\n".join(lines) + "\n"
    if problem_id == "2348_number_of_zero_filled_subarrays":
        return join([0 if index % 3 else 1 for index in range(size)])
    if problem_id == "2405_optimal_partition_of_string":
        return token_string(size, "abcdefghijklmnopqrstuvwxyz") + "\n"
    if problem_id == "1396_design_underground_system":
        stations = ["Leyton", "Paradise", "Waterloo", "Cambridge"]
        lines = ["__init__"]
        trip_count = max(1, size // 3)
        for index in range(trip_count):
            start = stations[index % 2]
            end = stations[2 + (index % 2)]
            lines.append(f"checkIn {index} {start} {index * 3}")
            lines.append(f"checkOut {index} {end} {index * 3 + 10 + (index % 5)}")
            lines.append(f"getAverageTime {start} {end}")
        return "\n".join(lines) + "\n"
    if problem_id == "2483_minimum_penalty_for_a_shop":
        return token_string(size, "YN") + "\n"
    if problem_id == "0068_text_justification":
        max_width = 20
        return str(max_width) + " " + join(words(size))
    if problem_id == "2306_naming_a_company":
        return join([chr(97 + index % 26) + "idea" + str(index) for index in range(size)])
    raise ValueError(f"missing case generator for {problem_id}")
