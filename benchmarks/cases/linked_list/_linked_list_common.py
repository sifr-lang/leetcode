from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def values(size: int) -> list[int]:
    return [(index * 17) % 1009 for index in range(size)]


def sorted_values(size: int) -> list[int]:
    return sorted(values(size))


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0206_reverse_linked_list":
        return join(values(size))
    if problem_id == "0021_merge_two_sorted_lists":
        left = sorted_values(size // 2)
        right = sorted_values(size - len(left))
        return f"{len(left)} {len(right)} " + join(left + right)
    if problem_id == "0234_palindrome_linked_list":
        half = values(size // 2)
        return join(half + list(reversed(half)))
    if problem_id == "0203_remove_linked_list_elements":
        data = values(size)
        remove = data[len(data) // 3] if data else 0
        return str(remove) + " " + join(data)
    if problem_id == "0083_remove_duplicates_from_sorted_list":
        return join([index // 3 for index in range(size)])
    if problem_id == "0876_middle_of_the_linked_list":
        return join(values(size))
    if problem_id == "2130_maximum_twin_sum_of_a_linked_list":
        data = values(size if size % 2 == 0 else size + 1)
        return join(data)
    if problem_id == "0019_remove_nth_node_from_end_of_list":
        return str(max(1, size // 2)) + " " + join(values(size))
    if problem_id == "1721_swapping_nodes_in_a_linked_list":
        return str(max(1, size // 3)) + " " + join(values(size))
    if problem_id == "0002_add_two_numbers":
        left = [index % 10 for index in range(size // 2)]
        right = [(index * 3) % 10 for index in range(size - len(left))]
        return f"{len(left)} {len(right)} " + join(left + right)
    if problem_id == "0141_linked_list_cycle":
        return join(values(size))
    if problem_id == "0287_find_the_duplicate_number":
        data = list(range(1, size + 1))
        data.append(size // 2 if size > 1 else 1)
        return join(data)
    if problem_id == "0024_swap_nodes_in_pairs":
        return join(values(size))
    if problem_id == "0148_sort_list":
        return join(list(reversed(values(size))))
    if problem_id == "0086_partition_list":
        return str(500) + " " + join(values(size))
    if problem_id == "0061_rotate_list":
        return str(size // 3) + " " + join(values(size))
    if problem_id == "0147_insertion_sort_list":
        return join(list(reversed(values(size))))
    if problem_id == "0025_reverse_nodes_in_k_group":
        return str(3) + " " + join(values(size))
    if problem_id == "0707_design_linked_list":
        lines = ["__init__"]
        for index in range(size):
            lines.append(f"addAtTail {index}")
            if index % 5 == 0:
                lines.append(f"get {index // 2}")
        return "\n".join(lines) + "\n"
    if problem_id == "1472_design_browser_history":
        lines = ["__init__ home"]
        for index in range(size):
            lines.append(f"visit page{index}")
            if index % 4 == 0:
                lines.append("back 1")
                lines.append("forward 1")
        return "\n".join(lines) + "\n"
    if problem_id == "0622_design_circular_queue":
        capacity = max(8, size // 4)
        lines = [f"__init__ {capacity}"]
        for index in range(size):
            lines.append(f"enQueue {index}")
            if index % 3 == 0:
                lines.append("Rear")
            if index % 5 == 0:
                lines.append("deQueue")
        lines.append("isFull")
        lines.append("isEmpty")
        return "\n".join(lines) + "\n"
    if problem_id == "0146_lru_cache":
        capacity = max(8, size // 10)
        lines = [f"__init__ {capacity}"]
        for index in range(size):
            lines.append(f"put {index % (capacity * 2)} {index}")
            if index % 2 == 0:
                lines.append(f"get {index % (capacity * 2)}")
        return "\n".join(lines) + "\n"
    raise ValueError(f"missing case generator for {problem_id}")
