from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0016_3sum_closest":
        nums = int_list(size, -1000, 1000)
        return tokens([37, *nums])
    if problem_id == "0023_merge_k_sorted_lists":
        width = 5
        lists = []
        for group in range(max(1, size // width)):
            start = group * width
            lists.append([start + offset * 2 for offset in range(width)])
        return segmented_lists(lists)
    if problem_id == "0044_wildcard_matching":
        s = ("abcde" * ((size // 5) + 1))[:size]
        return tokens([s, "a*e"])
    if problem_id == "0092_reverse_linked_list_ii":
        left = max(1, size // 4)
        right = max(left, (size * 3) // 4)
        return tokens([size, left, right, *range(1, size + 1)])
    if problem_id == "0119_pascal_triangle_ii":
        return tokens([size])
    if problem_id == "0133_clone_graph":
        rows = []
        for index in range(size):
            left = ((index - 1) % size) + 1
            right = ((index + 1) % size) + 1
            rows.append([left, right])
        return segmented_lists(rows)
    if problem_id == "0135_candy":
        return tokens([(i * 17) % 101 for i in range(size)])
    if problem_id == "0138_copy_list_with_random_pointer":
        pairs = [(i % 97, -1 if i % 5 == 0 else (i * 7) % size) for i in range(size)]
        return tuple_rows(pairs)
    if problem_id == "0143_reorder_list":
        return tokens([size, *range(1, size + 1)])
    if problem_id == "0151_reverse_words_in_a_string":
        return " ".join(f"w{i % 997}" for i in range(size))
    if problem_id == "0160_intersection_of_two_linked_lists":
        a = list(range(1, size + 1))
        b = list(range(size + 1, (2 * size) + 1))
        return tokens([len(a), len(b), *a, *b])
    if problem_id == "0201_bitwise_and_of_numbers_range":
        return tokens([size * 16, size * 16 + 15])
    if problem_id == "0207_course_schedule":
        edges = [(i + 1, i) for i in range(max(0, size - 1))]
        return tokens([size, len(edges), *flatten(edges)])
    if problem_id == "0231_power_of_two":
        return tokens([1 << (size.bit_length() - 1)])
    if problem_id == "0232_implement_queue_using_stacks":
        lines = []
        for i in range(size):
            lines.append(f"push {i}")
            if i % 3 == 0:
                lines.append("peek")
            if i % 4 == 0:
                lines.append("pop")
        lines.append("empty")
        return "\n".join(lines)
    if problem_id in {
        "0235_lowest_common_ancestor_of_a_binary_search_tree",
        "0236_lowest_common_ancestor_of_a_binary_tree",
    }:
        values = list(range(1, size + 1))
        return tokens([size, values[size // 4], values[(size * 3) // 4], *values])
    if problem_id == "0241_different_ways_to_add_parentheses":
        parts = []
        for i in range(size):
            parts.append(str((i % 5) + 1))
            if i + 1 < size:
                parts.append(["+", "-", "*"][i % 3])
        return "".join(parts)
    if problem_id == "0274_H_index":
        return tokens([(i * 13) % (size + 20) for i in range(size)])
    if problem_id == "0278_first_bad_version":
        return tokens([size])
    if problem_id == "0297_serialize_and_deserialize_binary_tree":
        values = list(range(1, size + 1))
        serialized = ",".join(["N"] + [str(value) for value in values[: min(size, 20)]])
        return "\n".join([tokens(["serialize", size, *values]), f"deserialize {serialized}"])
    if problem_id == "0323_number_of_connected_components_in_an_undirected_graph":
        edges = [(i, i + 1) for i in range(0, max(0, size - 1), 2)]
        return tokens([size, len(edges), *flatten(edges)])
    if problem_id == "0332_reconstruct_itinerary":
        tickets = [("JFK", f"A{i}") for i in range(size)]
        tickets.extend((f"A{i}", f"A{i + 1}") for i in range(size - 1))
        return tuple_rows(tickets)
    if problem_id == "0334_increasing_triplet_subsequence":
        return tokens([(size - i) if i < size // 2 else i for i in range(size)])
    if problem_id in {"0349_intersection_of_two_arrays", "0350_intersection_of_two_arrays_ii"}:
        a = [(i * 7) % (size // 2 + 3) for i in range(size)]
        b = [(i * 11) % (size // 2 + 3) for i in range(size)]
        return tokens([len(a), len(b), *a, *b])
    if problem_id == "0383_ransom_note":
        ransom = letters(size)
        return tokens([ransom, ransom + letters(size)])
    if problem_id == "0442_find_all_duplicates_in_an_array":
        values = [(i % max(1, size // 2)) + 1 for i in range(size)]
        return tokens(values)
    if problem_id == "0452_minimum_number_of_arrows_to_burst_balloons":
        rows = [[i * 3, i * 3 + 2] for i in range(size)]
        return matrix(rows)
    if problem_id == "0459_repeated_substring_pattern":
        return tokens(["ab" * max(1, size // 2)])
    if problem_id == "0509_fibonacci_number":
        return tokens([size])
    if problem_id == "0525_contiguous_array":
        return tokens([i % 2 for i in range(size)])
    if problem_id == "0684_redundant_connection":
        edges = [(i, i + 1) for i in range(1, size)]
        edges.append((1, size))
        return tuple_rows(edges)
    if problem_id == "0729_my_calendar_i":
        lines = []
        for i in range(size):
            start = i * 2
            lines.append(f"book {start} {start + 1}")
        return "\n".join(lines)
    if problem_id == "0745_prefix_and_suffix_search":
        words = [f"word{i}" for i in range(size)]
        lines = [tokens(["__init__", len(words), *words])]
        for i in range(size):
            word = words[i]
            lines.append(tokens(["f", word[:2], word[-1:]]))
        return "\n".join(lines)
    if problem_id == "0787_cheapest_flights_within_k_stops":
        flights = [[i, i + 1, (i % 9) + 1] for i in range(size - 1)]
        return tokens([size, 0, size - 1, size, len(flights), 3, *flatten(flights)])
    if problem_id == "0791_custom_sort_string":
        return tokens(["abcdefghijklmnopqrstuvwxyz", letters(size)])
    if problem_id == "0862_shortest_subarray_with_sum_at_least_k":
        return tokens([max(1, size // 3), *[1 if i % 7 else -1 for i in range(size)]])
    if problem_id == "0894_all_possible_full_binary_trees":
        return tokens([size])
    if problem_id == "0896_monotonic_array":
        return tokens(range(size))
    if problem_id == "0930_binary_subarrays_with_sum":
        return tokens([size // 3, *[i % 2 for i in range(size)]])
    if problem_id == "0931_minimum_falling_path_sum":
        return matrix([[((r * 17 + c * 11) % 31) - 15 for c in range(size)] for r in range(size)])
    if problem_id == "0948_bag_of_tokens":
        return tokens([size * 2, *[(i % 50) + 1 for i in range(size)]])
    if problem_id == "0997_find_the_town_judge":
        trust = [[i, size] for i in range(1, size)]
        return tokens([size, len(trust), 2, *flatten(trust)])
    if problem_id == "1074_number_of_submatrices_that_sum_to_target":
        rows = [[(r + c) % 3 - 1 for c in range(size)] for r in range(size)]
        return tokens([0, size, size, *flatten(rows)])
    if problem_id == "1203_sort_items_by_groups_respecting_dependencies":
        successors = [[] for _ in range(size)]
        indegree = [0] * size
        return tokens([size, len(indegree), *segmented_tokens(successors), *indegree])
    if problem_id == "1345_jump_game_iv":
        return tokens([(i * 17) % max(1, size // 4) for i in range(size)])
    if problem_id == "1397_find_all_good_strings":
        return tokens([size, "a" * size, "z" * size, "zz"])
    if problem_id == "1462_course_schedule_iv":
        queries = [[0, min(size - 1, i)] for i in range(size)]
        return tokens([size, 0, 2, len(queries), 2, *flatten(queries)])
    if problem_id == "1464_maximum_product_of_two_elements_in_an_array":
        return tokens([(i % 97) + 1 for i in range(size)])
    if problem_id == "1466_reorder_routes_to_make_all_paths_lead_to_the_city_zero":
        edges = [(0, i) for i in range(1, size)]
        return tokens([size, len(edges), *flatten(edges)])
    if problem_id == "1475_final_prices_with_a_special_discount_in_a_shop":
        return tokens([(i * 13) % 101 + 1 for i in range(size)])
    if problem_id == "1481_least_number_of_unique_integers_after_k_removals":
        return tokens([size // 3, *[(i * 7) % max(1, size // 4) for i in range(size)]])
    if problem_id == "1489_find_critical_and_pseudo_critical_edges_in_minimum_spanning_tree":
        edges = [[i, i + 1, (i % 7) + 1] for i in range(size - 1)]
        edges.extend([0, i, (i % 11) + 5] for i in range(2, size))
        return tokens([size, len(edges), 3, *flatten(edges)])
    if problem_id == "1582_special_positions_in_a_binary_matrix":
        rows = [[1 if r == c else 0 for c in range(size)] for r in range(size)]
        return matrix(rows)
    if problem_id == "1609_even_odd_tree":
        values = [2 * i + 1 for i in range(size)]
        return tokens([size, *values])
    if problem_id == "1642_furthest_building_you_can_reach":
        heights = [i + (i % 5) for i in range(size)]
        return tokens([size, max(1, size // 20), *heights])
    if problem_id == "1669_merge_in_between_linked_lists":
        list1 = list(range(1, size + 1))
        list2 = list(range(size + 1, size + 1 + max(1, size // 5)))
        a = size // 3
        b = min(size - 1, a + max(1, size // 10))
        return tokens([len(list1), len(list2), a, b, *list1, *list2])
    if problem_id == "1700_number_of_students_unable_to_eat_lunch":
        students = [i % 2 for i in range(size)]
        sandwiches = [(i + 1) % 2 for i in range(size)]
        return tokens([len(students), len(sandwiches), *students, *sandwiches])
    if problem_id == "1750_minimum_length_of_string_after_deleting_similar_ends":
        return tokens(["a" * (size // 2) + "b" * max(1, size // 2)])
    if problem_id == "1800_maximum_ascending_subarray_sum":
        return tokens([(i % 100) + 1 for i in range(size)])
    if problem_id == "2092_find_all_people_with_secret":
        meetings = [[i, i + 1, i + 1] for i in range(size - 1)]
        return tokens([size, 1, len(meetings), 3, *flatten(meetings)])
    if problem_id == "2235_add_two_integers":
        return tokens([size, size + 1])
    if problem_id == "2402_meeting_rooms_iii":
        meetings = [[i * 2, i * 2 + 1] for i in range(size)]
        rooms = max(1, size // 10)
        return tokens([rooms, len(meetings), 2, *flatten(meetings)])
    if problem_id == "2482_difference_between_ones_and_zeros_in_row_and_column":
        rows = [[(r + c) % 2 for c in range(size)] for r in range(size)]
        return matrix(rows)
    if problem_id == "2554_maximum_number_of_integers_to_choose_from_a_range_i":
        banned = list(range(2, size + 2, 2))
        return tokens([size * 2, size * 10, *banned])
    if problem_id == "2709_greatest_common_divisor_traversal":
        return tokens([6 * (i + 2) for i in range(size)])
    if problem_id == "2864_maximum_odd_binary_number":
        return tokens(["1" * max(1, size // 3) + "0" * max(1, size - size // 3)])
    if problem_id == "2971_find_polygon_with_the_largest_perimeter":
        return tokens([(i % 97) + 3 for i in range(size)])
    raise RuntimeError(f"missing additional problem generator: {problem_id}")


def tokens(values) -> str:
    return " ".join(str(value) for value in values)


def flatten(rows):
    return [value for row in rows for value in row]


def int_list(size: int, low: int, high: int) -> list[int]:
    span = high - low + 1
    return [low + ((i * 37 + 11) % span) for i in range(size)]


def letters(size: int) -> str:
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    return "".join(alphabet[(i * 7 + 3) % len(alphabet)] for i in range(size))


def matrix(rows: list[list[int]]) -> str:
    row_count = len(rows)
    col_count = len(rows[0]) if rows else 0
    return tokens([row_count, col_count, *flatten(rows)])


def tuple_rows(rows) -> str:
    return tokens([len(rows), *flatten(rows)])


def segmented_lists(rows: list[list[int]]) -> str:
    return tokens([len(rows), *segmented_tokens(rows)])


def segmented_tokens(rows: list[list[int]]) -> list[int]:
    output: list[int] = []
    for row in rows:
        output.append(len(row))
        output.extend(row)
    return output
