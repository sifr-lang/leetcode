from __future__ import annotations

from typing import Any


def solve_expected(input_text: str, oracle: Any) -> str:
    tokens = input_text.split()
    target = int(tokens[0])
    nums = [int(token) for token in tokens[1:]]
    result = oracle(nums, target)
    if not isinstance(result, list) or len(result) != 2:
        raise RuntimeError(f"unexpected two_sum oracle result: {result}")
    return f"{result[0]} {result[1]}\n"


def run_python(fixture_text: str, expected_text: str, oracle: Any, loops: int) -> str:
    tokens = fixture_text.split()
    target = int(tokens[0])
    nums = [int(token) for token in tokens[1:]]
    expected = [int(token) for token in expected_text.split()]
    result = oracle(nums, target)
    if result != expected:
        raise SystemExit(f"wrong result: {result}, expected {expected}")
    checksum = 0
    for _ in range(loops):
        checksum += len(oracle(nums, target))
    return f"OK {checksum}"


def sifr_runner_body(function: str) -> str:
    return f"""
def _run_two_sum(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = ""
    expected_text: str = ""
    try:
        loaded_fixture: str = read_text(fixture_path)
        loaded_expected: str = read_text(expected_path)
        fixture_text = loaded_fixture
        expected_text = loaded_expected
    except IOError as e:
        print(\"fixture read failed: \" + e.message)
        exit(1)

    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
    target: int = _parse_int(_nz_str(tokens[0]))
    expected_left: int = _parse_int(_nz_str(expected_tokens[0]))
    expected_right: int = _parse_int(_nz_str(expected_tokens[1]))
    nums: list[int] = []
    for index in range(1, len(tokens)):
        nums.append(_parse_int(_nz_str(tokens[index])))

    result: list[int] = {function}(nums, target)
    if str(result) != \"[\" + str(expected_left) + \", \" + str(expected_right) + \"]\":
        print(\"wrong result: \" + str(result))
        exit(1)

    checksum: int = 0
    for _loop in range(0, loops):
        loop_result: list[int] = {function}(nums, target)
        checksum = checksum + len(loop_result)
    print(\"OK \" + str(checksum))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print(\"usage: runner <fixture> <expected> <loops>\")
        exit(2)
    _run_two_sum(_nz_str(args[1]), _nz_str(args[2]), _parse_int(_nz_str(args[3])))
""".strip()
