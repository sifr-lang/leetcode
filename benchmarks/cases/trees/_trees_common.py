from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def sorted_values(size: int) -> list[int]:
    return list(range(size))


def preorder(values: list[int]) -> list[int]:
    if not values:
        return []
    mid = len(values) // 2
    return [values[mid]] + preorder(values[:mid]) + preorder(values[mid + 1 :])


def postorder(values: list[int]) -> list[int]:
    if not values:
        return []
    mid = len(values) // 2
    return postorder(values[:mid]) + postorder(values[mid + 1 :]) + [values[mid]]


def two_tree_input(size: int) -> str:
    left = sorted_values(size)
    right = sorted_values(size)
    return f"{len(left)} {len(right)} " + join(left + right)


def generate_input(problem_id: str, size: int) -> str:
    values = sorted_values(size)
    if problem_id in {
        "0094_binary_tree_inorder_traversal",
        "0144_binary_tree_preorder_traversal",
        "0145_binary_tree_postorder_traversal",
        "0226_invert_binary_tree",
        "0104_maximum_depth_of_binary_tree",
        "0543_diameter_of_binary_tree",
        "0110_balanced_binary_tree",
        "0102_binary_tree_level_order_traversal",
        "0199_binary_tree_right_side_view",
        "0783_minimum_distance_between_bst_nodes",
        "0101_symmetric_tree",
        "0103_binary_tree_zigzag_level_order_traversal",
        "0662_maximum_width_of_binary_tree",
        "1448_count_good_nodes_in_binary_tree",
        "0098_validate_binary_search_tree",
        "0513_find_bottom_left_tree_value",
        "0124_binary_tree_maximum_path_sum",
        "0606_construct_string_from_binary_tree",
    }:
        return join(values)
    if problem_id in {"0100_same_tree", "0572_subtree_of_another_tree", "0617_merge_two_binary_trees"}:
        return two_tree_input(size)
    if problem_id == "0108_convert_sorted_array_to_binary_search_tree":
        return join(values)
    if problem_id == "0112_path_sum":
        target = values[size // 2] if values else 0
        return str(target) + " " + join(values)
    if problem_id == "0701_insert_into_a_binary_search_tree":
        return str(size + 7) + " " + join(values)
    if problem_id == "0450_delete_node_in_a_bst":
        return str(size // 2) + " " + join(values)
    if problem_id == "0230_kth_smallest_element_in_a_bst":
        return str(max(1, size // 2)) + " " + join(values)
    if problem_id in {"0105_construct_binary_tree_from_preorder_and_inorder_traversal"}:
        pre = preorder(values)
        return f"{len(pre)} {len(values)} " + join(pre + values)
    if problem_id in {"0106_construct_binary_tree_from_inorder_and_postorder_traversal"}:
        post = postorder(values)
        return f"{len(values)} {len(post)} " + join(values + post)
    if problem_id == "0669_trim_a_binary_search_tree":
        low = size // 4
        high = max(low, (size * 3) // 4)
        return f"{low} {high} " + join(values)
    raise ValueError(f"missing case generator for {problem_id}")
