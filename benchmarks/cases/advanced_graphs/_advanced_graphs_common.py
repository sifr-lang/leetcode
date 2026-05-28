from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def square_values(size: int) -> list[int]:
    return [(row * size + col) % (size * size) for row in range(size) for col in range(size)]


def chain_edges(size: int, one_based: bool = False, weighted: bool = False) -> list[int]:
    edges: list[int] = []
    offset = 1 if one_based else 0
    for index in range(max(0, size - 1)):
        edges.extend([index + offset, index + offset + 1])
        if weighted:
            edges.append((index % 17) + 1)
    return edges


def points(size: int) -> list[int]:
    values: list[int] = []
    for index in range(size):
        values.extend([(index * 37) % 10007, (index * 101) % 10009])
    return values


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "1631_path_with_minimum_effort":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "1584_min_cost_to_connect_all_points":
        return f"{size} 2 " + join(points(size))
    if problem_id == "0743_network_delay_time":
        edges = chain_edges(size, one_based=True, weighted=True)
        return f"{size} 1 {max(0, size - 1)} 3 " + join(edges)
    if problem_id == "1514_path_with_maximum_probability":
        edges = chain_edges(size)
        probabilities = [1.0 for _ in range(max(0, size - 1))]
        return f"{size} 0 {max(0, size - 1)} {max(0, size - 1)} 2 " + join(edges + probabilities)
    if problem_id == "0778_swim_in_rising_water":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "0269_alien_dictionary":
        return join(["abc" for _ in range(size)])
    raise ValueError(f"missing case generator for {problem_id}")
