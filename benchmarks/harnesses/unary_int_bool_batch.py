from __future__ import annotations

from typing import Any


def checksum(results: list[bool]) -> tuple[int, int]:
    true_count = 0
    checksum_value = 0
    for index, value in enumerate(results):
        if value:
            true_count += 1
            checksum_value += index + 1
    return true_count, checksum_value


def solve_expected(input_text: str, oracle: Any) -> str:
    values = [int(token) for token in input_text.split()]
    results = [bool(oracle(value)) for value in values]
    true_count, checksum_value = checksum(results)
    return f"{true_count} {checksum_value}\n"


def run_python(fixture_text: str, expected_text: str, oracle: Any, loops: int) -> str:
    values = [int(token) for token in fixture_text.split()]
    expected_count, expected_checksum = map(int, expected_text.split())
    results = [bool(oracle(value)) for value in values]
    true_count, checksum_value = checksum(results)
    if (true_count, checksum_value) != (expected_count, expected_checksum):
        raise SystemExit(f"wrong result: {true_count} {checksum_value}")
    aggregate = 0
    for _ in range(loops):
        for value in values:
            if oracle(value):
                aggregate += 1
    return f"OK {aggregate}"


def sifr_runner_body(function: str) -> str:
    return f"""
def _run_unary_int_bool_batch(fixture_path: str, expected_path: str, loops: int) -> None:
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
    expected_count: int = _parse_int(_nz_str(expected_tokens[0]))
    expected_checksum: int = _parse_int(_nz_str(expected_tokens[1]))
    values: list[int] = []
    for index in range(0, len(tokens)):
        values.append(_parse_int(_nz_str(tokens[index])))

    count: int = 0
    checksum_value: int = 0
    for index in range(0, len(values)):
        value: int = _parse_int(str(values[index]))
        if {function}(value):
            count = count + 1
            checksum_value = checksum_value + index + 1

    if count != expected_count or checksum_value != expected_checksum:
        print(\"wrong result: \" + str(count) + \" \" + str(checksum_value))
        exit(1)

    aggregate: int = 0
    for _loop in range(0, loops):
        for index in range(0, len(values)):
            value: int = _parse_int(str(values[index]))
            if {function}(value):
                aggregate = aggregate + 1
    print(\"OK \" + str(aggregate))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print(\"usage: runner <fixture> <expected> <loops>\")
        exit(2)
    _run_unary_int_bool_batch(_nz_str(args[1]), _nz_str(args[2]), _parse_int(_nz_str(args[3])))
""".strip()
