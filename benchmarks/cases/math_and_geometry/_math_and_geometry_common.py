from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def square_values(size: int) -> list[int]:
    return [(row * size + col) % 997 for row in range(size) for col in range(size)]


def points(size: int) -> list[int]:
    values: list[int] = []
    for index in range(size):
        values.extend([index, index * 2])
    return values


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0168_excel_sheet_column_title":
        return f"{size}\n"
    if problem_id == "1572_matrix_diagonal_sum":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "0149_max_points_on_a_line":
        return f"{size} 2 " + join(points(size))
    if problem_id == "0048_rotate_image":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "0054_spiral_matrix":
        return f"{size} {size} " + join(square_values(size))
    if problem_id == "0073_set_matrix_zeroes":
        values = square_values(size)
        if values:
            values[0] = 0
        return f"{size} {size} " + join(values)
    if problem_id == "0202_happy_number":
        return join([index + 1 for index in range(size)])
    if problem_id == "0066_plus_one":
        return join([9 for _ in range(size)])
    if problem_id == "0263_ugly_number":
        return join([2 ** (index % 20) for index in range(size)])
    if problem_id == "1260_shift_2d_grid":
        return f"{size // 2} {size} {size} " + join(square_values(size))
    if problem_id == "0013_roman_to_integer":
        return ("M" * size) + "\n"
    if problem_id == "0012_integer_to_roman":
        return f"{size}\n"
    if problem_id == "0050_powx_n":
        return f"2.0 {size}\n"
    if problem_id == "0043_multiply_strings":
        value = "9" * size
        return f"{value} {value}\n"
    if problem_id == "2013_detect_squares":
        lines = ["__init__"]
        for index in range(size):
            lines.append(f"add 0 {index}")
            lines.append(f"add 1 {index}")
            if index > 0:
                lines.append(f"count 0 {index}")
        return "\n".join(lines) + "\n"
    if problem_id == "0006_zigzag_conversion":
        return "4 " + ("abcdefghijklmnopqrstuvwxyz" * ((size // 26) + 1))[:size] + "\n"
    raise ValueError(f"missing case generator for {problem_id}")
