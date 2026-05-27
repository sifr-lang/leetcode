from __future__ import annotations

from typing import Any


def solve_expected(input_text: str, oracle: Any, runner: dict[str, Any]) -> str:
    values = parse_input(input_text, runner)
    call = runner["call"]
    expected = runner["expected"]
    if call["mode"] == "single":
        result = call_single(oracle, values, call)
        if expected["type"] == "list_int":
            return format_int_list(result)
    if call["mode"] == "batch":
        results = call_batch(oracle, values, call)
        if expected["type"] == "bool_batch_index_checksum":
            true_count, checksum = bool_batch_checksum(results)
            return f"{true_count} {checksum}\n"
    raise RuntimeError(f"unsupported runner expected shape: {expected['type']}")


def run_python(fixture_text: str, expected_text: str, oracle: Any, loops: int, runner: dict[str, Any]) -> str:
    values = parse_input(fixture_text, runner)
    call = runner["call"]
    expected = runner["expected"]
    checksum = runner["checksum"]
    if call["mode"] == "single":
        result = call_single(oracle, values, call)
        assert_expected_single(result, expected_text, expected)
        return f"OK {single_checksum(oracle, values, call, checksum, loops)}"
    if call["mode"] == "batch":
        results = call_batch(oracle, values, call)
        assert_expected_batch(results, expected_text, expected)
        return f"OK {batch_checksum(oracle, values, call, checksum, loops)}"
    raise RuntimeError(f"unsupported runner call mode: {call['mode']}")


def parse_input(input_text: str, runner: dict[str, Any]) -> dict[str, Any]:
    tokens = input_text.split()
    values: dict[str, Any] = {}
    for binding in runner["input"]["bindings"]:
        values[binding["name"]] = parse_binding(tokens, binding)
    return values


def parse_binding(tokens: list[str], binding: dict[str, Any]) -> Any:
    if binding["type"] == "int" and binding["source"] == "token":
        return int(tokens[int(binding["index"])])
    if binding["type"] == "list[int]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        end = binding.get("end")
        selected = tokens[start : int(end) if end is not None else None]
        return [int(token) for token in selected]
    raise RuntimeError(f"unsupported input binding: {binding}")


def call_single(oracle: Any, values: dict[str, Any], call: dict[str, Any]) -> Any:
    return oracle(*(values[name] for name in call["args"]))


def call_batch(oracle: Any, values: dict[str, Any], call: dict[str, Any]) -> list[Any]:
    return [oracle(value) for value in values[call["items"]]]


def assert_expected_single(result: Any, expected_text: str, expected: dict[str, Any]) -> None:
    if expected["type"] != "list_int":
        raise RuntimeError(f"unsupported single expected shape: {expected['type']}")
    expected_values = [int(token) for token in expected_text.split()]
    if result != expected_values:
        raise SystemExit(f"wrong result: {result}, expected {expected_values}")


def assert_expected_batch(results: list[Any], expected_text: str, expected: dict[str, Any]) -> None:
    if expected["type"] != "bool_batch_index_checksum":
        raise RuntimeError(f"unsupported batch expected shape: {expected['type']}")
    expected_count, expected_checksum = map(int, expected_text.split())
    true_count, checksum = bool_batch_checksum(results)
    if (true_count, checksum) != (expected_count, expected_checksum):
        raise SystemExit(f"wrong result: {true_count} {checksum}")


def single_checksum(oracle: Any, values: dict[str, Any], call: dict[str, Any], checksum: dict[str, Any], loops: int) -> int:
    if checksum["type"] != "list_len":
        raise RuntimeError(f"unsupported single checksum: {checksum['type']}")
    total = 0
    for _ in range(loops):
        total += len(call_single(oracle, values, call))
    return total


def batch_checksum(oracle: Any, values: dict[str, Any], call: dict[str, Any], checksum: dict[str, Any], loops: int) -> int:
    if checksum["type"] != "true_count":
        raise RuntimeError(f"unsupported batch checksum: {checksum['type']}")
    total = 0
    for _ in range(loops):
        for value in values[call["items"]]:
            if oracle(value):
                total += 1
    return total


def bool_batch_checksum(results: list[Any]) -> tuple[int, int]:
    true_count = 0
    checksum = 0
    for index, value in enumerate(results):
        if bool(value):
            true_count += 1
            checksum += index + 1
    return true_count, checksum


def format_int_list(result: Any) -> str:
    if not isinstance(result, list):
        raise RuntimeError(f"expected list[int] result, got {result!r}")
    return " ".join(str(int(value)) for value in result) + "\n"


def sifr_runner_body(function: str, runner: dict[str, Any]) -> str:
    call = runner["call"]
    if call["mode"] == "single":
        return single_sifr_runner_body(function, runner)
    if call["mode"] == "batch":
        return batch_sifr_runner_body(function, runner)
    raise RuntimeError(f"unsupported runner call mode: {call['mode']}")


def single_sifr_runner_body(function: str, runner: dict[str, Any]) -> str:
    expected = runner["expected"]
    checksum = runner["checksum"]
    if expected["type"] != "list_int" or checksum["type"] != "list_len":
        raise RuntimeError("single Sifr runner currently supports list_int expected output and list_len checksum")
    bindings = "\n".join(sifr_binding_code(binding) for binding in runner["input"]["bindings"])
    call = sifr_call(function, runner["call"]["args"])
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _read_required(fixture_path)
    expected_text: str = _read_required(expected_path)
    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
{indent(bindings, 4)}
    expected_values: list[int] = []
    for index in range(0, len(expected_tokens)):
        expected_values.append(_parse_int(_nz_str(expected_tokens[index])))

    result: list[int] = {call}
    if str(result) != _format_int_list(expected_values):
        print("wrong result: " + str(result))
        exit(1)

    checksum: int = 0
    for _loop in range(0, loops):
        loop_result: list[int] = {call}
        checksum = checksum + len(loop_result)
    print("OK " + str(checksum))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_nz_str(args[1]), _nz_str(args[2]), _parse_int(_nz_str(args[3])))
""".strip()


def batch_sifr_runner_body(function: str, runner: dict[str, Any]) -> str:
    expected = runner["expected"]
    checksum = runner["checksum"]
    call = runner["call"]
    if expected["type"] != "bool_batch_index_checksum" or checksum["type"] != "true_count":
        raise RuntimeError("batch Sifr runner currently supports bool_batch_index_checksum expected output and true_count checksum")
    bindings = "\n".join(sifr_binding_code(binding) for binding in runner["input"]["bindings"])
    value = call.get("item_name", "value")
    function_call = f"{function}({value})"
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _read_required(fixture_path)
    expected_text: str = _read_required(expected_path)
    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
{indent(bindings, 4)}
    expected_count: int = _parse_int(_nz_str(expected_tokens[0]))
    expected_checksum: int = _parse_int(_nz_str(expected_tokens[1]))

    count: int = 0
    checksum_value: int = 0
    for index in range(0, len({call["items"]})):
        {value}: int = _parse_int(str({call["items"]}[index]))
        if {function_call}:
            count = count + 1
            checksum_value = checksum_value + index + 1

    if count != expected_count or checksum_value != expected_checksum:
        print("wrong result: " + str(count) + " " + str(checksum_value))
        exit(1)

    aggregate: int = 0
    for _loop in range(0, loops):
        for index in range(0, len({call["items"]})):
            {value}: int = _parse_int(str({call["items"]}[index]))
            if {function_call}:
                aggregate = aggregate + 1
    print("OK " + str(aggregate))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_nz_str(args[1]), _nz_str(args[2]), _parse_int(_nz_str(args[3])))
""".strip()


def sifr_binding_code(binding: dict[str, Any]) -> str:
    name = binding["name"]
    if binding["type"] == "int" and binding["source"] == "token":
        return f"{name}: int = _parse_int(_nz_str(tokens[{int(binding['index'])}]))"
    if binding["type"] == "list[int]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        end = binding.get("end")
        upper = f"{int(end)}" if end is not None else "len(tokens)"
        return "\n".join(
            [
                f"{name}: list[int] = []",
                f"for index in range({start}, {upper}):",
                f"    {name}.append(_parse_int(_nz_str(tokens[index])))",
            ]
        )
    raise RuntimeError(f"unsupported Sifr input binding: {binding}")


def sifr_call(function: str, args: list[str]) -> str:
    return f"{function}({', '.join(args)})"


def indent(text: str, spaces: int) -> str:
    prefix = " " * spaces
    return "\n".join(prefix + line if line else line for line in text.splitlines())
