from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def token_string(size: int, alphabet: str = "abcdefghijklmnopqrstuvwxyz") -> str:
    return "".join(alphabet[index % len(alphabet)] for index in range(size))


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def generate_input(problem_id: str, size: int) -> str:
    if problem_id == "0020_valid_parentheses":
        return ("()[]{}" * ((size // 6) + 1))[:size] + "\n"
    if problem_id == "0682_baseball_game":
        ops: list[str] = ["5", "2"]
        for index in range(max(0, size - 2)):
            if index % 11 == 0:
                ops.append("+")
            elif index % 7 == 0:
                ops.append("D")
            elif index % 5 == 0 and len(ops) > 2:
                ops.append("C")
            else:
                ops.append(str((index % 19) - 9))
        return join(ops[:size])
    if problem_id == "0225_implement_stack_using_queues":
        lines = ["__init__"]
        depth = 0
        for index in range(size):
            if depth == 0 or index % 4 in (0, 1):
                lines.append(f"push {index % 1000}")
                depth += 1
            elif index % 4 == 2:
                lines.append("top")
            else:
                lines.append("pop")
                depth -= 1
        lines.append("empty")
        return "\n".join(lines) + "\n"
    if problem_id == "0155_min_stack":
        lines = ["__init__"]
        depth = 0
        for index in range(size):
            if depth == 0 or index % 5 in (0, 1, 2):
                lines.append(f"push {(index * 37) % 1000 - 500}")
                depth += 1
            elif index % 5 == 3:
                lines.append("getMin")
            else:
                lines.append("top")
        return "\n".join(lines) + "\n"
    if problem_id == "0150_evaluate_reverse_polish_notation":
        tokens = ["1", "2", "+"]
        while len(tokens) + 2 <= size:
            tokens.append(str((len(tokens) % 9) + 1))
            tokens.append("+")
        return join(tokens)
    if problem_id == "2390_removing_stars_from_a_string":
        chars: list[str] = []
        depth = 0
        for index in range(size):
            if depth > 0 and index % 4 == 3:
                chars.append("*")
                depth -= 1
            else:
                chars.append(chr(97 + index % 26))
                depth += 1
        return "".join(chars) + "\n"
    if problem_id == "0946_validate_stack_sequences":
        pushed = list(range(size))
        popped = list(reversed(pushed))
        return f"{size} {size} " + join(pushed + popped)
    if problem_id == "0022_generate_parentheses":
        return str(size) + "\n"
    if problem_id == "0735_asteroid_collision":
        return join([((index % 11) + 1) * (1 if index % 3 else -1) for index in range(size)])
    if problem_id == "0739_daily_temperatures":
        return join([(index * 7) % 80 + 20 for index in range(size)])
    if problem_id == "0901_online_stock_span":
        lines = ["__init__"]
        for index in range(size):
            lines.append(f"next {(index * 17) % 200 + 1}")
        return "\n".join(lines) + "\n"
    if problem_id == "0853_car_fleet":
        target = size * 3 + 100
        positions = list(range(size))
        speeds = [(index % 9) + 1 for index in range(size)]
        return f"{target} {size} {size} " + join(positions + speeds)
    if problem_id == "0071_simplify_path":
        parts = ["a", ".", "b", "..", "c", "d"]
        path = "/" + "/".join(parts[index % len(parts)] for index in range(size))
        return path + "\n"
    if problem_id == "0394_decode_string":
        unit = "3[a2[b]]"
        return unit * max(1, size // len(unit)) + "\n"
    if problem_id == "0402_remove_k_digits":
        number = token_string(size, "9876543210")
        return str(max(1, size // 3)) + " " + number + "\n"
    if problem_id == "1209_remove_all_adjacent_duplicates_in_string_ii":
        k = 3
        text = token_string(size, "aabbccddeeff")
        return f"{k} {text}\n"
    if problem_id == "0456_132_pattern":
        return join([(index * 17) % 1000 for index in range(size)])
    if problem_id == "0895_maximum_frequency_stack":
        lines = ["__init__"]
        depth = 0
        for index in range(size):
            if depth == 0 or index % 5 != 4:
                lines.append(f"push {index % 17}")
                depth += 1
            else:
                lines.append("pop")
                depth -= 1
        return "\n".join(lines) + "\n"
    if problem_id == "0084_largest_rectangle_in_histogram":
        return join([(index * 13) % 100 + 1 for index in range(size)])
    raise ValueError(f"missing case generator for {problem_id}")
