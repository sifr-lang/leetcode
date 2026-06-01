from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


def render_rust_runner(source_rs: Path, function: str, runner: dict[str, Any]) -> str:
    source = strip_rust_main(source_rs.read_text(encoding="utf-8"))
    call = runner["call"]
    if call["mode"] == "object_ops":
        body = object_ops_body(source, function, call)
    else:
        rust_function = rust_solution_function(source, function)
        receiver = "Solution::" if is_solution_method(source, rust_function) else ""
        param_types = solution_param_types(source, rust_function)
        body = function_body(receiver, rust_function, param_types, runner)
    return "\n\n".join([prelude(source), source.strip(), body]).rstrip() + "\n"


def strip_rust_main(source: str) -> str:
    match = re.search(r"(?m)^fn\s+main\s*\([^)]*\)\s*\{", source)
    if match is None:
        return source
    depth = 0
    index = match.end() - 1
    while index < len(source):
        char = source[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return (source[: match.start()] + source[index + 1 :]).strip() + "\n"
        index += 1
    return source[: match.start()].strip() + "\n"


def prelude(source: str) -> str:
    parts = [
        "use std::env;",
        "use std::fs;",
    ]
    if not re.search(r"\bstruct\s+Solution\b", source):
        parts.append("struct Solution;")
    if "struct ListNode" not in source:
        parts.append(
            """
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        ListNode { val, next: None }
    }
}
""".strip()
        )
    if "struct TreeNode" not in source:
        parts.append(
            """
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>,
    pub right: Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}
""".strip()
        )
    return "\n\n".join(parts)


def rust_solution_function(source: str, function: str) -> str:
    candidates = re.findall(r"(?:pub\s+)?fn\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(", source)
    if function in candidates:
        return function
    snake = camel_to_snake(function)
    if snake in candidates:
        return snake
    normalized = normalize_name(function)
    for candidate in candidates:
        if normalize_name(candidate) == normalized:
            return candidate
    raise RuntimeError(f"could not find Rust Solution function for {function}")


def is_solution_method(source: str, function: str) -> bool:
    for match in re.finditer(r"impl\s+Solution\s*\{", source):
        start = match.end()
        depth = 1
        index = start
        while index < len(source) and depth > 0:
            if source[index] == "{":
                depth += 1
            elif source[index] == "}":
                depth -= 1
            index += 1
        if re.search(rf"(?:pub\s+)?fn\s+{re.escape(function)}\s*\(", source[start : index - 1]):
            return True
    return False


def solution_param_types(source: str, function: str) -> list[str]:
    match = re.search(rf"(?:pub\s+)?fn\s+{re.escape(function)}\s*\((.*?)\)\s*(?:->|\{{)", source, re.S)
    if match is None:
        return []
    params = split_top_level(match.group(1))
    if params and params[0].strip().startswith("&self"):
        params = params[1:]
    types = []
    for param in params:
        if ":" not in param:
            continue
        types.append(param.split(":", 1)[1].strip())
    return types


def split_top_level(text: str) -> list[str]:
    parts = []
    start = 0
    depth = 0
    for index, char in enumerate(text):
        if char in "(<[":
            depth += 1
        elif char in ")>]":
            depth -= 1
        elif char == "," and depth == 0:
            parts.append(text[start:index].strip())
            start = index + 1
    tail = text[start:].strip()
    if tail:
        parts.append(tail)
    return parts


def camel_to_snake(name: str) -> str:
    text = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", name)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", text)
    return text.lower()


def normalize_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def function_body(receiver: str, function: str, param_types: list[str], runner: dict[str, Any]) -> str:
    mode = runner["call"]["mode"]
    if mode == "single":
        return single_body(receiver, function, param_types, runner)
    if mode == "mutates_single":
        return mutates_body(receiver, function, param_types, runner)
    if mode == "batch":
        return batch_body(receiver, function, param_types, runner)
    raise RuntimeError(f"unsupported Rust runner call mode: {mode}")


def single_body(receiver: str, function: str, param_types: list[str], runner: dict[str, Any]) -> str:
    if runner["call"].get("python_adapter") == "graph_adjacency" and param_types and "Node" in param_types[0]:
        return graph_adjacency_body(receiver, function, runner)
    bindings = parse_bindings(runner["input"]["bindings"])
    expected = runner["expected"]
    format_fn = rust_format_function(expected)
    call = render_solution_call(receiver, function, runner["call"]["args"], runner["input"]["bindings"], param_types, "call")
    loop_call = render_solution_call(receiver, function, runner["call"]["args"], runner["input"]["bindings"], param_types, "loop_call")
    result_expr = coerce_result_expr(call.expr, expected["type"])
    loop_result_expr = coerce_result_expr(loop_call.expr, expected["type"])
    fresh = fresh_input_each_call(runner)
    loop_bindings = parse_bindings(runner["input"]["bindings"]) if fresh else ""
    return f"""
fn run_benchmark(fixture_path: &str, expected_path: &str, loops: usize) {{
    let fixture_text = fs::read_to_string(fixture_path).expect("fixture read failed");
    let expected_text = fs::read_to_string(expected_path).expect("expected read failed");
    let tokens: Vec<&str> = fixture_text.split_whitespace().collect();
{indent(bindings, 4)}
{indent(call.statements, 4)}
    let result = {result_expr};
    assert_expected(&{format_fn}(&result), &expected_text);

    let mut checksum: i64 = 0;
    for _loop_index in 0..loops {{
{indent(loop_bindings, 8) if fresh else ""}
{indent(loop_call.statements, 8)}
        let loop_result = {loop_result_expr};
        checksum += checksum_{expected['type']}(&loop_result);
    }}
    println!("OK {{}}", checksum);
}}

{RUNTIME_SUPPORT}
""".strip()


def graph_adjacency_body(receiver: str, function: str, runner: dict[str, Any]) -> str:
    bindings = parse_bindings(runner["input"]["bindings"])
    expected = runner["expected"]
    format_fn = rust_format_function(expected)
    arg = runner["call"]["args"][0]
    return f"""
fn run_benchmark(fixture_path: &str, expected_path: &str, loops: usize) {{
    let fixture_text = fs::read_to_string(fixture_path).expect("fixture read failed");
    let expected_text = fs::read_to_string(expected_path).expect("expected read failed");
    let tokens: Vec<&str> = fixture_text.split_whitespace().collect();
{indent(bindings, 4)}
    let graph_input = build_graph_from_adjacency(&{arg});
    let result = graph_to_adjacency({receiver}{function}(graph_input));
    assert_expected(&{format_fn}(&result), &expected_text);

    let mut checksum: i64 = 0;
    for _loop_index in 0..loops {{
        let graph_input = build_graph_from_adjacency(&{arg});
        let loop_result = graph_to_adjacency({receiver}{function}(graph_input));
        checksum += checksum_{expected['type']}(&loop_result);
    }}
    println!("OK {{}}", checksum);
}}

fn build_graph_from_adjacency(adjacency: &Vec<Vec<i32>>) -> Option<std::rc::Rc<std::cell::RefCell<Node>>> {{
    if adjacency.is_empty() {{
        return None;
    }}
    let nodes: Vec<_> = (0..adjacency.len())
        .map(|index| std::rc::Rc::new(std::cell::RefCell::new(Node::new(index as i32 + 1))))
        .collect();
    for (index, neighbors) in adjacency.iter().enumerate() {{
        nodes[index].borrow_mut().neighbors = neighbors
            .iter()
            .filter_map(|value| {{
                if *value >= 1 && (*value as usize) <= nodes.len() {{
                    Some(nodes[*value as usize - 1].clone())
                }} else {{
                    None
                }}
            }})
            .collect();
    }}
    Some(nodes[0].clone())
}}

fn graph_to_adjacency(node: Option<std::rc::Rc<std::cell::RefCell<Node>>>) -> Vec<Vec<i32>> {{
    let Some(start) = node else {{
        return Vec::new();
    }};
    let mut seen: std::collections::BTreeMap<i32, std::rc::Rc<std::cell::RefCell<Node>>> = std::collections::BTreeMap::new();
    let mut stack = vec![start];
    while let Some(current) = stack.pop() {{
        let val = current.borrow().val;
        if seen.contains_key(&val) {{
            continue;
        }}
        seen.insert(val, current.clone());
        let neighbors = current.borrow().neighbors.clone();
        for neighbor in neighbors {{
            let neighbor_val = neighbor.borrow().val;
            if !seen.contains_key(&neighbor_val) {{
                stack.push(neighbor);
            }}
        }}
    }}
    seen.values()
        .map(|node| {{
            let mut row: Vec<i32> = node
                .borrow()
                .neighbors
                .iter()
                .map(|neighbor| neighbor.borrow().val)
                .collect();
            row.sort_unstable();
            row
        }})
        .collect()
}}

{RUNTIME_SUPPORT}
""".strip()


def mutates_body(receiver: str, function: str, param_types: list[str], runner: dict[str, Any]) -> str:
    expected = runner["expected"]
    mutated = runner["call"]["mutated_arg"]
    mutable_names = {
        arg
        for index, arg in enumerate(runner["call"]["args"])
        if index < len(param_types) and param_types[index].startswith("&mut")
    }
    mutable_names.add(mutated)
    bindings = parse_bindings(runner["input"]["bindings"], mutable_names=mutable_names)
    call = render_solution_call(
        receiver,
        function,
        runner["call"]["args"],
        runner["input"]["bindings"],
        param_types,
        "call",
        clone_mut_refs=False,
    )
    format_fn = rust_format_function(expected)
    result_expr = coerce_result_expr(mutated, expected["type"])
    return f"""
fn run_benchmark(fixture_path: &str, expected_path: &str, loops: usize) {{
    let fixture_text = fs::read_to_string(fixture_path).expect("fixture read failed");
    let expected_text = fs::read_to_string(expected_path).expect("expected read failed");
    let tokens: Vec<&str> = fixture_text.split_whitespace().collect();
{indent(bindings, 4)}
{indent(call.statements, 4)}
    {call.expr};
    let result = {result_expr};
    assert_expected(&{format_fn}(&result), &expected_text);

    let mut checksum: i64 = 0;
    for _loop_index in 0..loops {{
        let tokens: Vec<&str> = fixture_text.split_whitespace().collect();
{indent(bindings, 8)}
{indent(call.statements, 8)}
        {call.expr};
        let loop_result = {result_expr};
        checksum += checksum_{expected['type']}(&loop_result);
    }}
    println!("OK {{}}", checksum);
}}

{RUNTIME_SUPPORT}
""".strip()


def batch_body(receiver: str, function: str, param_types: list[str], runner: dict[str, Any]) -> str:
    call = runner["call"]
    item_name = call.get("item_name", "value")
    item_param_type = param_types[0] if param_types else "i32"
    item_rust_type = "i64" if item_param_type.startswith("i64") else "i32"
    input_bindings = widen_batch_bindings(runner["input"]["bindings"], call["items"], item_rust_type)
    bindings = parse_bindings(input_bindings)
    target = render_solution_call(receiver, function, [item_name], [{"name": item_name, "type": "int"}], param_types, "batch")
    return f"""
fn run_benchmark(fixture_path: &str, expected_path: &str, loops: usize) {{
    let fixture_text = fs::read_to_string(fixture_path).expect("fixture read failed");
    let expected_text = fs::read_to_string(expected_path).expect("expected read failed");
    let tokens: Vec<&str> = fixture_text.split_whitespace().collect();
{indent(bindings, 4)}
    let expected_values: Vec<i64> = expected_text.split_whitespace().map(|v| v.parse::<i64>().unwrap()).collect();
    let mut count: i64 = 0;
    let mut checksum_value: i64 = 0;
    for (index, value_ref) in {call['items']}.iter().enumerate() {{
        let {item_name}: {item_rust_type} = *value_ref;
{indent(target.statements, 8)}
        if {target.expr} {{
            count += 1;
            checksum_value += index as i64 + 1;
        }}
    }}
    if expected_values.len() < 2 || count != expected_values[0] || checksum_value != expected_values[1] {{
        panic!("wrong result: {{}} {{}}", count, checksum_value);
    }}
    let mut aggregate: i64 = 0;
    for _loop_index in 0..loops {{
        for value_ref in {call['items']}.iter() {{
            let {item_name}: {item_rust_type} = *value_ref;
{indent(target.statements, 12)}
            if {target.expr} {{
                aggregate += 1;
            }}
        }}
    }}
    println!("OK {{}}", aggregate);
}}

{RUNTIME_SUPPORT}
""".strip()


def widen_batch_bindings(bindings: list[dict[str, Any]], items: str, item_rust_type: str) -> list[dict[str, Any]]:
    if item_rust_type != "i64":
        return bindings
    return [
        {**binding, "type": "list[int64]"}
        if binding["name"] == items and binding.get("type") == "list[int]"
        else binding
        for binding in bindings
    ]


class RenderedCall:
    def __init__(self, statements: str, expr: str) -> None:
        self.statements = statements
        self.expr = expr


def render_solution_call(
    receiver: str,
    function: str,
    args: list[str],
    bindings: list[dict[str, Any]],
    param_types: list[str],
    prefix: str,
    *,
    clone_mut_refs: bool = True,
) -> RenderedCall:
    binding_types = {binding["name"]: binding.get("type", "int") for binding in bindings}
    statements = []
    rendered_args = []
    for index, name in enumerate(args):
        arg_type = binding_types.get(name, "int")
        param_type = param_types[index] if index < len(param_types) else ""
        converted = converted_arg_expr(name, arg_type, param_type)
        needs_conversion = converted != clone_expr(name, arg_type)
        if param_type.startswith("&mut"):
            if clone_mut_refs:
                temp = f"__{prefix}_{index}"
                statements.append(f"let mut {temp} = {converted};")
                rendered_args.append(f"&mut {temp}")
            else:
                if needs_conversion:
                    temp = f"__{prefix}_{index}"
                    statements.append(f"let mut {temp} = {converted};")
                    rendered_args.append(f"&mut {temp}")
                else:
                    rendered_args.append(f"&mut {name}")
        elif param_type.startswith("&"):
            rendered_args.append(f"&{name}")
        else:
            rendered_args.append(converted)
    return RenderedCall("\n".join(statements), f"{receiver}{function}({', '.join(rendered_args)})")


def converted_arg_expr(name: str, arg_type: str, param_type: str) -> str:
    if arg_type == "int" and param_type.startswith("i32"):
        return f"{name} as i32"
    if arg_type == "int" and param_type.startswith("u32"):
        return f"{name} as u32"
    if arg_type == "int" and param_type.startswith("usize"):
        return f"{name} as usize"
    if arg_type == "int" and param_type.startswith("i64"):
        return f"{name} as i64"
    if arg_type == "matrix[str]" and "Vec<Vec<char>>" in param_type:
        return f"matrix_string_to_char(&{name})"
    if arg_type == "list[str]" and "Vec<char>" in param_type:
        return f"list_string_to_char(&{name})"
    return clone_expr(name, arg_type)


def clone_expr(name: str, arg_type: str) -> str:
    if arg_type in ("int", "float"):
        return name
    if arg_type == "list_node[int]":
        return name
    return f"{name}.clone()"


def fresh_input_each_call(runner: dict[str, Any]) -> bool:
    return any(
        binding["type"] in ("list_node[int]", "list[list_node[int]]", "balanced_tree[int]")
        for binding in runner["input"]["bindings"]
    )


def parse_bindings(bindings: list[dict[str, Any]], mutable_names: set[str] | None = None) -> str:
    lines = []
    mutable_names = mutable_names or set()
    for binding in bindings:
        lines.extend(parse_binding(binding, mutable=binding["name"] in mutable_names))
    return "\n".join(lines)


def parse_binding(binding: dict[str, Any], *, mutable: bool = False) -> list[str]:
    name = binding["name"]
    let_kw = "let mut" if mutable else "let"
    typ = binding["type"]
    if typ == "int" and binding.get("source") == "token":
        return [f"{let_kw} {name}: i64 = parse_i64(tokens[{int(binding['index'])}]);"]
    if typ == "float" and binding.get("source") == "token":
        return [f"{let_kw} {name}: f64 = tokens[{int(binding['index'])}].parse::<f64>().unwrap();"]
    if typ == "str" and binding.get("source") == "token":
        return [f"{let_kw} {name}: String = tokens[{int(binding['index'])}].to_string();"]
    if typ in ("list[int]", "list[int64]", "list[str]", "list[float]") and binding.get("source") == "tokens":
        start = int(binding.get("start", 0))
        lines = [f"let mut {name}_start: usize = {start};"]
        for index in binding.get("start_after_count_indices", []):
            lines.append(f"{name}_start += parse_usize(tokens[{int(index)}]);")
        if "count_index" in binding:
            lines.append(f"let {name}_end: usize = {name}_start + parse_usize(tokens[{int(binding['count_index'])}]);")
        elif binding.get("end") is not None:
            lines.append(f"let {name}_end: usize = {int(binding['end'])};")
        else:
            lines.append(f"let {name}_end: usize = tokens.len();")
        if typ == "list[int]":
            lines.append(f"{let_kw} {name}: Vec<i32> = tokens[{name}_start..{name}_end].iter().map(|v| parse_i32(v)).collect();")
        elif typ == "list[int64]":
            lines.append(f"{let_kw} {name}: Vec<i64> = tokens[{name}_start..{name}_end].iter().map(|v| parse_i64(v)).collect();")
        elif typ == "list[float]":
            lines.append(f"{let_kw} {name}: Vec<f64> = tokens[{name}_start..{name}_end].iter().map(|v| v.parse::<f64>().unwrap()).collect();")
        else:
            lines.append(f"{let_kw} {name}: Vec<String> = tokens[{name}_start..{name}_end].iter().map(|v| (*v).to_string()).collect();")
        return lines
    if typ in ("matrix[int]", "matrix[str]") and binding.get("source") == "matrix_tokens":
        lines = [
            f"let {name}_rows: usize = parse_usize(tokens[{int(binding['rows_index'])}]);",
            f"let {name}_cols: usize = parse_usize(tokens[{int(binding['cols_index'])}]);",
            f"let mut {name}_cursor: usize = {int(binding['start'])};",
        ]
        for index in binding.get("start_after_count_indices", []):
            lines.append(f"{name}_cursor += parse_usize(tokens[{int(index)}]);")
        elem = "parse_i32(tokens[{0}_cursor + col])".format(name) if typ == "matrix[int]" else "tokens[{0}_cursor + col].to_string()".format(name)
        rust_type = "Vec<Vec<i32>>" if typ == "matrix[int]" else "Vec<Vec<String>>"
        lines.extend(
            [
                f"let mut {name}: {rust_type} = Vec::with_capacity({name}_rows);",
                f"for _row in 0..{name}_rows {{",
                f"    let mut row_values = Vec::with_capacity({name}_cols);",
                f"    for col in 0..{name}_cols {{",
                f"        row_values.push({elem});",
                "    }",
                f"    {name}.push(row_values);",
                f"    {name}_cursor += {name}_cols;",
                "}",
            ]
        )
        return lines
    if typ in ("list[tuple[int,int]]", "list[tuple[int,int,int]]", "list[tuple[str,str]]") and binding.get("source") == "tuple_tokens":
        count = int(binding["count_index"])
        start = int(binding.get("start", 0))
        width = 3 if typ == "list[tuple[int,int,int]]" else 2
        rust_type = "Vec<Vec<String>>" if typ == "list[tuple[str,str]]" else "Vec<Vec<i32>>"
        parser = "tokens[{name}_cursor + offset].to_string()" if typ == "list[tuple[str,str]]" else "parse_i32(tokens[{name}_cursor + offset])"
        lines = [
            f"let {name}_count: usize = parse_usize(tokens[{count}]);",
            f"let mut {name}_cursor: usize = {start};",
            f"{let_kw} {name}: {rust_type} = {{",
            f"    let mut items = Vec::with_capacity({name}_count);",
            f"    for _tuple_index in 0..{name}_count {{",
            f"        let mut item = Vec::with_capacity({width});",
            f"        for offset in 0..{width} {{",
            f"            item.push({parser.format(name=name)});",
            "        }",
            "        items.push(item);",
            f"        {name}_cursor += {width};",
            "    }",
            "    items",
            "};",
        ]
        return lines
    if typ == "ragged[int]" and binding.get("source") == "segmented_tokens":
        lines = [
            f"let {name}_rows: usize = parse_usize(tokens[{int(binding['count_index'])}]);",
            f"let mut {name}_cursor: usize = {int(binding.get('start', 0))};",
            f"{let_kw} {name}: Vec<Vec<i32>> = {{",
            f"    let mut rows = Vec::with_capacity({name}_rows);",
            f"    for _row_index in 0..{name}_rows {{",
            f"        let value_count = parse_usize(tokens[{name}_cursor]);",
            f"        {name}_cursor += 1;",
            "        let mut row = Vec::with_capacity(value_count);",
            "        for _value_index in 0..value_count {",
            f"            row.push(parse_i32(tokens[{name}_cursor]));",
            f"            {name}_cursor += 1;",
            "        }",
            "        rows.push(row);",
            "    }",
            "    rows",
            "};",
        ]
        return lines
    if typ == "list_node[int]" and binding.get("source") == "tokens":
        base = {**binding, "type": "list[int]"}
        return parse_binding(base) + [f"{let_kw} {name} = build_list_node(&{name});"]
    if typ == "list[list_node[int]]" and binding.get("source") == "segmented_tokens":
        lines = [
            f"let {name}_lists: usize = parse_usize(tokens[{int(binding['count_index'])}]);",
            f"let mut {name}_cursor: usize = {int(binding.get('start', 0))};",
            f"{let_kw} {name}: Vec<Option<Box<ListNode>>> = {{",
            f"    let mut lists = Vec::with_capacity({name}_lists);",
            f"    for _list_index in 0..{name}_lists {{",
            f"        let value_count = parse_usize(tokens[{name}_cursor]);",
            f"        {name}_cursor += 1;",
            "        let mut values = Vec::with_capacity(value_count);",
            "        for _value_index in 0..value_count {",
            f"            values.push(parse_i32(tokens[{name}_cursor]));",
            f"            {name}_cursor += 1;",
            "        }",
            "        lists.push(build_list_node(&values));",
            "    }",
            "    lists",
            "};",
        ]
        return lines
    if typ == "balanced_tree[int]" and binding.get("source") == "tokens":
        base = {**binding, "type": "list[int]"}
        return parse_binding(base) + [f"{let_kw} {name} = build_balanced_tree(&{name}, 0, {name}.len() as isize - 1);"]
    raise RuntimeError(f"unsupported Rust input binding: {binding}")


def rust_expected_type(expected_type: str) -> str:
    return {
        "int": "i64",
        "float": "f64",
        "bool": "bool",
        "list_int": "Vec<i32>",
        "list_str": "Vec<String>",
        "list_list_int": "Vec<Vec<i32>>",
        "list_list_str": "Vec<Vec<String>>",
        "list_node_int": "Option<Box<ListNode>>",
        "tree_node_int": "Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>",
        "str": "String",
    }[expected_type]


def rust_format_function(expected: dict[str, Any]) -> str:
    if expected.get("sort_result") and expected["type"] == "list_int":
        return "format_expected_list_int_sorted"
    if expected.get("sort_result") and expected["type"] in ("list_str", "list_list_str"):
        return f"format_expected_{expected['type']}_sorted"
    return f"format_expected_{expected['type']}"


def coerce_result_expr(expr: str, expected_type: str) -> str:
    if expected_type == "int":
        return f"({expr}) as i64"
    return f"{expr}.clone()" if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", expr) else expr


def object_ops_body(source: str, class_name: str, call: dict[str, Any]) -> str:
    constructor_args, constructor_cursor = object_arg_values("init_parts", call.get("constructor_args", []), "init")
    methods = []
    for method, spec in call.get("methods", {}).items():
        rust_method = rust_method_name(source, class_name, method)
        args, arg_lines = object_arg_values("parts", spec.get("args", []), f"arg_{method}")
        arg_lines = indent(arg_lines, 16)
        result_type = spec.get("result", "int")
        if result_type == "none":
            methods.append(f'            "{method}" => {{\n{arg_lines}\n                obj.{rust_method}({", ".join(args)});\n            }}')
        else:
            methods.append(
                f'            "{method}" => {{\n{arg_lines}\n                let result = obj.{rust_method}({", ".join(args)});\n                query_index += 1;\n                result_count += 1;\n                checksum_value += query_index * object_checksum_{result_type}(&result);\n            }}'
            )
    return f"""
fn run_benchmark(fixture_path: &str, expected_path: &str, loops: usize) {{
    let fixture_text = fs::read_to_string(fixture_path).expect("fixture read failed");
    let expected_text = fs::read_to_string(expected_path).expect("expected read failed");
    let expected_values: Vec<i64> = expected_text.split_whitespace().map(|v| v.parse::<i64>().unwrap()).collect();
    let (count, checksum) = run_object_ops(&fixture_text);
    if expected_values.len() < 2 || count != expected_values[0] || checksum != expected_values[1] {{
        panic!("wrong result: {{}} {{}}", count, checksum);
    }}
    let mut aggregate: i64 = 0;
    for _loop_index in 0..loops {{
        aggregate += run_object_ops(&fixture_text).1;
    }}
    println!("OK {{}}", aggregate);
}}

fn run_object_ops(fixture_text: &str) -> (i64, i64) {{
    let lines: Vec<&str> = fixture_text.lines().filter(|line| !line.trim().is_empty()).collect();
    let init_parts: Vec<&str> = if !lines.is_empty() && lines[0].split_whitespace().next() == Some("__init__") {{
        lines[0].split_whitespace().collect()
    }} else {{
        vec!["__init__"]
    }};
{indent(constructor_cursor, 4)}
    let mut obj = {class_name}::new({", ".join(constructor_args)});
    let mut result_count: i64 = 0;
    let mut checksum_value: i64 = 0;
    let mut query_index: i64 = 0;
    let start_line = if !lines.is_empty() && lines[0].split_whitespace().next() == Some("__init__") {{ 1 }} else {{ 0 }};
    for line in lines.iter().skip(start_line) {{
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.is_empty() {{
            continue;
        }}
        match parts[0] {{
{chr(10).join(methods)}
            _ => {{}}
        }}
    }}
    (result_count, checksum_value)
}}

{RUNTIME_SUPPORT}
""".strip()


def rust_method_name(source: str, class_name: str, method: str) -> str:
    snake = camel_to_snake(method)
    candidates = re.findall(r"fn\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(", source)
    if method in candidates:
        return method
    if snake in candidates:
        return snake
    normalized = normalize_name(method)
    for candidate in candidates:
        if normalize_name(candidate) == normalized:
            return candidate
    return snake


def object_arg_values(parts_name: str, specs: list[dict[str, Any] | str], prefix: str) -> tuple[list[str], str]:
    lines = []
    args = []
    cursor = 1
    for index, raw in enumerate(specs):
        spec = {"type": raw} if isinstance(raw, str) else raw
        name = f"{prefix}_{index}"
        arg_type = spec["type"]
        if arg_type == "int":
            lines.append(f"let {name}: i32 = parse_i32({parts_name}[{cursor}]);")
            cursor += 1
        elif arg_type == "float":
            lines.append(f"let {name}: f64 = {parts_name}[{cursor}].parse::<f64>().unwrap();")
            cursor += 1
        elif arg_type == "str":
            lines.append(f"let {name}: String = {parts_name}[{cursor}].to_string();")
            cursor += 1
        elif arg_type == "point[int]":
            lines.append(f"let {name}: Vec<i32> = vec![parse_i32({parts_name}[{cursor}]), parse_i32({parts_name}[{cursor + 1}])];")
            cursor += 2
        elif arg_type == "list[int]":
            lines.append(f"let {name}_count: usize = parse_usize({parts_name}[{cursor}]);")
            lines.append(f"let {name}: Vec<i32> = {parts_name}[{cursor + 1}..{cursor + 1} + {name}_count].iter().map(|v| parse_i32(v)).collect();")
            cursor = cursor + 1
        elif arg_type == "matrix[int]":
            lines.append(f"let {name}: Vec<Vec<i32>> = parse_object_matrix_int(&{parts_name}, {cursor});")
            cursor = cursor + 1
        else:
            raise RuntimeError(f"unsupported Rust object arg type: {arg_type}")
        args.append(name)
    return args, "\n".join(lines)


def indent(text: str, spaces: int) -> str:
    if not text:
        return ""
    prefix = " " * spaces
    return "\n".join(prefix + line if line else line for line in text.splitlines())


RUNTIME_SUPPORT = r"""
fn parse_i32(value: &str) -> i32 {
    value.parse::<i32>().unwrap()
}

fn parse_i64(value: &str) -> i64 {
    value.parse::<i64>().unwrap()
}

fn parse_usize(value: &str) -> usize {
    value.parse::<usize>().unwrap()
}

fn assert_expected(actual: &str, expected_text: &str) {
    let expected = expected_text.trim();
    let actual_trimmed = actual.trim();
    if actual_trimmed != expected {
        panic!("wrong result: {}, expected {}", actual_trimmed, expected);
    }
}

fn build_list_node(values: &[i32]) -> Option<Box<ListNode>> {
    let mut head = None;
    for value in values.iter().rev() {
        let mut node = Box::new(ListNode::new(*value));
        node.next = head;
        head = Some(node);
    }
    head
}

fn build_balanced_tree(
    values: &[i32],
    left: isize,
    right: isize,
) -> Option<std::rc::Rc<std::cell::RefCell<TreeNode>>> {
    if left > right {
        return None;
    }
    let mid = left + (right - left) / 2;
    Some(std::rc::Rc::new(std::cell::RefCell::new(TreeNode {
        val: values[mid as usize],
        left: build_balanced_tree(values, left, mid - 1),
        right: build_balanced_tree(values, mid + 1, right),
    })))
}

fn format_expected_int(value: &i64) -> String { format!("{}\n", value) }
fn format_expected_float(value: &f64) -> String { format!("{}\n", py_float(*value)) }
fn format_expected_bool(value: &bool) -> String { format!("{}\n", if *value { 1 } else { 0 }) }
fn format_expected_list_int<T: PyIntAtom>(value: &Vec<T>) -> String { format!("{}\n", py_list_num(value)) }
fn format_expected_list_int_sorted<T: PyIntAtom + Ord + Clone>(value: &Vec<T>) -> String {
    let mut sorted = value.clone();
    sorted.sort();
    format!("{}\n", py_list_num(&sorted))
}
fn format_expected_list_str(value: &Vec<String>) -> String { format!("{}\n", py_list_str(value)) }
fn format_expected_list_list_int<T: std::fmt::Debug>(value: &Vec<Vec<T>>) -> String { format!("{:?}\n", value) }
fn format_expected_list_list_str(value: &Vec<Vec<String>>) -> String { format!("{}\n", py_list_list_str(value)) }
fn format_expected_list_str_sorted(value: &Vec<String>) -> String {
    let mut sorted = value.clone();
    sorted.sort();
    format!("{}\n", py_list_str(&sorted))
}
fn format_expected_list_list_str_sorted(value: &Vec<Vec<String>>) -> String {
    let mut sorted = value.clone();
    sorted.sort();
    format!("{}\n", py_list_list_str(&sorted))
}
fn format_expected_list_node_int(value: &Option<Box<ListNode>>) -> String { format!("{}\n", list_node_to_text(value)) }
fn format_expected_tree_node_int(value: &Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>) -> String { format!("{}\n", tree_node_to_text(value)) }
fn format_expected_str(value: &String) -> String { format!("{}\n", value) }

fn checksum_int(value: &i64) -> i64 { *value }
fn checksum_float(value: &f64) -> i64 { (*value * 1000.0) as i64 }
fn checksum_bool(value: &bool) -> i64 { if *value { 1 } else { 0 } }
fn checksum_list_int<T>(value: &Vec<T>) -> i64 { value.len() as i64 }
fn checksum_list_str(value: &Vec<String>) -> i64 { py_list_str(value).len() as i64 }
fn checksum_list_list_int<T: std::fmt::Debug>(value: &Vec<Vec<T>>) -> i64 { format!("{:?}", value).len() as i64 }
fn checksum_list_list_str(value: &Vec<Vec<String>>) -> i64 { py_list_list_str(value).len() as i64 }
fn checksum_list_node_int(value: &Option<Box<ListNode>>) -> i64 { list_node_to_text(value).len() as i64 }
fn checksum_tree_node_int(value: &Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>) -> i64 { tree_node_to_text(value).len() as i64 }
fn checksum_str(value: &String) -> i64 { value.len() as i64 }

fn object_checksum_int(value: &i32) -> i64 { i64::from(*value) }
fn object_checksum_float(value: &f64) -> i64 { (*value * 1000.0) as i64 }
fn object_checksum_bool(value: &bool) -> i64 { if *value { 1 } else { 0 } }
fn object_checksum_str(value: &String) -> i64 { value.len() as i64 }
fn object_checksum_list_int(value: &Vec<i32>) -> i64 { value.len() as i64 }

fn py_float(value: f64) -> String {
    let abs_value = value.abs();
    if abs_value != 0.0 && (abs_value >= 1e16 || abs_value < 1e-4) {
        let text = format!("{:e}", value);
        if let Some((mantissa, exponent)) = text.split_once('e') {
            let parsed = exponent.parse::<i32>().unwrap();
            if parsed >= 0 {
                return format!("{}e+{}", mantissa, parsed);
            }
            return format!("{}e{}", mantissa, parsed);
        }
    }
    if value.fract() == 0.0 {
        format!("{:.1}", value)
    } else {
        value.to_string()
    }
}

trait PyIntAtom {
    fn py_int_atom(&self) -> String;
}

impl PyIntAtom for i32 {
    fn py_int_atom(&self) -> String { self.to_string() }
}

impl PyIntAtom for i64 {
    fn py_int_atom(&self) -> String { self.to_string() }
}

impl PyIntAtom for usize {
    fn py_int_atom(&self) -> String { self.to_string() }
}

impl PyIntAtom for String {
    fn py_int_atom(&self) -> String { self.clone() }
}

fn py_list_num<T: PyIntAtom>(value: &Vec<T>) -> String {
    let parts: Vec<String> = value.iter().map(PyIntAtom::py_int_atom).collect();
    format!("[{}]", parts.join(", "))
}

fn py_list_str(value: &Vec<String>) -> String {
    let parts: Vec<String> = value.iter().map(|item| json_string(item)).collect();
    format!("[{}]", parts.join(", "))
}

fn py_list_list_num<T: PyIntAtom>(value: &Vec<Vec<T>>) -> String {
    let parts: Vec<String> = value.iter().map(py_list_num).collect();
    format!("[{}]", parts.join(", "))
}

fn py_list_list_str(value: &Vec<Vec<String>>) -> String {
    let parts: Vec<String> = value.iter().map(py_list_str).collect();
    format!("[{}]", parts.join(", "))
}

fn json_string(value: &str) -> String {
    format!("\"{}\"", value.replace('\\', "\\\\").replace('"', "\\\""))
}

fn list_node_to_text(node: &Option<Box<ListNode>>) -> String {
    let mut values = Vec::new();
    let mut current = node.as_ref();
    while let Some(node_ref) = current {
        values.push(node_ref.val.to_string());
        current = node_ref.next.as_ref();
    }
    if values.is_empty() { "None".to_string() } else { values.join("->") }
}

fn tree_node_to_text(node: &Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>) -> String {
    match node {
        None => "None".to_string(),
        Some(rc) => {
            let borrowed = rc.borrow();
            format!(
                "{}({},{})",
                borrowed.val,
                tree_node_to_text(&borrowed.left),
                tree_node_to_text(&borrowed.right)
            )
        }
    }
}

fn parse_object_matrix_int(parts: &[&str], cursor: usize) -> Vec<Vec<i32>> {
    let rows = parse_usize(parts[cursor]);
    let cols = parse_usize(parts[cursor + 1]);
    let mut index = cursor + 2;
    let mut matrix = Vec::with_capacity(rows);
    for _ in 0..rows {
        let mut row = Vec::with_capacity(cols);
        for _ in 0..cols {
            row.push(parse_i32(parts[index]));
            index += 1;
        }
        matrix.push(row);
    }
    matrix
}

fn matrix_string_to_char(values: &Vec<Vec<String>>) -> Vec<Vec<char>> {
    values
        .iter()
        .map(|row| row.iter().map(|value| value.chars().next().unwrap_or('\0')).collect())
        .collect()
}

fn list_string_to_char(values: &Vec<String>) -> Vec<char> {
    values
        .iter()
        .map(|value| value.chars().next().unwrap_or('\0'))
        .collect()
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 4 {
        eprintln!("usage: runner <fixture> <expected> <loops>");
        std::process::exit(2);
    }
    run_benchmark(&args[1], &args[2], parse_usize(&args[3]));
}
""".strip()
