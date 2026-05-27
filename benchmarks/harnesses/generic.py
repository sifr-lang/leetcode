from __future__ import annotations

import re
from typing import Any


SIFR_PRELUDE = """
from sifr.io import read_text
from sifr.sys import argv, exit


def _bench_nz_str(own value: str | None) -> str:
    if value is None:
        return ""
    return value


def _bench_parse_int(value: str) -> int:
    try:
        parsed: int = int(value)
        return parsed
    except ParseError:
        return 0


def _bench_read_required(path: str) -> str:
    try:
        loaded: str = read_text(path)
        return loaded
    except IOError as e:
        print("fixture read failed: " + e.message)
        exit(1)
    return ""


def _bench_format_int_list(values: list[int]) -> str:
    text: str = "["
    for index in range(0, len(values)):
        if index > 0:
            text = text + ", "
        text = text + str(_bench_parse_int(str(values[index])))
    return text + "]"


def _build_list_node(tokens: list[str], start: int, end: int) -> ListNode | None:
    head: ListNode | None = None
    for index in range(end - 1, start - 1, -1):
        head = ListNode(_bench_parse_int(_bench_nz_str(tokens[index])), head)
    return head


def _expect_list_node(own node: ListNode | None) -> ListNode:
    if node is None:
        return ListNode(0, None)
    return node


def _build_balanced_tree(values: list[int], left: int, right: int) -> TreeNode | None:
    if left > right:
        return None
    mid: int = (left + right) // 2
    value: int | None = values[mid]
    resolved: int = 0
    if value is None:
        resolved = 0
    else:
        resolved = value
    return TreeNode(resolved, _build_balanced_tree(values, left, mid - 1), _build_balanced_tree(values, mid + 1, right))
""".strip()


def solve_expected(input_text: str, oracle: Any, runner: dict[str, Any]) -> str:
    if runner["call"]["mode"] == "object_ops":
        result_count, checksum = run_object_ops(input_text, oracle, runner)
        return f"{result_count} {checksum}\n"
    values = parse_input(input_text, runner)
    call = runner["call"]
    expected = runner["expected"]
    if call["mode"] == "single":
        result = call_single(oracle, values, call)
        return format_expected(result, expected)
    if call["mode"] == "mutates_single":
        result = values[call["mutated_arg"]]
        call_single(oracle, values, call)
        return format_expected(result, expected)
    if call["mode"] == "batch":
        results = call_batch(oracle, values, call)
        if expected["type"] == "bool_batch_index_checksum":
            true_count, checksum = bool_batch_checksum(results)
            return f"{true_count} {checksum}\n"
    raise RuntimeError(f"unsupported runner expected shape: {expected['type']}")


def run_python(fixture_text: str, expected_text: str, oracle: Any, loops: int, runner: dict[str, Any]) -> str:
    if runner["call"]["mode"] == "object_ops":
        expected_result_count, expected_checksum = map(int, expected_text.split())
        result_count, checksum = run_object_ops(fixture_text, oracle, runner)
        if (result_count, checksum) != (expected_result_count, expected_checksum):
            raise SystemExit(f"wrong result: {result_count} {checksum}")
        total = 0
        for _ in range(loops):
            total += run_object_ops(fixture_text, oracle, runner)[1]
        return f"OK {total}"
    call = runner["call"]
    expected = runner["expected"]
    checksum = runner["checksum"]
    if call["mode"] == "single":
        values = parse_input(fixture_text, runner)
        result = call_single(oracle, values, call)
        assert_expected_single(result, expected_text, expected)
        if fresh_input_each_call(runner):
            total = 0
            for _ in range(loops):
                fresh_values = parse_input(fixture_text, runner)
                total += result_checksum(call_single(oracle, fresh_values, call), expected)
            return f"OK {total}"
        return f"OK {single_checksum(oracle, values, call, expected, loops)}"
    if call["mode"] == "mutates_single":
        values = parse_input(fixture_text, runner)
        call_single(oracle, values, call)
        assert_expected_single(values[call["mutated_arg"]], expected_text, expected)
        total = 0
        for _ in range(loops):
            fresh_values = parse_input(fixture_text, runner)
            call_single(oracle, fresh_values, call)
            total += result_checksum(fresh_values[call["mutated_arg"]], expected)
        return f"OK {total}"
    if call["mode"] == "batch":
        values = parse_input(fixture_text, runner)
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
    if binding["type"] == "str" and binding["source"] == "token":
        return tokens[int(binding["index"])]
    if binding["type"] == "list[int]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        start += sum(int(tokens[int(index)]) for index in binding.get("start_after_count_indices", []))
        end = binding.get("end")
        if "count_index" in binding:
            end = start + int(tokens[int(binding["count_index"])])
        selected = tokens[start : int(end) if end is not None else None]
        return [int(token) for token in selected]
    if binding["type"] == "list[str]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        start += sum(int(tokens[int(index)]) for index in binding.get("start_after_count_indices", []))
        end = binding.get("end")
        if "count_index" in binding:
            end = start + int(tokens[int(binding["count_index"])])
        return tokens[start : int(end) if end is not None else None]
    if binding["type"] == "matrix[int]" and binding["source"] == "matrix_tokens":
        rows = int(tokens[int(binding["rows_index"])])
        cols = int(tokens[int(binding["cols_index"])])
        index = int(binding["start"])
        matrix = []
        for _ in range(rows):
            row = [int(token) for token in tokens[index : index + cols]]
            matrix.append(row)
            index += cols
        return matrix
    if binding["type"] == "matrix[str]" and binding["source"] == "matrix_tokens":
        rows = int(tokens[int(binding["rows_index"])])
        cols = int(tokens[int(binding["cols_index"])])
        index = int(binding["start"])
        matrix = []
        for _ in range(rows):
            matrix.append(tokens[index : index + cols])
            index += cols
        return matrix
    if binding["type"] == "list_node[int]" and binding["source"] == "tokens":
        from helpers.list_node import ListNode

        values = parse_binding(tokens, {**binding, "type": "list[int]"})
        head = None
        for value in reversed(values):
            head = ListNode(value, head)
        return head
    if binding["type"] == "balanced_tree[int]" and binding["source"] == "tokens":
        from helpers.tree_node import TreeNode

        values = parse_binding(tokens, {**binding, "type": "list[int]"})

        def build(left: int, right: int) -> Any:
            if left > right:
                return None
            mid = (left + right) // 2
            return TreeNode(values[mid], build(left, mid - 1), build(mid + 1, right))

        return build(0, len(values) - 1)
    raise RuntimeError(f"unsupported input binding: {binding}")


def fresh_input_each_call(runner: dict[str, Any]) -> bool:
    return any(binding["type"] == "list_node[int]" for binding in runner["input"]["bindings"])


def call_single(oracle: Any, values: dict[str, Any], call: dict[str, Any]) -> Any:
    return oracle(*(values[name] for name in call["args"]))


def call_batch(oracle: Any, values: dict[str, Any], call: dict[str, Any]) -> list[Any]:
    return [oracle(value) for value in values[call["items"]]]


def assert_expected_single(result: Any, expected_text: str, expected: dict[str, Any]) -> None:
    actual = format_expected(result, expected).strip()
    expected_value = expected_text.strip()
    if actual != expected_value:
        raise SystemExit(f"wrong result: {actual}, expected {expected_value}")


def assert_expected_batch(results: list[Any], expected_text: str, expected: dict[str, Any]) -> None:
    if expected["type"] != "bool_batch_index_checksum":
        raise RuntimeError(f"unsupported batch expected shape: {expected['type']}")
    expected_count, expected_checksum = map(int, expected_text.split())
    true_count, checksum = bool_batch_checksum(results)
    if (true_count, checksum) != (expected_count, expected_checksum):
        raise SystemExit(f"wrong result: {true_count} {checksum}")


def single_checksum(oracle: Any, values: dict[str, Any], call: dict[str, Any], expected: dict[str, Any], loops: int) -> int:
    total = 0
    for _ in range(loops):
        total += result_checksum(call_single(oracle, values, call), expected)
    return total


def result_checksum(result: Any, expected: dict[str, Any]) -> int:
    expected_type = expected["type"]
    if expected_type == "int":
        return int(result)
    if expected_type == "bool":
        return 1 if result else 0
    if expected_type in ("list_int", "list_str", "list_list_int", "list_list_str"):
        return len(result)
    if expected_type == "str":
        return len(str(result))
    raise RuntimeError(f"unsupported checksum result shape: {expected_type}")


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


def format_expected(result: Any, expected: dict[str, Any]) -> str:
    expected_type = expected["type"]
    if expected_type == "int":
        return f"{int(result)}\n"
    if expected_type == "bool":
        return f"{1 if result else 0}\n"
    if expected_type == "list_int":
        return f"{result}\n"
    if expected_type == "str":
        return f"{result}\n"
    if expected_type in ("list_str", "list_list_str"):
        return f"{len(result)}\n"
    if expected_type == "list_list_int":
        return f"{len(result)}\n"
    raise RuntimeError(f"unsupported expected shape: {expected_type}")


def run_object_ops(input_text: str, constructor: Any, runner: dict[str, Any]) -> tuple[int, int]:
    lines = [line for line in input_text.splitlines() if line.strip()]
    call = runner["call"]
    constructor_args = []
    start_line = 0
    if lines and lines[0].split()[0] == "__init__":
        constructor_args = parse_object_args(lines[0].split()[1:], call.get("constructor_args", []))
        start_line = 1
    obj = constructor(*constructor_args)
    result_count = 0
    checksum = 0
    query_index = 0
    for line in lines[start_line:]:
        parts = line.split()
        method = parts[0]
        method_spec = call.get("methods", {}).get(method)
        if method_spec is None:
            continue
        result = getattr(obj, method)(*parse_object_args(parts[1:], method_spec.get("args", [])))
        if result is not None:
            query_index += 1
            result_count += 1
            checksum += query_index * object_result_checksum(result, method_spec.get("result", "int"))
    return result_count, checksum


def parse_object_args(tokens: list[str], specs: list[dict[str, Any] | str]) -> list[Any]:
    args = []
    cursor = 0
    for spec in specs:
        value, cursor = parse_object_arg(tokens, cursor, normalize_arg_spec(spec))
        args.append(value)
    return args


def normalize_arg_spec(spec: dict[str, Any] | str) -> dict[str, Any]:
    if isinstance(spec, str):
        return {"type": spec}
    return spec


def parse_object_arg(tokens: list[str], cursor: int, spec: dict[str, Any]) -> tuple[Any, int]:
    arg_type = spec["type"]
    if arg_type == "int":
        return int(tokens[cursor]), cursor + 1
    if arg_type == "str":
        return tokens[cursor], cursor + 1
    if arg_type == "list[int]":
        count = int(tokens[cursor])
        start = cursor + 1
        end = start + count
        return [int(token) for token in tokens[start:end]], end
    if arg_type == "matrix[int]":
        rows = int(tokens[cursor])
        cols = int(tokens[cursor + 1])
        index = cursor + 2
        matrix = []
        for _ in range(rows):
            matrix.append([int(token) for token in tokens[index : index + cols]])
            index += cols
        return matrix, index
    raise RuntimeError(f"unsupported object argument type: {arg_type}")


def object_result_checksum(result: Any, result_type: str) -> int:
    if result_type == "bool":
        return 1 if result else 0
    if result_type == "int":
        return int(result)
    if result_type == "float":
        return 1 if float(result) > 0.0 else 0
    if result_type == "str":
        return len(result)
    raise RuntimeError(f"unsupported object result type: {result_type}")


def sifr_runner_body(function: str, runner: dict[str, Any], owned_args: set[str] | None = None) -> str:
    call = runner["call"]
    if call["mode"] == "single":
        return single_sifr_runner_body(function, runner, owned_args or set())
    if call["mode"] == "mutates_single":
        return mutates_single_sifr_runner_body(function, runner)
    if call["mode"] == "batch":
        return batch_sifr_runner_body(function, runner)
    if call["mode"] == "object_ops":
        return object_ops_sifr_runner_body(function, call)
    raise RuntimeError(f"unsupported runner call mode: {call['mode']}")


def render_sifr_runner(algorithm: str, function: str, runner: dict[str, Any]) -> str:
    body = sifr_runner_body(function, runner, owned_args_for_function(algorithm, function))
    return f"{algorithm.rstrip()}\n\n{missing_helper_imports(algorithm)}{SIFR_PRELUDE}\n\n\n{body}".rstrip() + "\n"


def owned_args_for_function(algorithm: str, function: str) -> set[str]:
    match = re.search(rf"def\s+{re.escape(function)}\s*\(([^)]*)\)", algorithm)
    if match is None:
        return set()
    owned = set()
    for raw_param in match.group(1).split(","):
        param = raw_param.strip()
        if "own" not in param.split():
            continue
        before_type = param.split(":", 1)[0]
        name = before_type.split()[-1]
        owned.add(name)
    return owned


def missing_helper_imports(algorithm: str) -> str:
    imports = []
    if "ListNode" not in algorithm:
        imports.append("from helpers.list_node import ListNode")
    if "TreeNode" not in algorithm:
        imports.append("from helpers.tree_node import TreeNode")
    if not imports:
        return ""
    return "\n".join(imports) + "\n"


def single_sifr_runner_body(function: str, runner: dict[str, Any], owned_args: set[str]) -> str:
    bindings = render_sifr_bindings(runner["input"]["bindings"])
    call = sifr_call(function, runner["call"]["args"], runner["input"]["bindings"], owned_args)
    result_type = sifr_result_type(runner["expected"]["type"])
    expected_check = sifr_expected_check(runner["expected"]["type"], "result")
    checksum_expr = sifr_checksum_expr(runner["expected"]["type"], "loop_result")
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _bench_read_required(fixture_path)
    expected_text: str = _bench_read_required(expected_path)
    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
{indent(bindings, 4)}
    result: {result_type} = {call}
{indent(expected_check, 4)}
        print("wrong result: " + str(result))
        exit(1)

    checksum: int = 0
    for _loop in range(0, loops):
        loop_result: {result_type} = {call}
        checksum = checksum + {checksum_expr}
    print("OK " + str(checksum))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_bench_nz_str(args[1]), _bench_nz_str(args[2]), _bench_parse_int(_bench_nz_str(args[3])))
""".strip()


def mutates_single_sifr_runner_body(function: str, runner: dict[str, Any]) -> str:
    bindings = render_sifr_bindings(runner["input"]["bindings"])
    call = sifr_call(function, runner["call"]["args"], runner["input"]["bindings"])
    mutated_arg = runner["call"]["mutated_arg"]
    expected_type = runner["expected"]["type"]
    expected_check = sifr_expected_check(expected_type, mutated_arg)
    checksum_expr = sifr_checksum_expr(expected_type, "loop_result")
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _bench_read_required(fixture_path)
    expected_text: str = _bench_read_required(expected_path)
    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
{indent(bindings, 4)}
    {call}
{indent(expected_check, 4)}
        print("wrong result: " + str({mutated_arg}))
        exit(1)

    checksum: int = 0
    for _loop in range(0, loops):
        tokens = fixture_text.split()
{indent(bindings, 8)}
        {call}
        loop_result = {mutated_arg}
        checksum = checksum + {checksum_expr}
    print("OK " + str(checksum))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_bench_nz_str(args[1]), _bench_nz_str(args[2]), _bench_parse_int(_bench_nz_str(args[3])))
""".strip()


def batch_sifr_runner_body(function: str, runner: dict[str, Any]) -> str:
    expected = runner["expected"]
    checksum = runner["checksum"]
    call = runner["call"]
    if expected["type"] != "bool_batch_index_checksum" or checksum["type"] != "true_count":
        raise RuntimeError("batch Sifr runner currently supports bool_batch_index_checksum expected output and true_count checksum")
    bindings = render_sifr_bindings(runner["input"]["bindings"])
    value = call.get("item_name", "value")
    function_call = f"{function}({value})"
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _bench_read_required(fixture_path)
    expected_text: str = _bench_read_required(expected_path)
    tokens: list[str] = fixture_text.split()
    expected_tokens: list[str] = expected_text.split()
{indent(bindings, 4)}
    expected_count: int = _bench_parse_int(_bench_nz_str(expected_tokens[0]))
    expected_checksum: int = _bench_parse_int(_bench_nz_str(expected_tokens[1]))

    count: int = 0
    checksum_value: int = 0
    for index in range(0, len({call["items"]})):
        {value}: int = _bench_parse_int(str({call["items"]}[index]))
        if {function_call}:
            count = count + 1
            checksum_value = checksum_value + index + 1

    if count != expected_count or checksum_value != expected_checksum:
        print("wrong result: " + str(count) + " " + str(checksum_value))
        exit(1)

    aggregate: int = 0
    for _loop in range(0, loops):
        for index in range(0, len({call["items"]})):
            {value}: int = _bench_parse_int(str({call["items"]}[index]))
            if {function_call}:
                aggregate = aggregate + 1
    print("OK " + str(aggregate))


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_bench_nz_str(args[1]), _bench_nz_str(args[2]), _bench_parse_int(_bench_nz_str(args[3])))
""".strip()


def object_ops_sifr_runner_body(class_name: str, call: dict[str, Any]) -> str:
    constructor_lines, constructor_args = sifr_object_constructor_args(call.get("constructor_args", []))
    method_branches = indent(
        "\n".join(
            sifr_object_method_branch(index, method, method_spec)
            for index, (method, method_spec) in enumerate(call.get("methods", {}).items())
        ),
        8,
    )
    return f"""
def _run_benchmark(fixture_path: str, expected_path: str, loops: int) -> None:
    fixture_text: str = _bench_read_required(fixture_path)
    expected_text: str = _bench_read_required(expected_path)
    expected_tokens: list[str] = expected_text.split()
    expected_count: int = _bench_parse_int(_bench_nz_str(expected_tokens[0]))
    expected_checksum: int = _bench_parse_int(_bench_nz_str(expected_tokens[1]))

    count: int = _run_object_ops(fixture_text, expected_count, expected_checksum, True)
    aggregate: int = 0
    for _loop in range(0, loops):
        aggregate = aggregate + _run_object_ops(fixture_text, expected_count, expected_checksum, False)
    print("OK " + str(aggregate))


def _run_object_ops(fixture_text: str, expected_count: int, expected_checksum: int, validate: bool) -> int:
    lines: list[str] = fixture_text.split("\\n")
    init_parts: list[str] = []
    if len(lines) > 0:
        init_parts = _bench_nz_str(lines[0]).split()
{indent(constructor_lines, 4)}
    obj = {class_name}({", ".join(constructor_args)})
    result_count: int = 0
    checksum_value: int = 0
    query_index: int = 0
    for line_index in range(1, len(lines)):
        line: str = _bench_nz_str(lines[line_index])
        parts: list[str] = line.split()
        if len(parts) < 1:
            continue
        method: str = _bench_nz_str(parts[0])
{method_branches}
    if validate and (result_count != expected_count or checksum_value != expected_checksum):
        print("wrong result: " + str(result_count) + " " + str(checksum_value))
        exit(1)
    return checksum_value


def main() -> None:
    args: list[str] = argv()
    if len(args) < 4:
        print("usage: runner <fixture> <expected> <loops>")
        exit(2)
    _run_benchmark(_bench_nz_str(args[1]), _bench_nz_str(args[2]), _bench_parse_int(_bench_nz_str(args[3])))
""".strip()


def sifr_object_constructor_args(arg_specs: list[dict[str, Any] | str]) -> tuple[str, list[str]]:
    lines = []
    arg_names = []
    cursor = "1"
    for index, spec in enumerate(normalize_arg_spec(spec) for spec in arg_specs):
        name = f"init_arg_{index}"
        arg_names.append(name)
        rendered, cursor = sifr_object_arg_binding(name, "init_parts", cursor, spec)
        lines.append(rendered)
    return "\n".join(lines), arg_names


def sifr_object_arg_binding(name: str, parts_name: str, cursor: str, spec: dict[str, Any]) -> tuple[str, str]:
    arg_type = spec["type"]
    if arg_type == "int":
        return f"{name}: int = _bench_parse_int(_bench_nz_str({parts_name}[{cursor}]))", f"{cursor} + 1"
    if arg_type == "str":
        return f"{name}: str = _bench_nz_str({parts_name}[{cursor}])", f"{cursor} + 1"
    if arg_type == "list[int]":
        count_name = f"{name}_count"
        index_name = f"{name}_index"
        next_cursor = f"{cursor} + 1 + {count_name}"
        return (
            "\n".join(
                [
                    f"{count_name}: int = _bench_parse_int(_bench_nz_str({parts_name}[{cursor}]))",
                    f"{name}: list[int] = []",
                    f"for {index_name} in range(0, {count_name}):",
                    f"    {name}.append(_bench_parse_int(_bench_nz_str({parts_name}[{cursor} + 1 + {index_name}])))",
                ]
            ),
            next_cursor,
        )
    if arg_type == "matrix[int]":
        rows_name = f"{name}_rows"
        cols_name = f"{name}_cols"
        index_name = f"{name}_index"
        row_index_name = f"{name}_row_index"
        col_index_name = f"{name}_col_index"
        row_name = f"{name}_row"
        next_cursor = f"{cursor} + 2 + ({rows_name} * {cols_name})"
        return (
            "\n".join(
                [
                    f"{rows_name}: int = _bench_parse_int(_bench_nz_str({parts_name}[{cursor}]))",
                    f"{cols_name}: int = _bench_parse_int(_bench_nz_str({parts_name}[{cursor} + 1]))",
                    f"{name}: list[list[int]] = []",
                    f"{index_name}: int = {cursor} + 2",
                    f"for {row_index_name} in range(0, {rows_name}):",
                    f"    {row_name}: list[int] = []",
                    f"    for {col_index_name} in range(0, {cols_name}):",
                    f"        {row_name}.append(_bench_parse_int(_bench_nz_str({parts_name}[{index_name}])))",
                    f"        {index_name} = {index_name} + 1",
                    f"    {name}.append({row_name})",
                ]
            ),
            next_cursor,
        )
    raise RuntimeError(f"unsupported Sifr object argument type: {arg_type}")


def sifr_object_method_branch(index: int, method: str, method_spec: dict[str, Any]) -> str:
    lines = [f'if method == "{method}":']
    arg_names = []
    cursor = "1"
    for arg_index, spec in enumerate(normalize_arg_spec(spec) for spec in method_spec.get("args", [])):
        name = f"method_{index}_arg_{arg_index}"
        arg_names.append(name)
        rendered, cursor = sifr_object_arg_binding(name, "parts", cursor, spec)
        lines.extend(indent(rendered, 4).splitlines())
    result_type = method_spec.get("result", "none")
    call = f"obj.{method}({', '.join(arg_names)})"
    if result_type == "none":
        lines.append(f"    {call}")
    else:
        result_var = f"method_{index}_result"
        lines.append(f"    {result_var}: {sifr_object_result_type(result_type)} = {call}")
        lines.append("    query_index = query_index + 1")
        lines.append("    result_count = result_count + 1")
        lines.append(f"    checksum_value = checksum_value + (query_index * {sifr_object_checksum_expr(result_type, result_var)})")
    return "\n".join(lines)


def sifr_object_result_type(result_type: str) -> str:
    if result_type == "bool":
        return "bool"
    if result_type == "int":
        return "int"
    if result_type == "float":
        return "float"
    if result_type == "str":
        return "str"
    raise RuntimeError(f"unsupported Sifr object result type: {result_type}")


def sifr_object_checksum_expr(result_type: str, result_name: str) -> str:
    if result_type == "bool":
        return f"1 if {result_name} else 0"
    if result_type == "int":
        return result_name
    if result_type == "float":
        return f"1 if {result_name} > 0.0 else 0"
    if result_type == "str":
        return f"len({result_name})"
    raise RuntimeError(f"unsupported Sifr object result type: {result_type}")


def render_sifr_bindings(bindings: list[dict[str, Any]]) -> str:
    lines = []
    for binding in bindings:
        line = sifr_binding_code(binding)
        if line:
            lines.append(line)
    return "\n".join(lines)


def sifr_binding_code(binding: dict[str, Any]) -> str:
    name = binding["name"]
    if binding["type"] == "int" and binding["source"] == "token":
        return f"{name}: int = _bench_parse_int(_bench_nz_str(tokens[{int(binding['index'])}]))"
    if binding["type"] == "str" and binding["source"] == "token":
        return f"{name}: str = _bench_nz_str(tokens[{int(binding['index'])}])"
    if binding["type"] == "list[int]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        start_expr = str(start)
        for index in binding.get("start_after_count_indices", []):
            start_expr += f" + _bench_parse_int(_bench_nz_str(tokens[{int(index)}]))"
        end = binding.get("end")
        if "count_index" in binding:
            upper = f"{start_expr} + _bench_parse_int(_bench_nz_str(tokens[{int(binding['count_index'])}]))"
        else:
            upper = f"{int(end)}" if end is not None else "len(tokens)"
        return "\n".join(
            [
                f"{name}: list[int] = []",
                f"for index in range({start_expr}, {upper}):",
                f"    {name}.append(_bench_parse_int(_bench_nz_str(tokens[index])))",
            ]
        )
    if binding["type"] == "list[str]" and binding["source"] == "tokens":
        start = int(binding.get("start", 0))
        start_expr = str(start)
        for index in binding.get("start_after_count_indices", []):
            start_expr += f" + _bench_parse_int(_bench_nz_str(tokens[{int(index)}]))"
        end = binding.get("end")
        if "count_index" in binding:
            upper = f"{start_expr} + _bench_parse_int(_bench_nz_str(tokens[{int(binding['count_index'])}]))"
        else:
            upper = f"{int(end)}" if end is not None else "len(tokens)"
        return "\n".join(
            [
                f"{name}: list[str] = []",
                f"for index in range({start_expr}, {upper}):",
                f"    {name}.append(_bench_nz_str(tokens[index]))",
            ]
        )
    if binding["type"] in ("matrix[int]", "matrix[str]") and binding["source"] == "matrix_tokens":
        rows = f"_bench_parse_int(_bench_nz_str(tokens[{int(binding['rows_index'])}]))"
        cols = f"_bench_parse_int(_bench_nz_str(tokens[{int(binding['cols_index'])}]))"
        start = int(binding["start"])
        scalar_type = "int" if binding["type"] == "matrix[int]" else "str"
        parse = "_bench_parse_int(_bench_nz_str(tokens[index]))" if scalar_type == "int" else "_bench_nz_str(tokens[index])"
        return "\n".join(
            [
                f"{name}: list[list[{scalar_type}]] = []",
                f"rows: int = {rows}",
                f"cols: int = {cols}",
                f"index: int = {start}",
                "for _row_index in range(0, rows):",
                f"    row: list[{scalar_type}] = []",
                "    for _col_index in range(0, cols):",
                f"        row.append({parse})",
                "        index = index + 1",
                f"    {name}.append(row)",
            ]
        )
    if binding["type"] == "list_node[int]" and binding["source"] == "tokens":
        return ""
    if binding["type"] == "balanced_tree[int]" and binding["source"] == "tokens":
        list_binding = {**binding, "name": f"{name}_values", "type": "list[int]"}
        return sifr_binding_code(list_binding) + f"\n{name}: TreeNode | None = _build_balanced_tree({name}_values, 0, len({name}_values) - 1)"
    raise RuntimeError(f"unsupported Sifr input binding: {binding}")


def sifr_result_type(expected_type: str) -> str:
    if expected_type == "int":
        return "int"
    if expected_type == "bool":
        return "bool"
    if expected_type == "list_int":
        return "list[int]"
    if expected_type == "str":
        return "str"
    if expected_type == "list_str":
        return "list[str]"
    if expected_type == "list_list_int":
        return "list[list[int]]"
    if expected_type == "list_list_str":
        return "list[list[str]]"
    raise RuntimeError(f"unsupported Sifr expected shape: {expected_type}")


def sifr_expected_check(expected_type: str, result_name: str) -> str:
    if expected_type == "int":
        return f"if {result_name} != _bench_parse_int(_bench_nz_str(expected_tokens[0])):"
    if expected_type == "bool":
        return f"if ({result_name} and _bench_parse_int(_bench_nz_str(expected_tokens[0])) != 1) or ((not {result_name}) and _bench_parse_int(_bench_nz_str(expected_tokens[0])) != 0):"
    if expected_type == "list_int":
        return f"if str({result_name}) != expected_text.strip():"
    if expected_type == "str":
        return f"if {result_name} != expected_text.strip():"
    if expected_type in ("list_str", "list_list_str"):
        return f"if len({result_name}) != _bench_parse_int(_bench_nz_str(expected_tokens[0])):"
    if expected_type == "list_list_int":
        return f"if len({result_name}) != _bench_parse_int(_bench_nz_str(expected_tokens[0])):"
    raise RuntimeError(f"unsupported Sifr expected shape: {expected_type}")


def sifr_checksum_expr(expected_type: str, result_name: str) -> str:
    if expected_type == "int":
        return result_name
    if expected_type == "bool":
        return f"1 if {result_name} else 0"
    if expected_type in ("list_int", "list_str", "list_list_int", "list_list_str"):
        return f"len({result_name})"
    if expected_type == "str":
        return f"len({result_name})"
    raise RuntimeError(f"unsupported Sifr expected shape: {expected_type}")


def sifr_call(
    function: str,
    args: list[str],
    bindings: list[dict[str, Any]] | None = None,
    owned_args: set[str] | None = None,
) -> str:
    bindings_by_name = {binding["name"]: binding for binding in bindings or []}
    owned_args = owned_args or set()
    rendered_args = []
    for arg in args:
        binding = bindings_by_name.get(arg)
        if binding and binding["type"] == "list_node[int]":
            start = int(binding.get("start", 0))
            end = binding.get("end")
            upper = f"{int(end)}" if end is not None else "len(tokens)"
            expression = f"_build_list_node(tokens, {start}, {upper})"
            if not binding.get("nullable", True):
                expression = f"_expect_list_node({expression})"
            rendered_args.append(expression)
        elif binding and arg in owned_args and binding["type"] in ("list[int]", "list[str]", "matrix[int]", "matrix[str]"):
            rendered_args.append(f"{arg}.copy()")
        else:
            rendered_args.append(arg)
    return f"{function}({', '.join(rendered_args)})"


def indent(text: str, spaces: int) -> str:
    prefix = " " * spaces
    return "\n".join(prefix + line if line else line for line in text.splitlines())
