from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def sorted_values(size: int) -> list[int]:
    return list(range(size))


def rotated_values(size: int) -> list[int]:
    values = sorted_values(size)
    pivot = max(1, size // 3)
    return values[pivot:] + values[:pivot]


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0704_binary_search":
        return str(max(0, size - 1)) + " " + join(sorted_values(size))
    if problem_id == "0035_search_insert_position":
        return str(size // 2) + " " + join([index * 2 for index in range(size)])
    if problem_id == "0374_guess_number_higher_or_lower":
        return str(max(6, size)) + "\n"
    if problem_id == "0441_arranging_coins":
        return str(size * size) + "\n"
    if problem_id == "0977_squares_of_a_sorted_array":
        half = size // 2
        return join(list(range(-half, size - half)))
    if problem_id == "0367_valid_perfect_square":
        return str(size * size) + "\n"
    if problem_id == "0069_sqrtx":
        return str(size * size + size) + "\n"
    if problem_id == "0540_single_element_in_a_sorted_array":
        pair_count = max(1, size // 2)
        values: list[int] = []
        for index in range(pair_count):
            values.extend([index, index])
        values.insert(len(values) // 2, pair_count + 7)
        values.sort()
        return join(values)
    if problem_id == "1011_capacity_to_ship_packages_within_d_days":
        days = max(1, min(size, size // 10))
        weights = [(index % 50) + 1 for index in range(size)]
        return str(days) + " " + join(weights)
    if problem_id == "0162_find_peak_element":
        left = list(range(size // 2))
        right = list(range(size - len(left), 0, -1))
        return join(left + right)
    if problem_id == "2300_successful_pairs_of_spells_and_potions":
        spells = [(index % 1000) + 1 for index in range(size)]
        potions = [((index * 7) % 1000) + 1 for index in range(size)]
        success = 250000
        return f"{success} {len(spells)} {len(potions)} " + join(spells + potions)
    if problem_id == "0074_search_a_2d_matrix":
        rows = max(1, int(size ** 0.5))
        cols = max(1, size // rows)
        values = list(range(rows * cols))
        target = values[len(values) // 2]
        return f"{target} {rows} {cols} " + join(values)
    if problem_id == "0875_koko_eating_bananas":
        piles = [(index % 1000) + 1 for index in range(size)]
        h = max(size, size * 2)
        return str(h) + " " + join(piles)
    if problem_id == "2616_minimize_the_maximum_difference_of_pairs":
        p = max(1, size // 4)
        nums = [(index * 11) % (size * 3 + 1) for index in range(size)]
        return str(p) + " " + join(nums)
    if problem_id == "0153_find_minimum_in_rotated_sorted_array":
        return join(rotated_values(size))
    if problem_id in {"0033_search_in_rotated_sorted_array", "0081_search_in_rotated_sorted_array_ii"}:
        values = rotated_values(size)
        if problem_id == "0081_search_in_rotated_sorted_array_ii":
            values = [value // 2 for value in values]
            target = values[len(values) // 2]
        else:
            target = size // 2
        return str(target) + " " + join(values)
    if problem_id == "0981_time_based_key_value_store":
        lines = ["__init__"]
        timestamp = 1
        for index in range(size):
            value = "bar" if index % 2 == 0 else "bar2"
            lines.append(f"set foo {value} {timestamp}")
            lines.append(f"get foo {timestamp}")
            timestamp += 1
        return "\n".join(lines) + "\n"
    if problem_id == "0034_find_first_and_last_position_of_element_in_sorted_array":
        target = size // 3
        values = [index // 3 for index in range(size)]
        return str(target) + " " + join(values)
    if problem_id == "0410_split_array_largest_sum":
        m = max(1, min(size, size // 10))
        nums = [(index % 100) + 1 for index in range(size)]
        return str(m) + " " + join(nums)
    if problem_id == "0004_median_of_two_sorted_arrays":
        n1 = max(0, size // 2)
        n2 = max(1, size - n1)
        nums1 = list(range(0, n1 * 2, 2))
        nums2 = list(range(1, n2 * 2, 2))
        return f"{n1} {n2} " + join(nums1 + nums2)
    raise ValueError(f"missing case generator for {problem_id}")
