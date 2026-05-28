from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def grid_values(size: int, fill: object) -> list[object]:
    return [fill for _ in range(size * size)]


def checker_grid(size: int, land: object, water: object) -> list[object]:
    return [land if (row + col) % 2 == 0 else water for row in range(size) for col in range(size)]


def chain_edges(size: int) -> list[int]:
    edges: list[int] = []
    for index in range(max(0, size - 1)):
        edges.extend([index, index + 1])
    return edges


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0463_island_perimeter":
        return f"{size} {size} " + join(checker_grid(size, 1, 0))
    if problem_id == "0953_verifying_an_alien_dictionary":
        words = [f"a{index:05d}" for index in range(size)]
        return "abcdefghijklmnopqrstuvwxyz " + join(words)
    if problem_id == "0200_number_of_islands":
        return f"{size} {size} " + join(checker_grid(size, "1", "0"))
    if problem_id == "0695_max_area_of_island":
        return f"{size} {size} " + join(checker_grid(size, 1, 0))
    if problem_id == "1905_count_sub_islands":
        return f"1 {size} " + join([1 for _ in range(size)] + [1 for _ in range(size)])
    if problem_id == "0417_pacific_atlantic_water_flow":
        heights = [(row + col) % 100 for row in range(size) for col in range(size)]
        return f"{size} {size} " + join(heights)
    if problem_id == "0130_surrounded_regions":
        return f"{size} {size} " + join(checker_grid(size, "O", "X"))
    if problem_id == "1466_reorder_routes_to_make_all_paths_lead_to_the_city_zero":
        return f"{size} {max(0, size - 1)} 2 " + join(chain_edges(size))
    if problem_id == "0994_rotting_oranges":
        values = [1 for _ in range(size * size)]
        if values:
            values[0] = 2
        return f"{size} {size} " + join(values)
    if problem_id == "0286_walls_and_gates":
        values = [2147483647 for _ in range(size * size)]
        if values:
            values[0] = 0
        return f"{size} {size} " + join(values)
    if problem_id == "0909_snakes_and_ladders":
        return f"{size} {size} " + join(grid_values(size, -1))
    if problem_id == "0752_open_the_lock":
        deadends = [f"{index % 10000:04d}" for index in range(1, size + 1)]
        return "9999 " + join(deadends)
    if problem_id == "0802_find_eventual_safe_states":
        graph = [(index + 1) % size for index in range(size)]
        return f"{size} 1 " + join(graph)
    if problem_id == "0207_course_schedule":
        return f"{size} {max(0, size - 1)} 2 " + join(chain_edges(size))
    if problem_id == "0210_course_schedule_ii":
        return f"{size} {max(0, size - 1)} 2 " + join(chain_edges(size))
    if problem_id == "1958_check_if_move_is_legal":
        board = ["." for _ in range(64)]
        board[27] = "B"
        board[28] = "W"
        board[29] = "W"
        return "4 6 B 8 8 " + join(board)
    if problem_id == "1091_shortest_path_in_binary_matrix":
        return f"{size} {size} " + join(grid_values(size, 0))
    if problem_id == "0684_redundant_connection":
        edges = chain_edges(size)
        if size > 2:
            edges.extend([0, size - 1])
        return f"{max(0, len(edges) // 2)} 2 " + join(edges)
    if problem_id == "0323_number_of_connected_components_in_an_undirected_graph":
        return f"{size} {max(0, size - 1)} 2 " + join(chain_edges(size))
    if problem_id == "0261_graph_valid_tree":
        return f"{size} {max(0, size - 1)} 2 " + join(chain_edges(size))
    if problem_id == "0721_accounts_merge":
        values: list[str] = []
        for index in range(size):
            values.extend([f"User{index}", f"user{index}@mail.com", f"user{index}b@mail.com"])
        return f"{size} 3 " + join(values)
    if problem_id == "1254_number_of_closed_islands":
        values = [1 for _ in range(size * size)]
        for row in range(1, max(1, size - 1)):
            for col in range(1, max(1, size - 1)):
                if (row + col) % 2 == 0:
                    values[row * size + col] = 0
        return f"{size} {size} " + join(values)
    if problem_id == "1020_number_of_enclaves":
        values = [0 for _ in range(size * size)]
        for row in range(1, max(1, size - 1)):
            for col in range(1, max(1, size - 1)):
                if (row + col) % 2 == 0:
                    values[row * size + col] = 1
        return f"{size} {size} " + join(values)
    if problem_id == "0785_is_graph_bipartite":
        graph = [1 if index % 2 == 0 else 0 for index in range(size)]
        return f"{size} 1 " + join(graph)
    if problem_id == "2101_detonate_the_maximum_bombs":
        values: list[int] = []
        for index in range(size):
            values.extend([index, 0, 2])
        return f"{size} 3 " + join(values)
    if problem_id == "0127_word_ladder":
        words = ["hot", "dot", "dog", "lot", "log", "cog"]
        while len(words) < size:
            words.append(f"w{len(words):03d}")
        return "hit cog " + join(words)
    raise ValueError(f"missing case generator for {problem_id}")
