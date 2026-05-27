from __future__ import annotations


def fixture_stem(size: int) -> str:
    return f"n={size:07d}"


def join(values: list[object]) -> str:
    return " ".join(str(value) for value in values) + "\n"


def nums(size: int) -> list[int]:
    return [((index * 37) % 10007) + 1 for index in range(size)]


def generate_input(problem_id: str, size: int) -> str:
    values = nums(size)
    if problem_id == "1046_last_stone_weight":
        return join(values)
    if problem_id == "0215_kth_largest_element_in_an_array":
        return str(max(1, size // 3)) + " " + join(values)
    if problem_id == "0973_k_closest_points_to_origin":
        points: list[int] = []
        for index in range(size):
            points.extend([index % 997, (index * 7) % 997])
        return f"{max(1, size // 10)} {size} 2 " + join(points)
    if problem_id == "0621_task_scheduler":
        tasks = [chr(ord("A") + (index % 12)) for index in range(size)]
        return "2 " + join(tasks)
    if problem_id == "1834_single_threaded_cpu":
        tasks: list[int] = []
        for index in range(size):
            tasks.extend([index, (index * 11) % 97 + 1])
        return f"{size} 2 " + join(tasks)
    if problem_id == "1985_find_the_kth_largest_integer_in_the_array":
        words = [str((index * 7919) % 1000000007) for index in range(size)]
        return str(max(1, size // 2)) + " " + join(words)
    if problem_id == "0767_reorganize_string":
        return ("a" * size) + "\n"
    if problem_id == "1383_maximum_performance_of_a_team":
        speed = [((index * 17) % 1000) + 1 for index in range(size)]
        efficiency = [((index * 19) % 1000) + 1 for index in range(size)]
        k = max(1, min(size, size // 5))
        return f"{size} {k} " + join(speed + efficiency)
    if problem_id == "0502_ipo":
        profits = [((index * 13) % 1000) + 1 for index in range(size)]
        capital = [(index * 7) % max(1, size) for index in range(size)]
        return f"{max(1, size // 4)} 0 {size} " + join(profits + capital)
    if problem_id == "0703_kth_largest_element_in_a_stream":
        k = max(1, size // 10)
        initial = values[: max(1, size // 2)]
        lines = [f"__init__ {k} {len(initial)} " + " ".join(str(value) for value in initial)]
        for value in values[len(initial) :]:
            lines.append(f"add {value}")
        return "\n".join(lines) + "\n"
    if problem_id == "0355_design_twitter":
        lines = ["__init__"]
        for index in range(size):
            user = (index % 20) + 1
            lines.append(f"postTweet {user} {index + 1000}")
            if index % 5 == 0:
                lines.append(f"follow {user} {((user + 1) % 20) + 1}")
            if index % 7 == 0:
                lines.append(f"getNewsFeed {user}")
        return "\n".join(lines) + "\n"
    if problem_id == "1845_seat_reservation_manager":
        lines = [f"__init__ {size + 10}"]
        reserved: list[int] = []
        for index in range(size):
            lines.append("reserve")
            reserved.append(index + 1)
            if index % 4 == 0 and reserved:
                lines.append(f"unreserve {reserved.pop(0)}")
        return "\n".join(lines) + "\n"
    if problem_id == "0295_find_median_from_data_stream":
        lines = ["__init__"]
        for index, value in enumerate(values):
            lines.append(f"addNum {value}")
            if index % 3 == 0:
                lines.append("findMedian")
        return "\n".join(lines) + "\n"
    raise ValueError(f"missing case generator for {problem_id}")
