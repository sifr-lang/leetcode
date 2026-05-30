from __future__ import annotations

from typing import Any


def compiler(*tags: str, parity: str = "equivalent") -> dict[str, Any]:
    return {
        "benchmark_status": "complete",
        "parity_status": parity,
        "primary_slowness_owner": "compiler",
        "slowness_tags": list(tags),
    }


def leetcode(*tags: str) -> dict[str, Any]:
    return {
        "benchmark_status": "complete",
        "parity_status": "known_divergent",
        "primary_slowness_owner": "leetcode_sifr_code",
        "slowness_tags": list(tags),
    }


def leetcode_fixed(*tags: str) -> dict[str, Any]:
    return {
        "benchmark_status": "complete",
        "parity_status": "equivalent",
        "primary_slowness_owner": "leetcode_sifr_code",
        "slowness_tags": list(tags),
    }


def mixed(*tags: str, parity: str = "unknown") -> dict[str, Any]:
    return {
        "benchmark_status": "complete",
        "parity_status": parity,
        "primary_slowness_owner": "mixed",
        "slowness_tags": list(tags),
    }


def noise(*tags: str) -> dict[str, Any]:
    return {
        "benchmark_status": "complete",
        "parity_status": "equivalent",
        "primary_slowness_owner": "noise",
        "slowness_tags": list(tags),
    }


SLOWNESS_SEED: dict[str, dict[str, Any]] = {
    "1985_find_the_kth_largest_integer_in_the_array": leetcode_fixed("heap_parity", "string_indexing"),
    "0211_design_add_and_search_words_data_structure": mixed("trie_parity", "recursive_search", "dict_iteration", parity="equivalent"),
    "0212_word_search_ii": mixed("trie_parity", "field_clone", "dict_clone", "recursive_search", parity="equivalent"),
    "0973_k_closest_points_to_origin": leetcode_fixed("heap_parity"),
    "0208_implement_trie_prefix_tree": noise("trie_parity", "small_residual_gap"),
    "0567_permutation_in_string": mixed("string_indexing", "list_clone"),
    "2130_maximum_twin_sum_of_a_linked_list": compiler("list_node_clone", "optional_clone"),
    "0876_middle_of_the_linked_list": compiler("list_node_clone", "optional_clone"),
    "0083_remove_duplicates_from_sorted_list": compiler("list_node_clone", "optional_clone"),
    "1721_swapping_nodes_in_a_linked_list": compiler("list_node_clone", "optional_clone"),
    "0019_remove_nth_node_from_end_of_list": compiler("list_node_clone", "optional_clone"),
    "0203_remove_linked_list_elements": compiler("list_node_clone", "optional_clone"),
    "0086_partition_list": compiler("list_node_clone", "optional_clone"),
    "0061_rotate_list": compiler("list_node_clone", "optional_clone"),
    "0025_reverse_nodes_in_k_group": compiler("list_node_clone", "optional_clone"),
    "0002_add_two_numbers": compiler("list_node_clone", "optional_clone"),
    "0021_merge_two_sorted_lists": compiler("list_node_clone", "optional_clone"),
    "0148_sort_list": compiler("list_node_clone", "optional_clone"),
    "0269_alien_dictionary": noise("small_residual_gap"),
    "0049_group_anagrams": compiler("dict_clone", "list_clone", parity="unknown"),
    "2306_naming_a_company": leetcode_fixed("algorithm_parity", "set_grouping_parity"),
    "0003_longest_substring_without_repeating_characters": compiler("string_indexing", "set_clone"),
    "0706_design_hashmap": mixed("stateful_object", "field_clone"),
    "1888_minimum_number_of_flips_to_make_the_binary_string_alternating": compiler("string_indexing", "string_allocation"),
    "0036_valid_sudoku": compiler("set_clone", "safe_indexing"),
    "0014_longest_common_prefix": compiler("string_indexing"),
    "1768_merge_strings_alternately": compiler("string_indexing", "string_allocation"),
    "1930_unique_length_3_palindromic_subsequences": compiler("string_indexing", "set_clone"),
    "0187_repeated_dna_sequences": compiler("substring_allocation", "set_clone"),
    "0402_remove_k_digits": compiler("string_indexing", "list_clone", parity="unknown"),
    "1209_remove_all_adjacent_duplicates_in_string_ii": compiler("string_allocation", "stack_clone"),
    "1631_path_with_minimum_effort": leetcode_fixed("heap_parity", "matrix_clone"),
    "0763_partition_labels": compiler("string_indexing", "dict_clone"),
    "0680_valid_palindrome_ii": compiler("string_indexing"),
    "0221_maximal_square": compiler("matrix_clone"),
    "1461_check_if_a_string_contains_all_binary_codes_of_size_k": compiler("substring_allocation", "set_clone"),
    "0355_design_twitter": mixed("stateful_object", "field_clone", "heap_parity", parity="equivalent"),
    "0424_longest_repeating_character_replacement": compiler("string_indexing", "dict_clone"),
    "0139_word_break": compiler("substring_allocation", "set_clone"),
    "1456_maximum_number_of_vowels_in_a_substring_of_given_length": compiler("string_indexing"),
    "0721_accounts_merge": mixed("dict_clone", "list_clone", "set_clone"),
    "0703_kth_largest_element_in_a_stream": leetcode_fixed("heap_parity", "stateful_object"),
    "0200_number_of_islands": compiler("matrix_clone", "set_clone"),
    "0149_max_points_on_a_line": compiler("dict_clone", "tuple_key_clone"),
    "0146_lru_cache": mixed("stateful_object", "field_clone", "lru_parity", parity="equivalent"),
    "2001_number_of_pairs_of_interchangeable_rectangles": compiler("dict_clone"),
    "0130_surrounded_regions": compiler("matrix_clone"),
    "0058_length_of_last_word": compiler("string_indexing"),
    "0895_maximum_frequency_stack": mixed("stateful_object", "field_clone"),
    "0392_is_subsequence": compiler("string_indexing"),
    "2013_detect_squares": mixed("stateful_object", "dict_clone"),
    "0205_isomorphic_strings": compiler("string_indexing", "dict_clone"),
    "0778_swim_in_rising_water": leetcode_fixed("heap_parity", "matrix_clone"),
    "0015_3sum": leetcode_fixed("algorithm_parity", "sort_two_pointer"),
    "0067_add_binary": compiler("string_indexing", "string_allocation"),
    "1189_maximum_number_of_balloons": compiler("dict_clone", "string_iteration"),
    "0125_valid_palindrome": compiler("string_indexing"),
    "0929_unique_email_addresses": compiler("string_allocation", "set_clone", parity="unknown"),
    "0344_reverse_string": compiler("list_clone", "string_indexing"),
    "0102_binary_tree_level_order_traversal": compiler("tree_clone", "optional_clone"),
    "0647_palindromic_substrings": compiler("string_indexing"),
    "0005_longest_palindromic_substring": compiler("string_indexing", "substring_allocation"),
    "0981_time_based_key_value_store": mixed("stateful_object", "field_clone", "binary_search"),
    "0572_subtree_of_another_tree": compiler("tree_clone", "optional_clone"),
    "0234_palindrome_linked_list": {**compiler("list_node_clone", "optional_clone"), "benchmark_status": "partial"},
    "2405_optimal_partition_of_string": compiler("string_indexing", "set_clone"),
    "0100_same_tree": compiler("tree_clone", "optional_clone"),
    "0072_edit_distance": noise("string_indexing"),
    "0054_spiral_matrix": compiler("matrix_clone"),
    "0020_valid_parentheses": noise("list_clone", "dict_clone"),
    "1834_single_threaded_cpu": leetcode_fixed("heap_parity"),
    "0189_rotate_array": compiler("list_clone"),
    "0682_baseball_game": noise("stack_clone", "string_parse"),
    "0606_construct_string_from_binary_tree": compiler("tree_clone", "string_allocation"),
    "0064_minimum_path_sum": noise("matrix_clone"),
    "0752_open_the_lock": mixed("string_indexing", "set_clone", "queue_clone"),
    "0179_largest_number": mixed("string_allocation", "algorithm_parity_unknown"),
    "0295_find_median_from_data_stream": mixed("heap_parity", "field_clone", "stateful_object", parity="equivalent"),
    "0094_binary_tree_inorder_traversal": compiler("tree_clone", "optional_clone"),
    "0380_insert_delete_getrandom_o1": mixed("stateful_object", "field_clone", "array_map_parity", parity="equivalent"),
    "0104_maximum_depth_of_binary_tree": compiler("tree_clone", "optional_clone"),
    "0199_binary_tree_right_side_view": compiler("tree_clone", "list_clone"),
    "0013_roman_to_integer": compiler("string_indexing", "dict_clone"),
    "0496_next_greater_element_i": leetcode_fixed("algorithm_parity", "stack_index_map"),
    "0239_sliding_window_maximum": leetcode_fixed("algorithm_parity", "monotonic_queue"),
    "1046_last_stone_weight": leetcode_fixed("heap_parity"),
}

FAILED_SEED: dict[str, dict[str, Any]] = {
    "0234_palindrome_linked_list": {"benchmark_status": "partial", "slowness_tags": ["optional_type", "list_node_clone"]},
}


def seed_metadata(problem_id: str) -> dict[str, Any] | None:
    if problem_id in SLOWNESS_SEED:
        return dict(SLOWNESS_SEED[problem_id])
    if problem_id in FAILED_SEED:
        seed = dict(FAILED_SEED[problem_id])
        seed.setdefault("parity_status", "unknown")
        seed.setdefault("primary_slowness_owner", "compiler")
        return seed
    return None
